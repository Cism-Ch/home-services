import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  RevealOnScroll,
  StaggerGrid,
  StaggerItem,
} from "@/components/motion/reveal"
import { Clock, FileText, Shield, Award, ArrowRight, Check } from "lucide-react"

const featuredServices = [
  {
    number: "01",
    icon: Clock,
    title: "Créneaux garantis 7j/7",
    description:
      "Bloquez instantanément un créneau libre dans l'agenda réel de l'artisan près de votre commune.",
    features: ["Agenda temps réel", "Statut disponible en direct", "Sans double réservation"],
    color: "from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))]",
    accent: "text-[hsl(var(--brand))] bg-[hsl(var(--brand))]/10 ring-[hsl(var(--brand))]/20",
  },
  {
    number: "02",
    icon: FileText,
    title: "Contact & devis gratuits",
    description:
      "Discutez directement par téléphone ou note vocale WhatsApp avant de valider l'intervention.",
    features: ["0 % commission travaux", "Aucun paiement en ligne requis", "Tarif indicatif en FCFA"],
    color: "from-blue-500 to-cyan-500",
    accent: "text-blue-500 bg-blue-500/10 ring-blue-500/20",
  },
  {
    number: "03",
    icon: Shield,
    title: "Artisans vérifiés (KYC)",
    description:
      "Les professionnels vérifiés déposent leur CNI ou registre RCCM contrôlé par notre équipe.",
    features: ["Identité vérifiée", "Portfolio de chantiers réels", "Zone d'action précisée"],
    color: "from-emerald-500 to-teal-500",
    accent: "text-emerald-500 bg-emerald-500/10 ring-emerald-500/20",
  },
  {
    number: "04",
    icon: Award,
    title: "Suivi & avis mutuels",
    description:
      "Confirmez la fin de tâche depuis votre espace et évaluez la prestation de manière réciproque.",
    features: ["Suivi d'avancement clair", "Notes client et artisan", "Historique complet"],
    color: "from-purple-500 to-pink-500",
    accent: "text-purple-500 bg-purple-500/10 ring-purple-500/20",
  },
]

/**
 * Cartes de presentation des engagements HomeServices affichees apres la recherche Hero.
 */
export function FeaturedServices() {
  return (
    <section className="w-full py-12 md:py-20 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_65%_50%_at_50%_50%,hsla(var(--brand)/0.05)_0%,transparent_74%)]"
      />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 relative">
        <RevealOnScroll className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[hsl(var(--brand))] mb-3 bg-[hsl(var(--brand))]/10 px-4 py-1.5 rounded-full">
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--brand))] animate-pulse" />
            NOS AVANTAGES
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight mb-4 gradient-brand">
            Pourquoi nous choisir ?
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
            Des prestations locales encadrées, transparentes et sans intermédiaire financier
          </p>
        </RevealOnScroll>

        <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredServices.map((service) => {
            const Icon = service.icon
            return (
              <StaggerItem key={service.title}>
                <Card className="flex flex-col h-full group relative overflow-hidden rounded-2xl transition-[transform,box-shadow,border-color] duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1.5 border border-border/60 hover:border-[hsl(var(--brand))]/40 bg-card/85 backdrop-blur-sm">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500 pointer-events-none`}
                  />

                  <CardHeader className="relative pb-3">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div
                        className={`inline-flex items-center justify-center w-13 h-13 rounded-2xl ring-1 transition-transform duration-300 group-hover:scale-105 ${service.accent}`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-xs font-extrabold tracking-widest text-muted-foreground/45 tabular-nums group-hover:text-[hsl(var(--brand))]/75 transition-colors">
                        {service.number}
                      </span>
                    </div>
                    <CardTitle className="text-lg sm:text-xl font-extrabold tracking-tight group-hover:text-[hsl(var(--brand))] transition-colors duration-300">
                      {service.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="relative flex-1 space-y-4">
                    <CardDescription className="text-sm leading-relaxed">
                      {service.description}
                    </CardDescription>

                    <ul className="space-y-2 pt-1">
                      {service.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-xs font-medium text-muted-foreground"
                        >
                          <span className="inline-flex size-4 items-center justify-center rounded-full bg-[hsl(var(--brand))]/12 text-[hsl(var(--brand))] shrink-0">
                            <Check className="h-2.5 w-2.5" aria-hidden="true" />
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="relative mt-auto pt-2">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="w-full justify-between group/btn hover:bg-[hsl(var(--brand))]/10 hover:text-[hsl(var(--brand))] font-semibold"
                    >
                      <Link href="/services">
                        <span>Découvrir les services</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </Button>
                  </CardFooter>

                  <div
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${service.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
                  />
                </Card>
              </StaggerItem>
            )
          })}
        </StaggerGrid>

        <RevealOnScroll className="mt-12 md:mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-card/85 border border-border/60 rounded-2xl p-6 sm:p-8 shadow-sm backdrop-blur-sm max-w-full">
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-extrabold mb-1 gradient-brand">
                Prêt à commencer ?
              </h3>
              <p className="text-sm text-muted-foreground">
                Choisissez votre service et réservez un créneau en 1 minute
              </p>
            </div>
            <Button asChild size="lg" className="w-full sm:w-auto font-bold shadow-md rounded-xl">
              <Link href="/services">
                Voir tous les services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
