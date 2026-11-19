import {
  getPublicCategories,
  getPublicProfessionals,
} from "@/server/queries/catalog"
import { ProfessionalsBrowser } from "./professionals-browser"

export const dynamic = "force-dynamic"

export default async function ProfessionalsPage() {
  const [professionals, categories] = await Promise.all([
    getPublicProfessionals(),
    getPublicCategories(),
  ])

  return (
    <ProfessionalsBrowser
      initialProfessionals={professionals}
      categories={categories}
    />
  )
}
