import React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const glowVariants = cva("pointer-events-none absolute inset-0 -z-10 overflow-hidden", {
  variants: {
    variant: {
      top: "bg-[radial-gradient(ellipse_72%_58%_at_50%_18%,hsla(var(--brand)/0.16)_0%,hsla(var(--brand-foreground)/0.08)_38%,transparent_74%)] dark:bg-[radial-gradient(ellipse_72%_58%_at_50%_18%,hsla(var(--brand)/0.22)_0%,hsla(var(--brand-foreground)/0.09)_42%,transparent_76%)]",
      above: "bg-[radial-gradient(ellipse_60%_45%_at_50%_8%,hsla(var(--brand)/0.13)_0%,transparent_70%)]",
      bottom: "bg-[radial-gradient(ellipse_65%_50%_at_50%_82%,hsla(var(--brand-foreground)/0.12)_0%,transparent_70%)]",
      below: "bg-[radial-gradient(ellipse_65%_50%_at_50%_88%,hsla(var(--brand)/0.12)_0%,transparent_70%)]",
      center: "bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,hsla(var(--brand)/0.12)_0%,transparent_70%)]",
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
    data-hero-glow="true"
    aria-hidden="true"
    className={cn(glowVariants({ variant }), className)}
    {...props}
  />
))
Glow.displayName = "Glow"

export { Glow }
