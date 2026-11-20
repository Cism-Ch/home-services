"use client"

import * as React from "react"
import { AnimatePresence, m, useReducedMotion } from "framer-motion"
import { EASE_OUT_EXPO } from "@/lib/motion"
import { cn } from "@/lib/utils"

const SLOGANS = [
  "Trouver le professionnel qu'il vous faut.",
  "Trouver des prestataires de services locaux et inversement.",
  "Trouver les prestataires de services qu'il vous faut.",
  "Trouver les clients qu'il vous faut.",
] as const

const SLOGAN_TEXT_CLASS =
  "block w-full text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-center px-2 py-1.5 leading-[1.12]"

/**
 * Titre dynamique du Hero verrouille en hauteur via une grille CSS ghost-stack :
 * tous les slogans partagent la meme cellule afin de garantir un decalage CLS de 0px.
 */
export function HeroSloganRotator({ className }: { className?: string }) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const prefersReducedMotion = useReducedMotion()
  const activeIndex = prefersReducedMotion ? 0 : currentIndex

  React.useEffect(() => {
    if (prefersReducedMotion) return

    let timer: ReturnType<typeof setInterval> | null = null

    const start = () => {
      if (timer || document.hidden) return
      timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % SLOGANS.length)
      }, 3800)
    }

    const stop = () => {
      if (timer) {
        clearInterval(timer)
        timer = null
      }
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stop()
      } else {
        start()
      }
    }

    start()
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      stop()
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [prefersReducedMotion])

  return (
    <div
      data-hero-slogan-box="true"
      className={cn(
        "relative grid w-full max-w-4xl mx-auto place-items-center overflow-hidden",
        className
      )}
    >
      {/* Empilement invisible pour dimensionner automatiquement la hauteur maximale */}
      {SLOGANS.map((slogan, index) => (
        <span
          key={index}
          aria-hidden="true"
          className={cn(
            "invisible col-start-1 row-start-1 select-none pointer-events-none",
            SLOGAN_TEXT_CLASS
          )}
        >
          {slogan}
        </span>
      ))}

      <AnimatePresence mode="wait" initial={false}>
        <m.h1
          key={activeIndex}
          data-slogan-index={activeIndex}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -14 }}
          transition={{ duration: 0.38, ease: EASE_OUT_EXPO }}
          className={cn("col-start-1 row-start-1", SLOGAN_TEXT_CLASS)}
        >
          <span className="bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
            {SLOGANS[activeIndex]}
          </span>
        </m.h1>
      </AnimatePresence>
    </div>
  )
}
