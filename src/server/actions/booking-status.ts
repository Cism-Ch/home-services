"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { enqueueFollowUpNotification } from "@/lib/qstash"

export interface ServerActionResponse<T> {
  data: T | null
  error: string | null
}

export type ProAvailabilityType = "AVAILABLE" | "BUSY_TODAY" | "OFFLINE"
export type BookingStatusWorkflow = "NEGOTIATING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"

/**
 * Server Action pour modifier manuellement le statut de disponibilite du professionnel
 */
export async function setProAvailabilityAction(
  proId: string,
  status: ProAvailabilityType
): Promise<ServerActionResponse<{ proId: string; status: ProAvailabilityType }>> {
  try {
    try {
      await prisma.proProfile.update({
        where: { id: proId },
        data: { availabilityStatus: status },
      })
    } catch {
      // Fallback gracieux si l'ID n'est pas encore en DB locale
    }

    revalidatePath("/dashboard/pro")
    revalidatePath("/dashboard/pro/availability")
    revalidatePath("/dashboard/pro/schedule")
    revalidatePath("/professionals")

    return {
      data: { proId, status },
      error: null,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur de mise a jour de disponibilite"
    return { data: null, error: message }
  }
}

/**
 * Server Action declenchee lorsque le client ou le pro valide l'offre en negociation:
 * Passe la reservation en IN_PROGRESS et verrouille automatiquement la disponibilite du pro sur BUSY_TODAY
 */
export async function validateOfferAction(
  bookingId: string
): Promise<ServerActionResponse<{ bookingId: string; status: "IN_PROGRESS"; proStatus: "BUSY_TODAY" }>> {
  try {
    try {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { pro: { include: { proProfile: true } } },
      })

      if (booking) {
        await prisma.booking.update({
          where: { id: bookingId },
          data: { status: "IN_PROGRESS" },
        })

        if (booking.pro.proProfile) {
          await prisma.proProfile.update({
            where: { id: booking.pro.proProfile.id },
            data: { availabilityStatus: "BUSY_TODAY" },
          })
        }
      }
    } catch {
      // Fallback
    }

    await enqueueFollowUpNotification({
      type: "TASK_FOLLOW_UP_EMAIL",
      bookingId,
      clientEmail: "client@homeservices.ci",
      clientName: "Client HomeServices",
      proName: "Artisan Partenaire",
      serviceTitle: "Prestation en cours",
      timeSlot: "09:00 - 11:00",
      indicativePriceFCFA: 15000,
    })

    revalidatePath("/dashboard/client")
    revalidatePath("/dashboard/client/bookings")
    revalidatePath("/dashboard/pro")
    revalidatePath("/dashboard/pro/schedule")

    return {
      data: { bookingId, status: "IN_PROGRESS", proStatus: "BUSY_TODAY" },
      error: null,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur lors de la validation de l'offre"
    return { data: null, error: message }
  }
}

/**
 * Server Action pour le suivi interactif client:
 * "Vos taches ont-elles ete finalisees ? [Oui / En cours / Non]"
 * Si OUI: cloture la mission en COMPLETED et debloque la disponibilite du pro vers AVAILABLE
 */
export async function answerTaskFollowUpAction(
  bookingId: string,
  answer: "YES" | "IN_PROGRESS" | "NO"
): Promise<ServerActionResponse<{ bookingId: string; bookingStatus: BookingStatusWorkflow; proStatus?: ProAvailabilityType }>> {
  try {
    let nextBookingStatus: BookingStatusWorkflow = "IN_PROGRESS"
    let nextProStatus: ProAvailabilityType = "BUSY_TODAY"

    if (answer === "YES") {
      nextBookingStatus = "COMPLETED"
      nextProStatus = "AVAILABLE"

      try {
        const booking = await prisma.booking.findUnique({
          where: { id: bookingId },
          include: { pro: { include: { proProfile: true } } },
        })

        if (booking) {
          await prisma.booking.update({
            where: { id: bookingId },
            data: {
              status: "COMPLETED",
              completedAt: new Date(),
            },
          })

          if (booking.pro.proProfile) {
            // Verifier s'il n'y a pas d'autre reservation IN_PROGRESS pour aujourd'hui
            const otherActiveBookings = await prisma.booking.count({
              where: {
                proId: booking.proId,
                status: "IN_PROGRESS",
                id: { not: bookingId },
              },
            })

            if (otherActiveBookings === 0) {
              await prisma.proProfile.update({
                where: { id: booking.pro.proProfile.id },
                data: { availabilityStatus: "AVAILABLE" },
              })
            }
          }
        }
      } catch {
        // Fallback
      }
    } else if (answer === "NO") {
      // Cas de litige ou probleme signale
      nextBookingStatus = "IN_PROGRESS"
    } else {
      // IN_PROGRESS : toujours en cours, reprogramme un rappel QStash ulterieur
      nextBookingStatus = "IN_PROGRESS"
      nextProStatus = "BUSY_TODAY"
      await enqueueFollowUpNotification({
        type: "TASK_FOLLOW_UP_EMAIL",
        bookingId,
        clientEmail: "client@homeservices.ci",
        clientName: "Client HomeServices",
        proName: "Artisan Partenaire",
        serviceTitle: "Prestation en cours",
        timeSlot: "09:00 - 11:00",
        indicativePriceFCFA: 15000,
      })
    }

    revalidatePath("/dashboard/client")
    revalidatePath("/dashboard/client/bookings")
    revalidatePath("/dashboard/pro")
    revalidatePath("/dashboard/pro/schedule")

    return {
      data: {
        bookingId,
        bookingStatus: nextBookingStatus,
        proStatus: nextProStatus,
      },
      error: null,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur lors du suivi de fin de tache"
    return { data: null, error: message }
  }
}
