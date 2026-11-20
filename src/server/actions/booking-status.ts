"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { enqueueFollowUpNotification } from "@/lib/qstash"
import { enforceRateLimit, invalidateCatalogCache } from "@/lib/redis"
import { broadcastBookingStatusEvent } from "@/lib/supabase-server"
import { requireActionSession } from "@/server/auth-guard"
import { syncProAvailabilityFromCapacity } from "@/server/helpers/availability-sync"

const entityIdSchema = z.string().trim().min(1, "Identifiant requis").max(120)

const setProAvailabilitySchema = z.object({
  proId: entityIdSchema,
  status: z.enum(["AVAILABLE", "BUSY_TODAY", "OFFLINE"]),
})

const followUpInputSchema = z.object({
  bookingId: entityIdSchema,
  answer: z.enum(["YES", "IN_PROGRESS", "NO"]),
})

export interface ServerActionResponse<T> {
  data: T | null
  error: string | null
}

export type ProAvailabilityType = "AVAILABLE" | "BUSY_TODAY" | "OFFLINE"
export type BookingStatusWorkflow =
  | "NEGOTIATING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"

/**
 * Server Action pour modifier manuellement le statut de disponibilite du professionnel
 */
export async function setProAvailabilityAction(
  proId: string,
  status: ProAvailabilityType
): Promise<ServerActionResponse<{ proId: string; status: ProAvailabilityType }>> {
  try {
    const authRes = await requireActionSession(["pro", "admin"])
    if (authRes.error !== null) {
      return { data: null, error: authRes.error }
    }

    const parsed = setProAvailabilitySchema.safeParse({ proId, status })
    if (!parsed.success) {
      return {
        data: null,
        error: parsed.error.issues[0]?.message || "Paramètres de disponibilité invalides.",
      }
    }

    const existingPro = await prisma.proProfile.findUnique({
      where: { id: parsed.data.proId },
      select: { id: true, userId: true },
    })

    if (!existingPro) {
      return { data: null, error: "Profil prestataire introuvable." }
    }

    if (
      existingPro.userId !== authRes.user.id &&
      authRes.user.userType !== "admin"
    ) {
      return { data: null, error: "Accès non autorisé sur ce profil prestataire." }
    }

    await prisma.proProfile.update({
      where: { id: existingPro.id },
      data: { availabilityStatus: parsed.data.status },
    })

    await invalidateCatalogCache()
    revalidatePath("/dashboard/pro")
    revalidatePath("/dashboard/pro/availability")
    revalidatePath("/dashboard/pro/schedule")
    revalidatePath("/professionals")
    revalidatePath(`/professionals/pros/${existingPro.id}`)

    return {
      data: { proId: existingPro.id, status: parsed.data.status },
      error: null,
    }
  } catch (err) {
    console.error("[booking-status] setProAvailability error:", err)
    return {
      data: null,
      error: "Erreur lors de la mise à jour de disponibilité.",
    }
  }
}

/**
 * Server Action declenchee lorsque le client ou le pro valide l'offre en negociation:
 * Passe la reservation en IN_PROGRESS et verrouille automatiquement la disponibilite du pro sur BUSY_TODAY
 */
export async function validateOfferAction(
  bookingId: string
): Promise<
  ServerActionResponse<{
    bookingId: string
    status: "IN_PROGRESS"
    proStatus: ProAvailabilityType
  }>
> {
  try {
    const authRes = await requireActionSession()
    if (authRes.error !== null) {
      return { data: null, error: authRes.error }
    }

    const rateLimit = await enforceRateLimit("booking", authRes.user.id)
    if (!rateLimit.allowed) {
      return { data: null, error: rateLimit.error || "Trop de requêtes effectuées." }
    }

    const parsedId = entityIdSchema.safeParse(bookingId)
    if (!parsedId.success) {
      return { data: null, error: "Identifiant de réservation invalide." }
    }

    const booking = await prisma.booking.findUnique({
      where: { id: parsedId.data },
      include: {
        client: { select: { email: true, name: true } },
        pro: { select: { name: true, proProfile: true } },
        service: { select: { title: true } },
      },
    })

    if (!booking) {
      return { data: null, error: "Réservation introuvable." }
    }

    if (
      booking.clientId !== authRes.user.id &&
      booking.proId !== authRes.user.id &&
      authRes.user.userType !== "admin"
    ) {
      return { data: null, error: "Accès refusé pour valider cette offre." }
    }

    if (booking.status !== "NEGOTIATING") {
      return {
        data: null,
        error: "Seule une demande en négociation peut être validée.",
      }
    }

    const nextProStatus = await prisma.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: "IN_PROGRESS" },
      })

      if (!booking.pro.proProfile) {
        return "BUSY_TODAY" as const
      }

      return syncProAvailabilityFromCapacity(tx, {
        proUserId: booking.proId,
        proProfileId: booking.pro.proProfile.id,
        currentAvailabilityStatus: booking.pro.proProfile.availabilityStatus,
        organizationType: booking.pro.proProfile.organizationType,
        maxConcurrentProjects: booking.pro.proProfile.maxConcurrentProjects,
        markBusyWhenSaturated: true,
      })
    })

    await enqueueFollowUpNotification({
      type: "TASK_FOLLOW_UP_EMAIL",
      bookingId,
      clientEmail: booking.client.email,
      clientName: booking.clientName || booking.client.name,
      proName: booking.pro.name,
      serviceTitle: booking.service.title,
      timeSlot: booking.timeSlot,
      indicativePriceFCFA: booking.indicativePrice,
    })

    await invalidateCatalogCache()
    await broadcastBookingStatusEvent([booking.clientId, booking.proId], {
      bookingId,
      status: "IN_PROGRESS",
      message: "Offre validée : intervention en cours de traitement.",
    })
    revalidatePath("/dashboard/client")
    revalidatePath("/dashboard/client/bookings")
    revalidatePath("/dashboard/pro")
    revalidatePath("/dashboard/pro/schedule")
    revalidatePath("/professionals")

    return {
      data: { bookingId, status: "IN_PROGRESS", proStatus: nextProStatus },
      error: null,
    }
  } catch (err) {
    console.error("[booking-status] validateOffer error:", err)
    return {
      data: null,
      error: "Erreur lors de la validation de l'offre.",
    }
  }
}

/**
 * Server Action pour le suivi interactif client/pro:
 * "Vos taches ont-elles ete finalisees ? [Oui / En cours / Non]"
 * Si OUI: cloture la mission en COMPLETED, incremente completedTasks et debloque le pro vers AVAILABLE
 */
export async function answerTaskFollowUpAction(
  bookingId: string,
  answer: "YES" | "IN_PROGRESS" | "NO"
): Promise<
  ServerActionResponse<{
    bookingId: string
    bookingStatus: BookingStatusWorkflow
    proStatus?: ProAvailabilityType
  }>
> {
  try {
    const authRes = await requireActionSession()
    if (authRes.error !== null) {
      return { data: null, error: authRes.error }
    }

    const rateLimit = await enforceRateLimit("booking", authRes.user.id)
    if (!rateLimit.allowed) {
      return { data: null, error: rateLimit.error || "Trop de requêtes effectuées." }
    }

    const parsed = followUpInputSchema.safeParse({ bookingId, answer })
    if (!parsed.success) {
      return { data: null, error: "Paramètres de suivi invalides." }
    }

    const booking = await prisma.booking.findUnique({
      where: { id: parsed.data.bookingId },
      include: {
        client: { select: { email: true, name: true } },
        pro: { select: { name: true, proProfile: true } },
        service: { select: { title: true } },
      },
    })

    if (!booking) {
      return { data: null, error: "Réservation introuvable." }
    }

    if (
      booking.clientId !== authRes.user.id &&
      booking.proId !== authRes.user.id &&
      authRes.user.userType !== "admin"
    ) {
      return {
        data: null,
        error: "Vous n'êtes pas autorisé à actualiser cette mission.",
      }
    }

    if (booking.status === "COMPLETED" && parsed.data.answer === "YES") {
      return {
        data: {
          bookingId: booking.id,
          bookingStatus: "COMPLETED",
          proStatus: "AVAILABLE",
        },
        error: null,
      }
    }

    if (booking.status !== "IN_PROGRESS") {
      return {
        data: null,
        error: "Cette mission n'est pas en cours de traitement.",
      }
    }

    let nextBookingStatus: BookingStatusWorkflow = "IN_PROGRESS"
    let nextProStatus: ProAvailabilityType = "BUSY_TODAY"

    if (answer === "YES") {
      nextBookingStatus = "COMPLETED"
      nextProStatus = await prisma.$transaction(async (tx) => {
        const wasAlreadyCompleted = booking.status === "COMPLETED"

        await tx.booking.update({
          where: { id: bookingId },
          data: {
            status: "COMPLETED",
            completedAt: booking.completedAt || new Date(),
          },
        })

        if (!booking.pro.proProfile) {
          return "AVAILABLE" as const
        }

        if (!wasAlreadyCompleted) {
          await tx.proProfile.update({
            where: { id: booking.pro.proProfile.id },
            data: { completedTasks: { increment: 1 } },
          })
        }

        return syncProAvailabilityFromCapacity(tx, {
          proUserId: booking.proId,
          proProfileId: booking.pro.proProfile.id,
          currentAvailabilityStatus: booking.pro.proProfile.availabilityStatus,
          organizationType: booking.pro.proProfile.organizationType,
          maxConcurrentProjects: booking.pro.proProfile.maxConcurrentProjects,
          excludeBookingId: bookingId,
        })
      })
    } else if (answer === "NO") {
      nextBookingStatus = "IN_PROGRESS"
    } else {
      nextBookingStatus = "IN_PROGRESS"
      nextProStatus = "BUSY_TODAY"
      await enqueueFollowUpNotification({
        type: "TASK_FOLLOW_UP_EMAIL",
        bookingId,
        clientEmail: booking.client.email,
        clientName: booking.clientName || booking.client.name,
        proName: booking.pro.name,
        serviceTitle: booking.service.title,
        timeSlot: booking.timeSlot,
        indicativePriceFCFA: booking.indicativePrice,
      })
    }

    if (answer === "YES") {
      await broadcastBookingStatusEvent([booking.clientId, booking.proId], {
        bookingId,
        status: "COMPLETED",
        message: "Mission clôturée avec succès.",
      })
    }

    await invalidateCatalogCache()
    revalidatePath("/dashboard/client")
    revalidatePath("/dashboard/client/bookings")
    revalidatePath("/dashboard/pro")
    revalidatePath("/dashboard/pro/schedule")
    revalidatePath("/professionals")

    return {
      data: {
        bookingId,
        bookingStatus: nextBookingStatus,
        proStatus: nextProStatus,
      },
      error: null,
    }
  } catch (err) {
    console.error("[booking-status] answerTaskFollowUp error:", err)
    return {
      data: null,
      error: "Erreur lors du suivi de fin de tâche.",
    }
  }
}
