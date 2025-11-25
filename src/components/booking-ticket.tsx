"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, User, Phone, Mail, Printer, Download } from "lucide-react"

interface Booking {
    id: string
    serviceId: string
    serviceName: string
    professionalId: string
    professionalName: string
    date: Date
    status: "upcoming" | "completed" | "cancelled"
    price: number
    address: string
    time: string
    duration?: number
}

interface BookingTicketProps {
    booking: Booking | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function BookingTicket({ booking, open, onOpenChange }: BookingTicketProps) {
    if (!booking) return null

    const handlePrint = () => {
        window.print()
    }

    const handleDownload = () => {
        // TODO: Implement PDF download
        alert("Fonctionnalité de téléchargement à venir")
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "upcoming": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
            case "completed": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            default: return "bg-gray-100 text-gray-800"
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "upcoming": return "À venir"
            case "completed": return "Terminé"
            case "cancelled": return "Annulé"
            default: return status
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto print:max-w-full backdrop-blur-sm bg-white/70 dark:bg-background/50 border-2 ">
                <DialogHeader className="print:hidden">
                    <DialogTitle>Billet de réservation</DialogTitle>
                </DialogHeader>

                {/* Ticket Content */}
                <div className="space-y-6 print:p-8">
                    {/* Header */}
                    <div className="text-center space-y-2 border-b pb-6">
                        <h1 className="text-3xl font-bold gradient-brand">HomeServices</h1>
                        <p className="text-muted-foreground">Billet de réservation</p>
                        <Badge variant="outline" className={getStatusColor(booking.status)}>
                            {getStatusLabel(booking.status)}
                        </Badge>
                    </div>

                    {/* Booking Reference */}
                    <div className="bg-muted/30 rounded-lg p-6 text-center space-y-2">
                        <p className="text-sm text-muted-foreground">Référence de réservation</p>
                        <p className="text-2xl font-mono font-bold tracking-wider">{booking.id.toUpperCase()}</p>

                        {/* QR Code Placeholder */}
                        <div className="flex justify-center mt-4">
                            <div className="w-32 h-32 bg-white border-2 border-border rounded-lg flex items-center justify-center">
                                <div className="text-xs text-center text-muted-foreground">
                                    QR Code<br />{booking.id}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Service Details */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Détails du service</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Service</p>
                                        <p className="font-medium">{booking.serviceName}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Professionnel</p>
                                        <p className="font-medium">{booking.professionalName}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Date</p>
                                        <p className="font-medium">
                                            {new Date(booking.date).toLocaleDateString('fr-FR', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Heure</p>
                                        <p className="font-medium">{booking.time}</p>
                                        {booking.duration && (
                                            <p className="text-sm text-muted-foreground">
                                                Durée: {booking.duration} min
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t my-6"></div>

                    {/* Location */}
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg">Lieu d&apos;intervention</h3>
                        <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <p className="font-medium">{booking.address}</p>
                        </div>
                    </div>

                    <div className="border-t my-6"></div>

                    {/* Price */}
                    <div className="bg-muted/30 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold">Total</span>
                            <span className="text-2xl font-bold text-[hsl(var(--brand))]">
                                {booking.price}€
                            </span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center text-sm text-muted-foreground pt-4 border-t">
                        <p>Merci d&apos;avoir choisi HomeServices</p>
                        <p className="mt-2">
                            Pour toute question, contactez-nous à support@homeservices.fr
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 print:hidden">
                        <Button onClick={handlePrint} className="flex-1 gap-2">
                            <Printer className="h-4 w-4" />
                            Imprimer
                        </Button>
                        <Button onClick={handleDownload} variant="outline" className="flex-1 gap-2">
                            <Download className="h-4 w-4" />
                            Télécharger PDF
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
