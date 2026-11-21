"use client"

import * as React from "react"
import { AnimatePresence, m, useReducedMotion } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EASE_OUT_EXPO } from "@/lib/motion"

/**
 * Bouton flottant de retour en haut de page avec apparition/disparition GPU (AnimatePresence)
 * au-dela de 480px de defilement.
 */
export function BackToTop() {
  const [visible, setVisible] = React.useState(false)
  const prefersReducedMotion = useReducedMotion()

  React.useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 480)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    })
  }

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          key="back-to-top"
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.92 }}
          transition={{ duration: 0.22, ease: EASE_OUT_EXPO }}
          className="fixed bottom-6 right-5 z-40"
        >
          <Button
            type="button"
            size="icon"
            variant="secondary"
            onClick={scrollToTop}
            aria-label="Retour en haut de la page"
            className="size-11 rounded-full border border-border/60 bg-background/85 backdrop-blur-md shadow-lg hover:bg-[hsl(var(--brand))] hover:text-white hover:border-[hsl(var(--brand))] transition-colors duration-200"
          >
            <ArrowUp className="h-4 w-4" aria-hidden="true" />
          </Button>
        </m.div>
      )}
    </AnimatePresence>
  )
}
