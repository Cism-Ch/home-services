/**
 * Webhook Paystack securise (Verification HMAC-SHA512)
 * Synchronise de maniere idempotente les abonnements Prestataires (5k/10k/20k FCFA + 1 mois offert)
 * et Client Premium Or (2k FCFA) dans PostgreSQL via Prisma.
 */

import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { invalidateCatalogCache } from "@/lib/redis"
import {
  verifyPaystackWebhookSignature,
  resolvePlanFromPaystackCode,
  PAYSTACK_PLANS,
  type SubscriptionPlanCode,
} from "@/lib/paystack"

interface PaystackWebhookEvent {
  event: string
  data: {
    reference?: string
    amount?: number
    currency?: string
    customer?: {
      customer_code?: string
      email?: string
    }
    subscription_code?: string
    plan?: {
      plan_code?: string
    } | string
    metadata?: {
      userId?: string
      plan?: SubscriptionPlanCode
      trialDays?: number
    }
  }
}

function extractPlanCodeString(
  planField: PaystackWebhookEvent["data"]["plan"]
): string | undefined {
  if (typeof planField === "string") return planField
  return planField?.plan_code
}

async function resolveUserIdFromWebhook(
  data: PaystackWebhookEvent["data"]
): Promise<string | null> {
  if (data.metadata?.userId) {
    return data.metadata.userId
  }

  const customerEmail = data.customer?.email?.trim().toLowerCase()
  if (customerEmail) {
    const user = await prisma.user.findUnique({
      where: { email: customerEmail },
      select: { id: true },
    })
    if (user) return user.id
  }

  if (data.subscription_code) {
    const sub = await prisma.subscription.findFirst({
      where: { paystackSubscriptionCode: data.subscription_code },
      select: { userId: true },
    })
    if (sub) return sub.userId
  }

  if (data.customer?.customer_code) {
    const sub = await prisma.subscription.findFirst({
      where: { paystackCustomerCode: data.customer.customer_code },
      select: { userId: true },
    })
    if (sub) return sub.userId
  }

  return null
}

function resolvePlanFromWebhook(
  data: PaystackWebhookEvent["data"]
): SubscriptionPlanCode | undefined {
  if (data.metadata?.plan && data.metadata.plan in PAYSTACK_PLANS) {
    return data.metadata.plan
  }
  return resolvePlanFromPaystackCode(extractPlanCodeString(data.plan))
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get("x-paystack-signature")

    if (!verifyPaystackWebhookSignature(rawBody, signature)) {
      return NextResponse.json(
        { error: "Signature webhook Paystack invalide" },
        { status: 401 }
      )
    }

    const payload = JSON.parse(rawBody) as PaystackWebhookEvent
    const { event, data } = payload
    const userId = await resolveUserIdFromWebhook(data)
    const planCode = resolvePlanFromWebhook(data)
    const paystackPlanCode = extractPlanCodeString(data.plan)

    if (
      event === "charge.success" ||
      event === "subscription.create" ||
      event === "invoice.create"
    ) {
      if (!userId || !planCode || !(planCode in PAYSTACK_PLANS)) {
        return NextResponse.json({
          received: true,
          skipped: "Utilisateur ou formule introuvable dans le webhook",
        })
      }

      const planDef = PAYSTACK_PLANS[planCode]
      const now = new Date()
      const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      const trialEnd =
        planDef.trialDays > 0
          ? new Date(now.getTime() + planDef.trialDays * 24 * 60 * 60 * 1000)
          : null

      await prisma.$transaction(async (tx) => {
        // Pour un abonnement Pro, resilie les anciennes formules Pro actives differentes
        if (planCode !== "CLIENT_GOLD") {
          await tx.subscription.updateMany({
            where: {
              userId,
              plan: { in: ["PRO_STANDARD", "PRO_PREMIUM", "PRO_ENTERPRISE"], not: planCode },
              status: { in: ["ACTIVE", "TRIALING", "PAST_DUE"] },
            },
            data: { status: "CANCELLED" },
          })
        }

        const existingSub = await tx.subscription.findFirst({
          where: { userId, plan: planCode },
          orderBy: { createdAt: "desc" },
        })

        if (existingSub) {
          const stillInTrial =
            existingSub.trialEndDate && existingSub.trialEndDate.getTime() > now.getTime()
          const nextStatus =
            event === "invoice.create" && stillInTrial
              ? "TRIALING"
              : event === "charge.success" && existingSub.status === "PAST_DUE"
              ? "ACTIVE"
              : planDef.trialDays > 0 && !existingSub.trialEndDate
              ? "TRIALING"
              : "ACTIVE"

          await tx.subscription.update({
            where: { id: existingSub.id },
            data: {
              status: nextStatus,
              paystackCustomerCode:
                data.customer?.customer_code ?? existingSub.paystackCustomerCode,
              paystackSubscriptionCode:
                data.subscription_code ?? existingSub.paystackSubscriptionCode,
              paystackPlanCode: paystackPlanCode ?? existingSub.paystackPlanCode,
              currentPeriodStart: now,
              currentPeriodEnd: periodEnd,
            },
          })
        } else {
          await tx.subscription.create({
            data: {
              userId,
              plan: planCode,
              amount: planDef.amountFCFA,
              currency: "XOF",
              status: planDef.trialDays > 0 ? "TRIALING" : "ACTIVE",
              paystackCustomerCode: data.customer?.customer_code,
              paystackSubscriptionCode: data.subscription_code,
              paystackPlanCode,
              trialStartDate: planDef.trialDays > 0 ? now : null,
              trialEndDate: trialEnd,
              currentPeriodStart: now,
              currentPeriodEnd: periodEnd,
            },
          })
        }
      })

      await invalidateCatalogCache()
      revalidatePath("/dashboard/pro/settings")
      revalidatePath("/dashboard/client/settings")
      revalidatePath("/professionals")
      revalidatePath("/services")
    } else if (event === "invoice.payment_failed") {
      if (data.subscription_code) {
        await prisma.subscription.updateMany({
          where: { paystackSubscriptionCode: data.subscription_code },
          data: { status: "PAST_DUE" },
        })
      } else if (data.customer?.customer_code) {
        await prisma.subscription.updateMany({
          where: {
            paystackCustomerCode: data.customer.customer_code,
            status: { in: ["ACTIVE", "TRIALING"] },
          },
          data: { status: "PAST_DUE" },
        })
      } else if (userId && planCode) {
        await prisma.subscription.updateMany({
          where: { userId, plan: planCode },
          data: { status: "PAST_DUE" },
        })
      }

      await invalidateCatalogCache()
      revalidatePath("/dashboard/pro/settings")
      revalidatePath("/dashboard/client/settings")
      revalidatePath("/professionals")
      revalidatePath("/services")
    } else if (
      event === "subscription.disable" ||
      event === "subscription.not_renew"
    ) {
      if (data.subscription_code) {
        await prisma.subscription.updateMany({
          where: { paystackSubscriptionCode: data.subscription_code },
          data: { status: "CANCELLED" },
        })
      } else if (userId && planCode) {
        await prisma.subscription.updateMany({
          where: { userId, plan: planCode },
          data: { status: "CANCELLED" },
        })
      }

      await invalidateCatalogCache()
      revalidatePath("/dashboard/pro/settings")
      revalidatePath("/dashboard/client/settings")
      revalidatePath("/professionals")
      revalidatePath("/services")
    }

    return NextResponse.json({ received: true, event })
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Erreur de traitement webhook Paystack",
      },
      { status: 500 }
    )
  }
}
