/**
 * Worker Asynchrone Upstash QStash (/api/queues/follow-up)
 * Verifie obligatoirement la signature via receiver.verify et traite de maniere idempotente
 * l'envoi des emails de suivi ("Vos taches ont-elles ete finalisees ?") via Resend.
 */

import crypto from "crypto"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { receiver } from "@/lib/qstash"
import {
  sendFollowUpEmailViaResend,
  sendPasswordResetEmailViaResend,
} from "@/lib/resend"
import { deleteTigrisObject, isValidStorageObjectKey } from "@/lib/storage"

const qstashPayloadSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("TASK_FOLLOW_UP_EMAIL"),
    bookingId: z.string().min(1).max(120),
    clientEmail: z.string().email().max(200),
    clientName: z.string().min(1).max(120),
    proName: z.string().min(1).max(120),
    serviceTitle: z.string().min(1).max(160),
    timeSlot: z.string().min(3).max(40),
    indicativePriceFCFA: z.number().nonnegative(),
  }),
  z.object({
    type: z.literal("STORAGE_CLEANUP"),
    objectKey: z.string().min(1).max(260),
    proId: z.string().min(1).max(120),
    requestedAt: z.string().min(1).max(80),
  }),
  z.object({
    type: z.literal("PASSWORD_RESET_EMAIL"),
    toEmail: z.string().email().max(200),
    userName: z.string().min(1).max(120),
    resetUrl: z.string().url().max(1000),
  }),
])

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

    let parsedJson: unknown
    try {
      parsedJson = JSON.parse(rawBody)
    } catch {
      return NextResponse.json(
        { error: "Charge utile JSON QStash invalide" },
        { status: 400 }
      )
    }

    const validated = qstashPayloadSchema.safeParse(parsedJson)
    if (!validated.success) {
      return NextResponse.json(
        { error: "Type ou structure de tache QStash invalide" },
        { status: 400 }
      )
    }

    const payload = validated.data
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
      if (!isValidStorageObjectKey(payload.objectKey)) {
        return NextResponse.json(
          { error: "Cle objet S3 invalide pour nettoyage" },
          { status: 400 }
        )
      }

      const cleanupResult = await deleteTigrisObject(payload.objectKey)
      return NextResponse.json({
        processed: true,
        type: payload.type,
        cleanedKey: payload.objectKey,
        deleted: cleanupResult.deleted,
        skipped: cleanupResult.skipped ?? false,
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
    console.error("[qstash-worker] Erreur worker QStash:", err)
    return NextResponse.json(
      { error: "Erreur de traitement worker QStash" },
      { status: 500 }
    )
  }
}
