"use server"

import { revalidatePath } from "next/cache"
import {
  subscriptionCheckoutSchema,
  type SubscriptionCheckoutInput,
} from "@/lib/validations/subscription"
import {
  initializePaystackSubscription,
  type InitializeCheckoutResult,
} from "@/lib/paystack"

export interface ServerActionResponse<T> {
  data: T | null
  error: string | null
}

/**
 * Initialise une souscription Paystack (Pro 5k/10k/20k FCFA + 1 mois offert ou Client Or 2k FCFA)
 */
export async function startSubscriptionCheckoutAction(
  userId: string,
  email: string,
  input: SubscriptionCheckoutInput
): Promise<ServerActionResponse<InitializeCheckoutResult>> {
  const parsed = subscriptionCheckoutSchema.safeParse(input)
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message || "Formule d'abonnement invalide"
    return { data: null, error: firstIssue }
  }

  try {
    const result = await initializePaystackSubscription({
      userId,
      email,
      plan: parsed.data.plan,
      callbackUrl: parsed.data.callbackUrl,
    })

    revalidatePath("/dashboard/pro/settings")
    revalidatePath("/dashboard/client/settings")

    return {
      data: result,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Erreur d'initialisation Paystack",
    }
  }
}
