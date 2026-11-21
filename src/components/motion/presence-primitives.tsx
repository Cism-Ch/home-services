"use client"

import * as React from "react"
import { AnimatePresence, m, useReducedMotion } from "framer-motion"
import { EASE_OUT_EXPO, SPRING_SNAPPY } from "@/lib/motion"
import { cn } from "@/lib/utils"

interface PresenceFadeProps {
  show: boolean
  children: React.ReactNode
  className?: string
  keyId?: string
}

/**
 * Wrapper GPU d'apparition/disparition fluide (opacity + y) pour alertes,
 * etats vides et panneaux conditionnels.
 */
export function PresenceFade({
  show,
  children,
  className,
  keyId = "presence-fade",
}: PresenceFadeProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <AnimatePresence mode="wait" initial={false}>
      {show && (
        <m.div
          key={keyId}
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: EASE_OUT_EXPO }}
          className={className}
        >
          {children}
        </m.div>
      )}
    </AnimatePresence>
  )
}

interface PresenceChipProps {
  children: React.ReactNode
  className?: string
}

/**
 * Element puce animee (scale + opacity) destine aux listes de filtres actifs amovibles.
 */
export function PresenceChip({ children, className }: PresenceChipProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <m.div
      layout
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.88 }}
      transition={SPRING_SNAPPY}
      className={cn("inline-flex", className)}
    >
      {children}
    </m.div>
  )
}
