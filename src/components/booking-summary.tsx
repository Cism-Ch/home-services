import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, User, ShieldAlert } from "lucide-react"
import { Professional, Service, formatFCFA } from "@/lib/mock-data"

interface BookingSummaryProps {
  professional: Professional
  service: Service
  selectedDate?: Date
  selectedTime?: string
}

export function BookingSummary({
  professional,
  service,
  selectedDate,
  selectedTime,
}: BookingSummaryProps) {
  return (
    <Card className="sticky top-24 border shadow-sm">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-lg">Récapitulatif de rendez-vous</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <User className="h-4 w-4 text-primary" />
            <span className="font-semibold text-base">{professional.name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {professional.location}
          </div>
        </div>

        <div className="border-t pt-3">
          <div className="flex justify-between items-start mb-1">
            <span className="font-medium text-sm">{service.title}</span>
            <Badge variant="outline" className="text-xs">{service.category}</Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">{service.description}</p>
        </div>

        {selectedDate && (
          <div className="border-t pt-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="capitalize">
                {selectedDate.toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        )}

        {selectedTime && (
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-primary" />
            <span className="font-medium">{selectedTime}</span>
          </div>
        )}

        <div className="border-t pt-4 space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-muted-foreground">Tarif indicatif</span>
            <span className="text-2xl font-extrabold text-primary">
              {formatFCFA(service.price)}
            </span>
          </div>

          <div className="rounded-md bg-muted/60 p-3 text-xs text-muted-foreground space-y-1 border">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <ShieldAlert className="h-3.5 w-3.5 text-primary" />
              Paiement hors-plateforme
            </div>
            <p>
              La plateforme facilite uniquement la prise de rendez-vous et la négociation. Le règlement s&apos;effectue directement de la main à la main avec le prestataire après prestation.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
