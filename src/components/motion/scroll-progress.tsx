"use client"

import { useSyncExternalStore } from "react"
import { m, useScroll, useSpring } from "framer-motion"

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

function subscribeReducedMotion(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {}
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY)
  mediaQuery.addEventListener("change", onStoreChange)
  return () => mediaQuery.removeEventListener("change", onStoreChange)
}

function getShowProgressSnapshot() {
  if (typeof window === "undefined") return false
  return !window.matchMedia(REDUCED_MOTION_QUERY).matches
}

function getServerSnapshot() {
  return false
}

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 32,
    restDelta: 0.001,
  })

  return (
    <m.div
      aria-hidden="true"
      data-scroll-progress="true"
      style={{ scaleX }}
      className="pointer-events-none fixed top-16 left-0 right-0 z-40 h-[2px] origin-left bg-gradient-to-r from-[hsl(var(--brand))] via-[hsl(var(--brand-foreground))] to-[hsl(var(--brand))] motion-reduce:hidden"
    />
  )
}

/**
 * Barre de progression de lecture GPU (scaleX) ancree sous le header sur les pages longues.
 * N'attache aucun ecouteur de defilement en SSR ni lorsque prefers-reduced-motion est actif.
 */
export function ScrollProgress() {
  const shouldShow = useSyncExternalStore(
    subscribeReducedMotion,
    getShowProgressSnapshot,
    getServerSnapshot
  )

  if (!shouldShow) {
    return null
  }

  return <ScrollProgressBar />
}
