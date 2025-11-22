import { ServiceFilter } from "@/components/service-filter"
import { ServiceListingCard } from "@/components/service-listing-card"
import { services } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"

export default function ServicesPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Nos Services</h1>
                    <p className="text-muted-foreground mt-1">
                        {services.length} services disponibles près de chez vous
                    </p>
                </div>

                {/* Mobile Filter Button */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <SlidersHorizontal className="h-4 w-4" />
                                Filtres
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                            <div className="py-6">
                                <ServiceFilter />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Desktop Sidebar */}
                <aside className="hidden md:block col-span-1">
                    <div className="sticky top-24">
                        <ServiceFilter />
                    </div>
                </aside>

                {/* Service Grid */}
                <main className="col-span-1 md:col-span-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service) => (
                            <ServiceListingCard key={service.id} service={service} />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    )
}
