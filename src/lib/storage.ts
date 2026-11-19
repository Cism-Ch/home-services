/**
 * Service de Stockage d'Objets S3-Compatible (Tigris Data - Regle 4)
 * Centralise le client S3, les URLs presignees PutObject/GetObject et le nettoyage asynchrone DeleteObject.
 */

import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { enqueueFollowUpNotification } from "@/lib/qstash"

export type StorageFolder = "portfolio" | "kyc" | "avatars"

export const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024 // 5 Mo max

export const ALLOWED_MIME_BY_FOLDER: Record<StorageFolder, readonly string[]> = {
  portfolio: ["image/jpeg", "image/png", "image/webp"],
  avatars: ["image/jpeg", "image/png", "image/webp"],
  kyc: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
}

export interface PresignedUrlOptions {
  fileName: string
  contentType: string
  folder: StorageFolder
  proId: string
  fileSizeBytes?: number
  expiresInSeconds?: number
}

export interface PresignedUrlResult {
  uploadUrl: string
  publicUrl: string
  objectKey: string
  expiresAt: string
  isConfigured: boolean
}

let cachedS3Client: S3Client | null | undefined

function getStorageConfig() {
  return {
    bucket: process.env.TIGRIS_BUCKET_NAME?.trim() || "home-services-assets",
    endpoint: (
      process.env.AWS_ENDPOINT_URL_S3?.trim() || "https://fly.storage.tigris.dev"
    ).replace(/\/$/, ""),
    accessKeyId: process.env.AWS_ACCESS_KEY_ID?.trim() || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY?.trim() || "",
    region: process.env.AWS_REGION?.trim() || "auto",
  }
}

/**
 * Retourne l'instance singleton S3Client configuree pour Tigris Data ou null si absente.
 */
export function getS3Client(): S3Client | null {
  if (cachedS3Client !== undefined) {
    return cachedS3Client
  }

  const cfg = getStorageConfig()
  if (!cfg.accessKeyId || !cfg.secretAccessKey) {
    cachedS3Client = null
    return null
  }

  // WHEN_REQUIRED evite l'injection de parametres CRC32 incompatibles avec l'upload direct navigateur PUT
  cachedS3Client = new S3Client({
    region: cfg.region,
    endpoint: cfg.endpoint,
    credentials: {
      accessKeyId: cfg.accessKeyId,
      secretAccessKey: cfg.secretAccessKey,
    },
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  })

  return cachedS3Client
}

/**
 * Verifie le type MIME autorise et la taille maximale (5 Mo) avant toute signature S3.
 */
export function validateUploadConstraints(
  folder: StorageFolder,
  contentType: string,
  fileSizeBytes?: number
): { valid: true } | { valid: false; error: string } {
  const allowedMimes = ALLOWED_MIME_BY_FOLDER[folder]
  if (!allowedMimes || !allowedMimes.includes(contentType)) {
    const label =
      folder === "kyc"
        ? "JPEG, PNG, WebP ou PDF"
        : "JPEG, PNG ou WebP"
    return {
      valid: false,
      error: `Format de fichier non autorisé. Formats acceptés : ${label}.`,
    }
  }

  if (typeof fileSizeBytes === "number") {
    if (fileSizeBytes <= 0) {
      return { valid: false, error: "Le fichier sélectionné est vide." }
    }
    if (fileSizeBytes > MAX_UPLOAD_SIZE_BYTES) {
      return {
        valid: false,
        error: "Le fichier dépasse la taille maximale autorisée (5 Mo).",
      }
    }
  }

  return { valid: true }
}

/**
 * Extrait la cle S3 d'une URL Tigris publique ou valide une objectKey directe.
 */
export function extractTigrisObjectKey(urlOrKey: string): string | null {
  const trimmed = urlOrKey.trim()
  if (!trimmed) return null

  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return trimmed
  }

  try {
    const cfg = getStorageConfig()
    const prefix = `${cfg.endpoint}/${cfg.bucket}/`
    if (trimmed.startsWith(prefix)) {
      return decodeURIComponent(trimmed.slice(prefix.length))
    }

    const parsed = new URL(trimmed)
    const bucketMarker = `/${cfg.bucket}/`
    if (parsed.pathname.startsWith(bucketMarker)) {
      return decodeURIComponent(parsed.pathname.slice(bucketMarker.length))
    }
  } catch {
    return null
  }

  return null
}

/**
 * Genere une URL presignee S3 PutObject via @aws-sdk/s3-request-presigner pour l'upload navigateur direct.
 */
export async function generateTigrisPresignedUrl(
  options: PresignedUrlOptions
): Promise<PresignedUrlResult> {
  const validation = validateUploadConstraints(
    options.folder,
    options.contentType,
    options.fileSizeBytes
  )
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  const sanitizedName = options.fileName
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 80)
  const timestamp = Date.now()
  const objectKey = `${options.folder}/${options.proId}/${timestamp}-${sanitizedName}`
  const expires = options.expiresInSeconds ?? 900
  const expiresAt = new Date(timestamp + expires * 1000).toISOString()

  const cfg = getStorageConfig()
  const publicUrl = `${cfg.endpoint}/${cfg.bucket}/${objectKey}`

  const s3 = getS3Client()
  if (!s3) {
    return {
      uploadUrl: "",
      publicUrl,
      objectKey,
      expiresAt,
      isConfigured: false,
    }
  }

  const command = new PutObjectCommand({
    Bucket: cfg.bucket,
    Key: objectKey,
    ContentType: options.contentType,
  })

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: expires })

  return {
    uploadUrl,
    publicUrl,
    objectKey,
    expiresAt,
    isConfigured: true,
  }
}

/**
 * Genere une URL signee GetObject temporaire pour consulter un justificatif KYC prive.
 */
export async function generateTigrisReadUrl(
  objectKey: string,
  expiresInSeconds = 900
): Promise<string | null> {
  const s3 = getS3Client()
  if (!s3 || !objectKey) {
    return null
  }

  const cfg = getStorageConfig()
  const command = new GetObjectCommand({
    Bucket: cfg.bucket,
    Key: objectKey,
  })

  return getSignedUrl(s3, command, { expiresIn: expiresInSeconds })
}

/**
 * Supprime physiquement un objet dans le bucket Tigris S3 (execute depuis le worker QStash).
 */
export async function deleteTigrisObject(
  objectKey: string
): Promise<{ deleted: boolean; skipped?: boolean }> {
  const s3 = getS3Client()
  if (!s3 || !objectKey) {
    return { deleted: false, skipped: true }
  }

  const cfg = getStorageConfig()
  await s3.send(
    new DeleteObjectCommand({
      Bucket: cfg.bucket,
      Key: objectKey,
    })
  )

  return { deleted: true }
}

/**
 * Planifie la suppression asynchrone d'un objet Tigris via Upstash QStash (Regle 4).
 */
export async function scheduleTigrisFileCleanup(
  objectKey: string,
  proId: string
): Promise<{ scheduled: boolean; jobId: string }> {
  const res = await enqueueFollowUpNotification(
    {
      type: "STORAGE_CLEANUP",
      objectKey,
      proId,
      requestedAt: new Date().toISOString(),
    },
    0
  )

  return {
    scheduled: res.queued,
    jobId: res.messageId,
  }
}
