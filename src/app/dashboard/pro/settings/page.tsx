import { redirect } from "next/navigation"
import { requireRole } from "@/server/auth-guard"
import { getProSettingsData } from "@/server/queries/dashboard"
import { PAYSTACK_PLANS, type SubscriptionPlanCode } from "@/lib/paystack"
import { ProSettingsView } from "./pro-settings-view"

export const dynamic = "force-dynamic"

interface ProSettingsPageProps {
  searchParams: Promise<{
    reference?: string
    paystack_ref?: string
    trxref?: string
    plan?: string
  }>
}

export default async function ProSettingsPage({
  searchParams,
}: ProSettingsPageProps) {
  const { user } = await requireRole(["pro", "admin"])
  const [settings, params] = await Promise.all([
    getProSettingsData(user.id),
    searchParams,
  ])

  if (!settings.proProfile) {
    redirect("/dashboard/pro/profile")
  }

  const callbackRef =
    params.reference || params.paystack_ref || params.trxref || undefined
  const callbackPlan =
    params.plan && params.plan in PAYSTACK_PLANS
      ? (params.plan as SubscriptionPlanCode)
      : undefined

  return (
    <ProSettingsView
      user={{
        id: user.id,
        name: settings.user?.name || user.name,
        email: settings.user?.email || user.email,
      }}
      proProfile={{
        id: settings.proProfile.id,
        cityId: settings.proProfile.cityId || "",
        commune: settings.proProfile.commune || "",
        address: settings.proProfile.address || "",
        phoneNumber: settings.proProfile.phoneNumber,
        whatsappNumber: settings.proProfile.whatsappNumber,
        kycStatus: settings.proProfile.kycStatus,
        isVerified: settings.proProfile.isVerified,
      }}
      subscriptions={settings.subscriptions}
      activeSubscription={settings.activeProSubscription}
      callbackRef={callbackRef}
      callbackPlan={callbackPlan}
    />
  )
}
