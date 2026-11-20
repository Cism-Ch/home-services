import { ServiceCard } from "@/components/service-card"
import { ProCard } from "@/components/pro-card"
import { Button } from "@/components/ui/button"
import { Zap, Wrench, Droplets, Paintbrush, Shovel, Tv, Briefcase } from "lucide-react"
import Link from "next/link"
import { HeroSection } from "@/components/marketing/hero-section"
import { QuickSearch } from "@/components/quick-search"
import { FeaturedServices } from "@/components/featured-services"
import { HowItWorks } from "@/components/how-it-works"
import { HeroSloganRotator } from "@/components/hero-slogan-rotator"
import {
  RevealOnScroll,
  StaggerGrid,
  StaggerItem,
} from "@/components/motion/reveal"
import { getPublicProfessionals } from "@/server/queries/catalog"

export const dynamic = "force-dynamic"

export default async function Home() {
  const professionals = await getPublicProfessionals()

  return (
    <div className="flex flex-col min-h-screen">
      {/* New Hero Section Component */}
      <HeroSection
        badge={{
          text: "Découvrez nos services",
          action: {
            text: "En savoir plus",
            href: "/services",
          },
        }}
        title={<HeroSloganRotator />}
        description="Trouvez et réservez en quelques clics les meilleurs professionnels locaux pour tous vos besoins de maison. Simple, direct et sans intermédiaire financier."
        actions={[
          {
            text: "Explorer les services",
            href: "/services",
            variant: "default",
          },
          {
            text: "Voir les professionnels",
            href: "/professionals",
            variant: "outline",
            icon: <Briefcase className="h-5 w-5" />,
          },
        ]}
        scrollTargetHref="#quick-search"
        scrollTargetLabel="Rechercher un artisan"
      >
        <HowItWorks />
      </HeroSection>

      {/* Quick Search Section */}
      <QuickSearch />

      {/* Featured Services Section */}
      <FeaturedServices />

      {/* Categories Section */}
      <section className="w-full py-12 md:py-20 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_80%_50%,hsla(var(--brand)/0.05)_0%,transparent_72%)]"
        />

        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <RevealOnScroll className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[hsl(var(--brand))] mb-3 bg-[hsl(var(--brand))]/10 px-4 py-1.5 rounded-full">
                <div className="w-2 h-2 rounded-full bg-[hsl(var(--brand))] animate-pulse" />
                SERVICES POPULAIRES
              </div>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2 gradient-brand">
                Nos Services
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg">
                Tout ce dont votre maison a besoin
              </p>
            </div>
            <Button
              asChild
              variant="link"
              className="text-base sm:text-lg gap-2 group hover:text-[hsl(var(--brand))] transition-colors duration-300 px-0 w-fit"
            >
              <Link href="/services">
                Voir tout
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </Button>
          </RevealOnScroll>

          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
            <StaggerItem>
              <ServiceCard
                title="Électricité"
                icon={Zap}
                description="Installations et réparations"
              />
            </StaggerItem>
            <StaggerItem>
              <ServiceCard
                title="Plomberie"
                icon={Droplets}
                description="Fuites et canalisations"
              />
            </StaggerItem>
            <StaggerItem>
              <ServiceCard
                title="Climatisation"
                icon={Wrench}
                description="Entretien et dépannage"
              />
            </StaggerItem>
            <StaggerItem>
              <ServiceCard
                title="Nettoyage"
                icon={Paintbrush}
                description="Maison et bureaux"
              />
            </StaggerItem>
            <StaggerItem>
              <ServiceCard
                title="Jardinage"
                icon={Shovel}
                description="Entretien espaces verts"
              />
            </StaggerItem>
            <StaggerItem>
              <ServiceCard
                title="Électroménager"
                icon={Tv}
                description="Réparation TV, Cuisine"
              />
            </StaggerItem>
          </StaggerGrid>
        </div>
      </section>

      {/* Featured Professionals Section */}
      <section className="w-full py-12 md:py-20 bg-gradient-to-b from-muted/20 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_30%_50%,hsla(var(--brand-foreground)/0.05)_0%,transparent_72%)]"
        />

        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 relative">
          <RevealOnScroll className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[hsl(var(--brand))] mb-3 bg-[hsl(var(--brand))]/10 px-4 py-1.5 rounded-full">
                <div className="w-2 h-2 rounded-full bg-[hsl(var(--brand))] animate-pulse" />
                PROFESSIONNELS VÉRIFIÉS
              </div>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2 gradient-brand">
                Professionnels à la une
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg">
                Les mieux notés par nos clients
              </p>
            </div>
            <Button
              asChild
              variant="link"
              className="text-base sm:text-lg gap-2 group hover:text-[hsl(var(--brand))] transition-colors duration-300 px-0 w-fit"
            >
              <Link href="/professionals">
                Voir tout
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </Button>
          </RevealOnScroll>

          <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {professionals.slice(0, 3).map((pro) => (
              <StaggerItem key={pro.id}>
                <ProCard pro={pro} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-20">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <RevealOnScroll>
            <div className="relative bg-gradient-to-br from-[hsl(var(--brand))] via-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] text-white rounded-3xl p-6 sm:p-10 md:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-12 shadow-elevated-lg overflow-hidden group glow-brand-lg">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_90%_15%,rgba(255,255,255,0.22)_0%,transparent_55%)] opacity-80 transition-opacity duration-500 group-hover:opacity-100"
            />

            <div className="space-y-5 max-w-2xl relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm font-medium backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                </span>
                Offre lancement — 1er mois offert
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-tight">
                Vous êtes un professionnel ?
              </h2>
              <p className="text-white/90 text-base sm:text-xl leading-relaxed">
                Rejoignez notre réseau et développez votre clientèle. Inscription simple et rapide.
              </p>
              <ul className="space-y-2.5 text-sm sm:text-base text-white/90">
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 shrink-0 rounded-full bg-white/20 flex items-center justify-center text-sm backdrop-blur-sm">
                    ✓
                  </span>
                  Visibilité maximale auprès de clients qualifiés
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 shrink-0 rounded-full bg-white/20 flex items-center justify-center text-sm backdrop-blur-sm">
                    ✓
                  </span>
                  Gestion simplifiée de vos créneaux horaires
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 shrink-0 rounded-full bg-white/20 flex items-center justify-center text-sm backdrop-blur-sm">
                    ✓
                  </span>
                  Zéro commission prélevée sur vos prestations
                </li>
              </ul>
            </div>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="relative z-10 w-full md:w-auto whitespace-nowrap text-base sm:text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-[transform,box-shadow,background-color] duration-300 font-bold bg-white text-[hsl(var(--brand))] hover:bg-white/90"
              >
                <Link href="/register">
                  Devenir partenaire
                  <span className="ml-2">→</span>
                </Link>
              </Button>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  )
}
