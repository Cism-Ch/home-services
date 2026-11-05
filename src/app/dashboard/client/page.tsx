import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { bookings, services, professionals, formatFCFA } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ClientFollowUpCard, type ActiveTaskItem } from "@/components/dashboard/client-follow-up-card"

export default function ClientDashboardPage() {
  const userId = "user-1"
  const enrichedBookings = bookings
    .filter((b) => b.userId === userId)
    .map((booking) => {
      const service = services.find((s) => s.id === booking.serviceId)
      const professional = professionals.find((p) => p.id === booking.professionalId)
      return { ...booking, service, professional }
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  // Tâches actives en cours de traitement pour le suivi interactif
  const inProgressTasks: ActiveTaskItem[] = enrichedBookings
    .filter((b) => b.status === "in_progress")
    .map((b) => ({
      id: b.id,
      serviceName: b.service?.title || "Prestation",
      proName: b.professional?.name || "Artisan",
      proId: b.professionalId,
      bookingDate: b.date,
      timeSlot: b.time,
      indicativePrice: b.price,
    }))

  const negotiatingBookings = enrichedBookings.filter((b) => b.status === "negotiating")
  const activeBookings = enrichedBookings.filter(
    (b) => b.status === "negotiating" || b.status === "in_progress" || b.status === "upcoming"
  )

  const totalEstimatedFCFA = enrichedBookings.reduce((acc, curr) => acc + curr.price, 0)

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
            En cours
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white">
            Finalisé
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
        <h1 className="text-3xl font-bold tracking-tight">Bonjour, Jean !</h1>
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
            <div className="text-2xl font-bold">{activeBookings.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Dont {negotiatingBookings.length} en cours de négociation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missions totales</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrichedBookings.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Historique complet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget estimé (FCFA)</CardTitle>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatFCFA(totalEstimatedFCFA)}</div>
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
            <CardContent className="py-8 text-center text-muted-foreground">
              Aucun rendez-vous actif pour le moment.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {activeBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                      {booking.date.getDate()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{booking.service?.title}</h3>
                        {getStatusBadge(booking.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Prestataire : <strong className="text-foreground">{booking.professional?.name}</strong>
                      </p>
                      <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {booking.date.toLocaleDateString("fr-FR", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {booking.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {booking.address}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    <div className="text-right sm:mr-3">
                      <span className="text-lg font-bold text-foreground">
                        {formatFCFA(booking.price)}
                      </span>
                      <p className="text-[11px] text-muted-foreground">Paiement direct</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/dashboard/client/bookings">Détails</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
