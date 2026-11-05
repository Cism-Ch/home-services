"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookingTicket, type BookingTicketData } from "@/components/booking-ticket"
import { bookings, services, professionals, formatFCFA, type Booking } from "@/lib/mock-data"
import { Calendar, Clock, MapPin, User, MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProContactActions } from "@/components/pro-contact-actions"
import { ClientFollowUpCard, type ActiveTaskItem } from "@/components/dashboard/client-follow-up-card"

function getStatusBadge(status: string) {
  switch (status) {
    case "negotiating":
      return (
        <Badge variant="secondary" className="bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200 border-amber-300">
          En négociation
        </Badge>
      )
    case "in_progress":
      return (
        <Badge className="bg-blue-600 hover:bg-blue-700 text-white">
          En traitement
        </Badge>
      )
    case "completed":
      return (
        <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white">
          Terminé
        </Badge>
      )
    case "cancelled":
      return <Badge variant="destructive">Annulé</Badge>
    default:
      return <Badge variant="outline">Confirmé</Badge>
  }
}

interface BookingListProps {
  items: Booking[]
  onViewTicket: (booking: Booking) => void
}

function BookingList({ items, onViewTicket }: BookingListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Aucune réservation</h3>
        <p className="text-muted-foreground text-sm">
          Vous n&apos;avez aucune réservation dans cette catégorie.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((booking) => {
        const service = services.find((s) => s.id === booking.serviceId)
        const pro = professionals.find((p) => p.id === booking.professionalId)

        return (
          <Card key={booking.id} className="overflow-hidden hover:shadow-sm transition-shadow">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusBadge(booking.status)}
                        <span className="text-xs text-muted-foreground font-mono">
                          #{booking.id}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold">{service?.title}</h3>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewTicket(booking)}>
                          Voir le billet
                        </DropdownMenuItem>
                        {booking.status === "negotiating" && (
                          <DropdownMenuItem className="text-destructive">
                            Annuler la demande
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4 text-primary" />
                      <span className="font-medium text-foreground">{pro?.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="capitalize">
                        {new Date(booking.date).toLocaleDateString("fr-FR", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{booking.time} ({service?.duration || 60} min)</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="truncate">{booking.address}</span>
                    </div>
                  </div>

                  {pro && (
                    <div className="mt-4 pt-3 border-t flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Contact direct :</span>
                      <ProContactActions
                        proName={pro.name}
                        phoneNumber={pro.phoneNumber}
                        whatsappNumber={pro.whatsappNumber}
                        serviceTitle={service?.title}
                        bookingRef={booking.id}
                        variant="compact"
                      />
                    </div>
                  )}
                </div>

                <div className="bg-muted/30 p-6 flex flex-col justify-center items-center md:items-end border-t md:border-t-0 md:border-l min-w-[210px]">
                  <div className="text-2xl font-extrabold text-primary mb-1">
                    {formatFCFA(booking.price)}
                  </div>
                  <div className="text-xs text-muted-foreground mb-4 text-center md:text-right">
                    Règlement direct après prestation
                  </div>
                  <Button
                    className="w-full md:w-auto"
                    onClick={() => onViewTicket(booking)}
                  >
                    Voir le billet
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default function ClientBookingsPage() {
  const [selectedBooking, setSelectedBooking] = useState<BookingTicketData | null>(null)
  const [ticketOpen, setTicketOpen] = useState(false)
  const [clientBookingsList, setClientBookingsList] = useState<Booking[]>(bookings)
  const userId = "user-1"

  const userBookings = clientBookingsList
    .filter((b) => b.userId === userId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Tâches actives en cours pour le suivi interactif
  const inProgressTasks: ActiveTaskItem[] = userBookings
    .filter((b) => b.status === "in_progress")
    .map((b) => {
      const service = services.find((s) => s.id === b.serviceId)
      const pro = professionals.find((p) => p.id === b.professionalId)
      return {
        id: b.id,
        serviceName: service?.title || "Service",
        proName: pro?.name || "Prestataire",
        proId: b.professionalId,
        bookingDate: b.date,
        timeSlot: b.time,
        indicativePrice: b.price,
      }
    })

  const activeBookings = userBookings.filter(
    (b) => b.status === "negotiating" || b.status === "in_progress" || b.status === "upcoming"
  )
  const completedBookings = userBookings.filter((b) => b.status === "completed")
  const cancelledBookings = userBookings.filter((b) => b.status === "cancelled")

  const handleTaskCompleted = (taskId: string) => {
    setClientBookingsList((prev) =>
      prev.map((b) => (b.id === taskId ? { ...b, status: "completed" as const } : b))
    )
  }

  const handleViewTicket = (booking: Booking) => {
    const service = services.find((s) => s.id === booking.serviceId)
    const pro = professionals.find((p) => p.id === booking.professionalId)

    setSelectedBooking({
      id: booking.id,
      serviceId: booking.serviceId,
      serviceName: service?.title || "Service",
      professionalId: booking.professionalId,
      professionalName: pro?.name || "Professionnel",
      professionalPhone: pro?.phoneNumber,
      professionalWhatsapp: pro?.whatsappNumber,
      date: booking.date,
      status: booking.status as BookingTicketData["status"],
      price: booking.price,
      address: booking.address,
      time: booking.time,
      duration: service?.duration,
    })
    setTicketOpen(true)
  }

  return (
    <>
      <div className="space-y-8 animate-appear">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes réservations & rendez-vous</h1>
          <p className="text-muted-foreground mt-2">
            Consultez vos rendez-vous, échangez directement avec vos artisans et confirmez la finalisation des prestations.
          </p>
        </div>

        {/* Prompt interactif de suivi de tâche pour les interventions en cours */}
        <ClientFollowUpCard
          tasks={inProgressTasks}
          onTaskCompleted={handleTaskCompleted}
        />

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-[450px]">
            <TabsTrigger value="active">Actifs ({activeBookings.length})</TabsTrigger>
            <TabsTrigger value="completed">Finalisés ({completedBookings.length})</TabsTrigger>
            <TabsTrigger value="cancelled">Annulés ({cancelledBookings.length})</TabsTrigger>
          </TabsList>
          <div className="mt-6">
            <TabsContent value="active">
              <BookingList items={activeBookings} onViewTicket={handleViewTicket} />
            </TabsContent>
            <TabsContent value="completed">
              <BookingList items={completedBookings} onViewTicket={handleViewTicket} />
            </TabsContent>
            <TabsContent value="cancelled">
              <BookingList items={cancelledBookings} onViewTicket={handleViewTicket} />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Booking Ticket Dialog */}
      <BookingTicket
        booking={selectedBooking}
        open={ticketOpen}
        onOpenChange={setTicketOpen}
      />
    </>
  )
}
