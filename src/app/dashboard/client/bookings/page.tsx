import { requireSession } from "@/server/auth-guard"
import { getClientDashboardData } from "@/server/queries/dashboard"
import { ClientBookingsView } from "./client-bookings-view"

export const dynamic = "force-dynamic"

export default async function ClientBookingsPage() {
  const { user } = await requireSession()
  const { bookings } = await getClientDashboardData(user.id)

  return <ClientBookingsView initialBookings={bookings} />
}
