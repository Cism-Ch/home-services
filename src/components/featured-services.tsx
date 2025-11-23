"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, FileText, Shield, Award, ArrowRight } from "lucide-react"

const featuredServices = [
  {
    icon: Clock,
    title: "Services d'urgence 24/7",
    description: "Disponibilité garantie pour tous vos besoins urgents à toute heure du jour et de la nuit.",
    features: ["Intervention rapide", "Disponible 7j/7", "Équipes qualifiées"],
    color: "from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))]"
  },
  {
    icon: FileText,
    title: "Devis gratuit en ligne",
    description: "Recevez votre devis détaillé gratuitement en quelques minutes sans engagement.",
    features: ["100% gratuit", "Réponse rapide", "Sans engagement"],
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Shield,
    title: "Professionnels certifiés",
    description: "Tous nos professionnels sont vérifiés, certifiés et assurés pour votre tranquillité.",
    features: ["Vérification complète", "Certifications valides", "Assurance pro"],
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Award,
    title: "Garantie satisfaction",
    description: "Votre satisfaction est notre priorité avec notre garantie satisfait ou remboursé.",
    features: ["100% satisfait", "Service après-vente", "Suivi personnalisé"],
    color: "from-purple-500 to-pink-500"
  },
]

export function FeaturedServices() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[hsl(var(--brand))]/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[hsl(var(--brand-foreground))]/5 rounded-full blur-3xl -z-10" />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-16 animate-appear opacity-0">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--brand))] mb-3 bg-[hsl(var(--brand))]/10 px-4 py-2 rounded-full">
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--brand))] animate-pulse"></div>
            NOS AVANTAGES
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 gradient-brand">
            Pourquoi nous choisir ?
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Des services de qualité avec des garanties exceptionnelles pour votre sérénité
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredServices.map((service, index) => {
            const Icon = service.icon
            return (
              <Card
                key={service.title}
                className="group relative overflow-hidden cursor-pointer transition-all duration-300 shadow-md hover:shadow-2xl hover:-translate-y-2 border-2 hover:border-[hsl(var(--brand))]/30 bg-card/80 backdrop-blur-sm animate-appear opacity-0"
                style={{
                  animationDelay: `${100 + index * 100}ms`
                }}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 glow-brand" />
                
                <CardHeader className="relative pb-4">
                  <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--brand))]/10 to-[hsl(var(--brand-foreground))]/10 group-hover:from-[hsl(var(--brand))]/20 group-hover:to-[hsl(var(--brand-foreground))]/20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 transform">
                    <Icon className="h-8 w-8 text-[hsl(var(--brand))] group-hover:text-[hsl(var(--brand-foreground))] transition-all duration-500" />
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-[hsl(var(--brand))] transition-colors duration-300">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="relative space-y-4">
                  <CardDescription className="text-sm leading-relaxed group-hover:text-foreground transition-colors duration-300">
                    {service.description}
                  </CardDescription>
                  
                  {/* Features list */}
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--brand))] flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {/* Learn More Button */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full group/btn mt-4 hover:bg-[hsl(var(--brand))]/10 hover:text-[hsl(var(--brand))]"
                  >
                    En savoir plus
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </CardContent>
                
                {/* Bottom accent border */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${service.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
              </Card>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center animate-appear opacity-0 delay-700">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-[hsl(var(--brand))]/5 via-[hsl(var(--brand-foreground))]/5 to-[hsl(var(--brand))]/5 border border-[hsl(var(--brand))]/20 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
            <div className="text-left">
              <h3 className="text-xl font-bold mb-1 gradient-brand">
                Prêt à commencer ?
              </h3>
              <p className="text-sm text-muted-foreground">
                Réservez votre service dès maintenant
              </p>
            </div>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 whitespace-nowrap font-semibold"
            >
              Voir tous les services
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}