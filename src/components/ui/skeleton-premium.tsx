import { cn } from "@/lib/utils"

interface SkeletonPremiumProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "card" | "avatar" | "profile" | "row"
  count?: number
}

export function SkeletonPremium({
  className,
  variant = "default",
  count = 1,
  ...props
}: SkeletonPremiumProps) {
  if (variant === "card") {
    return (
      <div className={cn("rounded-xl border bg-card p-6 shadow-sm space-y-4 animate-pulse", className)} {...props}>
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-muted/80" />
          <div className="space-y-2 flex-1">
            <div className="h-5 w-3/5 rounded-md bg-muted/80" />
            <div className="h-4 w-2/5 rounded-md bg-muted/60" />
          </div>
        </div>
        <div className="space-y-2 pt-2">
          <div className="h-4 w-full rounded-md bg-muted/60" />
          <div className="h-4 w-4/5 rounded-md bg-muted/50" />
        </div>
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="h-6 w-24 rounded-md bg-muted/70" />
          <div className="h-9 w-28 rounded-lg bg-muted/80" />
        </div>
      </div>
    )
  }

  if (variant === "avatar") {
    return (
      <div
        className={cn("h-12 w-12 rounded-full bg-muted/80 animate-pulse ring-2 ring-background", className)}
        {...props}
      />
    )
  }

  if (variant === "profile") {
    return (
      <div className={cn("space-y-6 animate-pulse", className)} {...props}>
        <div className="h-48 md:h-64 w-full rounded-2xl bg-muted/70" />
        <div className="flex flex-col md:flex-row gap-6 -mt-16 md:-mt-20 px-6 items-start md:items-end">
          <div className="h-28 w-28 md:h-36 md:w-36 rounded-full bg-muted border-4 border-background" />
          <div className="space-y-2 flex-1 pb-4">
            <div className="h-8 w-64 rounded-md bg-muted/80" />
            <div className="h-5 w-40 rounded-md bg-muted/60" />
          </div>
          <div className="h-10 w-36 rounded-xl bg-muted/80" />
        </div>
      </div>
    )
  }

  if (variant === "row") {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className={cn("flex items-center justify-between p-4 rounded-lg border bg-card/60 animate-pulse gap-4", className)}
            {...props}
          >
            <div className="h-10 w-10 rounded-full bg-muted/80 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-1/3 rounded bg-muted/80" />
              <div className="h-3 w-1/4 rounded bg-muted/60" />
            </div>
            <div className="h-6 w-20 rounded bg-muted/70 shrink-0" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "rounded-md bg-muted/80 animate-pulse relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
        className
      )}
      {...props}
    />
  )
}
