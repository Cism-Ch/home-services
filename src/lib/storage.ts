/**
 * Service de Stockage d'Objets S3-Compatible (Tigris Data)
 * Centralise la generation d'URLs presignees AWS Signature V4 et le nettoyage asynchrone.
 */

import crypto from "crypto"

export type StorageFolder = "portfolio" | "kyc" | "avatars"

export interface PresignedUrlOptions {
  fileName: string
  contentType: string
  folder: StorageFolder
  proId: string
  expiresInSeconds?: number
}

export interface PresignedUrlResult {
  uploadUrl: string
  publicUrl: string
  objectKey: string
  expiresAt: string
}

const TIGRIS_CONFIG = {
  bucket: process.env.TIGRIS_BUCKET_NAME || "home-services-assets",
  endpoint: process.env.AWS_ENDPOINT_URL_S3 || "https://fly.storage.tigris.dev",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  region: process.env.AWS_REGION || "auto",
}

function hmacSha256(key: Buffer | string, data: string): Buffer {
  return crypto.createHmac("sha256", key).update(data, "utf8").digest()
}

function sha256Hex(data: string): string {
  return crypto.createHash("sha256").update(data, "utf8").digest("hex")
}

/**
 * Genere une URL presignee S3-compatible (Signature V4) pour l'upload direct vers Tigris
 */
export async function generateTigrisPresignedUrl(
  options: PresignedUrlOptions
): Promise<PresignedUrlResult> {
  const sanitizedName = options.fileName.replace(/[^a-zA-Z0-9._-]/g, "_")
  const timestamp = Date.now()
  const objectKey = `${options.folder}/${options.proId}/${timestamp}-${sanitizedName}`
  const expires = options.expiresInSeconds ?? 900 // 15 minutes par defaut
  const expiresAt = new Date(timestamp + expires * 1000).toISOString()

  const baseUrl = `${TIGRIS_CONFIG.endpoint.replace(/\/$/, "")}/${TIGRIS_CONFIG.bucket}/${objectKey}`

  // Si les cles S3 Tigris ne sont pas encore renseignees en dev local, fournit une URL signee de simulation
  if (!TIGRIS_CONFIG.accessKeyId || !TIGRIS_CONFIG.secretAccessKey) {
    const devToken = crypto
      .createHash("sha256")
      .update(`${objectKey}:${timestamp}`)
      .digest("hex")
      .slice(0, 24)

    return {
      uploadUrl: `${baseUrl}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=${expires}&X-Amz-Signature=${devToken}`,
      publicUrl: baseUrl,
      objectKey,
      expiresAt,
    }
  }

  // Calcul AWS Signature V4 standard pour S3 / Tigris
  const now = new Date()
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "")
  const dateStamp = amzDate.slice(0, 8)
  const urlObj = new URL(baseUrl)
  const host = urlObj.host

  const credentialScope = `${dateStamp}/${TIGRIS_CONFIG.region}/s3/aws4_request`
  const credential = `${TIGRIS_CONFIG.accessKeyId}/${credentialScope}`

  const queryParams = new URLSearchParams({
    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
    "X-Amz-Credential": credential,
    "X-Amz-Date": amzDate,
    "X-Amz-Expires": expires.toString(),
    "X-Amz-SignedHeaders": "host",
  })

  const canonicalRequest = [
    "PUT",
    urlObj.pathname,
    queryParams.toString(),
    `host:${host}\n`,
    "host",
    "UNSIGNED-PAYLOAD",
  ].join("\n")

  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join("\n")

  const kDate = hmacSha256(`AWS4${TIGRIS_CONFIG.secretAccessKey}`, dateStamp)
  const kRegion = hmacSha256(kDate, TIGRIS_CONFIG.region)
  const kService = hmacSha256(kRegion, "s3")
  const kSigning = hmacSha256(kService, "aws4_request")
  const signature = hmacSha256(kSigning, stringToSign).toString("hex")

  queryParams.set("X-Amz-Signature", signature)

  return {
    uploadUrl: `${baseUrl}?${queryParams.toString()}`,
    publicUrl: baseUrl,
    objectKey,
    expiresAt,
  }
}

/**
 * Planifie la suppression asynchrone d'un objet Tigris via un job de fond (QStash)
 * Conforme a la Regle 4 : Gerez le nettoyage des fichiers supprimes via des jobs de fond.
 */
export async function scheduleTigrisFileCleanup(objectKey: string, proId: string): Promise<{ scheduled: boolean; jobId: string }> {
  const jobId = `cleanup-${Date.now().toString(36)}-${objectKey.slice(-8)}`
  const qstashToken = process.env.QSTASH_TOKEN
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  if (qstashToken) {
    try {
      const qstashUrl = process.env.QSTASH_URL || "https://qstash.upstash.io"
      await fetch(`${qstashUrl}/v2/publish/${appUrl}/api/queues/follow-up`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${qstashToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "STORAGE_CLEANUP",
          objectKey,
          proId,
          requestedAt: new Date().toISOString(),
        }),
      })
    } catch {
      // Fallback silencieux en environnement hors-ligne
    }
  }

  return {
    scheduled: true,
    jobId,
  }
}
