import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, DollarSign, Star, TrendingUp, Clock, MapPin, User, Briefcase } from "lucide-react"
import Link from "next/link"
import { bookings, services, formatFCFA } from "@/lib/mock-data"
import { ProLiveStatusBanner } from "@/components/dashboard/pro-live-status-banner"
import { Badge } from "@/components/ui/badge"

export default function ProDashboardPage() {
  const proId = "pro-1"
  const activeBookings = bookings
    .filter((b) => b.professionalId === proId && (b.status === "negotiating" || b.status === "in_progress" || b.status === "upcoming"))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)

  const hasInProgress = bookings.some((b) => b.professionalId === proId && b.status === "in_progress")

  const stats = [
    {
      title: "Volume négocié estimé",
      value: "1 250 000 FCFA",
      change: "+15%",
      icon: DollarSign,
      trend: "up",
    },
    {
      title: "Rendez-vous actifs",
      value: activeBookings.length.toString(),
      change: "+3",
      icon: Calendar,
      trend: "up",
    },
    {
      title: "Note moyenne",
      value: "4.8",
      change: "0.0",
      icon: Star,
      trend: "neutral",
    },
  ]

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
            En traitement
          </Badge>
        )
      default:
        return <Badge variant="outline">Confirmé</Badge>
    }
  }

  return (
    <div className="space-y-8 animate-appear">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord Prestataire</h1>
        <p className="text-muted-foreground mt-2">
          Bienvenue, voici un aperçu de vos opportunités et de votre disponibilité locale.
        </p>
      </div>

      {/* Pro Live Availability Banner */}
      <ProLiveStatusBanner
        proId={proId}
        hasActiveMission={hasInProgress}
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                {stat.trend === "up" && <TrendingUp className="h-3 w-3 text-emerald-600 mr-1" />}
                <span className={stat.trend === "up" ? "text-emerald-600 font-medium" : ""}>
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
            <h2 className="text-xl font-semibold">Missions & créneaux du moment</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/pro/schedule">Voir tout</Link>
            </Button>
          </div>

          <div className="space-y-4">
            {activeBookings.length > 0 ? (
              activeBookings.map((booking) => {
                const service = services.find((s) => s.id === booking.serviceId)
                return (
                  <Card key={booking.id} className="overflow-hidden border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{service?.title}</h3>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <User className="h-3 w-3 mr-1" />
                            Client #{booking.userId.split("-")[1] || "1"}
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="font-medium text-primary">
                            {new Date(booking.date).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                            })}
                          </div>
                          <div className="text-xs text-muted-foreground">{booking.time}</div>
                          {getStatusBadge(booking.status)}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3 pt-3 border-t border-border/50">
                        <div className="flex items-center gap-1 text-xs">
                          <Clock className="h-3 w-3" />
                          {service?.duration || 60} min
                        </div>
                        <div className="flex items-center gap-1 text-xs truncate max-w-[160px]">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {booking.address}
                        </div>
                        <div className="ml-auto font-bold text-foreground text-sm">
                          {formatFCFA(booking.price)}
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
                  <p className="font-medium">Aucun rendez-vous actif</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Votre agenda est disponible pour accepter de nouvelles demandes.
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
            <Link href="/dashboard/pro/schedule">
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer group">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Mon Agenda & Offres</h3>
                    <p className="text-sm text-muted-foreground">Consulter et valider les créneaux négociés</p>
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
                    <h3 className="font-semibold">Gérer mes services en FCFA</h3>
                    <p className="text-sm text-muted-foreground">Tarifs indicatifs et descriptifs de prestations</p>
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
                    <h3 className="font-semibold">Profil artisan & WhatsApp</h3>
                    <p className="text-sm text-muted-foreground">Coordonnées directes et documents d&apos;activité</p>
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
