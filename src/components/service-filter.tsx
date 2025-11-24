"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { categories } from "@/lib/mock-data"
import { useState } from "react"
import { Star } from "lucide-react"

export function ServiceFilter() {
    const [priceRange, setPriceRange] = useState([0, 500])

    return (
        <div className="space-y-6">
            {/* Catégories Section */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
                    Catégories
                    <div className="h-px flex-1 bg-gradient-to-l from-border to-transparent" />
                </h3>
                <div className="space-y-3">
                    {categories.map((category) => (
                        <div key={category.id} className="flex items-center gap-2">
                            <Checkbox id={category.id} />
                            <Label
                                htmlFor={category.id}
                                className="text-sm font-normal cursor-pointer hover:text-[hsl(var(--brand))] transition-colors duration-200"
                            >
                                {category.name}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Prix Section */}
            <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
                    Prix
                    <div className="h-px flex-1 bg-gradient-to-l from-border to-transparent" />
                </h3>
                <div className="space-y-4 px-1">
                    <Slider
                        defaultValue={[0, 500]}
                        max={500}
                        step={10}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        className="py-4"
                    />
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Minimum</span>
                            <span className="text-sm font-bold text-foreground">{priceRange[0]}€</span>
                        </div>
                        <div className="h-px flex-1 mx-3 bg-border" />
                        <div className="flex flex-col items-end">
                            <span className="text-xs text-muted-foreground">Maximum</span>
                            <span className="text-sm font-bold text-foreground">{priceRange[1]}€+</span>
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
                                className="data-[state=checked]:bg-[hsl(var(--brand))] data-[state=checked]:border-[hsl(var(--brand))]"
                            />
                            <Label
                                htmlFor={`rating-${rating}`}
                                className="text-sm font-medium cursor-pointer group-hover:text-[hsl(var(--brand))] transition-colors duration-200 flex items-center gap-1"
                            >
                                <div className="flex items-center">
                                    {Array.from({ length: rating }).map((_, i) => (
                                        <Star key={i} className="h-3.5 w-3.5 fill-[hsl(var(--brand))] text-[hsl(var(--brand))]" />
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
