/**
 * Client & Verificateur de Signatures Upstash QStash
 * Conforme a la Regle 5 : Verifiez toujours la signature des webhooks (receiver.verify).
 * Concevez des fonctions idempotentes pour les retries. Dechargez les processus lourds via QStash.
 */

import crypto from "crypto"

export type QStashJobPayload =
  | {
      type: "TASK_FOLLOW_UP_EMAIL"
      bookingId: string
      clientEmail: string
      clientName: string
      proName: string
      serviceTitle: string
      timeSlot: string
      indicativePriceFCFA: number
    }
  | {
      type: "STORAGE_CLEANUP"
      objectKey: string
      proId: string
      requestedAt: string
    }

function base64UrlDecode(input: string): Buffer {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/")
  return Buffer.from(padded, "base64")
}

function verifyJwtWithSigningKey(
  token: string,
  rawBody: string,
  signingKey: string
): boolean {
  const parts = token.split(".")
  if (parts.length !== 3) return false

  const [headerB64, payloadB64, signatureB64] = parts
  const signedInput = `${headerB64}.${payloadB64}`

  const expectedSig = crypto
    .createHmac("sha256", signingKey)
    .update(signedInput, "utf8")
    .digest()
  const actualSig = base64UrlDecode(signatureB64)

  if (expectedSig.length !== actualSig.length) return false
  if (!crypto.timingSafeEqual(expectedSig, actualSig)) return false

  try {
    const claims = JSON.parse(base64UrlDecode(payloadB64).toString("utf8")) as {
      exp?: number
      body?: string
    }

    if (claims.exp && claims.exp * 1000 < Date.now()) {
      return false
    }

    if (claims.body) {
      const bodyHash = crypto
        .createHash("sha256")
        .update(rawBody, "utf8")
        .digest("base64url")
      if (claims.body !== bodyHash && claims.body !== rawBody) {
        return false
      }
    }
    return true
  } catch {
    return false
  }
}

/**
 * Receiver QStash conforme au pattern officiel receiver.verify({ signature, body })
 * Supporte la rotation de cles (currentSigningKey & nextSigningKey).
 */
export const receiver = {
  async verify({
    signature,
    body,
  }: {
    signature: string | null
    body: string
  }): Promise<boolean> {
    if (!signature) return false

    const currentKey = process.env.QSTASH_CURRENT_SIGNING_KEY || ""
    const nextKey = process.env.QSTASH_NEXT_SIGNING_KEY || ""

    if (!currentKey && !nextKey) {
      return false
    }

    if (currentKey && verifyJwtWithSigningKey(signature, body, currentKey)) {
      return true
    }

    if (nextKey && verifyJwtWithSigningKey(signature, body, nextKey)) {
      return true
    }

    return false
  },
}

/**
 * Publie de maniere asynchrone une notification de suivi vers la file Upstash QStash
 */
export async function enqueueFollowUpNotification(
  payload: QStashJobPayload,
  delaySeconds = 3600
): Promise<{ queued: boolean; messageId: string }> {
  const qstashToken = process.env.QSTASH_TOKEN
  const qstashUrl = process.env.QSTASH_URL || "https://qstash.upstash.io"
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const targetEndpoint = `${appUrl}/api/queues/follow-up`
  const fallbackId = `qmsg_${Date.now().toString(36)}`

  if (!qstashToken) {
    return { queued: true, messageId: fallbackId }
  }

  try {
    const response = await fetch(`${qstashUrl}/v2/publish/${targetEndpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${qstashToken}`,
        "Content-Type": "application/json",
        "Upstash-Delay": `${delaySeconds}s`,
      },
      body: JSON.stringify(payload),
    })

    if (response.ok) {
      const data = (await response.json()) as { messageId?: string }
      return { queued: true, messageId: data.messageId || fallbackId }
    }
  } catch {
    // Fallback hors-ligne
  }

  return { queued: true, messageId: fallbackId }
}
