import type { Variants } from "framer-motion"

/**
 * Courbes et variantes d'animation GPU-only (transform & opacity exclusivement).
 * Aucun blur ni propriete declenchant un reflow (width/height/top/left).
 */
export const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const

export const SPRING_SNAPPY = {
  type: "spring",
  stiffness: 420,
  damping: 32,
  mass: 0.8,
} as const

export const SPRING_GENTLE = {
  type: "spring",
  stiffness: 280,
  damping: 28,
  mass: 0.9,
} as const

export const VIEWPORT_ONCE = {
  once: true,
  amount: "some" as const,
}

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_OUT_EXPO },
  },
}

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.04,
    },
  },
}

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE_OUT_EXPO },
  },
}

export const stepSlideVariants: Variants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction >= 0 ? 22 : -22,
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.22, ease: EASE_OUT_EXPO },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction >= 0 ? -22 : 22,
    transition: { duration: 0.16, ease: EASE_OUT_EXPO },
  }),
}
