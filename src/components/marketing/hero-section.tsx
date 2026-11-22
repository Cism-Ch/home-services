import Link from "next/link"
import { ArrowRightIcon, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Glow } from "@/components/marketing/glow"
import { HeroShaderBackground } from "@/components/marketing/hero-shader-background"
import { cn } from "@/lib/utils"

interface HeroAction {
  text: string
  href: string
  icon?: React.ReactNode
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

interface HeroProps {
  badge?: {
    text: string
    action: {
      text: string
      href: string
    }
  }
  title: React.ReactNode
  description: string
  actions: HeroAction[]
  scrollTargetHref?: string
  scrollTargetLabel?: string
  children?: React.ReactNode
}

/**
 * Section Hero Cover plein ecran rendue cote serveur (RSC) sans animation initiale
 * bloquante sur le LCP, avec lueur radiale contenue et ancre de defilement.
 */
export function HeroSection({
  badge,
  title,
  description,
  actions,
  scrollTargetHref,
  scrollTargetLabel,
  children,
}: HeroProps) {
  return (
    <section
      data-hero-cover="true"
      className={cn(
        "relative isolate flex min-h-[calc(100svh-4rem)] w-full flex-col justify-center overflow-hidden",
        "bg-background text-foreground py-8 sm:py-10 lg:py-12"
      )}
    >
      {/* Fond anime ShaderGradient 3D avec secours WebGL */}
      <HeroShaderBackground />

      {/* Lueur contenue dans le hero pour eviter toute coupure nette avant la section suivante */}
      <Glow variant="top" />

      {/* Trame architecturale legere adoucie sur les bords sans flou GPU */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800f_1px,transparent_1px),linear-gradient(to_bottom,#8080800f_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_75%_60%_at_50%_28%,#000_20%,transparent_80%)]"
      />

      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 flex flex-col items-center gap-6 sm:gap-8 lg:gap-9">
        <div className="flex flex-col items-center gap-4 sm:gap-5 text-center w-full">
          {badge && (
            <Badge
              variant="outline"
              className="gap-2 max-w-full flex-wrap justify-center py-1 px-3 bg-background/70 backdrop-blur-sm"
            >
              <span className="text-muted-foreground">{badge.text}</span>
              <Link
                href={badge.action.href}
                className="flex items-center gap-1 font-semibold text-foreground hover:text-[hsl(var(--brand))] transition-colors"
              >
                {badge.action.text}
                <ArrowRightIcon className="h-3 w-3" />
              </Link>
            </Badge>
          )}

          {typeof title === "string" ? (
            <h1 className="relative z-10 inline-block text-3xl font-semibold leading-tight text-foreground drop-shadow-2xl sm:text-5xl md:text-7xl">
              {title}
            </h1>
          ) : (
            <div className="relative z-10 w-full">{title}</div>
          )}

          <p className="relative z-10 max-w-2xl text-base font-medium text-muted-foreground leading-relaxed sm:text-lg md:text-xl">
            {description}
          </p>

          <div className="relative z-10 flex w-full sm:w-auto flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-1">
            {actions.map((action, index) => (
              <Button key={index} variant={action.variant} size="lg" asChild>
                <Link href={action.href} className="flex items-center justify-center gap-2">
                  {action.icon}
                  {action.text}
                </Link>
              </Button>
            ))}
          </div>
        </div>

        {children && <div className="relative z-10 w-full pt-2 sm:pt-4">{children}</div>}

        {scrollTargetHref && (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden lg:inline-flex items-center gap-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-[hsl(var(--brand))] hover:bg-[hsl(var(--brand))]/10"
          >
            <a href={scrollTargetHref}>
              <span>{scrollTargetLabel || "Découvrir"}</span>
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </a>
          </Button>
        )}
      </div>
    </section>
  )
}
