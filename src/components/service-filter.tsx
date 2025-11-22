"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { categories } from "@/lib/mock-data"
import { useState } from "react"

export function ServiceFilter() {
    const [priceRange, setPriceRange] = useState([0, 500])

    return (
        <div className="space-y-8">
            <div>
                <h3 className="mb-4 text-lg font-semibold">Catégories</h3>
                <div className="space-y-3">
                    {categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                            <Checkbox id={category.id} />
                            <Label
                                htmlFor={category.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {category.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="mb-4 text-lg font-semibold">Prix (Taux horaire)</h3>
                <div className="space-y-4">
                    <Slider
                        defaultValue={[0, 500]}
                        max={500}
                        step={10}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        className="py-4"
                    />
                    <div className="flex items-center justify-between text-sm">
                        <span>{priceRange[0]}€</span>
                        <span>{priceRange[1]}€+</span>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="mb-4 text-lg font-semibold">Note minimum</h3>
                <div className="space-y-3">
                    {[4, 3, 2].map((rating) => (
                        <div key={rating} className="flex items-center space-x-2">
                            <Checkbox id={`rating-${rating}`} />
                            <Label htmlFor={`rating-${rating}`} className="text-sm">
                                {rating} étoiles et plus
                            </Label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
