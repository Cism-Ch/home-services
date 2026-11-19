import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, FileText, Shield, Award, ArrowRight } from "lucide-react"

const featuredServices = [
  {
    icon: Clock,
    title: "Créneaux garantis 7j/7",
    description:
      "Bloquez instantanément un créneau libre dans l'agenda réel de l'artisan près de votre commune.",
    features: ["Agenda temps réel", "Statut disponible en direct", "Sans double réservation"],
    color: "from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))]",
  },
  {
    icon: FileText,
    title: "Contact & devis gratuits",
    description:
      "Discutez directement par téléphone ou note vocale WhatsApp avant de valider l'intervention.",
    features: ["0 % commission travaux", "Aucun paiement en ligne requis", "Tarif indicatif en FCFA"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Shield,
    title: "Artisans vérifiés (KYC)",
    description:
      "Les professionnels vérifiés déposent leur CNI ou registre RCCM contrôlé par notre équipe.",
    features: ["Identité vérifiée", "Portfolio de chantiers réels", "Zone d'action précisée"],
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Award,
    title: "Suivi & avis mutuels",
    description:
      "Confirmez la fin de tâche depuis votre espace et évaluez la prestation de manière réciproque.",
    features: ["Suivi d'avancement clair", "Notes client et artisan", "Historique complet"],
    color: "from-purple-500 to-pink-500",
  },
]

export function FeaturedServices() {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
      <div className="pointer-events-none absolute top-0 left-0 w-full max-w-lg h-[400px] bg-[hsl(var(--brand))]/5 rounded-full blur-3xl -z-10" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-full max-w-lg h-[400px] bg-[hsl(var(--brand-foreground))]/5 rounded-full blur-3xl -z-10" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-10 md:mb-16 animate-appear">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[hsl(var(--brand))] mb-3 bg-[hsl(var(--brand))]/10 px-4 py-1.5 rounded-full">
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--brand))] animate-pulse" />
            NOS AVANTAGES
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-4 gradient-brand">
            Pourquoi nous choisir ?
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
            Des prestations locales encadrées, transparentes et sans intermédiaire financier
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredServices.map((service) => {
            const Icon = service.icon
            return (
              <Card
                key={service.title}
                className="group relative overflow-hidden transition-all duration-300 shadow-md hover:shadow-2xl hover:-translate-y-1 border-2 hover:border-[hsl(var(--brand))]/30 bg-card/80 backdrop-blur-sm animate-appear"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`}
                />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 glow-brand pointer-events-none" />

                <CardHeader className="relative pb-4">
                  <div className="mb-4 inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--brand))]/10 to-[hsl(var(--brand-foreground))]/10 transition-transform duration-300 group-hover:scale-105">
                    <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-[hsl(var(--brand))]" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-bold group-hover:text-[hsl(var(--brand))] transition-colors duration-300">
                    {service.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="relative space-y-4">
                  <CardDescription className="text-sm leading-relaxed">
                    {service.description}
                  </CardDescription>

                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--brand))] shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="w-full group/btn mt-2 hover:bg-[hsl(var(--brand))]/10 hover:text-[hsl(var(--brand))]"
                  >
                    <Link href="/services">
                      Découvrir les services
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>

                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${service.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
                />
              </Card>
            )
          })}
        </div>

        <div className="mt-12 md:mt-16 text-center animate-appear">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-[hsl(var(--brand))]/5 via-[hsl(var(--brand-foreground))]/5 to-[hsl(var(--brand))]/5 border border-[hsl(var(--brand))]/20 rounded-2xl p-6 sm:p-8 backdrop-blur-sm max-w-full">
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-bold mb-1 gradient-brand">
                Prêt à commencer ?
              </h3>
              <p className="text-sm text-muted-foreground">
                Choisissez votre service et réservez un créneau en 1 minute
              </p>
            </div>
            <Button asChild size="lg" className="w-full sm:w-auto font-semibold shadow-lg">
              <Link href="/services">
                Voir tous les services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
