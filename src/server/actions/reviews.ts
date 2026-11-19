"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { enforceRateLimit, invalidateCatalogCache } from "@/lib/redis"
import { createReviewSchema, type CreateReviewInput } from "@/lib/validations/review"
import { requireActionSession } from "@/server/auth-guard"

export interface ServerActionResponse<T> {
  data: T | null
  error: string | null
}

export interface ReviewSubmissionResult {
  id: string
  bookingId: string
  targetId: string
  authorType: "CLIENT_TO_PRO" | "PRO_TO_CLIENT"
  rating: number
  comment: string
  createdAt: string
}

/**
 * Soumet un avis mutuel (Client -> Prestataire ou Prestataire -> Client)
 * Verifie COMPLETED, previent les doublons et recalcule atomiquement rating + reviewsCount du Pro.
 */
export async function submitMutualReviewAction(
  clientAuthorId: string,
  input: CreateReviewInput
): Promise<ServerActionResponse<ReviewSubmissionResult>> {
  void clientAuthorId
  const authRes = await requireActionSession()
  if (authRes.error !== null) {
    return { data: null, error: authRes.error }
  }

  const rateLimit = await enforceRateLimit("review", authRes.user.id)
  if (!rateLimit.allowed) {
    return { data: null, error: rateLimit.error }
  }

  const parsed = createReviewSchema.safeParse(input)
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message || "Données d'avis invalides"
    return { data: null, error: firstIssue }
  }

  const { bookingId, rating, comment, authorType } = parsed.data
  const authorId = authRes.user.id

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        pro: { select: { id: true, proProfile: { select: { id: true } } } },
      },
    })

    if (!booking) {
      return { data: null, error: "Réservation associée introuvable." }
    }

    const expectedParticipant =
      authorType === "CLIENT_TO_PRO" ? booking.clientId : booking.proId
    if (
      expectedParticipant !== authorId &&
      authRes.user.userType !== "admin"
    ) {
      return {
        data: null,
        error: "Vous n'êtes pas autorisé à noter cette prestation.",
      }
    }

    if (booking.status !== "COMPLETED") {
      return {
        data: null,
        error:
          "Un avis mutuel ne peut être publié qu'après la finalisation de la prestation.",
      }
    }

    const existingReview = await prisma.review.findUnique({
      where: {
        bookingId_authorId: { bookingId, authorId },
      },
      select: { id: true },
    })

    if (existingReview) {
      return {
        data: null,
        error: "Vous avez déjà publié un avis pour cette prestation.",
      }
    }

    // Resolution canonique du destinataire pour empecher toute usurpation de targetId
    const canonicalTargetId =
      authorType === "CLIENT_TO_PRO" ? booking.proId : booking.clientId

    const created = await prisma.$transaction(async (tx) => {
      const rev = await tx.review.create({
        data: {
          bookingId,
          authorId,
          targetId: canonicalTargetId,
          authorType,
          rating,
          comment,
          isModerated: true,
        },
      })

      if (authorType === "CLIENT_TO_PRO" && booking.pro.proProfile) {
        const agg = await tx.review.aggregate({
          where: {
            targetId: booking.proId,
            authorType: "CLIENT_TO_PRO",
            isModerated: true,
            isReported: false,
          },
          _avg: { rating: true },
          _count: { id: true },
        })

        const roundedRating = Number((agg._avg.rating || rating).toFixed(1))
        await tx.proProfile.update({
          where: { id: booking.pro.proProfile.id },
          data: {
            rating: roundedRating,
            reviewsCount: agg._count.id,
          },
        })
      }

      return rev
    })

    if (booking.pro.proProfile) {
      revalidatePath(`/professionals/pros/${booking.pro.proProfile.id}`)
    }
    await invalidateCatalogCache()
    revalidatePath("/professionals")
    revalidatePath("/dashboard/client")
    revalidatePath("/dashboard/client/bookings")
    revalidatePath("/dashboard/pro")
    revalidatePath("/dashboard/pro/schedule")

    return {
      data: {
        id: created.id,
        bookingId: created.bookingId,
        targetId: created.targetId,
        authorType,
        rating: created.rating,
        comment: created.comment,
        createdAt: created.createdAt.toISOString(),
      },
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error:
        err instanceof Error ? err.message : "Erreur lors de l'enregistrement de l'avis",
    }
  }
}
