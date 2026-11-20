"use client"

import * as React from "react"
import { m, useReducedMotion } from "framer-motion"
import { EASE_OUT_EXPO } from "@/lib/motion"

/**
 * Micro-transition d'entree GPU entre routes App Router.
 * Laisse le contenu quasiment opaque (0.94 -> 1) pour ne jamais penaliser le LCP,
 * et supprime tout transform des l'arrivee afin de preserver position: sticky.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <m.div
      data-route-transition="true"
      initial={prefersReducedMotion ? false : { opacity: 0.94, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: EASE_OUT_EXPO }}
      transformTemplate={(_, generated) =>
        generated === "translateY(0px)" || generated === "none"
          ? "none"
          : generated
      }
    >
      {children}
    </m.div>
  )
}
