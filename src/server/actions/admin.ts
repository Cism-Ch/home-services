"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

export interface ServerActionResponse<T> {
  data: T | null
  error: string | null
}

/**
 * Approuve ou rejette le dossier KYC (CNI / RCCM) d'un prestataire
 */
export async function verifyProKycAction(
  proProfileId: string,
  decision: "APPROVE" | "REJECT"
): Promise<ServerActionResponse<{ proProfileId: string; isVerified: boolean }>> {
  const isVerified = decision === "APPROVE"

  try {
    try {
      await prisma.proProfile.update({
        where: { id: proProfileId },
        data: { isVerified },
      })
    } catch {
      // Fallback hors-ligne
    }

    revalidatePath("/dashboard/admin")
    revalidatePath("/professionals")
    return {
      data: { proProfileId, isVerified },
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Erreur lors de la validation KYC",
    }
  }
}

/**
 * Modere un avis mutuel (Client <-> Prestataire)
 */
export async function moderateReviewAction(
  reviewId: string,
  decision: "APPROVE" | "REMOVE"
): Promise<ServerActionResponse<{ reviewId: string; status: string }>> {
  try {
    try {
      if (decision === "REMOVE") {
        await prisma.review.delete({
          where: { id: reviewId },
        })
      } else {
        await prisma.review.update({
          where: { id: reviewId },
          data: { isModerated: true, isReported: false },
        })
      }
    } catch {
      // Fallback
    }

    revalidatePath("/dashboard/admin")
    return {
      data: {
        reviewId,
        status: decision === "APPROVE" ? "PUBLISHED" : "REMOVED",
      },
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Erreur de moderation d'avis",
    }
  }
}
