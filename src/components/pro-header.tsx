import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CatalogProfessional } from "@/lib/types/catalog"
import { MapPin, Star, Globe, Clock, CheckCircle2, Users } from "lucide-react"
import Link from "next/link"
import { formatOrganizationBadge } from "@/lib/scheduling"
import { ProContactActions } from "@/components/pro-contact-actions"
import { ProLiveStatusBadge } from "@/components/pro-live-status-badge"

interface ProHeaderProps {
  professional: CatalogProfessional
}

export function ProHeader({ professional }: ProHeaderProps) {
  const firstServiceId = professional.services?.[0]?.id || ""

  return (
    <div className="relative">
      {/* Banniere d'en-tete degradee plein cadre */}
      <div className="h-40 sm:h-48 md:h-60 w-full bg-gradient-to-r from-primary/25 via-primary/10 to-secondary/20" />

      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <div className="relative -mt-12 md:-mt-16 flex flex-col lg:flex-row items-start lg:items-end gap-6 pb-6 border-b">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-xl ring-2 ring-primary/20 shrink-0">
            <AvatarImage
              src={professional.avatar || undefined}
              alt={professional.name}
              className="object-cover"
            />
            <AvatarFallback className="text-xl md:text-2xl font-bold bg-primary/10 text-primary">
              {professional.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0 pt-1 lg:pt-0 lg:pb-2 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-2 sm:gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2 min-w-0">
                <span className="truncate">{professional.name}</span>
                {professional.isVerified && (
                  <CheckCircle2
                    className="h-5 w-5 text-primary shrink-0"
                    aria-label="Profil vérifié"
                  />
                )}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="text-sm px-3 py-1 font-medium">
                  {professional.title}
                </Badge>
                <ProLiveStatusBadge
                  proProfileId={professional.id}
                  initialStatus={professional.availabilityStatus}
                />
                <Badge variant="outline" className="gap-1.5 text-xs">
                  <Users className="h-3.5 w-3.5 text-primary shrink-0" />
                  {formatOrganizationBadge(
                    professional.organizationType,
                    professional.maxConcurrentProjects
                  )}
                  {professional.maxConcurrentProjects > 1 &&
                    professional.availablePlacesToday !== undefined && (
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        ({professional.availablePlacesToday}/{professional.maxConcurrentProjects} libres)
                      </span>
                    )}
                </Badge>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>{professional.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500 shrink-0" />
                <span className="font-bold text-foreground">{professional.rating}</span>
                <span>({professional.reviewsCount} avis)</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 shrink-0" />
                <span>{professional.experienceLabel} d&apos;expérience</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4 shrink-0" />
                <span>{professional.languages.join(", ")}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto lg:pb-2 shrink-0">
            {firstServiceId && (
              <Button size="lg" className="shadow-md" asChild>
                <Link href={`/book/${professional.id}/${firstServiceId}`}>
                  Prendre rendez-vous
                </Link>
              </Button>
            )}
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
