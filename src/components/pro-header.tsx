import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Professional } from "@/lib/mock-data"
import { MapPin, Star, Globe, Clock, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { ProContactActions } from "@/components/pro-contact-actions"

interface ProHeaderProps {
  professional: Professional
}

export function ProHeader({ professional }: ProHeaderProps) {
  // Premier service pour le lien direct de reservation de creneau
  const firstServiceId = professional.services[0]?.id || ""

  const getStatusBadge = () => {
    switch (professional.availabilityStatus) {
      case "AVAILABLE":
        return (
          <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Disponible aujourd&apos;hui
          </Badge>
        )
      case "BUSY_TODAY":
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200 gap-1.5 border-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Occupé aujourd&apos;hui
          </Badge>
        )
      case "OFFLINE":
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground gap-1.5">
            <span className="w-2 h-2 rounded-full bg-muted-foreground" />
            Hors ligne
          </Badge>
        )
    }
  }

  return (
    <div className="relative mb-8">
      {/* Banniere d'en-tete degradee */}
      <div className="h-48 md:h-64 w-full bg-gradient-to-r from-primary/25 via-primary/10 to-secondary/20 rounded-xl mb-16 md:mb-0" />

      <div className="container mx-auto px-4">
        <div className="relative -top-12 md:-top-16 flex flex-col md:flex-row items-start md:items-end gap-6">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-xl ring-2 ring-primary/20">
            <AvatarImage src={professional.avatar} alt={professional.name} className="object-cover" />
            <AvatarFallback className="text-xl md:text-2xl font-bold bg-primary/10 text-primary">
              {professional.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 pt-2 md:pt-0 md:pb-4 space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
                {professional.name}
                {professional.isVerified && (
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" aria-label="Profil vérifié" />
                )}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="text-sm px-3 py-1 font-medium">
                  {professional.title}
                </Badge>
                {getStatusBadge()}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{professional.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                <span className="font-bold text-foreground">{professional.rating}</span>
                <span>({professional.reviewsCount} avis)</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{professional.experience} d&apos;expérience</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                <span>{professional.languages.join(", ")}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto md:pb-4">
            <Button size="lg" className="shadow-md" asChild>
              <Link href={`/book/${professional.id}/${firstServiceId}`}>
                Prendre rendez-vous
              </Link>
            </Button>
            <ProContactActions
              proName={professional.name}
              phoneNumber={professional.phoneNumber}
              whatsappNumber={professional.whatsappNumber}
              size="lg"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
