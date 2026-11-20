"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { BookingTicket, type BookingTicketData } from "@/components/booking-ticket"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProContactActions } from "@/components/pro-contact-actions"
import {
  ClientFollowUpCard,
  type ActiveTaskItem,
} from "@/components/dashboard/client-follow-up-card"
import { AddReviewForm } from "@/components/add-review-form"
import { useBookingStatusRealtime } from "@/hooks/use-realtime-status"
import { updateBookingStatusAction } from "@/server/actions/booking"
import { formatFCFA } from "@/lib/formatters"
import type { DashboardBookingItem } from "@/lib/types/catalog"
import { Calendar, Clock, MapPin, User, MoreVertical, Star } from "lucide-react"
import { toast } from "sonner"

function getStatusBadge(status: DashboardBookingItem["status"]) {
  switch (status) {
    case "NEGOTIATING":
      return <Badge variant="warning">En négociation</Badge>
    case "IN_PROGRESS":
      return <Badge variant="info">En traitement</Badge>
    case "COMPLETED":
      return <Badge variant="success">Terminé</Badge>
    case "CANCELLED":
      return <Badge variant="destructive">Annulé</Badge>
  }
}

interface BookingListProps {
  items: DashboardBookingItem[]
  onViewTicket: (booking: DashboardBookingItem) => void
  onCancelBooking: (bookingId: string) => void
  onReviewPro: (booking: DashboardBookingItem) => void
}

function BookingList({
  items,
  onViewTicket,
  onCancelBooking,
  onReviewPro,
}: BookingListProps) {
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
      {items.map((booking) => (
        <Card key={booking.id} className="overflow-hidden hover:shadow-sm transition-shadow">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusBadge(booking.status)}
                      <span className="text-xs text-muted-foreground font-mono">
                        #{booking.id.slice(0, 12)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold">{booking.serviceTitle}</h3>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Actions sur la réservation"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewTicket(booking)}>
                        Voir le billet
                      </DropdownMenuItem>
                      {booking.status === "NEGOTIATING" && (
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => onCancelBooking(booking.id)}
                        >
                          Annuler la demande
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">{booking.proName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="capitalize">
                      {new Date(booking.bookingDate).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{booking.timeSlot}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="truncate">{booking.clientAddress}</span>
                  </div>
                </div>

                {booking.proPhone && (
                  <div className="mt-4 pt-3 border-t flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Contact direct :</span>
                    <ProContactActions
                      proName={booking.proName}
                      phoneNumber={booking.proPhone}
                      whatsappNumber={booking.proWhatsapp}
                      serviceTitle={booking.serviceTitle}
                      bookingRef={booking.id}
                      variant="compact"
                    />
                  </div>
                )}
              </div>

              <div className="bg-muted/30 p-5 sm:p-6 flex flex-col justify-center items-stretch md:items-end border-t md:border-t-0 md:border-l md:min-w-[210px] gap-2">
                <div className="text-2xl font-extrabold text-primary">
                  {formatFCFA(booking.indicativePrice)}
                </div>
                <div className="text-xs text-muted-foreground mb-2 text-center md:text-right">
                  Règlement direct après prestation
                </div>
                <Button
                  className="w-full md:w-auto"
                  onClick={() => onViewTicket(booking)}
                >
                  Voir le billet
                </Button>
                {booking.status === "COMPLETED" && !booking.hasClientReviewed && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full md:w-auto gap-1.5"
                    onClick={() => onReviewPro(booking)}
                  >
                    <Star className="h-3.5 w-3.5 text-amber-500" />
                    Noter l&apos;artisan
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function ClientBookingsView({
  userId,
  initialBookings,
}: {
  userId: string
  initialBookings: DashboardBookingItem[]
}) {
  const router = useRouter()
  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, DashboardBookingItem["status"]>
  >({})
  const [reviewedIds, setReviewedIds] = useState<Record<string, boolean>>({})
  const [selectedBooking, setSelectedBooking] = useState<BookingTicketData | null>(null)
  const [ticketOpen, setTicketOpen] = useState(false)
  const [reviewBooking, setReviewBooking] = useState<DashboardBookingItem | null>(null)

  useBookingStatusRealtime(userId, (evt) => {
    toast.info(evt.message || "Statut de réservation actualisé en direct.")
    router.refresh()
  })

  const bookingsList = initialBookings.map((b) => ({
    ...b,
    status: statusOverrides[`${b.id}:${b.status}`] ?? b.status,
    hasClientReviewed: b.hasClientReviewed || Boolean(reviewedIds[b.id]),
  }))

  const inProgressTasks: ActiveTaskItem[] = bookingsList
    .filter((b) => b.status === "IN_PROGRESS")
    .map((b) => ({
      id: b.id,
      serviceName: b.serviceTitle,
      proName: b.proName,
      proId: b.proUserId,
      bookingDate: b.bookingDate,
      timeSlot: b.timeSlot,
      indicativePrice: b.indicativePrice,
    }))

  const activeBookings = bookingsList.filter(
    (b) => b.status === "NEGOTIATING" || b.status === "IN_PROGRESS"
  )
  const completedBookings = bookingsList.filter((b) => b.status === "COMPLETED")
  const cancelledBookings = bookingsList.filter((b) => b.status === "CANCELLED")

  const handleTaskCompleted = (taskId: string) => {
    const target = initialBookings.find((b) => b.id === taskId)
    if (target) {
      setStatusOverrides((prev) => ({
        ...prev,
        [`${taskId}:${target.status}`]: "COMPLETED",
      }))
    }
    router.refresh()
  }

  const handleCancelBooking = async (bookingId: string) => {
    const target = initialBookings.find((b) => b.id === bookingId)
    const res = await updateBookingStatusAction({ bookingId, status: "CANCELLED" })
    if (res.error) {
      toast.error(typeof res.error === "string" ? res.error : "Impossible d'annuler.")
      return
    }
    if (target) {
      setStatusOverrides((prev) => ({
        ...prev,
        [`${bookingId}:${target.status}`]: "CANCELLED",
      }))
    }
    toast.success("Demande annulée.")
    router.refresh()
  }

  const mapTicketStatus = (
    s: DashboardBookingItem["status"]
  ): BookingTicketData["status"] => {
    if (s === "IN_PROGRESS") return "in_progress"
    if (s === "COMPLETED") return "completed"
    if (s === "CANCELLED") return "cancelled"
    return "negotiating"
  }

  const handleViewTicket = (booking: DashboardBookingItem) => {
    setSelectedBooking({
      id: booking.id,
      serviceId: booking.serviceId,
      serviceName: booking.serviceTitle,
      professionalId: booking.proProfileId,
      professionalName: booking.proName,
      professionalPhone: booking.proPhone,
      professionalWhatsapp: booking.proWhatsapp,
      date: booking.bookingDate,
      status: mapTicketStatus(booking.status),
      price: booking.indicativePrice,
      address: booking.clientAddress,
      time: booking.timeSlot,
    })
    setTicketOpen(true)
  }

  return (
    <>
      <div className="space-y-8 animate-appear">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Mes réservations & rendez-vous
          </h1>
          <p className="text-muted-foreground mt-2">
            Consultez vos rendez-vous, échangez directement avec vos artisans et confirmez la finalisation des prestations.
          </p>
        </div>

        <ClientFollowUpCard
          tasks={inProgressTasks}
          onTaskCompleted={handleTaskCompleted}
        />

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 p-1 sm:inline-flex sm:w-fit">
            <TabsTrigger value="active">Actifs ({activeBookings.length})</TabsTrigger>
            <TabsTrigger value="completed">
              Finalisés ({completedBookings.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Annulés ({cancelledBookings.length})
            </TabsTrigger>
          </TabsList>
          <div className="mt-6">
            <TabsContent value="active">
              <BookingList
                items={activeBookings}
                onViewTicket={handleViewTicket}
                onCancelBooking={handleCancelBooking}
                onReviewPro={setReviewBooking}
              />
            </TabsContent>
            <TabsContent value="completed">
              <BookingList
                items={completedBookings}
                onViewTicket={handleViewTicket}
                onCancelBooking={handleCancelBooking}
                onReviewPro={setReviewBooking}
              />
            </TabsContent>
            <TabsContent value="cancelled">
              <BookingList
                items={cancelledBookings}
                onViewTicket={handleViewTicket}
                onCancelBooking={handleCancelBooking}
                onReviewPro={setReviewBooking}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <BookingTicket
        booking={selectedBooking}
        open={ticketOpen}
        onOpenChange={setTicketOpen}
      />

      <Dialog
        open={reviewBooking !== null}
        onOpenChange={(open) => !open && setReviewBooking(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Évaluer {reviewBooking?.proName}</DialogTitle>
          </DialogHeader>
          {reviewBooking && (
            <AddReviewForm
              professionalId={reviewBooking.proUserId}
              professionalName={reviewBooking.proName}
              bookingId={reviewBooking.id}
              authorType="CLIENT_TO_PRO"
              onReviewSubmitted={() => {
                setReviewedIds((prev) => ({
                  ...prev,
                  [reviewBooking.id]: true,
                }))
                setReviewBooking(null)
                router.refresh()
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
