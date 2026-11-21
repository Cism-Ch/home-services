import Link from "next/link"
import { CheckCircle2, MapPin, Star, Users } from "lucide-react"
import { formatOrganizationBadge } from "@/lib/scheduling"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import type { CatalogProfessional } from "@/lib/types/catalog"

interface ProCardProps {
  pro: CatalogProfessional
  layout?: "grid" | "row"
}

export function ProCard({ pro, layout = "grid" }: ProCardProps) {
  if (layout === "row") {
    return (
      <Card
        data-card-layout="row"
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 group relative overflow-hidden transition-[transform,box-shadow,border-color] duration-300 shadow-sm hover:shadow-xl hover:-translate-y-0.5 bg-card/80 backdrop-blur-sm border-border/50 hover:border-[hsl(var(--brand))]/40"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--brand))]/5 via-transparent to-[hsl(var(--brand-foreground))]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="relative flex items-start sm:items-center gap-4 min-w-0 flex-1">
          <div className="relative shrink-0">
            <Avatar className="h-14 w-14 sm:h-16 sm:w-16 ring-2 ring-background group-hover:ring-[hsl(var(--brand))]/30 transition-[box-shadow,border-color] duration-300 shadow-md">
              <AvatarImage src={pro.avatar || undefined} alt={pro.name} className="object-cover" />
              <AvatarFallback className="bg-[hsl(var(--brand))]/10 text-[hsl(var(--brand))] font-semibold text-lg">
                {pro.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {pro.isVerified && (
              <span
                className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-600 text-white rounded-full border-2 border-background flex items-center justify-center shadow-xs"
                title="Prestataire vérifié KYC"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h3 className="font-bold text-lg leading-tight tracking-tight group-hover:text-[hsl(var(--brand))] transition-colors duration-200 truncate">
                {pro.name}
              </h3>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-[hsl(var(--brand))]" />
                {pro.location}
              </span>
            </div>
            <p className="text-sm font-medium text-foreground/85 truncate">
              {pro.title}
            </p>
            {pro.bio && (
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {pro.bio}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-primary shrink-0" />
                {formatOrganizationBadge(pro.organizationType, pro.maxConcurrentProjects)}
              </span>
              {pro.availablePlacesToday !== undefined && (
                <span className="font-semibold text-foreground tabular-nums">
                  {pro.availablePlacesToday}/{pro.maxConcurrentProjects} dispo aujourd&apos;hui
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="relative flex flex-row md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-border/40 shrink-0">
          <div className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-muted/40 border border-border/40">
            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
            <span className="font-bold text-base text-foreground tabular-nums">
              {pro.rating}
            </span>
            <span className="text-xs text-muted-foreground tabular-nums">
              ({pro.reviewsCount} avis)
            </span>
          </div>

          <Button
            asChild
            className="group-hover:shadow-md transition-[transform,box-shadow,background-color] duration-200 font-semibold"
          >
            <Link href={`/professionals/pros/${pro.id}`}>
              Voir le profil
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card
      data-card-layout="grid"
      className="flex flex-col h-full group relative overflow-hidden transition-[transform,box-shadow,border-color] duration-300 shadow-md hover:shadow-2xl hover:-translate-y-1 bg-card/80 backdrop-blur-sm border-border/50 hover:border-[hsl(var(--brand))]/40"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--brand))]/5 via-transparent to-[hsl(var(--brand-foreground))]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 glow-brand pointer-events-none" />

      <CardHeader className="relative flex flex-row items-center gap-4">
        <div className="relative shrink-0">
          <Avatar className="h-14 w-14 sm:h-16 sm:w-16 ring-2 ring-background group-hover:ring-[hsl(var(--brand))]/30 transition-[box-shadow,border-color] duration-500 shadow-md">
            <AvatarImage src={pro.avatar || undefined} alt={pro.name} className="object-cover" />
            <AvatarFallback className="bg-[hsl(var(--brand))]/10 text-[hsl(var(--brand))] font-semibold text-lg">
              {pro.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {pro.isVerified && (
            <span
              className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-600 text-white rounded-full border-2 border-background flex items-center justify-center shadow-xs"
              title="Prestataire vérifié KYC"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <h3 className="font-bold text-lg leading-tight tracking-tight group-hover:text-[hsl(var(--brand))] transition-colors duration-300 truncate">
            {pro.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 font-medium truncate">
            {pro.title}
          </p>
        </div>
      </CardHeader>

      <CardContent className="relative flex-1">
        <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-muted/30 group-hover:bg-[hsl(var(--brand))]/10 transition-[background-color,border-color] duration-500 border border-transparent group-hover:border-[hsl(var(--brand))]/20">
          <div className="flex items-center gap-1.5">
            <Star className="h-5 w-5 fill-amber-500 text-amber-500 drop-shadow-sm" />
            <span className="font-bold text-lg text-foreground tabular-nums">{pro.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground font-medium">
            <span className="text-foreground font-semibold tabular-nums">{pro.reviewsCount}</span> avis
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground mt-3">
          <span className="inline-flex items-center gap-1.5 min-w-0 truncate">
            <Users className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="truncate">
              {formatOrganizationBadge(pro.organizationType, pro.maxConcurrentProjects)}
            </span>
          </span>
          {pro.availablePlacesToday !== undefined && (
            <span className="font-semibold text-foreground shrink-0 tabular-nums">
              {pro.availablePlacesToday}/{pro.maxConcurrentProjects} dispo
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="relative mt-auto">
        <Button
          asChild
          className="w-full group-hover:shadow-lg transition-[transform,box-shadow,background-color] duration-300 font-semibold"
        >
          <Link href={`/professionals/pros/${pro.id}`}>
            Voir le profil
            <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </Button>
      </CardFooter>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </Card>
  )
}
