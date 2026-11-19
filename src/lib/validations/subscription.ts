import { z } from "zod"
import { africanPhoneRegex } from "./booking"

export const subscriptionCheckoutSchema = z.object({
  plan: z.enum(["PRO_STANDARD", "PRO_PREMIUM", "PRO_ENTERPRISE", "CLIENT_GOLD"], {
    message: "Formule d'abonnement Paystack invalide",
  }),
  callbackUrl: z.string().url("URL de retour invalide").optional(),
})

export const clientSettingsSchema = z.object({
  firstName: z.string().trim().min(2, "Le prénom doit comporter au moins 2 caractères").max(60),
  lastName: z.string().trim().min(1, "Le nom doit comporter au moins 1 caractère").max(60),
  phoneNumber: z
    .string()
    .trim()
    .refine((val) => val === "" || africanPhoneRegex.test(val), {
      message: "Numéro de téléphone invalide (ex: +225 07 08 09 10 11)",
    }),
})

export const proBusinessSettingsSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(2, "La raison sociale ou le nom doit comporter au moins 2 caractères")
    .max(100),
  cityId: z.string().trim().optional(),
  commune: z.string().trim().max(80).optional(),
  address: z.string().trim().max(200).optional(),
  phoneNumber: z
    .string()
    .trim()
    .regex(africanPhoneRegex, "Numéro de téléphone direct invalide"),
  whatsappNumber: z
    .string()
    .trim()
    .regex(africanPhoneRegex, "Numéro WhatsApp Business invalide"),
})

export type SubscriptionCheckoutInput = z.infer<typeof subscriptionCheckoutSchema>
export type ClientSettingsInput = z.infer<typeof clientSettingsSchema>
export type ProBusinessSettingsInput = z.infer<typeof proBusinessSettingsSchema>
