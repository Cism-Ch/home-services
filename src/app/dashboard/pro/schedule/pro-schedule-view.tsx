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
import { useBookingStatusRealtime } from "@/hooks/use-realtime-status"
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
  userId: string
  proProfileId: string
  initialStatus: AvailabilityStatusType
  initialBookings: DashboardBookingItem[]
}

export function ProScheduleView({
  userId,
  proProfileId,
  initialStatus,
  initialBookings,
}: ProScheduleViewProps) {
  const router = useRouter()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, DashboardBookingItem["status"]>
  >({})
  const [reviewedIds, setReviewedIds] = useState<Record<string, boolean>>({})
  const [reviewClientBooking, setReviewClientBooking] =
    useState<DashboardBookingItem | null>(null)

  useBookingStatusRealtime(userId, (evt) => {
    toast.info(evt.message || "Agenda actualisé en direct.")
    router.refresh()
  })

  const proBookings = initialBookings.map((b) => ({
    ...b,
    status: statusOverrides[`${b.id}:${b.status}`] ?? b.status,
    hasProReviewed: b.hasProReviewed || Boolean(reviewedIds[b.id]),
  }))

  const handleValidateOffer = async (bookingId: string) => {
    const target = initialBookings.find((b) => b.id === bookingId)
    const res = await validateOfferAction(bookingId)
    if (res.error) {
      toast.error(res.error)
      return
    }

    if (target) {
      setStatusOverrides((prev) => ({
        ...prev,
        [`${bookingId}:${target.status}`]: "IN_PROGRESS",
      }))
    }
    toast.success(
      "Offre validée ! Vous êtes maintenant noté 'Occupé aujourd'hui' pour traiter cette tâche."
    )
    router.refresh()
  }

  const handleCompleteTask = async (bookingId: string) => {
    const target = initialBookings.find((b) => b.id === bookingId)
    const res = await answerTaskFollowUpAction(bookingId, "YES")
    if (res.error) {
      toast.error(res.error)
      return
    }

    if (target) {
      setStatusOverrides((prev) => ({
        ...prev,
        [`${bookingId}:${target.status}`]: "COMPLETED",
      }))
    }
    toast.success("Mission clôturée ! Vos créneaux sont réouverts.")
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
    toast.info("Rendez-vous annulé.")
    router.refresh()
  }

  const getStatusBadge = (status: DashboardBookingItem["status"]) => {
    switch (status) {
      case "NEGOTIATING":
        return <Badge variant="warning">En négociation</Badge>
      case "IN_PROGRESS":
        return <Badge variant="info">En cours de traitement</Badge>
      case "COMPLETED":
        return <Badge variant="success">Terminé</Badge>
      case "CANCELLED":
        return <Badge variant="destructive">Annulé</Badge>
    }
  }

  return (
    <div className="space-y-8 animate-appear">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
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

      <div className="grid grid-cols-1 xl:grid-cols-[310px_minmax(0,1fr)] gap-6 lg:gap-8">
        <div className="space-y-6 min-w-0">
          <Card className="py-4">
            <CardContent className="flex justify-center overflow-x-auto px-3">
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

        <div className="space-y-6 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                    className="overflow-hidden py-0 hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="shrink-0 flex flex-row md:flex-col items-center justify-between md:justify-center border-b pb-3 md:border-b-0 md:border-r md:pb-0 md:pr-6 md:min-w-[110px]">
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

                        <div className="flex-1 min-w-0 space-y-3">
                          <div className="flex flex-wrap justify-between items-start gap-2">
                            <div className="min-w-0">
                              <h3 className="text-lg font-semibold break-words">
                                {booking.serviceTitle}
                              </h3>
                              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                <User className="h-4 w-4 shrink-0" />
                                <span className="truncate">
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

                        <div className="flex flex-col justify-center gap-2 border-t pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-6 md:min-w-[160px]">
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
                              <Button
                                size="sm"
                                variant="ghost"
                                className="w-full"
                                aria-label="Plus d'actions"
                              >
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
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
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
                setReviewedIds((prev) => ({
                  ...prev,
                  [reviewClientBooking.id]: true,
                }))
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
