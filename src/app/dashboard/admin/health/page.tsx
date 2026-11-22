import { requireRole } from "@/server/auth-guard"
import { runStackHealthChecks } from "@/lib/stack-health"
import { HealthMonitorView } from "./health-monitor-view"

export const dynamic = "force-dynamic"

export default async function AdminHealthPage() {
  await requireRole(["admin"])
  const initialReport = await runStackHealthChecks()
  return <HealthMonitorView initialReport={initialReport} />
}
