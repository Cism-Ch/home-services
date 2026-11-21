"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { formatFCFA } from "@/lib/formatters"
import type { CatalogCategory } from "@/lib/types/catalog"
import { CityCombobox } from "@/components/city-combobox"
import type { LocationItem } from "@/lib/cities-data"
import { Banknote, Layers, MapPin, Star } from "lucide-react"

interface ServiceFilterProps {
  categories?: CatalogCategory[]
  selectedCity?: string
  selectedCategories?: string[]
  priceRange?: number[]
  minRating?: number | null
  availableOnly?: boolean
  onCityChange?: (cityId: string) => void
  onCategoryToggle?: (categoryId: string) => void
  onPriceRangeChange?: (range: number[]) => void
  onMinRatingChange?: (rating: number | null) => void
  onAvailableOnlyChange?: (availableOnly: boolean) => void
}

const DEFAULT_CATEGORIES: CatalogCategory[] = [
  { id: "plomberie", name: "Plomberie", description: null, icon: "Droplets" },
  { id: "electricite", name: "Électricité", description: null, icon: "Zap" },
  { id: "climatisation", name: "Climatisation", description: null, icon: "Snowflake" },
  { id: "menage", name: "Ménage", description: null, icon: "Sparkles" },
]

export function ServiceFilter({
  categories = DEFAULT_CATEGORIES,
  selectedCity,
  selectedCategories = [],
  priceRange: controlledPriceRange,
  minRating = null,
  availableOnly = false,
  onCityChange,
  onCategoryToggle,
  onPriceRangeChange,
  onMinRatingChange,
  onAvailableOnlyChange,
}: ServiceFilterProps) {
  const [internalCity, setInternalCity] = useState(selectedCity || "")
  const [internalPriceRange, setInternalPriceRange] = useState([2000, 150000])

  const activeCity = selectedCity !== undefined ? selectedCity : internalCity
  const activePriceRange = controlledPriceRange ?? internalPriceRange

  const handleCitySelect = (location: LocationItem | null) => {
    const cityId = location ? location.id : ""
    setInternalCity(cityId)
    onCityChange?.(cityId)
  }

  const handleSliderChange = (nextRange: number[]) => {
    setInternalPriceRange(nextRange)
    onPriceRangeChange?.(nextRange)
  }

  return (
    <div className="space-y-5">
      {/* Disponibilite aujourd'hui */}
      <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/40 border border-border/60">
        <div className="space-y-0.5 min-w-0">
          <Label htmlFor="available-today" className="text-sm font-semibold cursor-pointer block">
            Disponible aujourd&apos;hui
          </Label>
          <p className="text-xs text-muted-foreground leading-snug">
            Masquer les pros déjà en intervention
          </p>
        </div>
        <Switch
          id="available-today"
          checked={availableOnly}
          onCheckedChange={(checked) => onAvailableOnlyChange?.(checked)}
          className="shrink-0"
        />
      </div>

      {/* Localisation Geo Section */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 pb-1.5 border-b border-border/50">
          <MapPin className="h-3.5 w-3.5 text-[hsl(var(--brand))] shrink-0" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Zone &amp; Ville
          </h3>
        </div>
        <p className="text-xs text-muted-foreground leading-snug">
          Sélectionnez votre commune ou ville en Côte d&apos;Ivoire
        </p>
        <CityCombobox
          value={activeCity}
          onChange={handleCitySelect}
          placeholder="Toutes les villes & communes..."
          className="w-full"
        />
      </div>

      {/* Catégories Section */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 pb-1.5 border-b border-border/50">
          <Layers className="h-3.5 w-3.5 text-[hsl(var(--brand))] shrink-0" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Catégories
          </h3>
        </div>
        <div className="space-y-1">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-muted/50 transition-colors duration-150"
            >
              <Checkbox
                id={`cat-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => onCategoryToggle?.(category.id)}
              />
              <Label
                htmlFor={`cat-${category.id}`}
                className="text-sm font-medium cursor-pointer flex-1 truncate"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Prix Section (FCFA) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-1.5 border-b border-border/50">
          <Banknote className="h-3.5 w-3.5 text-[hsl(var(--brand))] shrink-0" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Budget indicatif
          </h3>
        </div>
        <div className="space-y-3 px-0.5">
          <Slider
            defaultValue={[2000, 150000]}
            min={2000}
            max={150000}
            step={1000}
            value={activePriceRange}
            onValueChange={handleSliderChange}
            className="py-2"
          />
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-muted/40 border border-border/50 px-2.5 py-2">
              <span className="block text-[11px] text-muted-foreground">Minimum</span>
              <span className="text-xs font-bold text-foreground tabular-nums">
                {formatFCFA(activePriceRange[0])}
              </span>
            </div>
            <div className="rounded-lg bg-muted/40 border border-border/50 px-2.5 py-2 text-right">
              <span className="block text-[11px] text-muted-foreground">Maximum</span>
              <span className="text-xs font-bold text-foreground tabular-nums">
                {formatFCFA(activePriceRange[1])}+
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Note Section */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 pb-1.5 border-b border-border/50">
          <Star className="h-3.5 w-3.5 text-[hsl(var(--brand))] shrink-0" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Note minimum
          </h3>
        </div>
        <div className="space-y-1">
          {[4, 3, 2].map((rating) => (
            <div
              key={rating}
              className="group flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-muted/50 transition-colors duration-150"
            >
              <Checkbox
                id={`rating-${rating}`}
                checked={minRating === rating}
                onCheckedChange={(checked) =>
                  onMinRatingChange?.(checked ? rating : null)
                }
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor={`rating-${rating}`}
                className="text-sm font-medium cursor-pointer group-hover:text-primary transition-colors duration-150 flex items-center gap-1.5 flex-1"
              >
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">et plus</span>
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
