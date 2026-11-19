import { redirect } from "next/navigation"
import { requireRole } from "@/server/auth-guard"
import { getProDashboardData } from "@/server/queries/dashboard"
import { ProScheduleView } from "./pro-schedule-view"

export const dynamic = "force-dynamic"

export default async function ProSchedulePage() {
  const { user } = await requireRole(["pro", "admin"])
  const data = await getProDashboardData(user.id)

  if (!data) {
    redirect("/dashboard/pro/profile")
  }

  return (
    <ProScheduleView
      proProfileId={data.proProfile.id}
      initialStatus={data.proProfile.availabilityStatus}
      initialBookings={data.bookings}
    />
  )
}
