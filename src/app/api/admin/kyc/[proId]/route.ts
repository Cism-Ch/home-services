/**
 * Proxy securise de lecture et telechargement des justificatifs KYC (admin uniquement).
 * GET /api/admin/kyc/[proId] (inline) ou ?download=1 (telechargement piece jointe).
 */

import { NextResponse } from "next/server"
import { GetObjectCommand } from "@aws-sdk/client-s3"
import { prisma } from "@/lib/prisma"
import { getS3Client, isValidStorageObjectKey } from "@/lib/storage"
import { requireActionSession } from "@/server/auth-guard"

function sanitizeFileName(objectKey: string): string {
  const base = objectKey.split("/").pop() || "justificatif-kyc"
  return base.replace(/[^a-zA-Z0-9._-]/g, "_")
}

export async function GET(
  request: Request,
  context: { params: Promise<{ proId: string }> }
) {
  const authRes = await requireActionSession(["admin"])
  if (authRes.error !== null) {
    return NextResponse.json({ error: authRes.error }, { status: 403 })
  }

  const { proId } = await context.params
  if (!proId || proId.length > 120) {
    return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 })
  }

  const profile = await prisma.proProfile.findUnique({
    where: { id: proId },
    select: { kycDocumentUrl: true },
  })

  if (!profile?.kycDocumentUrl) {
    return NextResponse.json(
      { error: "Aucun justificatif KYC enregistré pour ce prestataire." },
      { status: 404 }
    )
  }

  const objectKey = profile.kycDocumentUrl
  if (!isValidStorageObjectKey(objectKey)) {
    return NextResponse.json(
      { error: "Référence de justificatif KYC invalide." },
      { status: 400 }
    )
  }

  const s3 = getS3Client()
  if (!s3) {
    return NextResponse.json(
      { error: "Stockage Tigris S3 non configuré sur cet environnement." },
      { status: 503 }
    )
  }

  const bucket = process.env.TIGRIS_BUCKET_NAME?.trim() || "home-services-assets"
  const url = new URL(request.url)
  const isDownload = url.searchParams.get("download") === "1"

  try {
    const obj = await s3.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: objectKey,
      })
    )

    if (!obj.Body) {
      return NextResponse.json(
        { error: "Contenu du fichier introuvable dans le bucket." },
        { status: 404 }
      )
    }

    const bytes = await obj.Body.transformToByteArray()
    const contentType = obj.ContentType || "application/octet-stream"
    const fileName = sanitizeFileName(objectKey)

    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `${isDownload ? "attachment" : "inline"}; filename="${fileName}"`,
        "Cache-Control": "private, no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch (err) {
    console.error("[api/admin/kyc] S3 read error:", err)
    return NextResponse.json(
      { error: "Impossible de récupérer le justificatif depuis Tigris S3." },
      { status: 502 }
    )
  }
}
