import { notFound } from "next/navigation"
import { getBookingContext } from "@/server/queries/catalog"
import { getServerSession } from "@/server/auth-guard"
import { BookingClient } from "./booking-client"

export const dynamic = "force-dynamic"

interface BookingPageProps {
  params: Promise<{
    proId: string
    serviceId: string
  }>
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { proId, serviceId } = await params
  const [context, sessionCtx] = await Promise.all([
    getBookingContext(proId, serviceId),
    getServerSession(),
  ])

  if (!context) {
    notFound()
  }

  return (
    <BookingClient
      professional={context.professional}
      service={context.service}
      timeSlots={context.timeSlots}
      unavailabilities={context.unavailabilities}
      bookedSlots={context.bookedSlots}
      isAuthenticated={Boolean(sessionCtx?.user)}
      initialClientName={sessionCtx?.user.name || ""}
      initialClientPhone={sessionCtx?.user.phoneNumber || ""}
    />
  )
}
