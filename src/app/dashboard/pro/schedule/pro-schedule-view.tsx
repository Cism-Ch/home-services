"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Calendar as CalendarIcon,
  MapPin,
  User,
  CheckCircle,
  MoreHorizontal,
  ArrowRight,
  ShieldCheck,
  Star,
} from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ProLiveStatusBanner } from "@/components/dashboard/pro-live-status-banner"
import { AddReviewForm } from "@/components/add-review-form"
import {
  validateOfferAction,
  answerTaskFollowUpAction,
} from "@/server/actions/booking-status"
import { updateBookingStatusAction } from "@/server/actions/booking"
import { formatFCFA } from "@/lib/formatters"
import type {
  AvailabilityStatusType,
  DashboardBookingItem,
} from "@/lib/types/catalog"
import { toast } from "sonner"

interface ProScheduleViewProps {
  proProfileId: string
  initialStatus: AvailabilityStatusType
  initialBookings: DashboardBookingItem[]
}

export function ProScheduleView({
  proProfileId,
  initialStatus,
  initialBookings,
}: ProScheduleViewProps) {
  const router = useRouter()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [proBookings, setProBookings] = useState<DashboardBookingItem[]>(initialBookings)
  const [reviewClientBooking, setReviewClientBooking] =
    useState<DashboardBookingItem | null>(null)

  const handleValidateOffer = async (bookingId: string) => {
    const res = await validateOfferAction(bookingId)
    if (res.error) {
      toast.error(res.error)
      return
    }

    setProBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status: "IN_PROGRESS" } : b
      )
    )
    toast.success(
      "Offre validée ! Vous êtes maintenant noté 'Occupé aujourd'hui' pour traiter cette tâche."
    )
    router.refresh()
  }

  const handleCompleteTask = async (bookingId: string) => {
    const res = await answerTaskFollowUpAction(bookingId, "YES")
    if (res.error) {
      toast.error(res.error)
      return
    }

    setProBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status: "COMPLETED" } : b
      )
    )
    toast.success("Mission clôturée ! Vos créneaux sont réouverts.")
    router.refresh()
  }

  const handleCancelBooking = async (bookingId: string) => {
    const res = await updateBookingStatusAction({ bookingId, status: "CANCELLED" })
    if (res.error) {
      toast.error(typeof res.error === "string" ? res.error : "Impossible d'annuler.")
      return
    }
    setProBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status: "CANCELLED" } : b
      )
    )
    toast.info("Rendez-vous annulé.")
    router.refresh()
  }

  const getStatusBadge = (status: DashboardBookingItem["status"]) => {
    switch (status) {
      case "NEGOTIATING":
        return (
          <Badge
            variant="secondary"
            className="bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200 border-amber-300"
          >
            En négociation
          </Badge>
        )
      case "IN_PROGRESS":
        return (
          <Badge className="bg-blue-600 hover:bg-blue-700 text-white">
            En cours de traitement
          </Badge>
        )
      case "COMPLETED":
        return (
          <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white">
            Terminé
          </Badge>
        )
      case "CANCELLED":
        return <Badge variant="destructive">Annulé</Badge>
    }
  }

  return (
    <div className="space-y-8 animate-appear">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Mon Agenda & Disponibilités
        </h1>
        <p className="text-muted-foreground mt-2">
          Gérez votre emploi du temps, vos créneaux et la validation de vos offres en direct.
        </p>
      </div>

      <ProLiveStatusBanner
        proId={proProfileId}
        initialStatus={initialStatus}
        hasActiveMission={proBookings.some((b) => b.status === "IN_PROGRESS")}
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4 lg:col-span-3 space-y-6">
          <Card>
            <CardContent className="p-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border shadow-sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Légende des statuts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span>En négociation (Offre reçue)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600" />
                <span>En cours de traitement</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-600" />
                <span>Traité & finalisé</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span>Annulé</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-8 lg:col-span-9 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {date?.toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </h2>
            <Button asChild variant="outline">
              <Link href="/dashboard/pro/availability">Plages d&apos;indisponibilité</Link>
            </Button>
          </div>

          <div className="space-y-4">
            {proBookings.length > 0 ? (
              proBookings.map((booking) => {
                const whatsappClean = booking.clientPhone.replace(/[^0-9]/g, "")
                const whatsappHref = whatsappClean
                  ? `https://wa.me/${whatsappClean}?text=${encodeURIComponent(
                      `Bonjour ${booking.clientName}, suite à votre demande HomeServices (${booking.serviceTitle}) pour le créneau ${booking.timeSlot}.`
                    )}`
                  : null

                return (
                  <Card
                    key={booking.id}
                    className="overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-shrink-0 flex flex-col items-center justify-center min-w-[110px] border-r pr-6">
                          <span className="text-lg font-bold text-primary">
                            {booking.timeSlot}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(booking.bookingDate).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        </div>

                        <div className="flex-1 space-y-3">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <h3 className="text-lg font-semibold">
                                {booking.serviceTitle}
                              </h3>
                              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                <User className="h-4 w-4" />
                                <span>
                                  {booking.clientName} ({booking.clientPhone})
                                </span>
                              </div>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {booking.clientAddress}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-foreground">
                                {formatFCFA(booking.indicativePrice)}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                (Règlement direct après prestation)
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col justify-center gap-2 border-l pl-6 min-w-[160px]">
                          {booking.status === "NEGOTIATING" && (
                            <Button
                              size="sm"
                              className="w-full gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={() => handleValidateOffer(booking.id)}
                            >
                              <ArrowRight className="h-4 w-4" />
                              Valider l&apos;offre
                            </Button>
                          )}

                          {booking.status === "IN_PROGRESS" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full gap-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                              onClick={() => handleCompleteTask(booking.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                              Clôturer
                            </Button>
                          )}

                          {booking.status === "COMPLETED" && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                                <ShieldCheck className="h-4 w-4" />
                                Mission clôturée
                              </div>
                              {!booking.hasProReviewed && (
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="w-full gap-1.5 text-xs"
                                  onClick={() => setReviewClientBooking(booking)}
                                >
                                  <Star className="h-3.5 w-3.5 text-amber-500" />
                                  Noter le client
                                </Button>
                              )}
                            </div>
                          )}

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost" className="w-full">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {whatsappHref && (
                                <DropdownMenuItem asChild>
                                  <a
                                    href={whatsappHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Ouvrir sur WhatsApp
                                  </a>
                                </DropdownMenuItem>
                              )}
                              {(booking.status === "NEGOTIATING" ||
                                booking.status === "IN_PROGRESS") && (
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleCancelBooking(booking.id)}
                                >
                                  Annuler la demande
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Aucun rendez-vous</h3>
                <p className="text-muted-foreground">
                  Vous n&apos;avez aucune mission enregistrée pour le moment.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog
        open={reviewClientBooking !== null}
        onOpenChange={(open) => !open && setReviewClientBooking(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Évaluation mutuelle post-prestation</DialogTitle>
          </DialogHeader>
          {reviewClientBooking && (
            <AddReviewForm
              professionalId={reviewClientBooking.clientId}
              professionalName={reviewClientBooking.clientName}
              bookingId={reviewClientBooking.id}
              authorType="PRO_TO_CLIENT"
              onReviewSubmitted={() => {
                setProBookings((prev) =>
                  prev.map((b) =>
                    b.id === reviewClientBooking.id
                      ? { ...b, hasProReviewed: true }
                      : b
                  )
                )
                setReviewClientBooking(null)
                router.refresh()
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
