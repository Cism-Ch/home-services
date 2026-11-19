"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { enforceRateLimit, invalidateCatalogCache } from "@/lib/redis"
import { createServiceSchema, type CreateServiceInput } from "@/lib/validations/service"
import { proProfileSchema, type ProProfileInput } from "@/lib/validations/pro-profile"
import {
  extractTigrisObjectKey,
  generateTigrisPresignedUrl,
  scheduleTigrisFileCleanup,
  type StorageFolder,
  type PresignedUrlResult,
} from "@/lib/storage"
import { requireProProfile } from "@/server/auth-guard"

export interface ServerActionResponse<T> {
  data: T | null
  error: string | null
}

/**
 * Cree une prestation en FCFA pour le professionnel
 */
export async function createProServiceAction(
  clientProProfileId: string,
  input: CreateServiceInput
): Promise<ServerActionResponse<{ id: string; title: string; price: number }>> {
  void clientProProfileId
  const authRes = await requireProProfile()
  if (authRes.error !== null) {
    return { data: null, error: authRes.error }
  }

  const parsed = createServiceSchema.safeParse(input)
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message || "Données de service invalides"
    return { data: null, error: firstIssue }
  }

  try {
    const categoryExists = await prisma.category.findUnique({
      where: { id: parsed.data.categoryId },
      select: { id: true },
    })

    if (!categoryExists) {
      return {
        data: null,
        error: "Catégorie introuvable. Veuillez sélectionner une catégorie valide.",
      }
    }

    const created = await prisma.service.create({
      data: {
        proProfileId: authRes.proProfile.id,
        categoryId: parsed.data.categoryId,
        title: parsed.data.title,
        description: parsed.data.description,
        price: parsed.data.price,
        duration: parsed.data.duration,
        isActive: parsed.data.isActive,
      },
    })

    await invalidateCatalogCache()
    revalidatePath("/dashboard/pro/services")
    revalidatePath("/services")
    revalidatePath(`/professionals/pros/${authRes.proProfile.id}`)

    return {
      data: {
        id: created.id,
        title: created.title,
        price: created.price,
      },
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Erreur lors de la création du service",
    }
  }
}

/**
 * Supprime un service du catalogue professionnel
 */
export async function deleteProServiceAction(
  serviceId: string
): Promise<ServerActionResponse<{ deletedId: string }>> {
  const authRes = await requireProProfile()
  if (authRes.error !== null) {
    return { data: null, error: authRes.error }
  }

  try {
    const existing = await prisma.service.findUnique({
      where: { id: serviceId },
      select: { proProfileId: true },
    })

    if (!existing) {
      return { data: null, error: "Service introuvable." }
    }

    if (
      existing.proProfileId !== authRes.proProfile.id &&
      authRes.user.userType !== "admin"
    ) {
      return { data: null, error: "Vous ne pouvez pas supprimer ce service." }
    }

    await prisma.service.delete({
      where: { id: serviceId },
    })

    await invalidateCatalogCache()
    revalidatePath("/dashboard/pro/services")
    revalidatePath("/services")
    revalidatePath(`/professionals/pros/${authRes.proProfile.id}`)

    return { data: { deletedId: serviceId }, error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Erreur lors de la suppression du service",
    }
  }
}

/**
 * Met a jour le profil public et les coordonnees WhatsApp / Telephone / Ville du professionnel
 */
export async function updateProProfileAction(
  clientProProfileId: string,
  input: ProProfileInput & { languages?: string[]; name?: string }
): Promise<ServerActionResponse<{ id: string; updatedAt: string }>> {
  void clientProProfileId
  const authRes = await requireProProfile()
  if (authRes.error !== null) {
    return { data: null, error: authRes.error }
  }

  const parsed = proProfileSchema.safeParse(input)
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message || "Informations de profil invalides"
    return { data: null, error: firstIssue }
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.proProfile.update({
        where: { id: authRes.proProfile.id },
        data: {
          headline: parsed.data.headline,
          bio: parsed.data.bio,
          phoneNumber: parsed.data.phoneNumber,
          whatsappNumber: parsed.data.whatsappNumber,
          yearsOfExperience: parsed.data.yearsOfExperience,
          cityId: parsed.data.cityId || null,
          commune: parsed.data.commune,
          address: parsed.data.address,
          availabilityStatus: parsed.data.availabilityStatus,
          ...(Array.isArray(input.languages) && input.languages.length > 0
            ? { languages: input.languages }
            : {}),
        },
      })

      if (input.name && input.name.trim().length >= 2) {
        await tx.user.update({
          where: { id: authRes.user.id },
          data: {
            name: input.name.trim(),
            phoneNumber: parsed.data.phoneNumber,
          },
        })
      }
    })

    await invalidateCatalogCache()
    revalidatePath("/dashboard/pro/profile")
    revalidatePath("/dashboard/pro/settings")
    revalidatePath("/professionals")
    revalidatePath(`/professionals/pros/${authRes.proProfile.id}`)

    return {
      data: { id: authRes.proProfile.id, updatedAt: new Date().toISOString() },
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Erreur lors de la sauvegarde du profil",
    }
  }
}

/**
 * Genere une URL presignee Tigris S3 pour uploader une photo de portfolio, un avatar ou un document KYC
 */
export async function requestPresignedUploadAction(
  clientProId: string,
  fileName: string,
  contentType: string,
  folder: StorageFolder,
  fileSizeBytes?: number
): Promise<ServerActionResponse<PresignedUrlResult>> {
  void clientProId
  const authRes = await requireProProfile()
  if (authRes.error !== null) {
    return { data: null, error: authRes.error }
  }

  const rateLimit = await enforceRateLimit("upload", authRes.user.id)
  if (!rateLimit.allowed) {
    return { data: null, error: rateLimit.error }
  }

  if (!fileName || !contentType) {
    return { data: null, error: "Nom de fichier et type MIME requis" }
  }

  try {
    const presigned = await generateTigrisPresignedUrl({
      proId: authRes.proProfile.id,
      fileName,
      contentType,
      folder,
      fileSizeBytes,
    })

    return { data: presigned, error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Erreur de génération de l'URL signée Tigris",
    }
  }
}

/**
 * Enregistre en base une photo de portfolio apres upload S3 direct reussi (max 12 photos)
 */
export async function confirmPortfolioUploadAction(
  publicUrl: string,
  objectKey: string
): Promise<ServerActionResponse<{ portfolioImages: string[] }>> {
  const authRes = await requireProProfile()
  if (authRes.error !== null) {
    return { data: null, error: authRes.error }
  }

  const expectedPrefix = `portfolio/${authRes.proProfile.id}/`
  if (!objectKey.startsWith(expectedPrefix) || !publicUrl.startsWith("http")) {
    return { data: null, error: "Chemin de fichier portfolio invalide." }
  }

  try {
    const current = await prisma.proProfile.findUnique({
      where: { id: authRes.proProfile.id },
      select: { portfolioImages: true },
    })

    const existingImages = current?.portfolioImages || []
    if (!existingImages.includes(publicUrl) && existingImages.length >= 12) {
      return {
        data: null,
        error: "Vous avez atteint la limite maximale de 12 photos de portfolio.",
      }
    }

    const updatedImages = existingImages.includes(publicUrl)
      ? existingImages
      : [...existingImages, publicUrl]

    await prisma.proProfile.update({
      where: { id: authRes.proProfile.id },
      data: { portfolioImages: updatedImages },
    })

    await invalidateCatalogCache()
    revalidatePath("/dashboard/pro/profile")
    revalidatePath("/professionals")
    revalidatePath(`/professionals/pros/${authRes.proProfile.id}`)

    return { data: { portfolioImages: updatedImages }, error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Erreur lors de l'enregistrement du portfolio",
    }
  }
}

/**
 * Met a jour l'avatar du prestataire apres upload S3 direct reussi
 */
export async function confirmAvatarUploadAction(
  publicUrl: string,
  objectKey: string
): Promise<ServerActionResponse<{ imageUrl: string }>> {
  const authRes = await requireProProfile()
  if (authRes.error !== null) {
    return { data: null, error: authRes.error }
  }

  const expectedPrefix = `avatars/${authRes.proProfile.id}/`
  if (!objectKey.startsWith(expectedPrefix) || !publicUrl.startsWith("http")) {
    return { data: null, error: "Chemin de fichier avatar invalide." }
  }

  try {
    await prisma.user.update({
      where: { id: authRes.user.id },
      data: { image: publicUrl },
    })

    await invalidateCatalogCache()
    revalidatePath("/dashboard/pro/profile")
    revalidatePath("/professionals")
    revalidatePath(`/professionals/pros/${authRes.proProfile.id}`)

    return { data: { imageUrl: publicUrl }, error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Erreur lors de la mise à jour de l'avatar",
    }
  }
}

/**
 * Enregistre la reference objet KYC privee (CNI / RCCM) et place le dossier en statut PENDING
 */
export async function confirmKycUploadAction(
  objectKey: string
): Promise<ServerActionResponse<{ kycStatus: string; kycDocumentUrl: string }>> {
  const authRes = await requireProProfile()
  if (authRes.error !== null) {
    return { data: null, error: authRes.error }
  }

  const expectedPrefix = `kyc/${authRes.proProfile.id}/`
  if (!objectKey.startsWith(expectedPrefix)) {
    return { data: null, error: "Chemin de justificatif KYC invalide." }
  }

  try {
    await prisma.proProfile.update({
      where: { id: authRes.proProfile.id },
      data: {
        kycDocumentUrl: objectKey,
        kycStatus: "PENDING",
        isVerified: false,
      },
    })

    await invalidateCatalogCache()
    revalidatePath("/dashboard/pro/profile")
    revalidatePath("/dashboard/admin")

    return {
      data: { kycStatus: "PENDING", kycDocumentUrl: objectKey },
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Erreur lors de la soumission KYC",
    }
  }
}

/**
 * Supprime un fichier du portfolio/KYC en base et planifie son nettoyage S3 via QStash
 */
export async function removeStoredAssetAction(
  clientProId: string,
  objectKey: string,
  imageUrl?: string
): Promise<ServerActionResponse<{ jobId: string | null }>> {
  void clientProId
  const authRes = await requireProProfile()
  if (authRes.error !== null) {
    return { data: null, error: authRes.error }
  }

  const proId = authRes.proProfile.id
  const ownedPrefixes = [
    `portfolio/${proId}/`,
    `kyc/${proId}/`,
    `avatars/${proId}/`,
  ]
  const extractedKey =
    (objectKey && ownedPrefixes.some((p) => objectKey.startsWith(p))
      ? objectKey
      : null) || extractTigrisObjectKey(imageUrl || "")
  const isOwnedS3Key =
    typeof extractedKey === "string" &&
    ownedPrefixes.some((prefix) => extractedKey.startsWith(prefix))

  if (objectKey && !objectKey.startsWith("legacy:") && !isOwnedS3Key && !imageUrl) {
    return { data: null, error: "Accès non autorisé sur ce fichier S3." }
  }

  try {
    if (imageUrl) {
      const current = await prisma.proProfile.findUnique({
        where: { id: proId },
        select: { portfolioImages: true },
      })
      if (current) {
        const nextImages = current.portfolioImages.filter((url) => url !== imageUrl)
        if (nextImages.length !== current.portfolioImages.length) {
          await prisma.proProfile.update({
            where: { id: proId },
            data: { portfolioImages: nextImages },
          })
        }
      }
    }

    let jobId: string | null = null
    if (isOwnedS3Key && extractedKey) {
      const cleanupRes = await scheduleTigrisFileCleanup(extractedKey, proId)
      jobId = cleanupRes.jobId
    }

    await invalidateCatalogCache()
    revalidatePath("/dashboard/pro/profile")
    revalidatePath("/professionals")
    revalidatePath(`/professionals/pros/${proId}`)

    return { data: { jobId }, error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Erreur lors de la suppression du fichier",
    }
  }
}
