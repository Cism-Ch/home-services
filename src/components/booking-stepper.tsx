"use client"

import { m } from "framer-motion"
import { Check } from "lucide-react"
import { EASE_OUT_EXPO, SPRING_SNAPPY } from "@/lib/motion"
import { cn } from "@/lib/utils"

interface BookingStepperProps {
  currentStep: number
  steps: string[]
}

/**
 * Barre de progression semantique des etapes de reservation (<nav><ol><li aria-current="step">)
 * avec progression animee GPU (scaleX + scale cercle actif).
 */
export function BookingStepper({ currentStep, steps }: BookingStepperProps) {
  return (
    <nav aria-label="Étapes de réservation" className="w-full py-4 sm:py-6">
      <ol className="flex items-start justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          const isLast = index === steps.length - 1

          return (
            <li
              key={step}
              aria-current={isCurrent ? "step" : undefined}
              className={cn("flex items-start", !isLast && "flex-1")}
            >
              <div className="flex flex-col items-center shrink-0">
                <m.div
                  initial={false}
                  animate={{ scale: isCurrent ? 1.06 : 1 }}
                  transition={SPRING_SNAPPY}
                  className={cn(
                    "size-8 sm:size-10 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm transition-colors duration-200",
                    isCompleted && "bg-primary text-primary-foreground",
                    isCurrent &&
                      "bg-primary text-primary-foreground ring-4 ring-primary/20",
                    !isCompleted &&
                      !isCurrent &&
                      "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                  ) : (
                    stepNumber
                  )}
                </m.div>
                <span
                  className={cn(
                    "text-[11px] sm:text-xs mt-2 font-medium text-center max-w-[72px] sm:max-w-none leading-tight transition-colors duration-200",
                    isCurrent || isCompleted
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {step}
                </span>
              </div>
              {!isLast && (
                <div
                  aria-hidden="true"
                  className="h-0.5 flex-1 mx-2 sm:mx-3 mt-4 sm:mt-5 bg-muted overflow-hidden rounded-full"
                >
                  <m.div
                    initial={false}
                    animate={{ scaleX: stepNumber < currentStep ? 1 : 0 }}
                    transition={{ duration: 0.28, ease: EASE_OUT_EXPO }}
                    className="h-full w-full origin-left bg-primary"
                  />
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
