import { SkeletonPremium } from "@/components/skeleton-premium"

export default function ServicesLoading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <SkeletonPremium key={idx} variant="card" />
        ))}
      </div>
    </div>
  )
}
