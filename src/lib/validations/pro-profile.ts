import { z } from "zod"
import { africanPhoneRegex } from "./booking"

export const organizationTypeSchema = z.enum(["INDIVIDUAL", "TEAM", "PME"], {
  message: "Type d'organisation invalide",
})

export const proProfileSchema = z.object({
  headline: z.string().min(5, "Le titre professionnel doit comporter au moins 5 caractères").max(100),
  bio: z.string().min(20, "La présentation doit comporter au moins 20 caractères").max(1000),
  phoneNumber: z.string().regex(africanPhoneRegex, "Numéro de téléphone direct pour les appels invalide"),
  whatsappNumber: z.string().regex(africanPhoneRegex, "Numéro WhatsApp pour les messages et notes vocales invalide"),
  yearsOfExperience: z.number().int().min(0).max(60),
  cityId: z.string().min(2, "Veuillez sélectionner une ville"),
  commune: z.string().min(2, "Veuillez renseigner votre commune ou quartier"),
  address: z.string().max(200).optional(),
  availabilityStatus: z.enum(["AVAILABLE", "BUSY_TODAY", "OFFLINE"], {
    message: "Statut de disponibilité invalide",
  }),
  organizationType: organizationTypeSchema.optional(),
  maxConcurrentProjects: z.number().int().min(1).max(50).optional(),
})

export const updateAvailabilitySchema = z.object({
  availabilityStatus: z.enum(["AVAILABLE", "BUSY_TODAY", "OFFLINE"]),
})

export const updateProCapacitySchema = z
  .object({
    organizationType: organizationTypeSchema,
    maxConcurrentProjects: z.number().int().min(1).max(50),
  })
  .refine(
    (data) =>
      data.organizationType === "INDIVIDUAL"
        ? data.maxConcurrentProjects === 1
        : data.maxConcurrentProjects >= 2,
    {
      message:
        "Un artisan indépendant dispose d'1 place maximale ; une équipe ou PME doit proposer au moins 2 places simultanées.",
      path: ["maxConcurrentProjects"],
    }
  )

export type ProProfileInput = z.infer<typeof proProfileSchema>
export type UpdateAvailabilityInput = z.infer<typeof updateAvailabilitySchema>
export type UpdateProCapacityInput = z.infer<typeof updateProCapacitySchema>
