import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, ShieldCheck } from "lucide-react"
import { ClientFollowUpCard, type ActiveTaskItem } from "@/components/dashboard/client-follow-up-card"
import { requireSession } from "@/server/auth-guard"
import { getClientDashboardData } from "@/server/queries/dashboard"
import { formatFCFA } from "@/lib/formatters"

export const dynamic = "force-dynamic"

function getStatusBadge(status: string) {
  switch (status) {
    case "NEGOTIATING":
      return <Badge variant="warning">En négociation</Badge>
    case "IN_PROGRESS":
      return <Badge variant="info">En cours</Badge>
    case "COMPLETED":
      return <Badge variant="success">Finalisé</Badge>
    case "CANCELLED":
      return <Badge variant="destructive">Annulé</Badge>
    default:
      return <Badge variant="outline">Confirmé</Badge>
  }
}

export default async function ClientDashboardPage() {
  const { user } = await requireSession()
  const { activeBookings, inProgressBookings, stats } =
    await getClientDashboardData(user.id)

  const inProgressTasks: ActiveTaskItem[] = inProgressBookings.map((b) => ({
    id: b.id,
    serviceName: b.serviceTitle,
    proName: b.proName,
    proId: b.proUserId,
    bookingDate: b.bookingDate,
    timeSlot: b.timeSlot,
    indicativePrice: b.indicativePrice,
  }))

  const firstName = user.name.split(" ")[0] || user.name

  return (
    <div className="space-y-8 animate-appear">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Bonjour, {firstName} !</h1>
        <p className="text-muted-foreground mt-1">
          Suivez vos demandes d&apos;intervention et vos échanges avec les artisans locaux.
        </p>
      </div>

      {/* Notification de suivi interactif des tâches en cours */}
      <ClientFollowUpCard tasks={inProgressTasks} />

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demandes actives</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Dont {stats.negotiatingCount} en cours de négociation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missions totales</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Historique complet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget estimé (FCFA)</CardTitle>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatFCFA(stats.totalEstimatedFCFA)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Règlement direct de gré à gré après service
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Bookings List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Vos rendez-vous récents</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/client/bookings">Gérer mes réservations</Link>
          </Button>
        </div>

        {activeBookings.length === 0 ? (
          <Card>
            <CardContent className="py-4 text-center space-y-3">
              <p className="text-muted-foreground">
                Aucun rendez-vous actif pour le moment.
              </p>
              <Button asChild size="sm">
                <Link href="/services">Explorer les services</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {activeBookings.map((booking) => {
              const dateObj = new Date(booking.bookingDate)
              return (
                <Card key={booking.id} className="py-0 hover:shadow-sm transition-shadow">
                  <CardContent className="p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                        {dateObj.getDate()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-semibold text-base sm:text-lg">{booking.serviceTitle}</h3>
                          {getStatusBadge(booking.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Prestataire :{" "}
                          <strong className="text-foreground">{booking.proName}</strong>
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 shrink-0" />
                            {dateObj.toLocaleDateString("fr-FR", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 shrink-0" />
                            {booking.timeSlot}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            {booking.clientAddress}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto pt-3 border-t md:border-t-0 md:pt-0 shrink-0">
                      <div className="md:text-right sm:mr-2">
                        <span className="text-lg font-bold text-foreground">
                          {formatFCFA(booking.indicativePrice)}
                        </span>
                        <p className="text-[11px] text-muted-foreground">Paiement direct</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/dashboard/client/bookings">Détails</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
