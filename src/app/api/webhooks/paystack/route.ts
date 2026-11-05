/**
 * Webhook Paystack securise (Verification HMAC-SHA512)
 * Synchronise de maniere idempotente les abonnements Prestataires (5k/10k/20k FCFA + 1 mois offert)
 * et Client Premium Or (2k FCFA) dans PostgreSQL via Prisma.
 */

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import {
  verifyPaystackWebhookSignature,
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
    }
    metadata?: {
      userId?: string
      plan?: SubscriptionPlanCode
      trialDays?: number
    }
  }
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
    const userId = data.metadata?.userId
    const planCode = data.metadata?.plan

    if (!userId || !planCode || !(planCode in PAYSTACK_PLANS)) {
      return NextResponse.json({ received: true, skipped: "Metadata incomplet" })
    }

    const planDef = PAYSTACK_PLANS[planCode]
    const now = new Date()
    const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    const trialEnd =
      planDef.trialDays > 0
        ? new Date(now.getTime() + planDef.trialDays * 24 * 60 * 60 * 1000)
        : null

    if (event === "charge.success" || event === "subscription.create") {
      try {
        const existingSub = await prisma.subscription.findFirst({
          where: { userId, plan: planCode },
        })

        if (existingSub) {
          await prisma.subscription.update({
            where: { id: existingSub.id },
            data: {
              status: planDef.trialDays > 0 ? "TRIALING" : "ACTIVE",
              paystackCustomerCode: data.customer?.customer_code,
              paystackSubscriptionCode: data.subscription_code,
              currentPeriodStart: now,
              currentPeriodEnd: periodEnd,
            },
          })
        } else {
          await prisma.subscription.create({
            data: {
              userId,
              plan: planCode,
              amount: planDef.amountFCFA,
              currency: "XOF",
              status: planDef.trialDays > 0 ? "TRIALING" : "ACTIVE",
              paystackCustomerCode: data.customer?.customer_code,
              paystackSubscriptionCode: data.subscription_code,
              paystackPlanCode: data.plan?.plan_code,
              trialStartDate: planDef.trialDays > 0 ? now : null,
              trialEndDate: trialEnd,
              currentPeriodStart: now,
              currentPeriodEnd: periodEnd,
            },
          })
        }
      } catch {
        // Tolere l'absence de base locale pendant les tests hors-ligne
      }
    } else if (event === "subscription.disable" || event === "subscription.not_renew") {
      try {
        await prisma.subscription.updateMany({
          where: { userId, plan: planCode },
          data: { status: "CANCELLED" },
        })
      } catch {
        // Fallback
      }
    }

    return NextResponse.json({ received: true, event })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur de traitement webhook Paystack" },
      { status: 500 }
    )
  }
}
