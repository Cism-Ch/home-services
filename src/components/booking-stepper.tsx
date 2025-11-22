"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface BookingStepperProps {
    currentStep: number
    steps: string[]
}

export function BookingStepper({ currentStep, steps }: BookingStepperProps) {
    return (
        <div className="w-full py-8">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const stepNumber = index + 1
                    const isCompleted = stepNumber < currentStep
                    const isCurrent = stepNumber === currentStep

                    return (
                        <div key={index} className="flex items-center flex-1">
                            <div className="flex flex-col items-center">
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all",
                                        isCompleted && "bg-primary text-primary-foreground",
                                        isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                                        !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                                    )}
                                >
                                    {isCompleted ? (
                                        <Check className="h-5 w-5" />
                                    ) : (
                                        stepNumber
                                    )}
                                </div>
                                <span className={cn(
                                    "text-xs mt-2 font-medium text-center",
                                    (isCurrent || isCompleted) ? "text-foreground" : "text-muted-foreground"
                                )}>
                                    {step}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={cn(
                                    "h-0.5 flex-1 mx-2 transition-all",
                                    stepNumber < currentStep ? "bg-primary" : "bg-muted"
                                )} />
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
