import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, User, ShieldAlert, Users } from "lucide-react"
import { formatFCFA } from "@/lib/formatters"
import {
  formatDurationLabel,
  formatOrganizationBadge,
  isMultiDayDuration,
  toIsoDayKey,
  type DurationUnit,
} from "@/lib/scheduling"
import type { CatalogProfessional, CatalogService } from "@/lib/types/catalog"

interface BookingSummaryProps {
  professional: CatalogProfessional
  service: CatalogService
  selectedDate?: Date
  selectedTime?: string
  durationUnit?: DurationUnit
  durationValue?: number
  endDate?: Date
}

function formatFrenchDate(d: Date): string {
  const key = toIsoDayKey(d)
  if (!key) return ""
  const [y, m, day] = key.split("-").map((n) => parseInt(n, 10))
  return new Date(Date.UTC(y, m - 1, day, 12, 0, 0)).toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })
}

export function BookingSummary({
  professional,
  service,
  selectedDate,
  selectedTime,
  durationUnit = service.durationUnit,
  durationValue = service.durationValue,
  endDate,
}: BookingSummaryProps) {
  const multiDay = isMultiDayDuration(durationValue, durationUnit)

  return (
    <Card className="sticky top-24 border shadow-sm">
      <CardHeader className="border-b">
        <CardTitle className="text-lg">Récapitulatif de rendez-vous</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <span className="font-semibold text-base">{professional.name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {professional.location}
          </div>
          <div className="pt-1">
            <Badge variant="outline" className="text-xs gap-1.5">
              <Users className="h-3 w-3 text-primary" />
              {formatOrganizationBadge(
                professional.organizationType,
                professional.maxConcurrentProjects
              )}
            </Badge>
          </div>
        </div>

        <div className="border-t pt-3">
          <div className="flex justify-between items-start gap-2 mb-1">
            <span className="font-medium text-sm min-w-0">{service.title}</span>
            <Badge variant="outline" className="text-xs shrink-0">
              {service.categoryName}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">{service.description}</p>
        </div>

        <div className="border-t pt-3 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-primary shrink-0" />
            <span>
              Durée prévue :{" "}
              <strong className="text-foreground">
                {formatDurationLabel(durationValue, durationUnit)}
              </strong>
            </span>
          </div>

          {selectedDate && (
            <div className="flex items-start gap-2 text-sm">
              <Calendar className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div className="space-y-0.5">
                <p className="capitalize">{formatFrenchDate(selectedDate)}</p>
                {multiDay && endDate && (
                  <p className="text-xs text-muted-foreground capitalize">
                    au {formatFrenchDate(endDate)}
                  </p>
                )}
              </div>
            </div>
          )}

          {selectedTime && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary shrink-0" />
              <span className="font-medium">{selectedTime}</span>
            </div>
          )}
        </div>

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
