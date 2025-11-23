"use client"

import { professionals } from "@/lib/mock-data"
import { ProCard } from "@/components/pro-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Users, Award, Star, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function ProfessionalsPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Header Section */}
            <section className="relative bg-gradient-to-br from-[hsl(var(--brand))]/10 via-background to-[hsl(var(--brand-foreground))]/10 py-20 overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[hsl(var(--brand))]/20 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[hsl(var(--brand-foreground))]/20 rounded-full blur-3xl -z-10" />

                <div className="container mx-auto px-4 relative">
                    <div className="max-w-4xl mx-auto text-center animate-appear opacity-0">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--brand))]/10 border border-[hsl(var(--brand))]/20 text-sm font-medium mb-6 backdrop-blur-sm">
                            <div className="w-2 h-2 rounded-full bg-[hsl(var(--brand))] animate-pulse"></div>
                            <span className="text-[hsl(var(--brand))]">PROFESSIONNELS VÉRIFIÉS</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 gradient-brand">
                            Nos Professionnels
                        </h1>

                        {/* Description */}
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                            Découvrez nos professionnels qualifiés et expérimentés, prêts à répondre à tous vos besoins. 
                            <span className="text-foreground font-medium"> {professionals.length} experts disponibles</span> dans votre région.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto animate-appear opacity-0 delay-300">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input 
                                    placeholder="Rechercher un professionnel ou un service..." 
                                    className="pl-12 pr-4 h-14 text-lg bg-background/80 backdrop-blur-sm border-border/50 focus:border-[hsl(var(--brand))] transition-colors shadow-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="container mx-auto px-4 -mt-8 relative z-10 animate-appear opacity-0 delay-700">
                <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4">
                    <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-border/50 shadow-elevated hover:shadow-elevated-lg transition-all duration-300 glow-brand">
                        <Users className="h-8 w-8 mx-auto mb-3 text-[hsl(var(--brand))]" />
                        <div className="text-3xl font-bold mb-1 gradient-brand">{professionals.length}+</div>
                        <div className="text-sm text-muted-foreground">Professionnels</div>
                    </div>
                    <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-border/50 shadow-elevated hover:shadow-elevated-lg transition-all duration-300 glow-brand">
                        <Award className="h-8 w-8 mx-auto mb-3 text-[hsl(var(--brand))]" />
                        <div className="text-3xl font-bold mb-1 gradient-brand">100%</div>
                        <div className="text-sm text-muted-foreground">Certifiés</div>
                    </div>
                    <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-border/50 shadow-elevated hover:shadow-elevated-lg transition-all duration-300 glow-brand">
                        <Star className="h-8 w-8 mx-auto mb-3 text-[hsl(var(--brand))]" />
                        <div className="text-3xl font-bold mb-1 gradient-brand">4.8</div>
                        <div className="text-sm text-muted-foreground">Note moyenne</div>
                    </div>
                </div>
            </section>

            {/* Filters Section */}
            <section className="container mx-auto px-4 py-12">
                <div className="flex flex-wrap items-center gap-3 mb-8 animate-appear opacity-0 delay-1000">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Filter className="h-4 w-4" />
                        <span>Filtrer par:</span>
                    </div>
                    <Badge 
                        variant="secondary" 
                        className="cursor-pointer hover:bg-[hsl(var(--brand))] hover:text-white transition-all duration-300 text-sm px-4 py-2"
                    >
                        Tous les services
                    </Badge>
                    <Badge 
                        variant="outline" 
                        className="cursor-pointer hover:bg-[hsl(var(--brand))] hover:text-white hover:border-[hsl(var(--brand))] transition-all duration-300 text-sm px-4 py-2"
                    >
                        Plomberie
                    </Badge>
                    <Badge 
                        variant="outline" 
                        className="cursor-pointer hover:bg-[hsl(var(--brand))] hover:text-white hover:border-[hsl(var(--brand))] transition-all duration-300 text-sm px-4 py-2"
                    >
                        Électricité
                    </Badge>
                    <Badge 
                        variant="outline" 
                        className="cursor-pointer hover:bg-[hsl(var(--brand))] hover:text-white hover:border-[hsl(var(--brand))] transition-all duration-300 text-sm px-4 py-2"
                    >
                        Climatisation
                    </Badge>
                    <Badge 
                        variant="outline" 
                        className="cursor-pointer hover:bg-[hsl(var(--brand))] hover:text-white hover:border-[hsl(var(--brand))] transition-all duration-300 text-sm px-4 py-2"
                    >
                        Nettoyage
                    </Badge>
                </div>
            </section>

            {/* Professionals Grid */}
            <section className="container mx-auto px-4 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {professionals.map((pro, index) => (
                        <div
                            key={pro.id}
                            className="animate-appear opacity-0"
                            style={{ animationDelay: `${100 + index * 75}ms` }}
                        >
                            <ProCard pro={pro} />
                        </div>
                    ))}
                </div>

                {/* Load More Button */}
                <div className="text-center mt-12 animate-appear opacity-0 delay-1000">
                    <Button 
                        size="lg" 
                        variant="outline"
                        className="gap-2 hover:bg-[hsl(var(--brand))] hover:text-white hover:border-[hsl(var(--brand))] transition-all duration-300 px-8"
                    >
                        Voir plus de professionnels
                        <span className="inline-block transition-transform group-hover:translate-y-1">↓</span>
                    </Button>
                </div>
            </section>

            {/* Featured Section - Best Professionals */}
            <section className="bg-gradient-to-b from-muted/20 to-background py-20 relative overflow-hidden">
                {/* Subtle grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[hsl(var(--brand-foreground))]/10 rounded-full blur-3xl -z-10" />

                <div className="container mx-auto px-4 relative">
                    <div className="text-center mb-12 animate-appear opacity-0">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--brand))]/10 border border-[hsl(var(--brand))]/20 text-sm font-medium mb-6 backdrop-blur-sm">
                            <Star className="h-4 w-4 text-[hsl(var(--brand))]" />
                            <span className="text-[hsl(var(--brand))]">LES MIEUX NOTÉS</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 gradient-brand">
                            Professionnels d&apos;Excellence
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Découvrez nos professionnels les plus appréciés par nos clients
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {professionals.slice(0, 3).map((pro, index) => (
                            <div
                                key={pro.id}
                                className="animate-appear opacity-0"
                                style={{ animationDelay: `${300 + index * 100}ms` }}
                            >
                                <div className="relative">
                                    {/* Featured badge */}
                                    <div className="absolute -top-3 -right-3 z-10">
                                        <div className="bg-[hsl(var(--brand))] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg glow-brand">
                                            ⭐ TOP
                                        </div>
                                    </div>
                                    <ProCard pro={pro} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 py-20">
                <div className="relative bg-gradient-to-br from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] text-white rounded-3xl p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 shadow-elevated-lg overflow-hidden group glow-brand-lg animate-appear opacity-0">
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

                    <div className="space-y-6 max-w-2xl relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-2 backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                            </span>
                            Rejoignez-nous
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold leading-tight">Vous êtes professionnel ?</h2>
                        <p className="text-white/90 text-xl leading-relaxed">
                            Rejoignez notre réseau d&apos;experts et développez votre activité. Inscription gratuite et sans engagement.
                        </p>
                        <ul className="space-y-3 text-white/90">
                            <li className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm backdrop-blur-sm">✓</span>
                                Accès à des milliers de clients potentiels
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm backdrop-blur-sm">✓</span>
                                Gestion simplifiée de vos missions
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm backdrop-blur-sm">✓</span>
                                Paiements sécurisés et rapides
                            </li>
                        </ul>
                    </div>
                    <Button 
                        size="lg" 
                        variant="secondary" 
                        className="relative z-10 whitespace-nowrap text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-bold bg-white text-[hsl(var(--brand))] hover:bg-white/90"
                    >
                        Devenir partenaire
                        <span className="ml-2">→</span>
                    </Button>
                </div>
            </section>
        </div>
    )
}
