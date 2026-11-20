"use client"

import * as React from "react"
import { m, useReducedMotion } from "framer-motion"
import {
  EASE_OUT_EXPO,
  VIEWPORT_ONCE,
  fadeUpVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from "@/lib/motion"
import { cn } from "@/lib/utils"

interface RevealOnScrollProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

/**
 * Revele un bloc sous la ligne de flottaison au premier defilement via GPU (transform/opacity).
 * Bascule automatiquement en rendu immediat lorsque prefers-reduced-motion est actif.
 */
export function RevealOnScroll({
  children,
  className,
  delay = 0,
}: RevealOnScrollProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <m.div
      initial={prefersReducedMotion ? false : "hidden"}
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      variants={fadeUpVariants}
      transition={
        delay > 0 ? { duration: 0.45, delay, ease: EASE_OUT_EXPO } : undefined
      }
      className={className}
    >
      {children}
    </m.div>
  )
}

interface StaggerGridProps {
  children: React.ReactNode
  className?: string
}

/**
 * Orchestre l'apparition en cascade GPU-only d'une grille de cartes au defilement.
 */
export function StaggerGrid({ children, className }: StaggerGridProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <m.div
      initial={prefersReducedMotion ? false : "hidden"}
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      variants={staggerContainerVariants}
      className={className}
    >
      {children}
    </m.div>
  )
}

interface StaggerItemProps {
  children: React.ReactNode
  className?: string
}

/**
 * Enfant de StaggerGrid conservant h-full pour garantir l'alignement iso-hauteur des cartes.
 */
export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <m.div variants={staggerItemVariants} className={cn("h-full", className)}>
      {children}
    </m.div>
  )
}
