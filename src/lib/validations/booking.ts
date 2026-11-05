import { z } from "zod"

// Regex de validation des numéros mobiles africains (formats internationaux +225, +221, +237, +229, +228 ou locaux 8-10 chiffres)
export const africanPhoneRegex = /^(?:\+(?:225|221|237|229|228|226|223|224|241|242|243)\s?)?[0-9\s]{8,14}$/

export const createBookingSchema = z.object({
  serviceId: z.string().min(1, "Identifiant de service requis"),
  proId: z.string().min(1, "Identifiant de prestataire requis"),
  bookingDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Date de rendez-vous invalide",
  }),
  timeSlot: z.string().min(3, "Veuillez sélectionner un créneau horaire"),
  clientName: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
  clientPhone: z.string().regex(africanPhoneRegex, "Numéro de téléphone invalide (ex: +225 07 08 09 10 11)"),
  clientAddress: z.string().min(3, "L'adresse ou la commune doit comporter au moins 3 caractères"),
  clientNotes: z.string().max(500, "Les précisions ne doivent pas dépasser 500 caractères").optional(),
  indicativePrice: z.number().int().positive("Le tarif indicatif doit être positif"),
})

export const updateBookingStatusSchema = z.object({
  bookingId: z.string().min(1, "Identifiant de réservation requis"),
  status: z.enum(["NEGOTIATING", "IN_PROGRESS", "COMPLETED", "CANCELLED"], {
    message: "Statut de réservation invalide",
  }),
  reason: z.string().max(250).optional(),
})

export type CreateBookingInput = z.infer<typeof createBookingSchema>
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>
