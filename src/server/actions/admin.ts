"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { invalidateCatalogCache } from "@/lib/redis"
import { generateTigrisReadUrl } from "@/lib/storage"
import { requireActionSession } from "@/server/auth-guard"

export interface ServerActionResponse<T> {
  data: T | null
  error: string | null
}

const entityIdSchema = z.string().trim().min(1, "Identifiant requis").max(120)
const kycDecisionSchema = z.enum(["APPROVE", "REJECT"])
const reviewDecisionSchema = z.enum(["APPROVE", "REMOVE"])

const slugSchema = z
  .string()
  .trim()
  .min(2, "L'identifiant (slug) doit comporter au moins 2 caractères")
  .max(60)
  .regex(
    /^[a-z0-9-]+$/,
    "Le slug ne doit contenir que des lettres minuscules, chiffres et tirets"
  )

const createCategorySchema = z.object({
  id: slugSchema,
  name: z.string().trim().min(2, "Le nom de catégorie est requis").max(80),
  description: z.string().trim().max(240).optional(),
  icon: z.string().trim().min(2, "L'icône Lucide est requise").max(40),
})

const createCitySchema = z.object({
  id: slugSchema,
  name: z.string().trim().min(2, "Le nom de ville ou commune est requis").max(100),
  country: z.string().trim().min(2, "Le pays est requis").max(80),
  currency: z.string().trim().min(3).max(6).default("XOF"),
})

/**
 * Approuve ou rejette le dossier KYC (CNI / RCCM) d'un prestataire
 */
export async function verifyProKycAction(
  proProfileId: string,
  decision: "APPROVE" | "REJECT"
): Promise<
  ServerActionResponse<{
    proProfileId: string
    isVerified: boolean
    kycStatus: "APPROVED" | "REJECTED"
  }>
> {
  const authRes = await requireActionSession(["admin"])
  if (authRes.error !== null) {
    return { data: null, error: authRes.error }
  }

  const parsedId = entityIdSchema.safeParse(proProfileId)
  const parsedDecision = kycDecisionSchema.safeParse(decision)
  if (!parsedId.success || !parsedDecision.success) {
    return { data: null, error: "Paramètres de validation KYC invalides." }
  }

  const isVerified = parsedDecision.data === "APPROVE"
  const kycStatus = isVerified ? "APPROVED" : "REJECTED"

  try {
    await prisma.proProfile.update({
      where: { id: parsedId.data },
      data: {
        isVerified,
        kycStatus,
      },
    })

    await invalidateCatalogCache()
    revalidatePath("/dashboard/admin")
    revalidatePath("/professionals")
    revalidatePath(`/professionals/pros/${parsedId.data}`)

    return {
      data: { proProfileId: parsedId.data, isVerified, kycStatus },
      error: null,
    }
  } catch (err) {
    console.error("[admin] verifyProKyc error:", err)
    return {
      data: null,
      error: "Erreur lors de la validation du dossier KYC.",
    }
  }
}

/**
 * Genere une URL signee GET temporaire pour consulter le document KYC prive d'un prestataire
 */
export async function getKycSignedDocumentUrlAction(
  proProfileId: string
): Promise<ServerActionResponse<{ url: string; expiresInSeconds: number }>> {
  const authRes = await requireActionSession(["admin"])
  if (authRes.error !== null) {
    return { data: null, error: authRes.error }
  }

  const parsedId = entityIdSchema.safeParse(proProfileId)
  if (!parsedId.success) {
    return { data: null, error: "Identifiant de profil invalide." }
  }

  try {
    const profile = await prisma.proProfile.findUnique({
      where: { id: parsedId.data },
      select: { kycDocumentUrl: true },
    })

    if (!profile?.kycDocumentUrl) {
      return {
        data: null,
        error: "Aucun justificatif KYC n'a encore été téléversé pour ce prestataire.",
      }
    }

    const expiresInSeconds = 300
    const signedUrl = await generateTigrisReadUrl(
      profile.kycDocumentUrl,
      expiresInSeconds
    )

    if (!signedUrl) {
      return {
        data: null,
        error: "Stockage Tigris S3 non configuré pour générer le lien sécurisé.",
      }
    }

    return {
      data: { url: signedUrl, expiresInSeconds },
      error: null,
    }
  } catch (err) {
    console.error("[admin] getKycSignedDocumentUrl error:", err)
    return {
      data: null,
      error: "Impossible de générer l'accès sécurisé au document KYC.",
    }
  }
}

/**
 * Modere un avis mutuel et recalcule atomiquement la note / compteur du prestataire
 */
export async function moderateReviewAction(
  reviewId: string,
  decision: "APPROVE" | "REMOVE"
): Promise<ServerActionResponse<{ reviewId: string; status: string }>> {
  const authRes = await requireActionSession(["admin"])
  if (authRes.error !== null) {
    return { data: null, error: authRes.error }
  }

  const parsedReviewId = entityIdSchema.safeParse(reviewId)
  const parsedDecision = reviewDecisionSchema.safeParse(decision)
  if (!parsedReviewId.success || !parsedDecision.success) {
    return { data: null, error: "Paramètres de modération d'avis invalides." }
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const targetReview = await tx.review.findUnique({
        where: { id: parsedReviewId.data },
        select: { id: true, targetId: true, authorType: true },
      })

      if (!targetReview) {
        return { error: "Avis introuvable." as const, proProfileId: null }
      }

      if (parsedDecision.data === "REMOVE") {
        await tx.review.delete({
          where: { id: parsedReviewId.data },
        })
      } else {
        await tx.review.update({
          where: { id: parsedReviewId.data },
          data: { isModerated: true, isReported: false },
        })
      }

      let affectedProId: string | null = null
      if (targetReview.authorType === "CLIENT_TO_PRO") {
        const proProfile = await tx.proProfile.findUnique({
          where: { userId: targetReview.targetId },
          select: { id: true },
        })

        if (proProfile) {
          affectedProId = proProfile.id
          const agg = await tx.review.aggregate({
            where: {
              targetId: targetReview.targetId,
              authorType: "CLIENT_TO_PRO",
              isModerated: true,
              isReported: false,
            },
            _avg: { rating: true },
            _count: { id: true },
          })

          const nextCount = agg._count.id
          const nextRating =
            nextCount > 0 && agg._avg.rating !== null
              ? Number(agg._avg.rating.toFixed(1))
              : 5.0

          await tx.proProfile.update({
            where: { id: proProfile.id },
            data: {
              rating: nextRating,
              reviewsCount: nextCount,
            },
          })
        }
      }

      return { error: null, proProfileId: affectedProId }
    })

    if (result.error) {
      return { data: null, error: result.error }
    }

    await invalidateCatalogCache()
    revalidatePath("/dashboard/admin")
    revalidatePath("/professionals")
    if (result.proProfileId) {
      revalidatePath(`/professionals/pros/${result.proProfileId}`)
    }

    return {
      data: {
        reviewId: parsedReviewId.data,
        status: parsedDecision.data === "APPROVE" ? "PUBLISHED" : "REMOVED",
      },
      error: null,
    }
  } catch (err) {
    console.error("[admin] moderateReview error:", err)
    return {
      data: null,
      error: "Erreur lors de la modération de l'avis.",
    }
  }
}

/**
 * Cree une categorie de metier dans PostgreSQL
 */
export async function createCategoryAction(
  input: z.input<typeof createCategorySchema>
): Promise<ServerActionResponse<{ id: string; name: string }>> {
  const authRes = await requireActionSession(["admin"])
  if (authRes.error !== null) {
    return { data: null, error: authRes.error }
  }

  const parsed = createCategorySchema.safeParse(input)
  if (!parsed.success) {
    return {
      data: null,
      error: parsed.error.issues[0]?.message || "Données de catégorie invalides",
    }
  }

  try {
    const existing = await prisma.category.findUnique({
      where: { id: parsed.data.id },
      select: { id: true },
    })
    if (existing) {
      return {
        data: null,
        error: "Une catégorie avec cet identifiant existe déjà.",
      }
    }

    const created = await prisma.category.create({
      data: {
        id: parsed.data.id,
        name: parsed.data.name,
        description: parsed.data.description || null,
        icon: parsed.data.icon,
      },
    })

    await invalidateCatalogCache()
    revalidatePath("/dashboard/admin")
    revalidatePath("/")
    revalidatePath("/services")

    return {
      data: { id: created.id, name: created.name },
      error: null,
    }
  } catch (err) {
    console.error("[admin] createCategory error:", err)
    return {
      data: null,
      error: "Erreur lors de la création de catégorie.",
    }
  }
}

/**
 * Supprime une categorie de metier si aucune prestation n'y est rattachee
 */
export async function deleteCategoryAction(
  categoryId: string
): Promise<ServerActionResponse<{ deletedId: string }>> {
  const authRes = await requireActionSession(["admin"])
  if (authRes.error !== null) {
    return { data: null, error: authRes.error }
  }

  const parsedId = entityIdSchema.safeParse(categoryId)
  if (!parsedId.success) {
    return { data: null, error: "Identifiant de catégorie invalide." }
  }

  try {
    const target = await prisma.category.findUnique({
      where: { id: parsedId.data },
      include: { _count: { select: { services: true } } },
    })

    if (!target) {
      return { data: null, error: "Catégorie introuvable." }
    }

    if (target._count.services > 0) {
      return {
        data: null,
        error: `Impossible de supprimer cette catégorie car ${target._count.services} prestation(s) y sont rattachées.`,
      }
    }

    await prisma.category.delete({ where: { id: parsedId.data } })

    await invalidateCatalogCache()
    revalidatePath("/dashboard/admin")
    revalidatePath("/")
    revalidatePath("/services")

    return { data: { deletedId: parsedId.data }, error: null }
  } catch (err) {
    console.error("[admin] deleteCategory error:", err)
    return {
      data: null,
      error: "Erreur lors de la suppression de catégorie.",
    }
  }
}

/**
 * Ajoute une ville / commune au referentiel GEO PostgreSQL
 */
export async function createCityAction(
  input: z.input<typeof createCitySchema>
): Promise<ServerActionResponse<{ id: string; name: string }>> {
  const authRes = await requireActionSession(["admin"])
  if (authRes.error !== null) {
    return { data: null, error: authRes.error }
  }

  const parsed = createCitySchema.safeParse(input)
  if (!parsed.success) {
    return {
      data: null,
      error: parsed.error.issues[0]?.message || "Données géographiques invalides",
    }
  }

  try {
    const existing = await prisma.city.findUnique({
      where: { id: parsed.data.id },
      select: { id: true },
    })
    if (existing) {
      return {
        data: null,
        error: "Une zone géographique avec cet identifiant existe déjà.",
      }
    }

    const created = await prisma.city.create({
      data: {
        id: parsed.data.id,
        name: parsed.data.name,
        country: parsed.data.country,
        currency: parsed.data.currency,
      },
    })

    await invalidateCatalogCache()
    revalidatePath("/dashboard/admin")
    revalidatePath("/professionals")
    revalidatePath("/services")

    return {
      data: { id: created.id, name: created.name },
      error: null,
    }
  } catch (err) {
    console.error("[admin] createCity error:", err)
    return {
      data: null,
      error: "Erreur lors de l'ajout de la zone GEO.",
    }
  }
}

/**
 * Supprime une zone GEO du referentiel (les profils lies conservent un cityId null)
 */
export async function deleteCityAction(
  cityId: string
): Promise<ServerActionResponse<{ deletedId: string }>> {
  const authRes = await requireActionSession(["admin"])
  if (authRes.error !== null) {
    return { data: null, error: authRes.error }
  }

  const parsedId = entityIdSchema.safeParse(cityId)
  if (!parsedId.success) {
    return { data: null, error: "Identifiant de zone GEO invalide." }
  }

  try {
    await prisma.city.delete({ where: { id: parsedId.data } })

    await invalidateCatalogCache()
    revalidatePath("/dashboard/admin")
    revalidatePath("/professionals")
    revalidatePath("/services")

    return { data: { deletedId: parsedId.data }, error: null }
  } catch (err) {
    console.error("[admin] deleteCity error:", err)
    return {
      data: null,
      error: "Erreur lors de la suppression de la zone GEO.",
    }
  }
}
