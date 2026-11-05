/**
 * Worker Asynchrone Upstash QStash (/api/queues/follow-up)
 * Verifie obligatoirement la signature via receiver.verify et traite de maniere idempotente
 * l'envoi des emails de suivi ("Vos taches ont-elles ete finalisees ?") via Resend.
 */

import { NextRequest, NextResponse } from "next/server"
import { receiver, type QStashJobPayload } from "@/lib/qstash"
import { sendFollowUpEmailViaResend } from "@/lib/resend"

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

    return NextResponse.json({ processed: false, reason: "Unknown job type" })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur worker QStash" },
      { status: 500 }
    )
  }
}
