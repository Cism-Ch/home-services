/**
 * Worker Asynchrone Upstash QStash (/api/queues/follow-up)
 * Verifie obligatoirement la signature via receiver.verify et traite de maniere idempotente
 * l'envoi des emails de suivi ("Vos taches ont-elles ete finalisees ?") via Resend.
 */

import crypto from "crypto"
import { NextRequest, NextResponse } from "next/server"
import { receiver, type QStashJobPayload } from "@/lib/qstash"
import {
  sendFollowUpEmailViaResend,
  sendPasswordResetEmailViaResend,
} from "@/lib/resend"

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get("upstash-signature")

    const isValid = await receiver.verify({
      signature,
      body: rawBody,
    })

    if (!isValid) {
      return NextResponse.json(
        { error: "Signature Upstash QStash invalide" },
        { status: 401 }
      )
    }

    const payload = JSON.parse(rawBody) as QStashJobPayload
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    if (payload.type === "TASK_FOLLOW_UP_EMAIL") {
      const idempotencyKey = `followup-${payload.bookingId}`
      const emailResult = await sendFollowUpEmailViaResend(
        payload.clientEmail,
        {
          clientName: payload.clientName,
          proName: payload.proName,
          serviceTitle: payload.serviceTitle,
          bookingId: payload.bookingId,
          timeSlot: payload.timeSlot,
          indicativePriceFCFA: payload.indicativePriceFCFA,
          dashboardUrl: `${appUrl}/dashboard/client/bookings`,
        },
        idempotencyKey
      )

      return NextResponse.json({
        processed: true,
        type: payload.type,
        emailId: emailResult.id,
      })
    }

    if (payload.type === "STORAGE_CLEANUP") {
      return NextResponse.json({
        processed: true,
        type: payload.type,
        cleanedKey: payload.objectKey,
      })
    }

    if (payload.type === "PASSWORD_RESET_EMAIL") {
      const tokenDigest = crypto
        .createHash("sha256")
        .update(payload.resetUrl, "utf8")
        .digest("hex")
        .slice(0, 16)
      const idempotencyKey = `password-reset-${tokenDigest}`
      const emailResult = await sendPasswordResetEmailViaResend(
        payload.toEmail,
        {
          userName: payload.userName,
          resetUrl: payload.resetUrl,
        },
        idempotencyKey
      )

      return NextResponse.json({
        processed: true,
        type: payload.type,
        emailId: emailResult.id,
      })
    }

    return NextResponse.json({ processed: false, reason: "Unknown job type" })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur worker QStash" },
      { status: 500 }
    )
  }
}
