import { notFound } from "next/navigation"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
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
    <>
      <div className="w-full bg-muted/20 border-b">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 pt-5 pb-1">
          <PageBreadcrumb
            className="mb-2"
            items={[
              { label: "Accueil", href: "/" },
              { label: "Professionnels", href: "/professionals" },
              {
                label: context.professional.name,
                href: `/professionals/pros/${context.professional.id}`,
              },
              { label: "Réservation" },
            ]}
          />
        </div>
      </div>
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
    </>
  )
}
