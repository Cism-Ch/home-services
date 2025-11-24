"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookingTicket } from "@/components/booking-ticket"
import { bookings, services, professionals } from "@/lib/mock-data"
import { Calendar, Clock, MapPin, User, MoreVertical } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ClientBookingsPage() {
    const [activeTab, setActiveTab] = useState("upcoming")
    const [selectedBooking, setSelectedBooking] = useState<any>(null)
    const [ticketOpen, setTicketOpen] = useState(false)
    const userId = "user-1"

    const userBookings = bookings
        .filter(b => b.userId === userId)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    const upcomingBookings = userBookings.filter(b => b.status === "upcoming")
    const completedBookings = userBookings.filter(b => b.status === "completed")
    const cancelledBookings = userBookings.filter(b => b.status === "cancelled")

    const handleViewTicket = (booking: any) => {
        const service = services.find(s => s.id === booking.serviceId)
        const pro = professionals.find(p => p.id === booking.professionalId)

        setSelectedBooking({
            ...booking,
            serviceName: service?.title || "Service inconnu",
            professionalName: pro?.name || "Professionnel inconnu",
            duration: service?.duration
        })
        setTicketOpen(true)
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

    const BookingList = ({ items }: { items: typeof bookings }) => {
        if (items.length === 0) {
            return (
                <div className="text-center py-12">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">Aucune réservation</h3>
                    <p className="text-muted-foreground">Vous n&apos;avez pas de réservation dans cette catégorie.</p>
                </div>
            )
        }

        return (
            <div className="space-y-4">
                {items.map((booking) => {
                    const service = services.find(s => s.id === booking.serviceId)
                    const pro = professionals.find(p => p.id === booking.professionalId)

                    return (
                        <Card key={booking.id} className="overflow-hidden">
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row">
                                    <div className="p-6 flex-1">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge variant="outline" className={getStatusColor(booking.status)}>
                                                        {getStatusLabel(booking.status)}
                                                    </Badge>
                                                    <span className="text-sm text-muted-foreground">
                                                        #{booking.id}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-semibold">{service?.title}</h3>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                                                    {booking.status === "upcoming" && (
                                                        <>
                                                            <DropdownMenuItem>Modifier</DropdownMenuItem>
                                                            <DropdownMenuItem className="text-destructive">Annuler</DropdownMenuItem>
                                                        </>
                                                    )}
                                                    {booking.status === "completed" && (
                                                        <DropdownMenuItem>Laisser un avis</DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <User className="h-4 w-4" />
                                                <span>{pro?.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Calendar className="h-4 w-4" />
                                                <span>{new Date(booking.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Clock className="h-4 w-4" />
                                                <span>{booking.time} ({service?.duration} min)</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <MapPin className="h-4 w-4" />
                                                <span>{booking.address}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-muted/30 p-6 flex flex-col justify-center items-center md:items-end border-t md:border-t-0 md:border-l min-w-[200px]">
                                        <div className="text-2xl font-bold mb-1">{booking.price} €</div>
                                        <div className="text-sm text-muted-foreground mb-4">Payé en ligne</div>
                                        {booking.status === "upcoming" && (
                                            <Button
                                                className="w-full md:w-auto"
                                                onClick={() => handleViewTicket(booking)}
                                            >
                                                Voir le billet
                                            </Button>
                                        )}
                                        {booking.status === "completed" && (
                                            <Button variant="outline" className="w-full md:w-auto">Facture</Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        )
    }

    return (
        <>
            <div className="space-y-8 animate-appear">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mes réservations</h1>
                    <p className="text-muted-foreground mt-2">
                        Gérez vos rendez-vous passés et à venir.
                    </p>
                </div>

                <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                        <TabsTrigger value="upcoming">À venir ({upcomingBookings.length})</TabsTrigger>
                        <TabsTrigger value="completed">Terminés ({completedBookings.length})</TabsTrigger>
                        <TabsTrigger value="cancelled">Annulés ({cancelledBookings.length})</TabsTrigger>
                    </TabsList>
                    <div className="mt-6">
                        <TabsContent value="upcoming">
                            <BookingList items={upcomingBookings} />
                        </TabsContent>
                        <TabsContent value="completed">
                            <BookingList items={completedBookings} />
                        </TabsContent>
                        <TabsContent value="cancelled">
                            <BookingList items={cancelledBookings} />
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
