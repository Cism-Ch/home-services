"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import {
  subscriptionCheckoutSchema,
  clientSettingsSchema,
  proBusinessSettingsSchema,
  type SubscriptionCheckoutInput,
  type ClientSettingsInput,
  type ProBusinessSettingsInput,
} from "@/lib/validations/subscription"
import {
  PAYSTACK_PLANS,
  initializePaystackSubscription,
  verifyPaystackTransaction,
  type InitializeCheckoutResult,
  type SubscriptionPlanCode,
} from "@/lib/paystack"
import { enforceRateLimit, invalidateCatalogCache } from "@/lib/redis"
import { requireActionSession, requireProProfile } from "@/server/auth-guard"

export interface ServerActionResponse<T> {
  data: T | null
  error: string | null
}

const paystackReferenceSchema = z
  .string()
  .trim()
  .min(4, "Référence Paystack invalide")
  .max(120, "Référence Paystack trop longue")

function isPlanAllowedForRole(
  plan: SubscriptionPlanCode,
  userType: "client" | "pro" | "admin"
): boolean {
  if (plan === "CLIENT_GOLD") {
    return true
  }
  return userType === "pro" || userType === "admin"
}

/**
 * Initialise une souscription Paystack (Pro 5k/10k/20k FCFA + 1 mois offert ou Client Or 2k FCFA)
 */
export async function startSubscriptionCheckoutAction(
  clientUserId: string,
  clientEmail: string,
  input: SubscriptionCheckoutInput
): Promise<ServerActionResponse<InitializeCheckoutResult>> {
  void clientUserId
  void clientEmail
  const authRes = await requireActionSession()
  if (authRes.error !== null) {
    return { data: null, error: authRes.error }
  }

  const rateLimit = await enforceRateLimit("checkout", authRes.user.id)
  if (!rateLimit.allowed) {
    return { data: null, error: rateLimit.error }
  }

  const parsed = subscriptionCheckoutSchema.safeParse(input)
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message || "Formule d'abonnement invalide"
    return { data: null, error: firstIssue }
  }

  if (!isPlanAllowedForRole(parsed.data.plan, authRes.user.userType)) {
    return {
      data: null,
      error: "Les formules Prestataire sont réservées aux comptes professionnels.",
    }
  }

  try {
    const result = await initializePaystackSubscription({
      userId: authRes.user.id,
      email: authRes.user.email,
      plan: parsed.data.plan,
      callbackUrl: parsed.data.callbackUrl,
    })

    return {
      data: result,
      error: null,
    }
  } catch (err) {
    console.error("[subscription] startCheckout error:", err)
    return {
      data: null,
      error: "Impossible d'initialiser le paiement Paystack pour le moment.",
    }
  }
}

/**
 * Verifie aupres de Paystack qu'une reference est payee et active/synchronise l'abonnement dans Prisma.
 */
export async function verifyAndSyncSubscriptionAction(
  reference: string,
  expectedPlan?: SubscriptionPlanCode
): Promise<
  ServerActionResponse<{
    subscriptionId: string
    plan: SubscriptionPlanCode
    status: string
    simulated: boolean
  }>
> {
  const authRes = await requireActionSession()
  if (authRes.error !== null) {
    return { data: null, error: authRes.error }
  }

  const rateLimit = await enforceRateLimit("checkout", authRes.user.id)
  if (!rateLimit.allowed) {
    return { data: null, error: rateLimit.error }
  }

  const parsedRef = paystackReferenceSchema.safeParse(reference)
  if (!parsedRef.success) {
    return {
      data: null,
      error: parsedRef.error.issues[0]?.message || "Référence Paystack invalide.",
    }
  }

  try {
    const verification = await verifyPaystackTransaction(parsedRef.data)
    if (!verification.verified) {
      return {
        data: null,
        error: verification.error || "Transaction Paystack non confirmée.",
      }
    }

    if (!verification.simulated) {
      const matchesUserId =
        verification.metadata?.userId &&
        verification.metadata.userId === authRes.user.id
      const matchesEmail =
        verification.customerEmail &&
        verification.customerEmail.toLowerCase() === authRes.user.email.toLowerCase()

      if (!matchesUserId && !matchesEmail) {
        return {
          data: null,
          error: "Cette transaction Paystack n'est pas associée à votre compte.",
        }
      }
    } else if (
      verification.metadata?.userId &&
      verification.metadata.userId !== authRes.user.id
    ) {
      return {
        data: null,
        error: "Cette transaction Paystack appartient à un autre utilisateur.",
      }
    }

    const resolvedPlan = verification.simulated
      ? verification.metadata?.plan || expectedPlan
      : verification.metadata?.plan

    if (!resolvedPlan || !(resolvedPlan in PAYSTACK_PLANS)) {
      return {
        data: null,
        error: "Impossible d'identifier de manière fiable la formule Paystack.",
      }
    }

    if (!isPlanAllowedForRole(resolvedPlan, authRes.user.userType)) {
      return {
        data: null,
        error: "Cette formule d'abonnement n'est pas autorisée pour votre rôle.",
      }
    }

    const planDef = PAYSTACK_PLANS[resolvedPlan]
    if (
      typeof verification.amountFCFA !== "number" ||
      verification.amountFCFA < planDef.amountFCFA
    ) {
      return {
        data: null,
        error: "Le montant Paystack vérifié est insuffisant pour activer cette formule.",
      }
    }

    const now = new Date()
    const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    const trialEnd =
      planDef.trialDays > 0
        ? new Date(now.getTime() + planDef.trialDays * 24 * 60 * 60 * 1000)
        : null
    const nextStatus = planDef.trialDays > 0 ? "TRIALING" : "ACTIVE"

    const synced = await prisma.$transaction(async (tx) => {
      if (resolvedPlan !== "CLIENT_GOLD") {
        await tx.subscription.updateMany({
          where: {
            userId: authRes.user.id,
            plan: {
              in: ["PRO_STANDARD", "PRO_PREMIUM", "PRO_ENTERPRISE"],
              not: resolvedPlan,
            },
            status: { in: ["ACTIVE", "TRIALING", "PAST_DUE"] },
          },
          data: { status: "CANCELLED" },
        })
      }

      const existingSub = await tx.subscription.findFirst({
        where: { userId: authRes.user.id, plan: resolvedPlan },
        orderBy: { createdAt: "desc" },
      })

      if (existingSub) {
        return tx.subscription.update({
          where: { id: existingSub.id },
          data: {
            status: nextStatus,
            paystackCustomerCode:
              verification.customerCode ?? existingSub.paystackCustomerCode,
            paystackPlanCode:
              verification.paystackPlanCode ?? existingSub.paystackPlanCode,
            currentPeriodStart: now,
            currentPeriodEnd: periodEnd,
            ...(planDef.trialDays > 0 && !existingSub.trialEndDate
              ? { trialStartDate: now, trialEndDate: trialEnd }
              : {}),
          },
        })
      }

      return tx.subscription.create({
        data: {
          userId: authRes.user.id,
          plan: resolvedPlan,
          amount: planDef.amountFCFA,
          currency: "XOF",
          status: nextStatus,
          paystackCustomerCode: verification.customerCode,
          paystackPlanCode: verification.paystackPlanCode,
          trialStartDate: planDef.trialDays > 0 ? now : null,
          trialEndDate: trialEnd,
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
        },
      })
    })

    await invalidateCatalogCache()
    revalidatePath("/dashboard/pro/settings")
    revalidatePath("/dashboard/client/settings")
    revalidatePath("/professionals")
    revalidatePath("/services")

    return {
      data: {
        subscriptionId: synced.id,
        plan: resolvedPlan,
        status: synced.status,
        simulated: verification.simulated,
      },
      error: null,
    }
  } catch (err) {
    console.error("[subscription] verifyAndSync error:", err)
    return {
      data: null,
      error: "Erreur de synchronisation de l'abonnement Paystack.",
    }
  }
}

/**
 * Met a jour le nom et le numero de telephone d'un client dans PostgreSQL
 */
export async function updateClientSettingsAction(
  input: ClientSettingsInput
): Promise<ServerActionResponse<{ name: string; phoneNumber: string | null }>> {
  const authRes = await requireActionSession()
  if (authRes.error !== null) {
    return { data: null, error: authRes.error }
  }

  const parsed = clientSettingsSchema.safeParse(input)
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message || "Données client invalides"
    return { data: null, error: firstIssue }
  }

  const fullName = `${parsed.data.firstName} ${parsed.data.lastName}`.trim()
  const nextPhone = parsed.data.phoneNumber || null

  try {
    await prisma.user.update({
      where: { id: authRes.user.id },
      data: {
        name: fullName,
        phoneNumber: nextPhone,
      },
    })

    revalidatePath("/dashboard/client")
    revalidatePath("/dashboard/client/settings")

    return {
      data: { name: fullName, phoneNumber: nextPhone },
      error: null,
    }
  } catch (err) {
    console.error("[subscription] updateClientSettings error:", err)
    return {
      data: null,
      error: "Erreur lors de la mise à jour du profil client.",
    }
  }
}

/**
 * Met a jour les coordonnees professionnelles et l'etablissement du prestataire dans PostgreSQL
 */
export async function updateProBusinessAction(
  input: ProBusinessSettingsInput
): Promise<ServerActionResponse<{ updatedAt: string }>> {
  const authRes = await requireProProfile()
  if (authRes.error !== null) {
    return { data: null, error: authRes.error }
  }

  const parsed = proBusinessSettingsSchema.safeParse(input)
  if (!parsed.success) {
    const firstIssue =
      parsed.error.issues[0]?.message || "Informations d'établissement invalides"
    return { data: null, error: firstIssue }
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: authRes.user.id },
        data: {
          name: parsed.data.companyName,
          phoneNumber: parsed.data.phoneNumber,
        },
      })

      await tx.proProfile.update({
        where: { id: authRes.proProfile.id },
        data: {
          cityId: parsed.data.cityId || null,
          commune: parsed.data.commune || null,
          address: parsed.data.address || null,
          phoneNumber: parsed.data.phoneNumber,
          whatsappNumber: parsed.data.whatsappNumber,
        },
      })
    })

    await invalidateCatalogCache()
    revalidatePath("/dashboard/pro/settings")
    revalidatePath("/dashboard/pro/profile")
    revalidatePath("/professionals")
    revalidatePath(`/professionals/pros/${authRes.proProfile.id}`)

    return {
      data: { updatedAt: new Date().toISOString() },
      error: null,
    }
  } catch (err) {
    console.error("[subscription] updateProBusiness error:", err)
    return {
      data: null,
      error: "Erreur lors de l'enregistrement des paramètres prestataire.",
    }
  }
}
