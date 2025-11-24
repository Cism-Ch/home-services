import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { bookings, services, professionals } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ClientDashboardPage() {
    // Enrich bookings with service and professional data
    const enrichedBookings = bookings.map(booking => {
        const service = services.find(s => s.id === booking.serviceId)
        const professional = professionals.find(p => p.id === booking.professionalId)
        return { ...booking, service, professional }
    }).sort((a, b) => a.date.getTime() - b.date.getTime())

    const upcomingBookings = enrichedBookings.filter(b => b.status === "upcoming")
    const pastBookings = enrichedBookings.filter(b => b.status !== "upcoming")

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Bonjour, Jean ! 👋</h1>
                <p className="text-muted-foreground">Voici un aperçu de vos activités.</p>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Réservations à venir</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{upcomingBookings.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total réservations</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{bookings.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Dépenses ce mois</CardTitle>
                        <div className="h-4 w-4 text-muted-foreground">€</div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {bookings.reduce((acc, curr) => acc + curr.price, 0)}€
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Upcoming Bookings */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Prochains rendez-vous</h2>
                {upcomingBookings.length === 0 ? (
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            Aucun rendez-vous à venir.
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {upcomingBookings.map((booking) => (
                            <Card key={booking.id}>
                                <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                            {booking.date.getDate()}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">{booking.service?.title}</h3>
                                            <p className="text-muted-foreground">avec {booking.professional?.name}</p>
                                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    {booking.date.toLocaleDateString('fr-FR', { weekday: 'long', month: 'long' })}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    {booking.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-4 w-4" />
                                                    {booking.professional?.location}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 w-full md:w-auto">
                                        <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-0">
                                            Confirmé
                                        </Badge>
                                        <Button variant="outline" size="sm">Modifier</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Past Bookings (Simplified) */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Historique</h2>
                <div className="rounded-md border">
                    <div className="grid grid-cols-4 p-4 font-medium border-b bg-muted/50 text-sm">
                        <div>Service</div>
                        <div>Professionnel</div>
                        <div>Date</div>
                        <div className="text-right">Prix</div>
                    </div>
                    {pastBookings.map((booking) => (
                        <div key={booking.id} className="grid grid-cols-4 p-4 items-center text-sm border-b last:border-0 hover:bg-muted/5">
                            <div className="font-medium">{booking.service?.title}</div>
                            <div className="text-muted-foreground">{booking.professional?.name}</div>
                            <div className="text-muted-foreground">{booking.date.toLocaleDateString('fr-FR')}</div>
                            <div className="text-right font-medium">{booking.price}€</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
