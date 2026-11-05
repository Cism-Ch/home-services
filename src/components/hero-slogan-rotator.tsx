"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"

const SLOGANS = [
  "Trouver le professionnel qu'il vous faut.",
  "Trouver des prestataires de services locaux et inversement.",
  "Trouver les prestataires de services qu'il vous faut.",
  "Trouver les clients qu'il vous faut."
]

export function HeroSloganRotator({ className }: { className?: string }) {
  const [currentIndex, setCurrentIndex] = React.useState(0)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLOGANS.length)
    }, 3800)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className={`relative min-h-[5.5rem] sm:min-h-[6.5rem] md:min-h-[7.5rem] flex items-center justify-center overflow-hidden ${className || ""}`}>
      <AnimatePresence mode="wait">
        <motion.h1
          key={currentIndex}
          initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -24, filter: "blur(4px)" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-center max-w-4xl px-2 leading-[1.15]"
        >
          <span className="bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
            {SLOGANS[currentIndex]}
          </span>
        </motion.h1>
      </AnimatePresence>
    </div>
  )
}
