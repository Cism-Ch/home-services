import { SkeletonPremium } from "@/components/skeleton-premium"

export default function ProfessionalsLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, idx) => (
          <SkeletonPremium key={idx} variant="card" />
        ))}
      </div>
    </div>
  )
}
