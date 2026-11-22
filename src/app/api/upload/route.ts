/**
 * Route API d'upload securise cote serveur vers Tigris S3 (POST /api/upload).
 * Contourne les blocages CORS navigateur tout en appliquant auth, RBAC, rate-limit et validation MIME/taille.
 */

import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { prisma } from "@/lib/prisma"
import { enforceRateLimit, invalidateCatalogCache } from "@/lib/redis"
import {
  buildTigrisPublicUrl,
  getS3Client,
  validateUploadConstraints,
  type StorageFolder,
} from "@/lib/storage"
import { requireProProfile } from "@/server/auth-guard"

const VALID_FOLDERS = new Set<StorageFolder>(["avatars", "portfolio", "kyc"])

export async function POST(request: Request) {
  const authRes = await requireProProfile()
  if (authRes.error !== null) {
    return NextResponse.json({ data: null, error: authRes.error }, { status: 401 })
  }

  const rateLimit = await enforceRateLimit("upload", authRes.user.id)
  if (!rateLimit.allowed) {
    return NextResponse.json({ data: null, error: rateLimit.error }, { status: 429 })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json(
      { data: null, error: "Requête multipart invalide." },
      { status: 400 }
    )
  }

  const rawFolder = String(formData.get("folder") || "").trim() as StorageFolder
  const fileEntry = formData.get("file")

  if (!VALID_FOLDERS.has(rawFolder)) {
    return NextResponse.json(
      { data: null, error: "Dossier de destination non autorisé." },
      { status: 400 }
    )
  }

  if (!(fileEntry instanceof File)) {
    return NextResponse.json(
      { data: null, error: "Aucun fichier reçu." },
      { status: 400 }
    )
  }

  const validation = validateUploadConstraints(
    rawFolder,
    fileEntry.type,
    fileEntry.size
  )
  if (!validation.valid) {
    return NextResponse.json(
      { data: null, error: validation.error },
      { status: 400 }
    )
  }

  const s3 = getS3Client()
  if (!s3) {
    return NextResponse.json(
      {
        data: null,
        error:
          "Stockage Tigris S3 non configuré sur cet environnement (consultez Admin > Santé & Uptime).",
      },
      { status: 503 }
    )
  }

  const proId = authRes.proProfile.id
  const bucket = process.env.TIGRIS_BUCKET_NAME?.trim() || "home-services-assets"
  const sanitizedName = fileEntry.name
    .replace(/\.{2,}/g, "_")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 80)
  const objectKey = `${rawFolder}/${proId}/${Date.now()}-${sanitizedName}`

  try {
    const buffer = Buffer.from(await fileEntry.arrayBuffer())

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: objectKey,
        Body: buffer,
        ContentType: fileEntry.type,
        ContentLength: buffer.byteLength,
      })
    )

    const publicUrl = buildTigrisPublicUrl(objectKey)

    if (rawFolder === "avatars") {
      await prisma.user.update({
        where: { id: authRes.user.id },
        data: { image: publicUrl },
      })
    } else if (rawFolder === "portfolio") {
      const current = await prisma.proProfile.findUnique({
        where: { id: proId },
        select: { portfolioImages: true },
      })
      const existing = current?.portfolioImages || []
      if (existing.length >= 12) {
        return NextResponse.json(
          {
            data: null,
            error: "Vous avez atteint la limite maximale de 12 photos de portfolio.",
          },
          { status: 400 }
        )
      }
      await prisma.proProfile.update({
        where: { id: proId },
        data: { portfolioImages: [...existing, publicUrl] },
      })
    } else {
      await prisma.proProfile.update({
        where: { id: proId },
        data: {
          kycDocumentUrl: objectKey,
          kycStatus: "PENDING",
          isVerified: false,
        },
      })
    }

    await invalidateCatalogCache()
    revalidatePath("/dashboard/pro/profile")
    revalidatePath("/dashboard/admin")
    revalidatePath("/professionals")
    revalidatePath(`/professionals/pros/${proId}`)

    return NextResponse.json({
      data: {
        objectKey,
        publicUrl,
        folder: rawFolder,
      },
      error: null,
    })
  } catch (err) {
    console.error("[api/upload] S3 upload error:", err)
    const msg =
      err instanceof Error ? err.message : "Erreur lors de l'envoi vers Tigris S3."
    return NextResponse.json(
      {
        data: null,
        error: `Échec du stockage S3 : ${msg.slice(0, 140)}`,
      },
      { status: 502 }
    )
  }
}
