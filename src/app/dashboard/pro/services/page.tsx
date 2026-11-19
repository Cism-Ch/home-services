import { redirect } from "next/navigation"
import { requireRole } from "@/server/auth-guard"
import { getProDashboardData } from "@/server/queries/dashboard"
import { ProServicesView } from "./pro-services-view"

export const dynamic = "force-dynamic"

export default async function ProServicesPage() {
  const { user } = await requireRole(["pro", "admin"])
  const data = await getProDashboardData(user.id)

  if (!data) {
    redirect("/dashboard/pro/profile")
  }

  return (
    <ProServicesView
      proProfileId={data.proProfile.id}
      providerName={data.proProfile.userName}
      initialServices={data.services}
      categories={data.categories}
    />
  )
}
