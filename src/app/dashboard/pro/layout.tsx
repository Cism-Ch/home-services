import { requireRole } from "@/server/auth-guard"

export default async function ProDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireRole(["pro", "admin"])
  return <>{children}</>
}
