import { formatFCFA } from "@/lib/formatters"
import type { CatalogService } from "@/lib/types/catalog"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle2 } from "lucide-react"
import Link from "next/link"

interface ProServicesListProps {
  proId: string
  services: CatalogService[]
}

export function ProServicesList({ proId, services }: ProServicesListProps) {
  if (!services || services.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed rounded-lg">
        <p className="text-muted-foreground">Aucun service disponible pour le moment.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {services.map((service) => (
        <Card key={service.id} className="flex flex-col h-full pb-0 overflow-hidden">
          <CardHeader>
            <div className="flex justify-between items-start gap-4">
              <CardTitle className="text-lg min-w-0">{service.title}</CardTitle>
              <Badge variant="outline" className="shrink-0">{service.categoryName}</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <p className="text-sm text-muted-foreground">{service.description}</p>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
              <span>Devis gratuit avant intervention</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>Durée estimée : {service.duration} min</span>
            </div>
          </CardContent>
          <CardFooter className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t bg-muted/20 py-4 px-4 sm:px-6">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Tarif indicatif</span>
              <span className="text-xl font-bold text-primary">
                {formatFCFA(service.price)}
              </span>
            </div>
            <Button asChild size="sm">
              <Link href={`/book/${proId}/${service.id}`}>Choisir ce créneau</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
