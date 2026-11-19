"use server"

import { revalidatePath } from "next/cache"
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
    return {
      data: null,
      error: err instanceof Error ? err.message : "Erreur d'initialisation Paystack",
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

  try {
    const verification = await verifyPaystackTransaction(reference)
    if (!verification.verified) {
      return {
        data: null,
        error: verification.error || "Transaction Paystack non confirmée.",
      }
    }

    if (
      verification.metadata?.userId &&
      verification.metadata.userId !== authRes.user.id
    ) {
      return {
        data: null,
        error: "Cette transaction Paystack appartient à un autre utilisateur.",
      }
    }

    const resolvedPlan = verification.metadata?.plan || expectedPlan
    if (!resolvedPlan || !(resolvedPlan in PAYSTACK_PLANS)) {
      return {
        data: null,
        error: "Impossible d'identifier la formule d'abonnement Paystack.",
      }
    }

    const planDef = PAYSTACK_PLANS[resolvedPlan]
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
    return {
      data: null,
      error:
        err instanceof Error
          ? err.message
          : "Erreur de synchronisation de l'abonnement Paystack",
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
    return {
      data: null,
      error: err instanceof Error ? err.message : "Erreur de mise à jour du profil client",
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
    return {
      data: null,
      error:
        err instanceof Error
          ? err.message
          : "Erreur lors de l'enregistrement des paramètres prestataire",
    }
  }
}
