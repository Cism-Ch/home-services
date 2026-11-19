import { Suspense } from "react"
import { getPublicCategories, getPublicServices } from "@/server/queries/catalog"
import { ServicesBrowser } from "./services-browser"

export const dynamic = "force-dynamic"

export default async function ServicesPage() {
  const [services, categories] = await Promise.all([
    getPublicServices(),
    getPublicCategories(),
  ])

  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">
          Chargement des prestations...
        </div>
      }
    >
      <ServicesBrowser initialServices={services} categories={categories} />
    </Suspense>
  )
}
