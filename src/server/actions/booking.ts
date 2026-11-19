"use server"

import { revalidatePath } from "next/cache"
import {
  createBookingSchema,
  updateBookingStatusSchema,
  type CreateBookingInput,
  type UpdateBookingStatusInput,
} from "@/lib/validations/booking"
import { prisma } from "@/lib/prisma"
import { enforceRateLimit } from "@/lib/redis"
import { broadcastBookingStatusEvent } from "@/lib/supabase-server"
import { requireActionSession } from "@/server/auth-guard"

export interface ServerActionResponse<T> {
  data: T | null
  error: string | Record<string, string[]> | null
}

export interface BookingResult {
  id: string
  proId: string
  serviceId: string
  bookingDate: string
  timeSlot: string
  clientName: string
  clientPhone: string
  clientAddress: string
  clientNotes?: string
  indicativePrice: number
  status: "NEGOTIATING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
  createdAt: string
}

/**
 * Server Action pour reserver un creneau horaire sans paiement direct en ligne.
 * Resout canoniquement proId -> User.id et empeche les doubles reservations via transaction Prisma.
 */
export async function createSlotBooking(
  input: CreateBookingInput
): Promise<ServerActionResponse<BookingResult>> {
  try {
    const authRes = await requireActionSession()
    if (authRes.error !== null) {
      return { data: null, error: authRes.error }
    }

    const rateLimit = await enforceRateLimit("booking", authRes.user.id)
    if (!rateLimit.allowed) {
      return { data: null, error: rateLimit.error }
    }

    const validated = createBookingSchema.safeParse(input)
    if (!validated.success) {
      return {
        data: null,
        error: validated.error.flatten().fieldErrors,
      }
    }

    const data = validated.data
    const requestedDate = new Date(data.bookingDate)
    if (Number.isNaN(requestedDate.getTime())) {
      return { data: null, error: "Date de réservation invalide." }
    }

    const dayStart = new Date(requestedDate)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(requestedDate)
    dayEnd.setHours(23, 59, 59, 999)

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const txResult = await prisma.$transaction(async (tx) => {
      const service = await tx.service.findUnique({
        where: { id: data.serviceId },
        include: { proProfile: true },
      })

      if (!service || !service.isActive) {
        return { error: "Ce service n'est plus disponible." as const, record: null }
      }

      const matchesPro =
        service.proProfile.id === data.proId ||
        service.proProfile.userId === data.proId
      if (!matchesPro) {
        return {
          error: "Le prestataire sélectionné ne propose pas ce service." as const,
          record: null,
        }
      }

      if (service.proProfile.availabilityStatus === "OFFLINE") {
        return {
          error: "Ce prestataire est actuellement hors ligne." as const,
          record: null,
        }
      }

      const isToday = dayStart.getTime() === todayStart.getTime()
      if (isToday && service.proProfile.availabilityStatus === "BUSY_TODAY") {
        return {
          error:
            "Ce prestataire est déjà occupé aujourd'hui sur une offre en traitement." as const,
          record: null,
        }
      }

      const overlappingBooking = await tx.booking.findFirst({
        where: {
          proId: service.proProfile.userId,
          bookingDate: { gte: dayStart, lte: dayEnd },
          timeSlot: data.timeSlot,
          status: { in: ["NEGOTIATING", "IN_PROGRESS"] },
        },
        select: { id: true },
      })

      if (overlappingBooking) {
        return {
          error:
            "Ce créneau horaire vient d'être réservé. Veuillez en choisir un autre." as const,
          record: null,
        }
      }

      const dbBooking = await tx.booking.create({
        data: {
          proId: service.proProfile.userId,
          serviceId: service.id,
          clientId: authRes.user.id,
          clientName: data.clientName,
          clientPhone: data.clientPhone,
          clientAddress: data.clientAddress,
          clientNotes: data.clientNotes || "",
          bookingDate: requestedDate,
          timeSlot: data.timeSlot,
          status: "NEGOTIATING",
          indicativePrice: service.price,
        },
      })

      return { error: null, record: dbBooking }
    })

    if (txResult.error || !txResult.record) {
      return { data: null, error: txResult.error || "Impossible de créer la réservation." }
    }

    const dbBooking = txResult.record

    await broadcastBookingStatusEvent([dbBooking.proId], {
      bookingId: dbBooking.id,
      status: dbBooking.status,
      message: "Nouvelle demande de créneau reçue.",
    })

    revalidatePath("/dashboard/client")
    revalidatePath("/dashboard/client/bookings")
    revalidatePath("/dashboard/pro")
    revalidatePath("/dashboard/pro/schedule")
    revalidatePath(`/book/${data.proId}/${data.serviceId}`)

    return {
      data: {
        id: dbBooking.id,
        proId: dbBooking.proId,
        serviceId: dbBooking.serviceId,
        bookingDate: dbBooking.bookingDate.toISOString(),
        timeSlot: dbBooking.timeSlot,
        clientName: dbBooking.clientName,
        clientPhone: dbBooking.clientPhone,
        clientAddress: dbBooking.clientAddress,
        clientNotes: dbBooking.clientNotes || undefined,
        indicativePrice: dbBooking.indicativePrice,
        status: dbBooking.status as BookingResult["status"],
        createdAt: dbBooking.createdAt.toISOString(),
      },
      error: null,
    }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erreur inattendue lors de la réservation"
    return { data: null, error: message }
  }
}

/**
 * Server Action pour mettre a jour le statut de la negociation / intervention
 */
export async function updateBookingStatusAction(
  input: UpdateBookingStatusInput
): Promise<ServerActionResponse<{ id: string; status: string }>> {
  try {
    const authRes = await requireActionSession()
    if (authRes.error !== null) {
      return { data: null, error: authRes.error }
    }

    const rateLimit = await enforceRateLimit("booking", authRes.user.id)
    if (!rateLimit.allowed) {
      return { data: null, error: rateLimit.error }
    }

    const validated = updateBookingStatusSchema.safeParse(input)
    if (!validated.success) {
      return {
        data: null,
        error: validated.error.flatten().fieldErrors,
      }
    }

    const { bookingId, status } = validated.data

    const existing = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { id: true, clientId: true, proId: true },
    })

    if (!existing) {
      return { data: null, error: "Réservation introuvable." }
    }

    if (
      existing.clientId !== authRes.user.id &&
      existing.proId !== authRes.user.id &&
      authRes.user.userType !== "admin"
    ) {
      return { data: null, error: "Accès refusé pour cette réservation." }
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status,
        completedAt: status === "COMPLETED" ? new Date() : undefined,
      },
    })

    await broadcastBookingStatusEvent([existing.clientId, existing.proId], {
      bookingId,
      status,
      message: "Statut de réservation mis à jour.",
    })

    revalidatePath("/dashboard/client")
    revalidatePath("/dashboard/client/bookings")
    revalidatePath("/dashboard/pro")
    revalidatePath("/dashboard/pro/schedule")

    return {
      data: { id: bookingId, status },
      error: null,
    }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erreur de mise à jour du statut"
    return { data: null, error: message }
  }
}
