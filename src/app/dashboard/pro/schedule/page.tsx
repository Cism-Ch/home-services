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
      userId={user.id}
      proProfileId={data.proProfile.id}
      initialStatus={data.proProfile.availabilityStatus}
      maxConcurrentProjects={data.proProfile.maxConcurrentProjects}
      activeProjectsToday={data.proProfile.activeProjectsToday}
      initialBookings={data.bookings}
    />
  )
}
