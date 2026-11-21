"use client"

import { useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { AnimatePresence, m, useReducedMotion } from "framer-motion"
import { SlidersHorizontal, Sparkles, X } from "lucide-react"
import { EASE_OUT_EXPO } from "@/lib/motion"
import { RevealOnScroll } from "@/components/motion/reveal"
import { PresenceChip, PresenceFade } from "@/components/motion/presence-primitives"
import { CatalogPagination } from "@/components/catalog-pagination"
import {
  CatalogLayoutToolbar,
  useCatalogLayout,
  type CatalogLayoutMode,
} from "@/components/catalog-layout-toolbar"
import { ServiceAutocomplete } from "@/components/service-autocomplete"
import { ServiceFilter } from "@/components/service-filter"
import { ServiceListingCard } from "@/components/service-listing-card"
import { Badge } from "@/components/ui/badge"
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
import { formatFCFA } from "@/lib/formatters"
import { notify } from "@/lib/notifications"
import { cn } from "@/lib/utils"
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
  const initialQueryParam = searchParams.get("q") || ""

  const resultsRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const { mode, preset, setMode } = useCatalogLayout("hs:services:layout", "grid-3x3")
  const [searchQuery, setSearchQuery] = useState(initialQueryParam)
  const [selectedCity, setSelectedCity] = useState(initialCityParam)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategoryParam ? [initialCategoryParam] : []
  )
  const [priceRange, setPriceRange] = useState<number[]>([2000, 150000])
  const [minRating, setMinRating] = useState<number | null>(null)
  const [availableOnly, setAvailableOnly] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const serviceSuggestions = useMemo(
    () =>
      initialServices.map((s) => ({
        id: s.id,
        title: s.title,
        categoryId: s.categoryId,
        categoryName: s.categoryName,
        price: s.price,
        providerName: s.providerName,
      })),
    [initialServices]
  )

  const categorySuggestions = useMemo(
    () => categories.map((c) => ({ id: c.id, name: c.name })),
    [categories]
  )

  const categoryNameById = useMemo(
    () => new Map(categories.map((c) => [c.id, c.name])),
    [categories]
  )

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleLayoutChange = (nextMode: CatalogLayoutMode) => {
    setMode(nextMode)
    setCurrentPage(1)
  }

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
    const q = searchQuery.toLowerCase().trim()
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
      if (q) {
        const hay = `${s.title} ${s.description} ${s.categoryName} ${s.providerName} ${s.location}`.toLowerCase()
        if (!hay.includes(q)) {
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
    searchQuery,
  ])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredServices.length / preset.itemsPerPage)
  )
  const safePage = Math.min(currentPage, totalPages)

  const paginatedServices = useMemo(() => {
    const start = (safePage - 1) * preset.itemsPerPage
    return filteredServices.slice(start, start + preset.itemsPerPage)
  }, [filteredServices, safePage, preset.itemsPerPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const isPriceFiltered = priceRange[0] > 2000 || priceRange[1] < 150000
  const activeFilterCount =
    (searchQuery.trim() ? 1 : 0) +
    (selectedCity ? 1 : 0) +
    selectedCategories.length +
    (isPriceFiltered ? 1 : 0) +
    (minRating !== null ? 1 : 0) +
    (availableOnly ? 1 : 0)

  const hasActiveFilters = activeFilterCount > 0

  const resetFilters = () => {
    setSearchQuery("")
    setSelectedCity("")
    setSelectedCategories([])
    setPriceRange([2000, 150000])
    setMinRating(null)
    setAvailableOnly(false)
    setCurrentPage(1)
    notify.info("Filtres réinitialisés", {
      id: "services-reset",
      duration: 2400,
    })
  }

  return (
    <div className="min-h-screen">
      {/* Hero Header Section */}
      <section className="relative bg-gradient-to-br from-[hsl(var(--brand))]/10 via-background to-[hsl(var(--brand-foreground))]/10 py-14 sm:py-20 overflow-x-clip">
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
              <span className="text-foreground font-semibold tabular-nums">
                {" "}
                {filteredServices.length} prestation(s) disponible(s)
              </span>{" "}
              près de chez vous.
            </p>

            {/* Autocomplete Search Bar */}
            <div className="w-full max-w-2xl mx-auto relative z-30 rounded-2xl border border-border/60 bg-card/95 p-1.5 shadow-lg backdrop-blur-md text-left">
              <ServiceAutocomplete
                value={searchQuery}
                onChange={handleSearchChange}
                services={serviceSuggestions}
                categories={categorySuggestions}
                placeholder="Rechercher un service ou métier..."
                onSelectCategory={(cat) => {
                  setSearchQuery("")
                  setSelectedCategories([cat.id])
                  setCurrentPage(1)
                }}
                onSelectService={(svc) => {
                  setSearchQuery(svc.title)
                  setSelectedCategories([svc.categoryId])
                  setCurrentPage(1)
                }}
              />
            </div>

            {/* Mobile & Tablet Filter Drawer */}
            <div className="lg:hidden mt-5">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button
                    size="lg"
                    data-mobile-filter-trigger="true"
                    className="w-full sm:w-auto gap-2 bg-[hsl(var(--brand))] hover:bg-[hsl(var(--brand))]/90 text-white shadow-lg glow-brand rounded-xl"
                  >
                    <SlidersHorizontal className="h-5 w-5" />
                    Filtrer les services
                    {activeFilterCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-1 bg-white/20 text-white hover:bg-white/25 tabular-nums"
                      >
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="max-h-[88dvh] flex flex-col">
                  <DrawerHeader className="shrink-0 border-b border-border/50 px-5 pt-3 pb-3 text-left">
                    <DrawerTitle className="flex items-center justify-between gap-2">
                      <span>Filtres de recherche</span>
                      {activeFilterCount > 0 && (
                        <Badge variant="secondary" className="tabular-nums">
                          {activeFilterCount} actif(s)
                        </Badge>
                      )}
                    </DrawerTitle>
                    <DrawerDescription>
                      Affinez les prestations par commune, catégorie, budget ou
                      note.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 py-4">
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
                  <DrawerFooter className="shrink-0 border-t border-border/50 px-5 pt-3 pb-5">
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
      <section ref={resultsRef} className="w-full py-10 sm:py-14">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)] gap-6 xl:gap-8 items-start">
            <aside
              data-services-sidebar="true"
              className="hidden lg:block sticky top-24 min-w-0"
            >
              <div className="relative flex flex-col max-h-[calc(100vh-7rem)] bg-card/75 backdrop-blur-md rounded-2xl border border-border/50 p-5 shadow-elevated">
                <div className="flex items-center justify-between gap-2 pb-3.5 mb-3.5 border-b border-border/50 shrink-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-[hsl(var(--brand))]/10 to-[hsl(var(--brand-foreground))]/10 shrink-0">
                      <Sparkles className="h-4 w-4 text-[hsl(var(--brand))]" />
                    </div>
                    <h2 className="text-base font-bold gradient-brand truncate">
                      Filtres
                    </h2>
                    {activeFilterCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="text-xs font-bold tabular-nums"
                      >
                        {activeFilterCount}
                      </Badge>
                    )}
                  </div>
                  {hasActiveFilters && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={resetFilters}
                      className="h-7 px-2 text-xs shrink-0"
                    >
                      Réinitialiser
                    </Button>
                  )}
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain pr-1 pb-2">
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
            </aside>

            <main className="min-w-0 space-y-5">
              <CatalogLayoutToolbar
                mode={mode}
                onModeChange={handleLayoutChange}
                totalCount={filteredServices.length}
                itemLabel={
                  filteredServices.length > 1
                    ? "prestations disponibles"
                    : "prestation disponible"
                }
              />

              {/* Active removable filter chips */}
              <AnimatePresence mode="popLayout">
                {hasActiveFilters && (
                  <div className="flex flex-wrap items-center gap-2">
                    {searchQuery.trim() && (
                      <PresenceChip key="chip-query">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => handleSearchChange("")}
                          className="h-7 rounded-full gap-1.5 px-3 text-xs font-medium"
                        >
                          <span>Recherche : {searchQuery.trim()}</span>
                          <X className="h-3 w-3" />
                        </Button>
                      </PresenceChip>
                    )}
                    {availableOnly && (
                      <PresenceChip key="chip-avail">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => handleAvailableOnlyChange(false)}
                          className="h-7 rounded-full gap-1.5 px-3 text-xs font-medium"
                        >
                          <span>Disponible aujourd&apos;hui</span>
                          <X className="h-3 w-3" />
                        </Button>
                      </PresenceChip>
                    )}
                    {selectedCity && (
                      <PresenceChip key="chip-city">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => handleCityChange("")}
                          className="h-7 rounded-full gap-1.5 px-3 text-xs font-medium"
                        >
                          <span>Zone : {selectedCity}</span>
                          <X className="h-3 w-3" />
                        </Button>
                      </PresenceChip>
                    )}
                    {selectedCategories.map((catId) => (
                      <PresenceChip key={`chip-cat-${catId}`}>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => handleCategoryToggle(catId)}
                          className="h-7 rounded-full gap-1.5 px-3 text-xs font-medium"
                        >
                          <span>{categoryNameById.get(catId) ?? catId}</span>
                          <X className="h-3 w-3" />
                        </Button>
                      </PresenceChip>
                    ))}
                    {isPriceFiltered && (
                      <PresenceChip key="chip-price">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => handlePriceRangeChange([2000, 150000])}
                          className="h-7 rounded-full gap-1.5 px-3 text-xs font-medium tabular-nums"
                        >
                          <span>
                            {formatFCFA(priceRange[0])} – {formatFCFA(priceRange[1])}
                          </span>
                          <X className="h-3 w-3" />
                        </Button>
                      </PresenceChip>
                    )}
                    {minRating !== null && (
                      <PresenceChip key="chip-rating">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => handleMinRatingChange(null)}
                          className="h-7 rounded-full gap-1.5 px-3 text-xs font-medium tabular-nums"
                        >
                          <span>Note ≥ {minRating}</span>
                          <X className="h-3 w-3" />
                        </Button>
                      </PresenceChip>
                    )}
                  </div>
                )}
              </AnimatePresence>

              {paginatedServices.length > 0 && (
                <m.div
                  key={`${mode}-${safePage}-${filteredServices.length}`}
                  initial={prefersReducedMotion ? false : { opacity: 0.7, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, ease: EASE_OUT_EXPO }}
                  className={cn("grid gap-6", preset.gridClass)}
                >
                  {paginatedServices.map((service) => (
                    <div key={service.id} className="h-full min-w-0">
                      <ServiceListingCard
                        service={service}
                        layout={preset.cardLayout}
                      />
                    </div>
                  ))}
                </m.div>
              )}

              <PresenceFade
                show={filteredServices.length === 0}
                keyId="services-empty"
              >
                <div className="text-center py-20 space-y-4 rounded-2xl border border-dashed border-border/70 bg-card/40">
                  <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
                    <SlidersHorizontal className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-semibold">Aucun service trouvé</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Essayez d&apos;ajuster vos filtres géographiques ou de budget
                    pour voir plus de résultats.
                  </p>
                  <Button variant="outline" onClick={resetFilters}>
                    Réinitialiser les filtres
                  </Button>
                </div>
              </PresenceFade>

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
