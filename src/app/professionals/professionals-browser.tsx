"use client"

import { useMemo, useRef, useState } from "react"
import Link from "next/link"
import { Search, Users, Award, Star, Filter } from "lucide-react"
import { CatalogPagination } from "@/components/catalog-pagination"
import { ProCard } from "@/components/pro-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { CatalogCategory, CatalogProfessional } from "@/lib/types/catalog"

const ITEMS_PER_PAGE = 9

interface ProfessionalsBrowserProps {
  initialProfessionals: CatalogProfessional[]
  categories: CatalogCategory[]
}

export function ProfessionalsBrowser({
  initialProfessionals,
  categories,
}: ProfessionalsBrowserProps) {
  const resultsRef = useRef<HTMLElement>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("ALL")
  const [currentPage, setCurrentPage] = useState(1)

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId)
    setCurrentPage(1)
  }

  const resetFilters = () => {
    setSearchQuery("")
    setSelectedCategoryId("ALL")
    setCurrentPage(1)
  }

  const filteredProfessionals = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return initialProfessionals.filter((pro) => {
      if (selectedCategoryId !== "ALL") {
        const hasCat = pro.services?.some(
          (s) => s.categoryId === selectedCategoryId
        )
        if (!hasCat) return false
      }

      if (q) {
        const hay = `${pro.name} ${pro.title} ${pro.location} ${pro.bio}`.toLowerCase()
        if (!hay.includes(q)) return false
      }

      return true
    })
  }, [initialProfessionals, searchQuery, selectedCategoryId])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProfessionals.length / ITEMS_PER_PAGE)
  )
  const safePage = Math.min(currentPage, totalPages)

  const paginatedProfessionals = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE
    return filteredProfessionals.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredProfessionals, safePage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const averageRating = useMemo(() => {
    if (initialProfessionals.length === 0) return "5.0"
    const total = initialProfessionals.reduce((acc, p) => acc + p.rating, 0)
    return (total / initialProfessionals.length).toFixed(1)
  }, [initialProfessionals])

  return (
    <div className="min-h-screen">
      {/* Hero Header Section */}
      <section className="relative bg-gradient-to-br from-[hsl(var(--brand))]/10 via-background to-[hsl(var(--brand-foreground))]/10 py-14 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="pointer-events-none absolute top-0 left-0 w-full max-w-lg h-[400px] bg-[hsl(var(--brand))]/20 rounded-full blur-3xl -z-10" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-full max-w-md h-[350px] bg-[hsl(var(--brand-foreground))]/20 rounded-full blur-3xl -z-10" />

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center animate-appear">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(var(--brand))]/10 border border-[hsl(var(--brand))]/20 text-xs sm:text-sm font-medium mb-6 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-[hsl(var(--brand))] animate-pulse" />
              <span className="text-[hsl(var(--brand))]">
                PROFESSIONNELS VÉRIFIÉS
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-6 gradient-brand">
              Nos Professionnels
            </h1>

            <p className="text-base sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Découvrez nos artisans qualifiés et expérimentés, prêts à
              intervenir près de chez vous.
              <span className="text-foreground font-medium">
                {" "}
                {filteredProfessionals.length} expert(s) disponible(s)
              </span>{" "}
              dans votre zone.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto animate-appear">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Rechercher un professionnel, un métier ou une commune..."
                  className="pl-12 pr-4 h-12 sm:h-14 text-base sm:text-lg bg-background/80 backdrop-blur-sm border-border/50 focus:border-[hsl(var(--brand))] transition-colors shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full -mt-6 sm:-mt-8 relative z-10 animate-appear">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-card/85 backdrop-blur-sm rounded-2xl p-5 sm:p-6 text-center border border-border/50 shadow-elevated">
              <Users className="h-7 w-7 mx-auto mb-2 text-[hsl(var(--brand))]" />
              <div className="text-2xl sm:text-3xl font-bold mb-1 gradient-brand">
                {initialProfessionals.length}
              </div>
              <div className="text-sm text-muted-foreground">Professionnels</div>
            </div>
            <div className="bg-card/85 backdrop-blur-sm rounded-2xl p-5 sm:p-6 text-center border border-border/50 shadow-elevated">
              <Award className="h-7 w-7 mx-auto mb-2 text-[hsl(var(--brand))]" />
              <div className="text-2xl sm:text-3xl font-bold mb-1 gradient-brand">
                {initialProfessionals.filter((p) => p.isVerified).length}
              </div>
              <div className="text-sm text-muted-foreground">Profils vérifiés</div>
            </div>
            <div className="bg-card/85 backdrop-blur-sm rounded-2xl p-5 sm:p-6 text-center border border-border/50 shadow-elevated">
              <Star className="h-7 w-7 mx-auto mb-2 text-[hsl(var(--brand))]" />
              <div className="text-2xl sm:text-3xl font-bold mb-1 gradient-brand">
                {averageRating}
              </div>
              <div className="text-sm text-muted-foreground">Note moyenne</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section ref={resultsRef} className="w-full py-8 sm:py-12">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 animate-appear">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mr-1">
            <Filter className="h-4 w-4" />
            <span>Filtrer par :</span>
          </div>
          <Button
            type="button"
            size="sm"
            variant={selectedCategoryId === "ALL" ? "default" : "outline"}
            onClick={() => handleCategorySelect("ALL")}
            className="rounded-full"
          >
            Tous les métiers
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              type="button"
              size="sm"
              variant={selectedCategoryId === cat.id ? "default" : "outline"}
              onClick={() => handleCategorySelect(cat.id)}
              className="rounded-full"
            >
              {cat.name}
            </Button>
          ))}
          </div>
        </div>
      </section>

      {/* Professionals Grid */}
      <section className="w-full pb-16 sm:pb-20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {paginatedProfessionals.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {paginatedProfessionals.map((pro) => (
                  <div key={pro.id} className="animate-appear">
                    <ProCard pro={pro} />
                  </div>
                ))}
              </div>

              <CatalogPagination
                currentPage={safePage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <div className="text-center py-16 space-y-4">
              <p className="text-lg font-medium">
                Aucun professionnel ne correspond à votre recherche.
              </p>
              <Button type="button" variant="outline" onClick={resetFilters}>
                Afficher tous les professionnels
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Featured Section */}
      {initialProfessionals.length > 0 && (
        <section className="w-full bg-gradient-to-b from-muted/20 to-background py-14 sm:py-20 relative overflow-hidden">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-10 sm:mb-12 animate-appear">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(var(--brand))]/10 border border-[hsl(var(--brand))]/20 text-xs sm:text-sm font-medium mb-4 backdrop-blur-sm">
                <Star className="h-4 w-4 text-[hsl(var(--brand))]" />
                <span className="text-[hsl(var(--brand))]">LES MIEUX NOTÉS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4 gradient-brand">
                Professionnels d&apos;Excellence
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
                Découvrez nos professionnels les plus appréciés par nos clients
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
              {initialProfessionals.slice(0, 3).map((pro) => (
                <div key={pro.id} className="relative animate-appear">
                  <div className="absolute -top-3 -right-2 sm:-right-3 z-10">
                    <Badge className="bg-[hsl(var(--brand))] text-white px-3 py-1 shadow-lg glow-brand gap-1 font-bold">
                      <Star className="h-3 w-3 fill-current" />
                      TOP
                    </Badge>
                  </div>
                  <ProCard pro={pro} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="w-full py-14 sm:py-20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] text-white rounded-3xl p-6 sm:p-10 md:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-elevated-lg overflow-hidden group glow-brand-lg animate-appear">
            <div className="space-y-4 max-w-2xl relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-tight">
                Vous êtes professionnel ?
              </h2>
              <p className="text-white/90 text-base sm:text-xl leading-relaxed">
                Rejoignez notre réseau d&apos;artisans locaux, gérez vos créneaux
                horaires et développez votre clientèle sans commission sur vos
                travaux.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="relative z-10 w-full md:w-auto whitespace-nowrap text-base sm:text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all duration-300 font-bold bg-white text-[hsl(var(--brand))] hover:bg-white/90"
            >
              <Link href="/register">
                Devenir partenaire
                <span className="ml-2">-&gt;</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
