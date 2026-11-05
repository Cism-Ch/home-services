"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, MapPin, User, CheckCircle, MoreHorizontal, ArrowRight, ShieldCheck, Star } from "lucide-react"
import { bookings, services, formatFCFA, type Booking } from "@/lib/mock-data"
import { Calendar } from "@/components/ui/calendar"
import Link from "next/link"
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
import { validateOfferAction, answerTaskFollowUpAction } from "@/server/actions/booking-status"
import { toast } from "sonner"

export default function ProSchedulePage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [proBookings, setProBookings] = useState<Booking[]>(bookings)
  const [reviewClientBooking, setReviewClientBooking] = useState<Booking | null>(null)
  const proId = "pro-1"

  const selectedDateBookings = proBookings.filter((b) => b.professionalId === proId)

  const handleValidateOffer = async (bookingId: string) => {
    try {
      const res = await validateOfferAction(bookingId)
      if (res.error) {
        toast.error("Impossible de valider l'offre.")
        return
      }

      setProBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: "in_progress" as const } : b))
      )
      toast.success("Offre validée ! Vous êtes maintenant noté 'Occupé aujourd'hui' pour traiter cette tâche.")
    } catch {
      toast.error("Erreur lors de la validation.")
    }
  }

  const handleCompleteTask = async (bookingId: string) => {
    try {
      const res = await answerTaskFollowUpAction(bookingId, "YES")
      if (res.error) {
        toast.error("Impossible de clôturer la tâche.")
        return
      }

      setProBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: "completed" as const } : b))
      )
      toast.success("Mission clôturée ! Vos créneaux sont réouverts.")
    } catch {
      toast.error("Erreur de clôture.")
    }
  }

  const getStatusBadge = (status: string) => {
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
            En cours de traitement
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

  return (
    <div className="space-y-8 animate-appear">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mon Agenda & Disponibilités</h1>
        <p className="text-muted-foreground mt-2">
          Gérez votre emploi du temps, vos créneaux et la validation de vos offres en direct.
        </p>
      </div>

      {/* Pro Live Status Banner */}
      <ProLiveStatusBanner
        proId={proId}
        hasActiveMission={proBookings.some((b) => b.professionalId === proId && b.status === "in_progress")}
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Calendar Sidebar */}
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

        {/* Schedule List */}
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
            {selectedDateBookings.length > 0 ? (
              selectedDateBookings.map((booking) => {
                const service = services.find((s) => s.id === booking.serviceId)
                return (
                  <Card key={booking.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-shrink-0 flex flex-col items-center justify-center min-w-[80px] border-r pr-6">
                          <span className="text-2xl font-bold text-primary">{booking.time}</span>
                          <span className="text-sm text-muted-foreground">{service?.duration || 60} min</span>
                        </div>

                        <div className="flex-1 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold">{service?.title}</h3>
                              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                <User className="h-4 w-4" />
                                <span>Client #{booking.userId.split("-")[1] || "1"}</span>
                              </div>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {booking.address}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-foreground">{formatFCFA(booking.price)}</span>
                              <span className="text-xs text-muted-foreground">(Règlement direct après prestation)</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col justify-center gap-2 border-l pl-6 min-w-[150px]">
                          {booking.status === "negotiating" && (
                            <Button
                              size="sm"
                              className="w-full gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={() => handleValidateOffer(booking.id)}
                            >
                              <ArrowRight className="h-4 w-4" />
                              Valider l&apos;offre
                            </Button>
                          )}

                          {booking.status === "in_progress" && (
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

                          {booking.status === "completed" && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                                <ShieldCheck className="h-4 w-4" />
                                Mission clôturée
                              </div>
                              <Button
                                size="sm"
                                variant="secondary"
                                className="w-full gap-1.5 text-xs"
                                onClick={() => setReviewClientBooking(booking)}
                              >
                                <Star className="h-3.5 w-3.5 text-amber-500" />
                                Noter le client
                              </Button>
                            </div>
                          )}

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost" className="w-full">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Voir détails client</DropdownMenuItem>
                              <DropdownMenuItem>Ouvrir sur WhatsApp</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Annuler la demande</DropdownMenuItem>
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
                <p className="text-muted-foreground">Vous n&apos;avez rien de prévu pour cette journée.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialog d'avis mutuel Pro -> Client */}
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
              professionalId={reviewClientBooking.userId}
              professionalName={`Client #${reviewClientBooking.userId.split("-")[1] || "1"}`}
              bookingId={reviewClientBooking.id}
              authorType="PRO_TO_CLIENT"
              onReviewSubmitted={() => setReviewClientBooking(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
