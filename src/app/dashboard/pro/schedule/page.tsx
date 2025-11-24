"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, Clock, MapPin, User, CheckCircle, XCircle, MoreHorizontal } from "lucide-react"
import { bookings, services } from "@/lib/mock-data"
import { Calendar } from "@/components/ui/calendar"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export default function ProSchedulePage() {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const proId = "pro-1"

    // Filter bookings for the selected date (mock logic)
    const selectedDateBookings = bookings
        .filter(b => b.professionalId === proId && b.status === "upcoming")
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return (
        <div className="space-y-8 animate-appear">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Mon Agenda</h1>
                <p className="text-muted-foreground mt-2">
                    Gérez votre emploi du temps et vos rendez-vous.
                </p>
            </div>

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
                            <CardTitle className="text-sm font-medium">Légende</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span>Rendez-vous confirmé</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span>Terminé</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
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
                            {date?.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </h2>
                        <Button asChild>
                            <Link href="/dashboard/pro/availability">Ajouter une indisponibilité</Link>
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {selectedDateBookings.length > 0 ? (
                            selectedDateBookings.map((booking) => {
                                const service = services.find(s => s.id === booking.serviceId)
                                return (
                                    <Card key={booking.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row gap-6">
                                                <div className="flex-shrink-0 flex flex-col items-center justify-center min-w-[80px] border-r pr-6">
                                                    <span className="text-2xl font-bold text-primary">{booking.time}</span>
                                                    <span className="text-sm text-muted-foreground">{service?.duration} min</span>
                                                </div>

                                                <div className="flex-1 space-y-3">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="text-lg font-semibold">{service?.title}</h3>
                                                            <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                                                <User className="h-4 w-4" />
                                                                <span>Client #{booking.userId.split('-')[1]}</span>
                                                            </div>
                                                        </div>
                                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                            Confirmé
                                                        </Badge>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="h-4 w-4" />
                                                            {booking.address}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-foreground">{booking.price} €</span>
                                                            <span>(Payé en ligne)</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col justify-center gap-2 border-l pl-6">
                                                    <Button size="sm" variant="outline" className="w-full justify-start gap-2 text-green-600 hover:text-green-700 hover:bg-green-50">
                                                        <CheckCircle className="h-4 w-4" />
                                                        Terminer
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                                                        <XCircle className="h-4 w-4" />
                                                        Annuler
                                                    </Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button size="sm" variant="ghost" className="w-full">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem>Voir détails client</DropdownMenuItem>
                                                            <DropdownMenuItem>Contacter client</DropdownMenuItem>
                                                            <DropdownMenuItem>Reporter</DropdownMenuItem>
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
        </div>
    )
}
