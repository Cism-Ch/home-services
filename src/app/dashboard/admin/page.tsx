import { requireRole } from "@/server/auth-guard"
import { getAdminDashboardData } from "@/server/queries/admin"
import { AdminDashboardView } from "./admin-dashboard-view"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  await requireRole(["admin"])
  const data = await getAdminDashboardData()

  return <AdminDashboardView data={data} />
}
