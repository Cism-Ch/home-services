"use client"

import * as React from "react"
import { LazyMotion, MotionConfig, domMax } from "framer-motion"
import { EASE_OUT_EXPO } from "@/lib/motion"

interface MotionProviderProps {
  children: React.ReactNode
}

/**
 * Socle global Framer Motion : chargement allege (LazyMotion + domMax) et respect
 * strict des preferences d'accessibilite systeme (prefers-reduced-motion).
 */
export function MotionProvider({ children }: MotionProviderProps) {
  return (
    <LazyMotion features={domMax}>
      <MotionConfig
        reducedMotion="user"
        transition={{ ease: EASE_OUT_EXPO, duration: 0.32 }}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  )
}
