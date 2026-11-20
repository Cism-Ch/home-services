/**
 * Webhook Paystack securise (Verification HMAC-SHA512)
 * Synchronise de maniere idempotente les abonnements Prestataires (5k/10k/20k FCFA + 1 mois offert)
 * et Client Premium Or (2k FCFA) dans PostgreSQL via Prisma.
 */

import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { invalidateCatalogCache } from "@/lib/redis"
import {
  verifyPaystackWebhookSignature,
  resolvePlanFromPaystackCode,
  PAYSTACK_PLANS,
  type SubscriptionPlanCode,
} from "@/lib/paystack"

const paystackPlanEnum = z.enum([
  "PRO_STANDARD",
  "PRO_PREMIUM",
  "PRO_ENTERPRISE",
  "CLIENT_GOLD",
])

const paystackWebhookSchema = z.object({
  event: z.string().min(1),
  data: z.object({
    reference: z.string().optional(),
    amount: z.number().nonnegative().optional(),
    currency: z.string().optional(),
    customer: z
      .object({
        customer_code: z.string().optional(),
        email: z.string().optional(),
      })
      .optional(),
    subscription_code: z.string().optional(),
    plan: z
      .union([
        z.string(),
        z.object({
          plan_code: z.string().optional(),
        }),
      ])
      .optional(),
    metadata: z
      .object({
        userId: z.string().optional(),
        plan: paystackPlanEnum.optional(),
        trialDays: z.number().int().nonnegative().optional(),
      })
      .optional(),
  }),
})

type PaystackWebhookEvent = z.infer<typeof paystackWebhookSchema>

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

    let parsedJson: unknown
    try {
      parsedJson = JSON.parse(rawBody)
    } catch {
      return NextResponse.json(
        { error: "Charge utile JSON webhook invalide" },
        { status: 400 }
      )
    }

    const validatedPayload = paystackWebhookSchema.safeParse(parsedJson)
    if (!validatedPayload.success) {
      return NextResponse.json(
        { error: "Structure d'événement Paystack invalide" },
        { status: 400 }
      )
    }

    const { event, data } = validatedPayload.data
    const userId = await resolveUserIdFromWebhook(data)
    const planCode = resolvePlanFromWebhook(data)
    const paystackPlanCode = extractPlanCodeString(data.plan)

    // L'emission d'une facture (invoice.create) ne vaut pas encaissement effectif
    if (event === "invoice.create") {
      return NextResponse.json({
        received: true,
        event,
        skipped: "En attente de règlement confirmé (charge.success)",
      })
    }

    if (event === "charge.success" || event === "subscription.create") {
      if (!userId || !planCode || !(planCode in PAYSTACK_PLANS)) {
        return NextResponse.json({
          received: true,
          skipped: "Utilisateur ou formule introuvable dans le webhook",
        })
      }

      const dbUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, userType: true },
      })

      if (!dbUser) {
        return NextResponse.json({
          received: true,
          skipped: "Utilisateur introuvable en base",
        })
      }

      if (
        planCode !== "CLIENT_GOLD" &&
        dbUser.userType !== "pro" &&
        dbUser.userType !== "admin"
      ) {
        return NextResponse.json({
          received: true,
          skipped: "Rôle utilisateur incompatible avec cette formule",
        })
      }

      const planDef = PAYSTACK_PLANS[planCode]

      if (event === "charge.success") {
        const expectedMinorAmount = planDef.amountFCFA * 100
        if (typeof data.amount !== "number" || data.amount < expectedMinorAmount) {
          return NextResponse.json({
            received: true,
            skipped: "Montant Paystack inférieur au tarif de la formule",
          })
        }

        if (
          data.currency &&
          !["XOF", "XAF"].includes(data.currency.toUpperCase())
        ) {
          return NextResponse.json({
            received: true,
            skipped: "Devise non supportée pour cette formule",
          })
        }
      }

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
              userId: dbUser.id,
              plan: { in: ["PRO_STANDARD", "PRO_PREMIUM", "PRO_ENTERPRISE"], not: planCode },
              status: { in: ["ACTIVE", "TRIALING", "PAST_DUE"] },
            },
            data: { status: "CANCELLED" },
          })
        }

        const existingSub = await tx.subscription.findFirst({
          where: { userId: dbUser.id, plan: planCode },
          orderBy: { createdAt: "desc" },
        })

        if (existingSub) {
          const nextStatus =
            event === "charge.success" && existingSub.status === "PAST_DUE"
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
              userId: dbUser.id,
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
    console.error("[paystack-webhook] Erreur de traitement:", err)
    return NextResponse.json(
      { error: "Erreur de traitement webhook Paystack" },
      { status: 500 }
    )
  }
}
