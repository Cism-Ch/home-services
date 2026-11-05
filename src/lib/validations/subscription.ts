import { z } from "zod"

export const subscriptionCheckoutSchema = z.object({
  plan: z.enum(["PRO_STANDARD", "PRO_PREMIUM", "PRO_ENTERPRISE", "CLIENT_GOLD"], {
    message: "Formule d'abonnement Paystack invalide",
  }),
  callbackUrl: z.string().url("URL de retour invalide").optional(),
})

export type SubscriptionCheckoutInput = z.infer<typeof subscriptionCheckoutSchema>
