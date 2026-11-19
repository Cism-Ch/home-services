"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { enqueueFollowUpNotification } from "@/lib/qstash"
import { requireActionSession } from "@/server/auth-guard"

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

    const existingPro = await prisma.proProfile.findUnique({
      where: { id: proId },
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
      data: { availabilityStatus: status },
    })

    revalidatePath("/dashboard/pro")
    revalidatePath("/dashboard/pro/availability")
    revalidatePath("/dashboard/pro/schedule")
    revalidatePath("/professionals")
    revalidatePath(`/professionals/pros/${existingPro.id}`)

    return {
      data: { proId: existingPro.id, status },
      error: null,
    }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erreur de mise à jour de disponibilité"
    return { data: null, error: message }
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
    proStatus: "BUSY_TODAY"
  }>
> {
  try {
    const authRes = await requireActionSession()
    if (authRes.error !== null) {
      return { data: null, error: authRes.error }
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
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

    await prisma.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: "IN_PROGRESS" },
      })

      if (booking.pro.proProfile) {
        await tx.proProfile.update({
          where: { id: booking.pro.proProfile.id },
          data: { availabilityStatus: "BUSY_TODAY" },
        })
      }
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

    revalidatePath("/dashboard/client")
    revalidatePath("/dashboard/client/bookings")
    revalidatePath("/dashboard/pro")
    revalidatePath("/dashboard/pro/schedule")
    revalidatePath("/professionals")

    return {
      data: { bookingId, status: "IN_PROGRESS", proStatus: "BUSY_TODAY" },
      error: null,
    }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erreur lors de la validation de l'offre"
    return { data: null, error: message }
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

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
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

    let nextBookingStatus: BookingStatusWorkflow = "IN_PROGRESS"
    let nextProStatus: ProAvailabilityType = "BUSY_TODAY"

    if (answer === "YES") {
      nextBookingStatus = "COMPLETED"
      nextProStatus = "AVAILABLE"

      await prisma.$transaction(async (tx) => {
        const wasAlreadyCompleted = booking.status === "COMPLETED"

        await tx.booking.update({
          where: { id: bookingId },
          data: {
            status: "COMPLETED",
            completedAt: booking.completedAt || new Date(),
          },
        })

        if (booking.pro.proProfile) {
          const otherActiveBookings = await tx.booking.count({
            where: {
              proId: booking.proId,
              status: "IN_PROGRESS",
              id: { not: bookingId },
            },
          })

          if (otherActiveBookings > 0) {
            nextProStatus = "BUSY_TODAY"
          }

          await tx.proProfile.update({
            where: { id: booking.pro.proProfile.id },
            data: {
              ...(wasAlreadyCompleted
                ? {}
                : { completedTasks: { increment: 1 } }),
              ...(otherActiveBookings === 0
                ? { availabilityStatus: "AVAILABLE" }
                : {}),
            },
          })
        }
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
    const message =
      err instanceof Error ? err.message : "Erreur lors du suivi de fin de tâche"
    return { data: null, error: message }
  }
}
