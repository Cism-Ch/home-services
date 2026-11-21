"use client"

import * as React from "react"
import { animate, useInView } from "framer-motion"
import { EASE_OUT_EXPO } from "@/lib/motion"
import { cn } from "@/lib/utils"

interface AnimatedCounterProps {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  duration?: number
  className?: string
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

function formatDisplayNumber(val: number, decimals: number): string {
  if (decimals > 0) {
    return val.toFixed(decimals)
  }
  return Math.round(val).toLocaleString("fr-FR")
}

/**
 * Compteur numerique anime au premier passage dans le viewport (tabular-nums anti-tremblement).
 * Affiche immediatement la valeur finale en SSR et lorsque prefers-reduced-motion est actif.
 */
export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.05,
  className,
}: AnimatedCounterProps) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: "some" })
  const [animatedValue, setAnimatedValue] = React.useState<number | null>(null)
  const hasAnimatedRef = React.useRef(false)

  React.useEffect(() => {
    if (!isInView || hasAnimatedRef.current) return
    hasAnimatedRef.current = true

    if (
      value === 0 ||
      (typeof window !== "undefined" &&
        window.matchMedia(REDUCED_MOTION_QUERY).matches)
    ) {
      return
    }

    const controls = animate(0, value, {
      duration,
      ease: EASE_OUT_EXPO,
      onUpdate: (latest) => {
        setAnimatedValue(latest)
      },
      onComplete: () => {
        setAnimatedValue(null)
      },
    })

    return () => controls.stop()
  }, [isInView, value, duration])

  const displayValue = animatedValue ?? value

  return (
    <span
      ref={ref}
      data-animated-counter="true"
      className={cn("tabular-nums", className)}
    >
      {prefix}
      {formatDisplayNumber(displayValue, decimals)}
      {suffix}
    </span>
  )
}
