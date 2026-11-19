import Link from "next/link"
import { CheckCircle2, Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import type { CatalogProfessional } from "@/lib/types/catalog"

interface ProCardProps {
  pro: CatalogProfessional
}

export function ProCard({ pro }: ProCardProps) {
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 shadow-md hover:shadow-2xl hover:-translate-y-1 bg-card/80 backdrop-blur-sm border-border/50 hover:border-[hsl(var(--brand))]/40 animate-appear">
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--brand))]/5 via-transparent to-[hsl(var(--brand-foreground))]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 glow-brand pointer-events-none" />

      <CardHeader className="relative flex flex-row items-center gap-4 pb-4">
        <div className="relative shrink-0">
          <Avatar className="h-14 w-14 sm:h-16 sm:w-16 ring-2 ring-background group-hover:ring-[hsl(var(--brand))]/30 transition-all duration-500 shadow-md">
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

      <CardContent className="relative pt-0">
        <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-muted/30 group-hover:bg-[hsl(var(--brand))]/10 transition-all duration-500 border border-transparent group-hover:border-[hsl(var(--brand))]/20">
          <div className="flex items-center gap-1.5">
            <Star className="h-5 w-5 fill-amber-500 text-amber-500 drop-shadow-sm" />
            <span className="font-bold text-lg text-foreground">{pro.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground font-medium">
            <span className="text-foreground font-semibold">{pro.reviewsCount}</span> avis
          </span>
        </div>
      </CardContent>

      <CardFooter className="relative">
        <Button
          asChild
          className="w-full group-hover:shadow-lg transition-all duration-300 font-semibold"
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
