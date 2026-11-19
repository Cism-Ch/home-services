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
import { Star, MapPin } from "lucide-react"

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
    <div className="space-y-6">
      {/* Disponibilite aujourd'hui */}
      <div className="flex items-center justify-between gap-2 p-3 rounded-lg bg-muted/40 border">
        <div className="space-y-0.5">
          <Label htmlFor="available-today" className="text-sm font-medium cursor-pointer">
            Disponible aujourd&apos;hui
          </Label>
          <p className="text-xs text-muted-foreground">
            Masquer les pros déjà en intervention
          </p>
        </div>
        <Switch
          id="available-today"
          checked={availableOnly}
          onCheckedChange={(checked) => onAvailableOnlyChange?.(checked)}
        />
      </div>

      {/* Localisation Geo Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
          <MapPin className="h-3.5 w-3.5 text-primary" />
          Zone & Ville
          <div className="h-px flex-1 bg-gradient-to-l from-border to-transparent" />
        </h3>
        <p className="text-xs text-muted-foreground">
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
      <div className="space-y-4 pt-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
          Catégories
          <div className="h-px flex-1 bg-gradient-to-l from-border to-transparent" />
        </h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => onCategoryToggle?.(category.id)}
              />
              <Label
                htmlFor={`cat-${category.id}`}
                className="text-sm font-normal cursor-pointer hover:text-primary transition-colors duration-200"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Prix Section (FCFA) */}
      <div className="space-y-4 pt-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
          Budget indicatif
          <div className="h-px flex-1 bg-gradient-to-l from-border to-transparent" />
        </h3>
        <div className="space-y-4 px-1">
          <Slider
            defaultValue={[2000, 150000]}
            min={2000}
            max={150000}
            step={1000}
            value={activePriceRange}
            onValueChange={handleSliderChange}
            className="py-4"
          />
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Minimum</span>
              <span className="text-sm font-bold text-foreground">
                {formatFCFA(activePriceRange[0])}
              </span>
            </div>
            <div className="h-px flex-1 mx-3 bg-border" />
            <div className="flex flex-col items-end">
              <span className="text-xs text-muted-foreground">Maximum</span>
              <span className="text-sm font-bold text-foreground">
                {formatFCFA(activePriceRange[1])}+
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Note Section */}
      <div className="space-y-4 pt-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
          Note minimum
          <div className="h-px flex-1 bg-gradient-to-l from-border to-transparent" />
        </h3>
        <div className="space-y-3">
          {[4, 3, 2].map((rating) => (
            <div
              key={rating}
              className="group flex items-center space-x-3 p-2 rounded-lg hover:bg-accent/5 transition-colors duration-200 cursor-pointer"
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
                className="text-sm font-medium cursor-pointer group-hover:text-primary transition-colors duration-200 flex items-center gap-1"
              >
                <div className="flex items-center">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <span className="ml-1">et plus</span>
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
