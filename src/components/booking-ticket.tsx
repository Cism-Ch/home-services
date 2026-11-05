"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, User, Printer, ShieldCheck } from "lucide-react"
import { formatFCFA } from "@/lib/mock-data"
import { ProContactActions } from "@/components/pro-contact-actions"

export type BookingStatusType = "negotiating" | "in_progress" | "upcoming" | "completed" | "cancelled"

export interface BookingTicketData {
  id: string
  serviceId: string
  serviceName: string
  professionalId: string
  professionalName: string
  professionalPhone?: string
  professionalWhatsapp?: string
  date: Date | string
  status: BookingStatusType
  price: number
  address: string
  time: string
  duration?: number
  clientName?: string
  clientPhone?: string
}

interface BookingTicketProps {
  booking: BookingTicketData | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BookingTicket({ booking, open, onOpenChange }: BookingTicketProps) {
  if (!booking) return null

  const handlePrint = () => {
    window.print()
  }

  const getStatusBadge = (status: BookingStatusType) => {
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
            Traité & Finalisé
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="destructive">
            Annulé
          </Badge>
        )
      case "upcoming":
      default:
        return (
          <Badge variant="outline" className="border-primary/50 text-primary">
            Confirmé
          </Badge>
        )
    }
  }

  const parsedDate = typeof booking.date === "string" ? new Date(booking.date) : booking.date

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto print:max-w-full backdrop-blur-sm bg-background/95 border-2">
        <DialogHeader className="print:hidden">
          <DialogTitle>Billet de mise en relation & réservation</DialogTitle>
        </DialogHeader>

        {/* Ticket Content */}
        <div className="space-y-6 print:p-8">
          {/* Header */}
          <div className="text-center space-y-2 border-b pb-6">
            <h1 className="text-3xl font-extrabold gradient-brand">HomeServices</h1>
            <p className="text-muted-foreground text-sm">Plateforme de mise en relation directe avec les artisans locaux</p>
            <div className="pt-1">
              {getStatusBadge(booking.status)}
            </div>
          </div>

          {/* Booking Reference */}
          <div className="bg-muted/40 rounded-lg p-5 text-center space-y-2 border">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Référence de rendez-vous</p>
            <p className="text-2xl font-mono font-bold tracking-wider text-primary">{booking.id.toUpperCase()}</p>
            <p className="text-xs text-muted-foreground">Conservez cette référence pour vos échanges avec le prestataire</p>
          </div>

          {/* Service & Artisan Details */}
          <div className="space-y-4">
            <h3 className="font-bold text-base">Détails de l&apos;intervention</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3 bg-card p-3 rounded-md border">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Service demandé</p>
                    <p className="font-semibold text-sm">{booking.serviceName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Artisan / Prestataire</p>
                    <p className="font-semibold text-sm">{booking.professionalName}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 bg-card p-3 rounded-md border">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Date convenue</p>
                    <p className="font-semibold text-sm capitalize">
                      {parsedDate.toLocaleDateString("fr-FR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Créneau horaire</p>
                    <p className="font-semibold text-sm">{booking.time}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2 bg-card p-4 rounded-md border">
            <h3 className="font-bold text-sm">Lieu d&apos;intervention</h3>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <p className="font-medium text-sm">{booking.address}</p>
            </div>
          </div>

          {/* Direct Communication Channels */}
          <div className="space-y-3 bg-muted/40 p-4 rounded-lg border">
            <h3 className="font-bold text-sm">Contacter le prestataire pour finaliser les détails</h3>
            <p className="text-xs text-muted-foreground">
              Envoyez vos photos ou une note vocale pour convenir du devis final avant son déplacement.
            </p>
            <ProContactActions
              proName={booking.professionalName}
              phoneNumber={booking.professionalPhone}
              whatsappNumber={booking.professionalWhatsapp}
              serviceTitle={booking.serviceName}
              bookingRef={booking.id}
            />
          </div>

          {/* Price Indicator */}
          <div className="bg-card rounded-lg p-4 border space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm font-semibold">Tarif indicatif de prestation</span>
                <p className="text-xs text-muted-foreground">Règlement direct de gré à gré après l&apos;intervention</p>
              </div>
              <span className="text-2xl font-extrabold text-primary">
                {formatFCFA(booking.price)}
              </span>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Aucune commission prélevée sur le coût des travaux de l&apos;artisan.</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 print:hidden">
            <Button onClick={handlePrint} className="flex-1 gap-2" variant="outline">
              <Printer className="h-4 w-4" />
              Imprimer le billet
            </Button>
            <Button onClick={() => onOpenChange(false)} className="flex-1">
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
