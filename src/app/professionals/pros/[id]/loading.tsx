import { SkeletonPremium } from "@/components/skeleton-premium"

export default function ProfessionalDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <SkeletonPremium variant="profile" />
    </div>
  )
}
