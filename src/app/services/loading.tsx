import { SkeletonPremium } from "@/components/skeleton-premium"

export default function ServicesLoading() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <SkeletonPremium key={idx} variant="card" />
        ))}
      </div>
    </div>
  )
}
