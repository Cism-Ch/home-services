/**
 * Client & Utilitaires Paystack (XOF / FCFA)
 * Gere les formules d'abonnement Prestataires (avec 1 mois offert) et Client Or (2 000 FCFA/mois).
 */

import crypto from "crypto"

export type SubscriptionPlanCode =
  | "PRO_STANDARD"
  | "PRO_PREMIUM"
  | "PRO_ENTERPRISE"
  | "CLIENT_GOLD"

export interface PaystackPlanDefinition {
  code: SubscriptionPlanCode
  name: string
  amountFCFA: number
  currency: "XOF"
  trialDays: number
  description: string
  badgeLabel: string
}

export const PAYSTACK_PLANS: Record<SubscriptionPlanCode, PaystackPlanDefinition> = {
  PRO_STANDARD: {
    code: "PRO_STANDARD",
    name: "Abonnement Prestataire Standard",
    amountFCFA: 5000,
    currency: "XOF",
    trialDays: 30,
    description: "5 000 FCFA / mois avec 1 mois offert pour démarrer votre activité sur la plateforme.",
    badgeLabel: "Pro Standard",
  },
  PRO_PREMIUM: {
    code: "PRO_PREMIUM",
    name: "Abonnement Prestataire Premium",
    amountFCFA: 10000,
    currency: "XOF",
    trialDays: 30,
    description: "10 000 FCFA / mois avec 1 mois offert, positionnement prioritaire et prestations illimitées.",
    badgeLabel: "Pro Premium",
  },
  PRO_ENTERPRISE: {
    code: "PRO_ENTERPRISE",
    name: "Abonnement Prestataire Entreprise",
    amountFCFA: 20000,
    currency: "XOF",
    trialDays: 30,
    description: "20 000 FCFA / mois avec 1 mois offert, visibilité multi-villes et support dédié.",
    badgeLabel: "Pro Entreprise",
  },
  CLIENT_GOLD: {
    code: "CLIENT_GOLD",
    name: "Compte Client Premium Or",
    amountFCFA: 2000,
    currency: "XOF",
    trialDays: 0,
    description: "2 000 FCFA / mois : Badge Premium Or, priorité auprès des meilleurs artisans et soutien au projet.",
    badgeLabel: "Client Or",
  },
}

export interface InitializeCheckoutParams {
  email: string
  userId: string
  plan: SubscriptionPlanCode
  callbackUrl?: string
}

export interface InitializeCheckoutResult {
  authorizationUrl: string
  accessCode: string
  reference: string
  plan: PaystackPlanDefinition
  trialEndsAt: string | null
}

/**
 * Initialise une transaction ou un abonnement Paystack en XOF (FCFA)
 */
export async function initializePaystackSubscription(
  params: InitializeCheckoutParams
): Promise<InitializeCheckoutResult> {
  const planDef = PAYSTACK_PLANS[params.plan]
  const reference = `psk_${params.plan.toLowerCase()}_${Date.now().toString(36)}`
  const now = Date.now()
  const trialEndsAt =
    planDef.trialDays > 0
      ? new Date(now + planDef.trialDays * 24 * 60 * 60 * 1000).toISOString()
      : null

  const secretKey = process.env.PAYSTACK_SECRET_KEY
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const callback = params.callbackUrl || `${appUrl}/dashboard`

  if (secretKey) {
    try {
      const response = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: params.email,
          // Paystack attend le montant dans la sous-unite (multiplie par 100)
          amount: planDef.amountFCFA * 100,
          currency: "XOF",
          reference,
          callback_url: callback,
          metadata: {
            userId: params.userId,
            plan: params.plan,
            trialDays: planDef.trialDays,
            trialEndsAt,
          },
        }),
      })

      if (response.ok) {
        const json = (await response.json()) as {
          status: boolean
          data?: { authorization_url: string; access_code: string; reference: string }
        }
        if (json.status && json.data) {
          return {
            authorizationUrl: json.data.authorization_url,
            accessCode: json.data.access_code,
            reference: json.data.reference,
            plan: planDef,
            trialEndsAt,
          }
        }
      }
    } catch {
      // Fallback dev local
    }
  }

  return {
    authorizationUrl: `${callback}?paystack_ref=${reference}&plan=${params.plan}`,
    accessCode: `acc_${reference}`,
    reference,
    plan: planDef,
    trialEndsAt,
  }
}

/**
 * Verifie la signature cryptographique HMAC-SHA512 des webhooks Paystack (x-paystack-signature)
 */
export function verifyPaystackWebhookSignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  const secret = process.env.PAYSTACK_SECRET_KEY || process.env.BETTER_AUTH_SECRET || ""
  if (!secret || !signatureHeader) {
    return false
  }

  const expectedHash = crypto
    .createHmac("sha512", secret)
    .update(rawBody, "utf8")
    .digest("hex")

  const expectedBuf = Buffer.from(expectedHash, "utf8")
  const receivedBuf = Buffer.from(signatureHeader, "utf8")

  if (expectedBuf.length !== receivedBuf.length) {
    return false
  }

  return crypto.timingSafeEqual(expectedBuf, receivedBuf)
}
