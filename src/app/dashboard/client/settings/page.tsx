import { requireSession } from "@/server/auth-guard"
import { getClientSettingsData } from "@/server/queries/dashboard"
import { PAYSTACK_PLANS, type SubscriptionPlanCode } from "@/lib/paystack"
import { ClientSettingsView } from "./client-settings-view"

export const dynamic = "force-dynamic"

interface ClientSettingsPageProps {
  searchParams: Promise<{
    reference?: string
    paystack_ref?: string
    trxref?: string
    plan?: string
  }>
}

export default async function ClientSettingsPage({
  searchParams,
}: ClientSettingsPageProps) {
  const { user } = await requireSession()
  const [settings, params] = await Promise.all([
    getClientSettingsData(user.id),
    searchParams,
  ])

  const callbackRef =
    params.reference || params.paystack_ref || params.trxref || undefined
  const callbackPlan =
    params.plan && params.plan in PAYSTACK_PLANS
      ? (params.plan as SubscriptionPlanCode)
      : undefined

  return (
    <ClientSettingsView
      user={{
        id: user.id,
        name: settings.user?.name || user.name,
        email: settings.user?.email || user.email,
        phoneNumber: settings.user?.phoneNumber || "",
      }}
      subscriptions={settings.subscriptions}
      initialIsGoldMember={settings.isGoldMember}
      callbackRef={callbackRef}
      callbackPlan={callbackPlan}
    />
  )
}
