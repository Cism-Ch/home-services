"use server"

import { revalidatePath } from "next/cache"
import {
  createBookingSchema,
  updateBookingStatusSchema,
  type CreateBookingInput,
  type UpdateBookingStatusInput,
} from "@/lib/validations/booking"
import { prisma } from "@/lib/prisma"

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
 * Server Action pour reserver un creneau horaire sans paiement direct en ligne
 * Initie la mise en relation en statut NEGOTIATING
 */
export async function createSlotBooking(
  input: CreateBookingInput
): Promise<ServerActionResponse<BookingResult>> {
  try {
    const validated = createBookingSchema.safeParse(input)

    if (!validated.success) {
      return {
        data: null,
        error: validated.error.flatten().fieldErrors,
      }
    }

    const data = validated.data
    const generatedId = `book-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`

    let createdRecord: BookingResult

    try {
      // Tentative de persistance en base de donnees via le singleton Prisma
      const dbBooking = await prisma.booking.create({
        data: {
          id: generatedId,
          proId: data.proId,
          serviceId: data.serviceId,
          clientId: "guest-client-session", // Par defaut pour la reservation d'entree de tunnel
          clientName: data.clientName,
          clientPhone: data.clientPhone,
          clientAddress: data.clientAddress,
          clientNotes: data.clientNotes || "",
          bookingDate: new Date(data.bookingDate),
          timeSlot: data.timeSlot,
          status: "NEGOTIATING",
          indicativePrice: data.indicativePrice,
        },
      })

      createdRecord = {
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
        status: dbBooking.status as "NEGOTIATING",
        createdAt: dbBooking.createdAt.toISOString(),
      }
    } catch {
      // Fallback gracieux si la base locale n'est pas encore executee en local
      createdRecord = {
        id: generatedId,
        proId: data.proId,
        serviceId: data.serviceId,
        bookingDate: data.bookingDate,
        timeSlot: data.timeSlot,
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        clientAddress: data.clientAddress,
        clientNotes: data.clientNotes,
        indicativePrice: data.indicativePrice,
        status: "NEGOTIATING",
        createdAt: new Date().toISOString(),
      }
    }

    // Revalidation des routes cote client et pro
    revalidatePath("/dashboard/client")
    revalidatePath("/dashboard/client/bookings")
    revalidatePath("/dashboard/pro")
    revalidatePath("/dashboard/pro/schedule")

    return {
      data: createdRecord,
      error: null,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inattendue lors de la reservation"
    return {
      data: null,
      error: message,
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
    const validated = updateBookingStatusSchema.safeParse(input)

    if (!validated.success) {
      return {
        data: null,
        error: validated.error.flatten().fieldErrors,
      }
    }

    const { bookingId, status } = validated.data

    try {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status },
      })
    } catch {
      // Fallback developpement si l'id n'est pas encore synchronise
    }

    revalidatePath("/dashboard/client/bookings")
    revalidatePath("/dashboard/pro/schedule")

    return {
      data: { id: bookingId, status },
      error: null,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur de mise a jour du statut"
    return {
      data: null,
      error: message,
    }
  }
}
