"use client"

import { ServiceFilter } from "@/components/service-filter"
import { ServiceListingCard } from "@/components/service-listing-card"
import { services } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal, Sparkles } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet"

export default function ServicesPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Header Section */}
            <section className="relative bg-gradient-to-br from-[hsl(var(--brand))]/10 via-background to-[hsl(var(--brand-foreground))]/10 py-20 overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[hsl(var(--brand))]/20 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[hsl(var(--brand-foreground))]/20 rounded-full blur-3xl -z-10" />

                <div className="container mx-auto px-4 relative">
                    <div className="max-w-4xl mx-auto text-center animate-appear opacity-0">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--brand))]/10 border border-[hsl(var(--brand))]/20 text-sm font-medium mb-6 backdrop-blur-sm">
                            <div className="w-2 h-2 rounded-full bg-[hsl(var(--brand))] animate-pulse"></div>
                            <span className="text-[hsl(var(--brand))]">TROUVEZ LE SERVICE PARFAIT</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 gradient-brand">
                            Tous nos Services
                        </h1>

                        {/* Description */}
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                            Découvrez notre gamme complète de services professionnels pour votre maison.
                            <span className="text-foreground font-medium"> {services.length} services disponibles</span> près de chez vous.
                        </p>

                        {/* Mobile Filter Button */}
                        <div className="md:hidden mt-8">
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
                                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                                    <SheetTitle className="sr-only">Filtres de recherche</SheetTitle>
                                    <div className="py-6">
                                        <ServiceFilter />
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
                    {/* Desktop Sidebar with enhanced styling */}
                    <aside className="hidden md:block col-span-1">
                        <div className="sticky top-24 animate-appear opacity-0 delay-300">
                            <div className="relative bg-card/60 backdrop-blur-md rounded-2xl border border-border/50 p-6 shadow-elevated overflow-hidden group hover:shadow-elevated-lg transition-shadow duration-500">
                                {/* Decorative gradient background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--brand))]/5 via-transparent to-[hsl(var(--brand-foreground))]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Content */}
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border/50">
                                        <div className="p-2 rounded-lg bg-gradient-to-br from-[hsl(var(--brand))]/10 to-[hsl(var(--brand-foreground))]/10">
                                            <Sparkles className="h-5 w-5 text-[hsl(var(--brand))]" />
                                        </div>
                                        <h2 className="text-lg font-bold gradient-brand">Filtres</h2>
                                    </div>
                                    <ServiceFilter />
                                </div>

                                {/* Decorative corner accent */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-[hsl(var(--brand))]/10 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>
                        </div>
                    </aside>

                    {/* Service Grid */}
                    <main className="col-span-1 md:col-span-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {services.map((service, index) => (
                                <div
                                    key={service.id}
                                    className="animate-appear opacity-0"
                                    style={{ animationDelay: `${100 + index * 50}ms` }}
                                >
                                    <ServiceListingCard service={service} />
                                </div>
                            ))}
                        </div>

                        {/* Empty state if needed */}
                        {services.length === 0 && (
                            <div className="text-center py-20 animate-appear opacity-0">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                                    <SlidersHorizontal className="h-10 w-10 text-muted-foreground" />
                                </div>
                                <h3 className="text-2xl font-semibold mb-2">Aucun service trouvé</h3>
                                <p className="text-muted-foreground">
                                    Essayez d&apos;ajuster vos filtres pour voir plus de résultats.
                                </p>
                            </div>
                        )}
                    </main>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 py-20">
                <div className="relative bg-gradient-to-br from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] text-white rounded-3xl p-12 md:p-16 text-center shadow-elevated-lg overflow-hidden group glow-brand-lg animate-appear opacity-0 delay-700">
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-6 backdrop-blur-sm">
                            <Sparkles className="h-4 w-4" />
                            VOUS ÊTES PROFESSIONNEL ?
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Proposez vos services sur notre plateforme
                        </h2>
                        <p className="text-white/90 text-lg mb-8 leading-relaxed">
                            Rejoignez notre réseau de professionnels qualifiés et développez votre activité.
                            Inscription gratuite et commissions attractives.
                        </p>
                        <Button
                            size="lg"
                            variant="secondary"
                            className="text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-bold bg-white text-[hsl(var(--brand))] hover:bg-white/90"
                        >
                            Devenir partenaire
                            <span className="ml-2">→</span>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
