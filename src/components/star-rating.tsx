"use client"

import * as React from "react"
import { Star } from "lucide-react"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface StarRatingProps {
  value: number
  onChange: (rating: number) => void
  disabled?: boolean
  size?: "sm" | "md" | "lg"
  showValue?: boolean
  ariaLabel?: string
  className?: string
}

const SIZE_CLASSES = {
  sm: "size-5",
  md: "size-7",
  lg: "size-8",
} as const

/**
 * Selecteur d'etoiles accessible fonde sur shadcn RadioGroup (navigation clavier native).
 */
export function StarRating({
  value,
  onChange,
  disabled = false,
  size = "md",
  showValue = false,
  ariaLabel = "Sélectionner une note de 1 à 5 étoiles",
  className,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = React.useState(0)
  const groupId = React.useId()
  const activeValue = hoverValue || value

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <RadioGroup
        aria-label={ariaLabel}
        value={value > 0 ? String(value) : ""}
        disabled={disabled}
        onValueChange={(val) => {
          const parsed = Number(val)
          if (parsed >= 1 && parsed <= 5) {
            onChange(parsed)
          }
        }}
        onMouseLeave={() => setHoverValue(0)}
        className="flex flex-row items-center gap-1.5"
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const itemId = `${groupId}-star-${star}`
          const labelText = `Attribuer ${star} ${star === 1 ? "étoile" : "étoiles"}`
          const isFilled = star <= activeValue

          return (
            <Label
              key={star}
              htmlFor={itemId}
              onMouseEnter={() => {
                if (!disabled) setHoverValue(star)
              }}
              className={cn(
                "cursor-pointer rounded-sm p-0.5 transition-transform hover:scale-110 has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50",
                disabled && "pointer-events-none opacity-50"
              )}
            >
              <RadioGroupItem
                id={itemId}
                value={String(star)}
                aria-label={labelText}
                className="sr-only"
              />
              <Star
                aria-hidden="true"
                className={cn(
                  "transition-colors",
                  SIZE_CLASSES[size],
                  isFilled
                    ? "fill-amber-500 text-amber-500"
                    : "fill-muted text-muted-foreground"
                )}
              />
            </Label>
          )
        })}
      </RadioGroup>

      {showValue && value > 0 && (
        <span className="ml-1 text-sm font-medium text-foreground">
          {value} / 5
        </span>
      )}
    </div>
  )
}
