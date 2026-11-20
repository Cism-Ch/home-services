"use client"

import Link from "next/link"
import Image from "next/image"
import { useSyncExternalStore } from "react"
import { useTheme } from "next-themes"
import { ArrowRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mockup, MockupFrame } from "@/components/marketing/mockup"
import { Glow } from "@/components/marketing/glow"
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
  image?: {
    light: string
    dark: string
    alt: string
  }
  children?: React.ReactNode
}

export function HeroSection({
  badge,
  title,
  description,
  actions,
  image,
  children,
}: HeroProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
  const { resolvedTheme } = useTheme()

  const imageSrc =
    mounted && image
      ? resolvedTheme === "light"
        ? image.light
        : image.dark
      : image?.light || ""

  return (
    <section
      className={cn(
        "w-full bg-background text-foreground",
        "pt-10 pb-12 sm:pt-16 sm:pb-16 md:pt-24 md:pb-20",
        "overflow-hidden"
      )}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10 pt-4 sm:pt-8 sm:gap-14">
        <div className="flex flex-col items-center gap-6 text-center sm:gap-10">
          {badge && (
            <Badge variant="outline" className="animate-appear gap-2 max-w-full flex-wrap justify-center py-1 px-3">
              <span className="text-muted-foreground">{badge.text}</span>
              <Link href={badge.action.href} className="flex items-center gap-1 font-semibold">
                {badge.action.text}
                <ArrowRightIcon className="h-3 w-3" />
              </Link>
            </Badge>
          )}

          {typeof title === "string" ? (
            <h1 className="relative z-10 inline-block animate-appear text-3xl font-semibold leading-tight text-foreground drop-shadow-2xl sm:text-5xl md:text-7xl">
              {title}
            </h1>
          ) : (
            <div className="relative z-10 w-full animate-appear">{title}</div>
          )}

          <p className="relative z-10 max-w-[560px] animate-appear text-base font-medium text-muted-foreground sm:text-xl">
            {description}
          </p>

          <div className="relative z-10 flex w-full sm:w-auto flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 animate-appear">
            {actions.map((action, index) => (
              <Button key={index} variant={action.variant} size="lg" asChild>
                <Link href={action.href} className="flex items-center justify-center gap-2">
                  {action.icon}
                  {action.text}
                </Link>
              </Button>
            ))}
          </div>

          <div className="relative pt-6 sm:pt-10 w-full">
            {children ? (
              <div className="animate-appear w-full">{children}</div>
            ) : (
              image && (
                <MockupFrame className="animate-appear" size="small">
                  <Mockup type="responsive">
                    <Image
                      src={imageSrc}
                      alt={image.alt}
                      width={1248}
                      height={765}
                      priority
                    />
                  </Mockup>
                </MockupFrame>
              )
            )}
            <Glow variant="top" className="animate-appear-zoom" />
          </div>
        </div>
      </div>
    </section>
  )
}
