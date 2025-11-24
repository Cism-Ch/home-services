import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, DollarSign, Star, TrendingUp, Clock, MapPin, User, Briefcase } from "lucide-react"
import Link from "next/link"
import { bookings, services } from "@/lib/mock-data"

export default function ProDashboardPage() {
    // Mock data for the pro dashboard
    const proId = "pro-1"
    const upcomingBookings = bookings
        .filter(b => b.professionalId === proId && b.status === 'upcoming')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3)

    const stats = [
        {
            title: "Revenus ce mois",
            value: "2 450 €",
            change: "+12%",
            icon: DollarSign,
            trend: "up"
        },
        {
            title: "Réservations",
            value: "24",
            change: "+4",
            icon: Calendar,
            trend: "up"
        },
        {
            title: "Note moyenne",
            value: "4.9",
            change: "0.0",
            icon: Star,
            trend: "neutral"
        }
    ]

    return (
        <div className="space-y-8 animate-appear">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
                <p className="text-muted-foreground mt-2">
                    Bienvenue, voici un aperçu de votre activité.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-3">
                {stats.map((stat, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground flex items-center mt-1">
                                {stat.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500 mr-1" />}
                                <span className={stat.trend === 'up' ? 'text-green-500' : ''}>
                                    {stat.change}
                                </span>
                                <span className="ml-1">par rapport au mois dernier</span>
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Upcoming Schedule */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Prochains rendez-vous</h2>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/dashboard/pro/schedule">Voir tout</Link>
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {upcomingBookings.length > 0 ? (
                            upcomingBookings.map((booking) => {
                                const service = services.find(s => s.id === booking.serviceId)
                                return (
                                    <Card key={booking.id} className="overflow-hidden border-l-4 border-l-primary">
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-semibold">{service?.title}</h3>
                                                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                                                        <User className="h-3 w-3 mr-1" />
                                                        Client #{booking.userId.split('-')[1]}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-medium text-primary">
                                                        {new Date(booking.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {booking.time}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3 pt-3 border-t border-border/50">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {service?.duration} min
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {booking.address}
                                                </div>
                                                <div className="ml-auto font-medium text-foreground">
                                                    {service?.price} €
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })
                        ) : (
                            <Card className="bg-muted/50 border-dashed">
                                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                                    <Calendar className="h-8 w-8 text-muted-foreground mb-3" />
                                    <p className="font-medium">Aucun rendez-vous à venir</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Votre agenda est vide pour le moment.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Actions rapides</h2>
                    <div className="grid gap-4">
                        <Link href="/dashboard/pro/availability">
                            <Card className="hover:bg-accent/50 transition-colors cursor-pointer group">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Calendar className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Mettre à jour mes disponibilités</h3>
                                        <p className="text-sm text-muted-foreground">Gérer vos créneaux horaires</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/dashboard/pro/services">
                            <Card className="hover:bg-accent/50 transition-colors cursor-pointer group">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Briefcase className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Gérer mes services</h3>
                                        <p className="text-sm text-muted-foreground">Ajouter ou modifier vos prestations</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/dashboard/pro/profile">
                            <Card className="hover:bg-accent/50 transition-colors cursor-pointer group">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <User className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Éditer mon profil</h3>
                                        <p className="text-sm text-muted-foreground">Mettre à jour vos informations</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
