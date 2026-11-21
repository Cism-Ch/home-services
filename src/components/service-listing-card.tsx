import { Star, MapPin, Sparkles, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatFCFA } from "@/lib/formatters"
import { formatDurationLabel } from "@/lib/scheduling"
import type { CatalogService } from "@/lib/types/catalog"
import Image from "next/image"
import Link from "next/link"

interface ServiceListingCardProps {
  service: CatalogService
  layout?: "grid" | "row"
}

export function ServiceListingCard({
  service,
  layout = "grid",
}: ServiceListingCardProps) {
  if (layout === "row") {
    return (
      <Card
        data-card-layout="row"
        className="flex flex-col sm:flex-row h-full py-0 gap-0 overflow-hidden transition-[transform,box-shadow,border-color] duration-300 group relative bg-card/65 backdrop-blur-sm border-border/50 shadow-sm hover:shadow-xl hover:border-[hsl(var(--brand))]/35 hover:-translate-y-0.5"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--brand))]/5 via-transparent to-[hsl(var(--brand-foreground))]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />

        {/* Image Container */}
        <div className="relative h-48 sm:h-auto sm:w-60 md:w-72 shrink-0 overflow-hidden">
          <Image
            src={service.image}
            alt={service.title}
            fill
            unoptimized
            className="object-cover transition-[transform,filter] duration-500 group-hover:scale-105 group-hover:brightness-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-55" />
          <Badge className="absolute top-3 left-3 bg-white/95 text-gray-900 hover:bg-white backdrop-blur-md shadow-md font-semibold px-2.5 py-0.5 text-xs">
            {service.categoryName}
          </Badge>
        </div>

        {/* Content & Footer */}
        <div className="flex flex-1 flex-col justify-between min-w-0 relative z-20">
          <div className="px-5 pt-4 pb-3 space-y-2.5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-bold text-lg leading-snug line-clamp-2 group-hover:text-[hsl(var(--brand))] transition-colors duration-200 min-w-0">
                {service.title}
              </h3>
              <div className="flex items-center gap-1 bg-[hsl(var(--brand))]/10 px-2.5 py-1 rounded-full shrink-0">
                <Star className="h-3.5 w-3.5 fill-[hsl(var(--brand))] text-[hsl(var(--brand))]" />
                <span className="text-xs font-bold text-[hsl(var(--brand))] tabular-nums">
                  {service.rating}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 min-w-0">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-[hsl(var(--brand))]" />
                <span className="font-medium truncate">{service.location}</span>
              </span>
              <span className="inline-flex items-center gap-1 shrink-0">
                <Clock className="h-3.5 w-3.5" />
                {formatDurationLabel(service.durationValue, service.durationUnit)}
              </span>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {service.description}
            </p>
          </div>

          <div className="px-5 py-3.5 border-t border-border/40 flex flex-wrap items-center justify-between gap-3 bg-muted/15">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar className="h-8 w-8 ring-2 ring-border/50 shrink-0">
                <AvatarImage
                  src={service.providerAvatar || undefined}
                  className="object-cover"
                />
                <AvatarFallback className="bg-[hsl(var(--brand))]/10 text-[hsl(var(--brand))] font-semibold text-xs">
                  {service.providerName.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-semibold truncate">
                {service.providerName}
              </span>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="flex flex-col items-end">
                <span className="text-[11px] text-muted-foreground font-medium">
                  À partir de
                </span>
                <span className="text-lg font-extrabold bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] bg-clip-text text-transparent tabular-nums">
                  {formatFCFA(service.price)}
                </span>
              </div>
              <Button
                asChild
                className="bg-[hsl(var(--brand))] hover:bg-[hsl(var(--brand))]/90 text-white shadow-md hover:shadow-lg transition-[box-shadow,background-color] duration-200 gap-2 font-semibold"
              >
                <Link href={`/book/${service.proProfileId}/${service.id}`}>
                  <Sparkles className="h-4 w-4" />
                  Réserver
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card
      data-card-layout="grid"
      className="flex flex-col h-full py-0 gap-0 overflow-hidden transition-[transform,box-shadow,border-color] duration-300 group relative bg-card/55 backdrop-blur-sm border-border/50 shadow-md hover:shadow-2xl hover:border-[hsl(var(--brand))]/30 hover:-translate-y-1.5"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--brand))]/5 via-transparent to-[hsl(var(--brand-foreground))]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />

      {/* Glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 glow-brand pointer-events-none" />

      {/* Image Container */}
      <div className="relative h-52 w-full overflow-hidden shrink-0">
        <Image
          src={service.image}
          alt={service.title}
          fill
          unoptimized
          className="object-cover transition-[transform,filter] duration-700 group-hover:scale-105 group-hover:brightness-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

        <Badge className="absolute top-4 right-4 bg-white/95 text-gray-900 hover:bg-white backdrop-blur-md shadow-lg font-semibold px-3 py-1">
          {service.categoryName}
        </Badge>
      </div>

      <CardHeader className="px-5 pt-5 pb-2 relative z-20">
        <div className="flex justify-between items-start gap-3 mb-1">
          <h3 className="font-bold text-lg leading-snug line-clamp-2 group-hover:text-[hsl(var(--brand))] transition-colors duration-300 min-w-0">
            {service.title}
          </h3>
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-[hsl(var(--brand))]/10 to-[hsl(var(--brand-foreground))]/10 px-2.5 py-1 rounded-full shadow-sm shrink-0 group-hover:scale-105 transition-transform duration-300">
            <Star className="h-3.5 w-3.5 fill-[hsl(var(--brand))] text-[hsl(var(--brand))]" />
            <span className="text-xs font-bold text-[hsl(var(--brand))] tabular-nums">
              {service.rating}
            </span>
          </div>
        </div>
        <div className="flex items-center text-muted-foreground text-sm gap-1.5 group-hover:text-foreground transition-colors duration-300 min-w-0">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="font-medium truncate">{service.location}</span>
        </div>
      </CardHeader>

      <CardContent className="px-5 py-3 flex-1 relative z-20 flex flex-col justify-between gap-4">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
          {service.description}
        </p>
        <div className="flex items-center gap-3 pt-3 border-t border-border/50 group-hover:border-[hsl(var(--brand))]/20 transition-colors duration-300 min-w-0">
          <Avatar className="h-9 w-9 ring-2 ring-border/50 group-hover:ring-[hsl(var(--brand))]/30 transition-[box-shadow,border-color] duration-300 shrink-0">
            <AvatarImage
              src={service.providerAvatar || undefined}
              className="object-cover"
            />
            <AvatarFallback className="bg-[hsl(var(--brand))]/10 text-[hsl(var(--brand))] font-semibold">
              {service.providerName.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-semibold group-hover:text-[hsl(var(--brand))] transition-colors duration-300 truncate flex-1 min-w-0">
            {service.providerName}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <Clock className="h-3.5 w-3.5" />
            {formatDurationLabel(service.durationValue, service.durationUnit)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="px-5 pb-5 pt-3 flex flex-wrap items-center justify-between gap-3 relative z-20">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-medium mb-0.5">
            À partir de
          </span>
          <span className="text-xl font-bold bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] bg-clip-text text-transparent tabular-nums">
            {formatFCFA(service.price)}
          </span>
        </div>
        <Button
          asChild
          className="bg-[hsl(var(--brand))] hover:bg-[hsl(var(--brand))]/90 text-white shadow-md hover:shadow-lg transition-[box-shadow,background-color] duration-300 gap-2 font-semibold"
        >
          <Link href={`/book/${service.proProfileId}/${service.id}`}>
            <Sparkles className="h-4 w-4" />
            Réserver
          </Link>
        </Button>
      </CardFooter>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[hsl(var(--brand))] via-[hsl(var(--brand-foreground))] to-[hsl(var(--brand))] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
    </Card>
  )
}
