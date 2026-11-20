"use client"

import { useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { m, useReducedMotion } from "framer-motion"
import { SlidersHorizontal, Sparkles } from "lucide-react"
import { EASE_OUT_EXPO } from "@/lib/motion"
import { RevealOnScroll } from "@/components/motion/reveal"
import { CatalogPagination } from "@/components/catalog-pagination"
import { ServiceFilter } from "@/components/service-filter"
import { ServiceListingCard } from "@/components/service-listing-card"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { CatalogCategory, CatalogService } from "@/lib/types/catalog"

const ITEMS_PER_PAGE = 12

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

  const resultsRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [selectedCity, setSelectedCity] = useState(initialCityParam)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategoryParam ? [initialCategoryParam] : []
  )
  const [priceRange, setPriceRange] = useState<number[]>([2000, 150000])
  const [minRating, setMinRating] = useState<number | null>(null)
  const [availableOnly, setAvailableOnly] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const handleCityChange = (cityId: string) => {
    setSelectedCity(cityId)
    setCurrentPage(1)
  }

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
    setCurrentPage(1)
  }

  const handlePriceRangeChange = (range: number[]) => {
    setPriceRange(range)
    setCurrentPage(1)
  }

  const handleMinRatingChange = (rating: number | null) => {
    setMinRating(rating)
    setCurrentPage(1)
  }

  const handleAvailableOnlyChange = (value: boolean) => {
    setAvailableOnly(value)
    setCurrentPage(1)
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
      if (
        s.price < priceRange[0] ||
        (priceRange[1] < 150000 && s.price > priceRange[1])
      ) {
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

  const totalPages = Math.max(
    1,
    Math.ceil(filteredServices.length / ITEMS_PER_PAGE)
  )
  const safePage = Math.min(currentPage, totalPages)

  const paginatedServices = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE
    return filteredServices.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredServices, safePage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const hasActiveFilters = Boolean(
    selectedCity ||
      selectedCategories.length > 0 ||
      minRating !== null ||
      availableOnly
  )

  const resetFilters = () => {
    setSelectedCity("")
    setSelectedCategories([])
    setPriceRange([2000, 150000])
    setMinRating(null)
    setAvailableOnly(false)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Header Section */}
      <section className="relative bg-gradient-to-br from-[hsl(var(--brand))]/10 via-background to-[hsl(var(--brand-foreground))]/10 py-14 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_60%_at_85%_10%,hsla(var(--brand)/0.16)_0%,transparent_70%),radial-gradient(ellipse_50%_55%_at_15%_90%,hsla(var(--brand-foreground)/0.14)_0%,transparent_72%)]"
        />

        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(var(--brand))]/10 border border-[hsl(var(--brand))]/20 text-xs sm:text-sm font-medium mb-6 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-[hsl(var(--brand))] animate-pulse" />
              <span className="text-[hsl(var(--brand))]">
                TROUVEZ LE SERVICE PARFAIT
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-6 gradient-brand">
              Tous nos Services
            </h1>

            <p className="text-base sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Découvrez notre gamme complète de services professionnels pour votre
              maison.
              <span className="text-foreground font-medium">
                {" "}
                {filteredServices.length} prestation(s) disponible(s)
              </span>{" "}
              près de chez vous.
            </p>

            {/* Mobile Filter Drawer */}
            <div className="md:hidden mt-6">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button
                    size="lg"
                    className="gap-2 bg-[hsl(var(--brand))] hover:bg-[hsl(var(--brand))]/90 text-white shadow-lg glow-brand"
                  >
                    <SlidersHorizontal className="h-5 w-5" />
                    Filtrer les services
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader className="text-left">
                    <DrawerTitle>Filtres de recherche</DrawerTitle>
                    <DrawerDescription>
                      Affinez les prestations par commune, catégorie, budget ou
                      note.
                    </DrawerDescription>
                  </DrawerHeader>
                  <ScrollArea className="max-h-[60vh] px-4 pb-2">
                    <div className="py-2">
                      <ServiceFilter
                        categories={categories}
                        selectedCity={selectedCity}
                        selectedCategories={selectedCategories}
                        priceRange={priceRange}
                        minRating={minRating}
                        availableOnly={availableOnly}
                        onCityChange={handleCityChange}
                        onCategoryToggle={handleCategoryToggle}
                        onPriceRangeChange={handlePriceRangeChange}
                        onMinRatingChange={handleMinRatingChange}
                        onAvailableOnlyChange={handleAvailableOnlyChange}
                      />
                    </div>
                  </ScrollArea>
                  <DrawerFooter className="border-t pt-4">
                    <DrawerClose asChild>
                      <Button className="w-full">
                        Voir {filteredServices.length} résultat(s)
                      </Button>
                    </DrawerClose>
                    {hasActiveFilters && (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={resetFilters}
                      >
                        Réinitialiser les filtres
                      </Button>
                    )}
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section ref={resultsRef} className="w-full py-12 sm:py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="hidden md:block col-span-1">
            <div className="sticky top-24">
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
                    {hasActiveFilters && (
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
                    onCityChange={handleCityChange}
                    onCategoryToggle={handleCategoryToggle}
                    onPriceRangeChange={handlePriceRangeChange}
                    onMinRatingChange={handleMinRatingChange}
                    onAvailableOnlyChange={handleAvailableOnlyChange}
                  />
                </div>
              </div>
            </div>
          </aside>

          <main className="col-span-1 md:col-span-3 min-w-0">
            <m.div
              key={`${safePage}-${filteredServices.length}`}
              initial={prefersReducedMotion ? false : { opacity: 0.7, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: EASE_OUT_EXPO }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
            >
              {paginatedServices.map((service) => (
                <div key={service.id} className="h-full">
                  <ServiceListingCard service={service} />
                </div>
              ))}
            </m.div>

            {filteredServices.length === 0 && (
              <div className="text-center py-20 space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
                  <SlidersHorizontal className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold">Aucun service trouvé</h3>
                <p className="text-muted-foreground">
                  Essayez d&apos;ajuster vos filtres géographiques ou de budget pour
                  voir plus de résultats.
                </p>
                <Button variant="outline" onClick={resetFilters}>
                  Réinitialiser les filtres
                </Button>
              </div>
            )}

            <CatalogPagination
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </main>
        </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 sm:py-20">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <RevealOnScroll>
            <div className="relative bg-gradient-to-br from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] text-white rounded-3xl p-6 sm:p-10 md:p-16 text-center shadow-elevated-lg overflow-hidden group glow-brand-lg">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_15%,rgba(255,255,255,0.22)_0%,transparent_55%)] opacity-80 transition-opacity duration-500 group-hover:opacity-100"
            />

            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm font-medium mb-6 backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                VOUS ÊTES PROFESSIONNEL ?
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-6">
                Proposez vos services sur notre plateforme
              </h2>
              <p className="text-white/90 text-base sm:text-lg mb-8 leading-relaxed">
                Rejoignez notre réseau d&apos;artisans vérifiés et recevez des
                créneaux de rendez-vous directement sur WhatsApp.
              </p>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto text-base sm:text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-[transform,box-shadow,background-color] duration-300 font-bold bg-white text-[hsl(var(--brand))] hover:bg-white/90"
              >
                <Link href="/register">
                  Devenir partenaire
                  <span className="ml-2">-&gt;</span>
                </Link>
              </Button>
            </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  )
}
