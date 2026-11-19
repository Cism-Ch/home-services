"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { SlidersHorizontal, Sparkles } from "lucide-react"
import { ServiceFilter } from "@/components/service-filter"
import { ServiceListingCard } from "@/components/service-listing-card"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import type { CatalogCategory, CatalogService } from "@/lib/types/catalog"

interface ServicesBrowserProps {
  initialServices: CatalogService[]
  categories: CatalogCategory[]
}

export function ServicesBrowser({
  initialServices,
  categories,
}: ServicesBrowserProps) {
  const searchParams = useSearchParams()
  const initialCityParam = searchParams.get("city") || ""
  const initialCategoryParam = searchParams.get("category") || ""
  const initialQueryParam = (searchParams.get("q") || "").toLowerCase().trim()

  const [selectedCity, setSelectedCity] = useState(initialCityParam)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategoryParam ? [initialCategoryParam] : []
  )
  const [priceRange, setPriceRange] = useState<number[]>([2000, 150000])
  const [minRating, setMinRating] = useState<number | null>(null)
  const [availableOnly, setAvailableOnly] = useState(false)

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const filteredServices = useMemo(() => {
    return initialServices.filter((s) => {
      if (selectedCity && s.cityId !== selectedCity) {
        return false
      }
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(s.categoryId)
      ) {
        return false
      }
      if (s.price < priceRange[0] || (priceRange[1] < 150000 && s.price > priceRange[1])) {
        return false
      }
      if (minRating !== null && s.rating < minRating) {
        return false
      }
      if (availableOnly && s.availabilityStatus !== "AVAILABLE") {
        return false
      }
      if (initialQueryParam) {
        const hay = `${s.title} ${s.description} ${s.categoryName} ${s.providerName} ${s.location}`.toLowerCase()
        if (!hay.includes(initialQueryParam)) {
          return false
        }
      }
      return true
    })
  }, [
    initialServices,
    selectedCity,
    selectedCategories,
    priceRange,
    minRating,
    availableOnly,
    initialQueryParam,
  ])

  const resetFilters = () => {
    setSelectedCity("")
    setSelectedCategories([])
    setPriceRange([2000, 150000])
    setMinRating(null)
    setAvailableOnly(false)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Header Section */}
      <section className="relative bg-gradient-to-br from-[hsl(var(--brand))]/10 via-background to-[hsl(var(--brand-foreground))]/10 py-14 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="pointer-events-none absolute top-0 right-0 w-full max-w-lg h-[400px] bg-[hsl(var(--brand))]/20 rounded-full blur-3xl -z-10" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-full max-w-md h-[350px] bg-[hsl(var(--brand-foreground))]/20 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center animate-appear">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(var(--brand))]/10 border border-[hsl(var(--brand))]/20 text-xs sm:text-sm font-medium mb-6 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-[hsl(var(--brand))] animate-pulse" />
              <span className="text-[hsl(var(--brand))]">TROUVEZ LE SERVICE PARFAIT</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-6 gradient-brand">
              Tous nos Services
            </h1>

            <p className="text-base sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Découvrez notre gamme complète de services professionnels pour votre maison.
              <span className="text-foreground font-medium">
                {" "}
                {filteredServices.length} prestation(s) disponible(s)
              </span>{" "}
              près de chez vous.
            </p>

            {/* Mobile Filter Button */}
            <div className="md:hidden mt-6">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    size="lg"
                    className="gap-2 bg-[hsl(var(--brand))] hover:bg-[hsl(var(--brand))]/90 text-white shadow-lg glow-brand"
                  >
                    <SlidersHorizontal className="h-5 w-5" />
                    Filtrer les services
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[min(85vw,320px)] sm:w-[360px] overflow-y-auto">
                  <SheetTitle className="sr-only">Filtres de recherche</SheetTitle>
                  <div className="py-6">
                    <ServiceFilter
                      categories={categories}
                      selectedCity={selectedCity}
                      selectedCategories={selectedCategories}
                      priceRange={priceRange}
                      minRating={minRating}
                      availableOnly={availableOnly}
                      onCityChange={setSelectedCity}
                      onCategoryToggle={handleCategoryToggle}
                      onPriceRangeChange={setPriceRange}
                      onMinRatingChange={setMinRating}
                      onAvailableOnlyChange={setAvailableOnly}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="hidden md:block col-span-1">
            <div className="sticky top-24 animate-appear">
              <div className="relative bg-card/60 backdrop-blur-md rounded-2xl border border-border/50 p-6 shadow-elevated overflow-hidden group hover:shadow-elevated-lg transition-shadow duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--brand))]/5 via-transparent to-[hsl(var(--brand-foreground))]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-2 mb-6 pb-4 border-b border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-[hsl(var(--brand))]/10 to-[hsl(var(--brand-foreground))]/10">
                        <Sparkles className="h-5 w-5 text-[hsl(var(--brand))]" />
                      </div>
                      <h2 className="text-lg font-bold gradient-brand">Filtres</h2>
                    </div>
                    {(selectedCity ||
                      selectedCategories.length > 0 ||
                      minRating !== null ||
                      availableOnly) && (
                      <Button variant="ghost" size="sm" onClick={resetFilters}>
                        Réinitialiser
                      </Button>
                    )}
                  </div>
                  <ServiceFilter
                    categories={categories}
                    selectedCity={selectedCity}
                    selectedCategories={selectedCategories}
                    priceRange={priceRange}
                    minRating={minRating}
                    availableOnly={availableOnly}
                    onCityChange={setSelectedCity}
                    onCategoryToggle={handleCategoryToggle}
                    onPriceRangeChange={setPriceRange}
                    onMinRatingChange={setMinRating}
                    onAvailableOnlyChange={setAvailableOnly}
                  />
                </div>
              </div>
            </div>
          </aside>

          <main className="col-span-1 md:col-span-3 min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <div key={service.id} className="animate-appear">
                  <ServiceListingCard service={service} />
                </div>
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div className="text-center py-20 animate-appear space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
                  <SlidersHorizontal className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold">Aucun service trouvé</h3>
                <p className="text-muted-foreground">
                  Essayez d&apos;ajuster vos filtres géographiques ou de budget pour voir plus de résultats.
                </p>
                <Button variant="outline" onClick={resetFilters}>
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </main>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-14 sm:py-20">
        <div className="relative bg-gradient-to-br from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] text-white rounded-3xl p-6 sm:p-10 md:p-16 text-center shadow-elevated-lg overflow-hidden group glow-brand-lg animate-appear">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="pointer-events-none absolute top-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm font-medium mb-6 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              VOUS ÊTES PROFESSIONNEL ?
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-6">
              Proposez vos services sur notre plateforme
            </h2>
            <p className="text-white/90 text-base sm:text-lg mb-8 leading-relaxed">
              Rejoignez notre réseau d&apos;artisans vérifiés et recevez des créneaux de rendez-vous directement sur WhatsApp.
            </p>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto text-base sm:text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all duration-300 font-bold bg-white text-[hsl(var(--brand))] hover:bg-white/90"
            >
              <Link href="/register">
                Devenir partenaire
                <span className="ml-2">→</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
