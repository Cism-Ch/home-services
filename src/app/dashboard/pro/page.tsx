import Link from "next/link"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, DollarSign, Star, Clock, MapPin, User, Briefcase } from "lucide-react"
import { ProLiveStatusBanner } from "@/components/dashboard/pro-live-status-banner"
import { requireRole } from "@/server/auth-guard"
import { getProDashboardData } from "@/server/queries/dashboard"
import { formatFCFA } from "@/lib/formatters"

export const dynamic = "force-dynamic"

function getStatusBadge(status: string) {
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
          En traitement
        </Badge>
      )
    default:
      return <Badge variant="outline">Confirmé</Badge>
  }
}

export default async function ProDashboardPage() {
  const { user } = await requireRole(["pro", "admin"])
  const data = await getProDashboardData(user.id)

  if (!data) {
    redirect("/dashboard/pro/profile")
  }

  const { proProfile, activeBookings, stats: dbStats } = data
  const hasInProgress = activeBookings.some((b) => b.status === "IN_PROGRESS")

  const stats = [
    {
      title: "Volume négocié estimé",
      value: formatFCFA(dbStats.negotiatedVolumeFCFA),
      subtext: `${dbStats.completedTasks} mission(s) clôturée(s)`,
      icon: DollarSign,
    },
    {
      title: "Rendez-vous actifs",
      value: dbStats.activeBookingsCount.toString(),
      subtext: "En négociation ou en traitement",
      icon: Calendar,
    },
    {
      title: "Note moyenne",
      value: dbStats.averageRating,
      subtext: `${proProfile.reviewsCount} avis clients`,
      icon: Star,
    },
  ]

  return (
    <div className="space-y-8 animate-appear">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Tableau de bord Prestataire
        </h1>
        <p className="text-muted-foreground mt-2">
          Bienvenue {proProfile.userName}, voici vos opportunités et votre disponibilité locale.
        </p>
      </div>

      {/* Pro Live Availability Banner */}
      <ProLiveStatusBanner
        proId={proProfile.id}
        initialStatus={proProfile.availabilityStatus}
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
              <p className="text-xs text-muted-foreground mt-1">{stat.subtext}</p>
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
              activeBookings.slice(0, 3).map((booking) => (
                <Card
                  key={booking.id}
                  className="overflow-hidden border-l-4 border-l-primary"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{booking.serviceTitle}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <User className="h-3 w-3 mr-1" />
                          {booking.clientName}
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="font-medium text-primary">
                          {new Date(booking.bookingDate).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                          })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {booking.timeSlot}
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3 pt-3 border-t border-border/50">
                      <div className="flex items-center gap-1 text-xs">
                        <Clock className="h-3 w-3" />
                        {booking.timeSlot}
                      </div>
                      <div className="flex items-center gap-1 text-xs truncate max-w-[160px]">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {booking.clientAddress}
                      </div>
                      <div className="ml-auto font-bold text-foreground text-sm">
                        {formatFCFA(booking.indicativePrice)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
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
                    <p className="text-sm text-muted-foreground">
                      Consulter et valider les créneaux négociés
                    </p>
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
                    <p className="text-sm text-muted-foreground">
                      Tarifs indicatifs et descriptifs de prestations
                    </p>
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
                    <p className="text-sm text-muted-foreground">
                      Coordonnées directes et documents d&apos;activité
                    </p>
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
