"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Users, Shield, Clock, Target, Heart, Zap, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Header Section */}
            <section className="relative bg-gradient-to-br from-[hsl(var(--brand))]/10 via-background to-[hsl(var(--brand-foreground))]/10 py-20 overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[hsl(var(--brand))]/20 rounded-full blur-3xl -z-10" />

                <div className="container mx-auto px-4 relative">
                    <div className="max-w-4xl mx-auto text-center animate-appear opacity-0">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--brand))]/10 border border-[hsl(var(--brand))]/20 text-sm font-medium mb-6 backdrop-blur-sm">
                            <div className="w-2 h-2 rounded-full bg-[hsl(var(--brand))] animate-pulse"></div>
                            <span className="text-[hsl(var(--brand))]">NOTRE HISTOIRE</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 gradient-brand">
                            À propos de HomeService
                        </h1>

                        {/* Description */}
                        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                            Votre plateforme de confiance pour tous vos services à domicile. 
                            Nous connectons les meilleurs professionnels avec les particuliers depuis 2020.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="container mx-auto px-4 py-20">
                <div className="max-w-4xl mx-auto animate-appear opacity-0 delay-300">
                    <div className="bg-gradient-to-br from-[hsl(var(--brand))]/5 to-[hsl(var(--brand-foreground))]/5 rounded-3xl p-12 md:p-16 border border-border/50 shadow-elevated">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-[hsl(var(--brand))]/10 flex items-center justify-center">
                                <Target className="h-6 w-6 text-[hsl(var(--brand))]" />
                            </div>
                            <h2 className="text-3xl font-bold gradient-brand">Notre Mission</h2>
                        </div>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                            Simplifier l&apos;accès aux services à domicile en créant une plateforme de confiance où
                            professionnels qualifiés et particuliers peuvent se rencontrer facilement. Nous croyons
                            que chacun mérite un service de qualité, rapide et transparent.
                        </p>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Notre engagement est de révolutionner l&apos;industrie des services à domicile en offrant
                            une expérience utilisateur exceptionnelle, tant pour nos clients que pour nos professionnels
                            partenaires.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-background to-muted/20">
                <div className="text-center mb-12 animate-appear opacity-0 delay-700">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--brand))]/10 border border-[hsl(var(--brand))]/20 text-sm font-medium mb-6 backdrop-blur-sm">
                        <TrendingUp className="h-4 w-4 text-[hsl(var(--brand))]" />
                        <span className="text-[hsl(var(--brand))]">NOS CHIFFRES CLÉS</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 gradient-brand">
                        HomeService en chiffres
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Une croissance qui témoigne de votre confiance
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    <div className="animate-appear opacity-0" style={{ animationDelay: '900ms' }}>
                        <Card className="text-center border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-elevated-lg transition-all duration-300 group glow-brand">
                            <CardContent className="pt-8 pb-8">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[hsl(var(--brand))]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <Users className="h-8 w-8 text-[hsl(var(--brand))]" />
                                </div>
                                <div className="text-4xl font-bold mb-2 gradient-brand">5,000+</div>
                                <p className="text-sm text-muted-foreground">Clients satisfaits</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="animate-appear opacity-0" style={{ animationDelay: '1000ms' }}>
                        <Card className="text-center border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-elevated-lg transition-all duration-300 group glow-brand">
                            <CardContent className="pt-8 pb-8">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[hsl(var(--brand))]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <Shield className="h-8 w-8 text-[hsl(var(--brand))]" />
                                </div>
                                <div className="text-4xl font-bold mb-2 gradient-brand">500+</div>
                                <p className="text-sm text-muted-foreground">Professionnels certifiés</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="animate-appear opacity-0" style={{ animationDelay: '1100ms' }}>
                        <Card className="text-center border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-elevated-lg transition-all duration-300 group glow-brand">
                            <CardContent className="pt-8 pb-8">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[hsl(var(--brand))]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <Zap className="h-8 w-8 text-[hsl(var(--brand))]" />
                                </div>
                                <div className="text-4xl font-bold mb-2 gradient-brand">50+</div>
                                <p className="text-sm text-muted-foreground">Services disponibles</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="animate-appear opacity-0" style={{ animationDelay: '1200ms' }}>
                        <Card className="text-center border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-elevated-lg transition-all duration-300 group glow-brand">
                            <CardContent className="pt-8 pb-8">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[hsl(var(--brand))]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <Heart className="h-8 w-8 text-[hsl(var(--brand))]" />
                                </div>
                                <div className="text-4xl font-bold mb-2 gradient-brand">4.8/5</div>
                                <p className="text-sm text-muted-foreground">Note moyenne</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="container mx-auto px-4 py-20">
                <div className="text-center mb-12 animate-appear opacity-0">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--brand))]/10 border border-[hsl(var(--brand))]/20 text-sm font-medium mb-6 backdrop-blur-sm">
                        <Heart className="h-4 w-4 text-[hsl(var(--brand))]" />
                        <span className="text-[hsl(var(--brand))]">NOS VALEURS</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 gradient-brand">
                        Ce qui nous guide
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Des valeurs fortes au service de votre satisfaction
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-elevated-lg transition-all duration-300 animate-appear opacity-0 delay-300">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-[hsl(var(--brand))]/10 flex items-center justify-center flex-shrink-0">
                                    <Users className="h-7 w-7 text-[hsl(var(--brand))]" />
                                </div>
                                <CardTitle className="text-xl">Professionnels Vérifiés</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed">
                                Tous nos professionnels sont soigneusement sélectionnés et vérifiés pour garantir
                                la qualité de leurs services. Certifications, assurances et références sont systématiquement contrôlées.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-elevated-lg transition-all duration-300 animate-appear opacity-0 delay-700">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-[hsl(var(--brand))]/10 flex items-center justify-center flex-shrink-0">
                                    <Shield className="h-7 w-7 text-[hsl(var(--brand))]" />
                                </div>
                                <CardTitle className="text-xl">Paiement Sécurisé</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed">
                                Vos paiements sont sécurisés et vous bénéficiez d&apos;une garantie sur tous les travaux effectués.
                                Protection complète de vos données bancaires et transactions cryptées.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-elevated-lg transition-all duration-300 animate-appear opacity-0 delay-1000">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-[hsl(var(--brand))]/10 flex items-center justify-center flex-shrink-0">
                                    <Clock className="h-7 w-7 text-[hsl(var(--brand))]" />
                                </div>
                                <CardTitle className="text-xl">Intervention Rapide</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed">
                                Réservez en quelques clics et bénéficiez d&apos;une intervention rapide selon vos disponibilités.
                                Professionnels disponibles 7j/7 pour répondre à vos urgences.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-elevated-lg transition-all duration-300 animate-appear opacity-0" style={{ animationDelay: '1300ms' }}>
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-[hsl(var(--brand))]/10 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 className="h-7 w-7 text-[hsl(var(--brand))]" />
                                </div>
                                <CardTitle className="text-xl">Satisfaction Garantie</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed">
                                Notre service client est à votre écoute pour garantir votre satisfaction à chaque étape.
                                Support disponible et résolution rapide de tout problème.
                            </p>
                        </CardContent>
                    </Card>
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
                            Rejoignez l&apos;aventure
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold leading-tight">Prêt à nous rejoindre ?</h2>
                        <p className="text-white/90 text-xl leading-relaxed">
                            Que vous soyez un professionnel souhaitant développer votre activité ou un particulier 
                            à la recherche de services de qualité, nous sommes là pour vous.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button 
                                size="lg" 
                                variant="secondary" 
                                className="text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-bold bg-white text-[hsl(var(--brand))] hover:bg-white/90"
                            >
                                Devenir professionnel
                                <span className="ml-2">→</span>
                            </Button>
                            <Button 
                                size="lg" 
                                variant="outline" 
                                className="text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-bold border-white/20 text-white hover:bg-white/10"
                            >
                                Trouver un service
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
