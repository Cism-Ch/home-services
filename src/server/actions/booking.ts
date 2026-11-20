"use server"

import { revalidatePath } from "next/cache"
import {
  createBookingSchema,
  updateBookingStatusSchema,
  type CreateBookingInput,
  type UpdateBookingStatusInput,
} from "@/lib/validations/booking"
import { prisma } from "@/lib/prisma"
import { enforceRateLimit, invalidateCatalogCache } from "@/lib/redis"
import {
  computeAvailablePlaces,
  computeBookingEndDate,
  normalizeDurationUnit,
  normalizeMaxConcurrent,
  normalizeOrganizationType,
  toIsoDayKey,
  type DurationUnit,
} from "@/lib/scheduling"
import { broadcastBookingStatusEvent } from "@/lib/supabase-server"
import { requireActionSession } from "@/server/auth-guard"
import { syncProAvailabilityFromCapacity } from "@/server/helpers/availability-sync"

const ALLOWED_BOOKING_TRANSITIONS: Record<string, readonly string[]> = {
  NEGOTIATING: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
}

export interface ServerActionResponse<T> {
  data: T | null
  error: string | Record<string, string[]> | null
}

export interface BookingResult {
  id: string
  proId: string
  serviceId: string
  bookingDate: string
  endDate: string
  durationUnit: DurationUnit
  durationValue: number
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

    const startDayKey = toIsoDayKey(requestedDate)
    const todayKey = toIsoDayKey(new Date())

    if (startDayKey < todayKey) {
      return {
        data: null,
        error: "Impossible de réserver un créneau sur une date passée.",
      }
    }

    const bookingDateUtc = new Date(`${startDayKey}T12:00:00.000Z`)
    const dayStart = new Date(`${startDayKey}T00:00:00.000Z`)

    const txResult = await prisma.$transaction(async (tx) => {
      const service = await tx.service.findUnique({
        where: { id: data.serviceId },
        include: { proProfile: true },
      })

      if (!service || !service.isActive) {
        return { error: "Ce service n'est plus disponible." as const, record: null }
      }

      if (service.proProfile.userId === authRes.user.id) {
        return {
          error: "Vous ne pouvez pas réserver votre propre prestation." as const,
          record: null,
        }
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

      const isToday = startDayKey === todayKey
      if (isToday && service.proProfile.availabilityStatus === "BUSY_TODAY") {
        return {
          error:
            "Ce prestataire est déjà complet aujourd'hui sur ses chantiers en cours." as const,
          record: null,
        }
      }

      const effectiveUnit = normalizeDurationUnit(
        data.durationUnit || service.durationUnit
      )
      const effectiveValue = Math.max(
        1,
        data.durationValue ?? service.durationValue ?? service.duration ?? 60
      )
      const rangeEnd = computeBookingEndDate(
        startDayKey,
        effectiveValue,
        effectiveUnit
      )

      const unavailability = await tx.unavailabilityPeriod.findFirst({
        where: {
          proProfileId: service.proProfile.id,
          startDate: { lte: rangeEnd },
          endDate: { gte: dayStart },
        },
        select: { id: true },
      })

      if (unavailability) {
        return {
          error:
            "La période sélectionnée chevauche une indisponibilité du prestataire." as const,
          record: null,
        }
      }

      const maxPlaces = normalizeMaxConcurrent(
        normalizeOrganizationType(service.proProfile.organizationType),
        service.proProfile.maxConcurrentProjects
      )

      const overlappingBookings = await tx.booking.findMany({
        where: {
          proId: service.proProfile.userId,
          status: { in: ["NEGOTIATING", "IN_PROGRESS"] },
          bookingDate: { lte: rangeEnd },
          endDate: { gte: dayStart },
        },
        select: {
          id: true,
          bookingDate: true,
          endDate: true,
          timeSlot: true,
          durationUnit: true,
          durationValue: true,
        },
      })

      const placeAvailability = computeAvailablePlaces({
        maxConcurrentProjects: maxPlaces,
        startDate: startDayKey,
        endDate: rangeEnd,
        timeSlot: data.timeSlot,
        durationUnit: effectiveUnit,
        durationValue: effectiveValue,
        activeBookings: overlappingBookings.map((b) => ({
          id: b.id,
          startDate: b.bookingDate.toISOString(),
          endDate: b.endDate.toISOString(),
          timeSlot: b.timeSlot,
          durationUnit: normalizeDurationUnit(b.durationUnit),
          durationValue: b.durationValue,
        })),
      })

      if (placeAvailability.isFull) {
        return {
          error: `Aucune place restante (0/${maxPlaces}) sur cette période ou ce créneau. Veuillez choisir d'autres dates.` as const,
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
          bookingDate: bookingDateUtc,
          endDate: rangeEnd,
          durationUnit: effectiveUnit,
          durationValue: effectiveValue,
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
        endDate: dbBooking.endDate.toISOString(),
        durationUnit: normalizeDurationUnit(dbBooking.durationUnit),
        durationValue: dbBooking.durationValue,
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
    console.error("[booking] createSlotBooking error:", err)
    return {
      data: null,
      error: "Erreur inattendue lors de la création de la réservation.",
    }
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
      select: {
        id: true,
        status: true,
        completedAt: true,
        clientId: true,
        proId: true,
        pro: {
          select: {
            proProfile: {
              select: {
                id: true,
                availabilityStatus: true,
                organizationType: true,
                maxConcurrentProjects: true,
              },
            },
          },
        },
      },
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

    if (existing.status === status) {
      return { data: { id: bookingId, status }, error: null }
    }

    const allowedNext = ALLOWED_BOOKING_TRANSITIONS[existing.status] ?? []
    if (
      authRes.user.userType !== "admin" &&
      !allowedNext.includes(status)
    ) {
      return {
        data: null,
        error: "Transition de statut non autorisée pour cette réservation.",
      }
    }

    await prisma.$transaction(async (tx) => {
      const wasAlreadyCompleted = existing.status === "COMPLETED"

      await tx.booking.update({
        where: { id: bookingId },
        data: {
          status,
          completedAt:
            status === "COMPLETED"
              ? existing.completedAt || new Date()
              : undefined,
        },
      })

      if (
        (status === "COMPLETED" || status === "CANCELLED") &&
        existing.pro.proProfile
      ) {
        if (status === "COMPLETED" && !wasAlreadyCompleted) {
          await tx.proProfile.update({
            where: { id: existing.pro.proProfile.id },
            data: { completedTasks: { increment: 1 } },
          })
        }

        await syncProAvailabilityFromCapacity(tx, {
          proUserId: existing.proId,
          proProfileId: existing.pro.proProfile.id,
          currentAvailabilityStatus: existing.pro.proProfile.availabilityStatus,
          organizationType: existing.pro.proProfile.organizationType,
          maxConcurrentProjects: existing.pro.proProfile.maxConcurrentProjects,
          excludeBookingId: bookingId,
        })
      }
    })

    if (status === "COMPLETED") {
      await invalidateCatalogCache()
    }

    await broadcastBookingStatusEvent([existing.clientId, existing.proId], {
      bookingId,
      status,
      message: "Statut de réservation mis à jour.",
    })

    revalidatePath("/dashboard/client")
    revalidatePath("/dashboard/client/bookings")
    revalidatePath("/dashboard/pro")
    revalidatePath("/dashboard/pro/schedule")
    revalidatePath("/professionals")

    return {
      data: { id: bookingId, status },
      error: null,
    }
  } catch (err) {
    console.error("[booking] updateBookingStatus error:", err)
    return {
      data: null,
      error: "Erreur lors de la mise à jour du statut de la réservation.",
    }
  }
}
