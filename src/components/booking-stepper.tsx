"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface BookingStepperProps {
  currentStep: number
  steps: string[]
}

export function BookingStepper({ currentStep, steps }: BookingStepperProps) {
  return (
    <div className="w-full py-4 sm:py-6">
      <div className="flex items-start justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          const isLast = index === steps.length - 1

          return (
            <div
              key={index}
              className={cn("flex items-center", !isLast && "flex-1")}
            >
              <div className="flex flex-col items-center shrink-0">
                <div
                  className={cn(
                    "size-8 sm:size-10 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm transition-all",
                    isCompleted && "bg-primary text-primary-foreground",
                    isCurrent &&
                      "bg-primary text-primary-foreground ring-4 ring-primary/20",
                    !isCompleted &&
                      !isCurrent &&
                      "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4 sm:h-5 sm:w-5" /> : stepNumber}
                </div>
                <span
                  className={cn(
                    "text-[11px] sm:text-xs mt-2 font-medium text-center max-w-[72px] sm:max-w-none leading-tight",
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
                  className={cn(
                    "h-0.5 flex-1 mx-2 sm:mx-3 mt-4 sm:mt-5 transition-all",
                    stepNumber < currentStep ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
