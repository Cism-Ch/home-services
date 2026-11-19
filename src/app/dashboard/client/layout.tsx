import { requireRole } from "@/server/auth-guard"

export default async function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireRole(["client", "pro", "admin"])
  return <>{children}</>
}
