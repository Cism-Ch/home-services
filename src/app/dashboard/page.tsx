import { redirect } from "next/navigation"
import { getDashboardHomeByRole, requireSession } from "@/server/auth-guard"

export default async function DashboardIndexPage() {
  const { user } = await requireSession()
  redirect(getDashboardHomeByRole(user.userType))
}
