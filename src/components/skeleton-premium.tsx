import * as React from "react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface SkeletonPremiumProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "card" | "avatar" | "profile" | "row"
  count?: number
}

/**
 * Squelettes composites de chargement appuyes sur la primitive shadcn/ui Skeleton.
 */
export function SkeletonPremium({
  className,
  variant = "default",
  count = 1,
  ...props
}: SkeletonPremiumProps) {
  if (variant === "card") {
    return (
      <div
        className={cn("rounded-xl border bg-card p-6 shadow-sm space-y-4", className)}
        {...props}
      >
        <div className="flex items-center gap-4">
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-3/5" />
            <Skeleton className="h-4 w-2/5 opacity-80" />
          </div>
        </div>
        <div className="space-y-2 pt-2">
          <Skeleton className="h-4 w-full opacity-80" />
          <Skeleton className="h-4 w-4/5 opacity-70" />
        </div>
        <div className="flex items-center justify-between pt-4 border-t">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </div>
    )
  }

  if (variant === "avatar") {
    return (
      <Skeleton
        className={cn("h-12 w-12 rounded-full ring-2 ring-background", className)}
        {...props}
      />
    )
  }

  if (variant === "profile") {
    return (
      <div className={cn("space-y-6", className)} {...props}>
        <Skeleton className="h-48 md:h-64 w-full rounded-2xl" />
        <div className="flex flex-col md:flex-row gap-6 -mt-16 md:-mt-20 px-4 sm:px-6 items-start md:items-end">
          <Skeleton className="h-24 w-24 md:h-36 md:w-36 rounded-full border-4 border-background" />
          <div className="space-y-2 flex-1 pb-4">
            <Skeleton className="h-8 w-52 sm:w-64" />
            <Skeleton className="h-5 w-40 opacity-80" />
          </div>
          <Skeleton className="h-10 w-36 rounded-xl" />
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
            className={cn(
              "flex items-center justify-between p-4 rounded-lg border bg-card/60 gap-4",
              className
            )}
            {...props}
          >
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/4 opacity-80" />
            </div>
            <Skeleton className="h-6 w-20 shrink-0" />
          </div>
        ))}
      </div>
    )
  }

  return <Skeleton className={cn("relative overflow-hidden", className)} {...props} />
}
