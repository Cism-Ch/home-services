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

/**
 * Associe un code de formule interne au plan_code Paystack recurrent configure dans l'environnement.
 */
export function getPaystackPlanCodeFromEnv(
  plan: SubscriptionPlanCode
): string | undefined {
  const map: Record<SubscriptionPlanCode, string | undefined> = {
    PRO_STANDARD: process.env.PAYSTACK_PLAN_PRO_STANDARD?.trim() || undefined,
    PRO_PREMIUM: process.env.PAYSTACK_PLAN_PRO_PREMIUM?.trim() || undefined,
    PRO_ENTERPRISE: process.env.PAYSTACK_PLAN_PRO_ENTERPRISE?.trim() || undefined,
    CLIENT_GOLD: process.env.PAYSTACK_PLAN_CLIENT_GOLD?.trim() || undefined,
  }
  return map[plan]
}

/**
 * Resout un plan_code Paystack vers notre formule interne (fallback webhook si metadata absent).
 */
export function resolvePlanFromPaystackCode(
  paystackPlanCode?: string | null
): SubscriptionPlanCode | undefined {
  if (!paystackPlanCode) return undefined
  const plans: SubscriptionPlanCode[] = [
    "PRO_STANDARD",
    "PRO_PREMIUM",
    "PRO_ENTERPRISE",
    "CLIENT_GOLD",
  ]
  for (const plan of plans) {
    if (getPaystackPlanCodeFromEnv(plan) === paystackPlanCode) {
      return plan
    }
  }
  return undefined
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
  isSimulated: boolean
}

export interface VerifyPaystackResult {
  verified: boolean
  simulated: boolean
  reference: string
  amountFCFA?: number
  customerCode?: string
  customerEmail?: string
  paystackPlanCode?: string
  metadata?: {
    userId?: string
    plan?: SubscriptionPlanCode
  }
  error?: string
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

  const secretKey = process.env.PAYSTACK_SECRET_KEY?.trim()
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "")
  const defaultPath =
    params.plan === "CLIENT_GOLD"
      ? "/dashboard/client/settings"
      : "/dashboard/pro/settings"
  const callback = params.callbackUrl || `${appUrl}${defaultPath}`

  if (secretKey) {
    const envPlanCode = getPaystackPlanCodeFromEnv(params.plan)
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
        ...(envPlanCode ? { plan: envPlanCode } : {}),
        metadata: {
          userId: params.userId,
          plan: params.plan,
          trialDays: planDef.trialDays,
          trialEndsAt,
        },
      }),
    })

    const json = (await response.json()) as {
      status: boolean
      message?: string
      data?: { authorization_url: string; access_code: string; reference: string }
    }

    if (!response.ok || !json.status || !json.data) {
      throw new Error(
        json.message || `Échec d'initialisation Paystack (HTTP ${response.status})`
      )
    }

    return {
      authorizationUrl: json.data.authorization_url,
      accessCode: json.data.access_code,
      reference: json.data.reference,
      plan: planDef,
      trialEndsAt,
      isSimulated: false,
    }
  }

  return {
    authorizationUrl: `${callback}?paystack_ref=${reference}&plan=${params.plan}`,
    accessCode: `acc_${reference}`,
    reference,
    plan: planDef,
    trialEndsAt,
    isSimulated: true,
  }
}

function inferPlanFromReference(reference: string): SubscriptionPlanCode | undefined {
  const lower = reference.toLowerCase()
  if (lower.includes("pro_standard")) return "PRO_STANDARD"
  if (lower.includes("pro_premium")) return "PRO_PREMIUM"
  if (lower.includes("pro_enterprise")) return "PRO_ENTERPRISE"
  if (lower.includes("client_gold")) return "CLIENT_GOLD"
  return undefined
}

/**
 * Verifie aupres de l'API Paystack qu'une transaction est reellement reglee avant activation en DB.
 */
export async function verifyPaystackTransaction(
  reference: string
): Promise<VerifyPaystackResult> {
  const trimmedRef = reference.trim()
  if (!trimmedRef) {
    return {
      verified: false,
      simulated: false,
      reference: trimmedRef,
      error: "Référence de transaction Paystack manquante.",
    }
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY?.trim()
  if (!secretKey) {
    if (process.env.NODE_ENV === "production") {
      return {
        verified: false,
        simulated: false,
        reference: trimmedRef,
        error: "PAYSTACK_SECRET_KEY manquante en production.",
      }
    }

    if (!trimmedRef.startsWith("psk_")) {
      return {
        verified: false,
        simulated: true,
        reference: trimmedRef,
        error: "Référence Paystack locale invalide.",
      }
    }

    const inferredPlan = inferPlanFromReference(trimmedRef)
    return {
      verified: true,
      simulated: true,
      reference: trimmedRef,
      amountFCFA: inferredPlan ? PAYSTACK_PLANS[inferredPlan].amountFCFA : undefined,
      paystackPlanCode: inferredPlan ? getPaystackPlanCodeFromEnv(inferredPlan) : undefined,
      metadata: inferredPlan ? { plan: inferredPlan } : undefined,
    }
  }

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(trimmedRef)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
      cache: "no-store",
    }
  )

  const json = (await response.json()) as {
    status?: boolean
    message?: string
    data?: {
      status?: string
      amount?: number
      reference?: string
      plan?: string | null
      plan_object?: { plan_code?: string } | null
      customer?: { customer_code?: string; email?: string } | null
      metadata?: { userId?: string; plan?: SubscriptionPlanCode } | null
    }
  }

  if (!response.ok || !json.status || !json.data) {
    return {
      verified: false,
      simulated: false,
      reference: trimmedRef,
      error: json.message || "Impossible de vérifier la transaction Paystack.",
    }
  }

  if (json.data.status !== "success") {
    return {
      verified: false,
      simulated: false,
      reference: trimmedRef,
      error: `Paiement non finalisé (statut : ${json.data.status || "inconnu"}).`,
    }
  }

  const paystackPlanCode =
    json.data.plan_object?.plan_code ||
    (typeof json.data.plan === "string" ? json.data.plan : undefined)

  return {
    verified: true,
    simulated: false,
    reference: json.data.reference || trimmedRef,
    amountFCFA:
      typeof json.data.amount === "number"
        ? Math.round(json.data.amount / 100)
        : undefined,
    customerCode: json.data.customer?.customer_code,
    customerEmail: json.data.customer?.email,
    paystackPlanCode,
    metadata: {
      userId: json.data.metadata?.userId,
      plan:
        json.data.metadata?.plan ||
        resolvePlanFromPaystackCode(paystackPlanCode),
    },
  }
}

/**
 * Verifie la signature cryptographique HMAC-SHA512 des webhooks Paystack (x-paystack-signature)
 */
export function verifyPaystackWebhookSignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  const secret = process.env.PAYSTACK_SECRET_KEY?.trim() || ""
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
