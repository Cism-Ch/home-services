import React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const glowVariants = cva("pointer-events-none absolute inset-x-0 overflow-hidden", {
  variants: {
    variant: {
      top: "top-0",
      above: "-top-[128px]",
      bottom: "bottom-0",
      below: "-bottom-[128px]",
      center: "top-1/2 -translate-y-1/2",
    },
  },
  defaultVariants: {
    variant: "top",
  },
})

const Glow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof glowVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(glowVariants({ variant }), className)}
    {...props}
  >
    <div
      className={cn(
        "mx-auto h-[220px] w-full max-w-3xl rounded-full bg-[radial-gradient(ellipse_at_center,_hsla(var(--brand-foreground)/.35)_10%,_hsla(var(--brand-foreground)/0)_65%)] sm:h-[420px]"
      )}
    />
    <div
      className={cn(
        "mx-auto -mt-32 h-[120px] w-full max-w-xl rounded-full bg-[radial-gradient(ellipse_at_center,_hsla(var(--brand)/.25)_10%,_hsla(var(--brand-foreground)/0)_65%)] sm:h-[220px]"
      )}
    />
  </div>
))
Glow.displayName = "Glow"

export { Glow }
