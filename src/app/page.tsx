"use client"

import { ServiceCard } from "@/components/service-card"
import { ProCard } from "@/components/pro-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Sparkles, Zap, Wrench, Droplets, Paintbrush, Shovel, Tv } from "lucide-react"
import { professionals } from "@/lib/mock-data"
import Link from "next/link"
import { HeroSection } from "@/components/ui/hero-section"
import { Icons } from "@/components/ui/icons"
import { QuickSearch } from "@/components/quick-search"
import { FeaturedServices } from "@/components/featured-services"
import { HowItWorks } from "@/components/how-it-works"

export default function Home() {
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
        title="Trouvez le professionnel qu'il vous faut"
        description="Réservez en quelques clics les meilleurs professionnels pour tous vos projets de maison. Simple, rapide et fiable."
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
            icon: <Icons.gitHub className="h-5 w-5" />,
          },
        ]}
        image={{
          light: "",
          dark: "",
          alt: "",
        }}
      >
        <HowItWorks />
      </HeroSection>

      {/* Quick Search Section */}
      <QuickSearch />

      {/* Featured Services Section */}
      <FeaturedServices />

      {/* Categories Section */}
      <section className="py-12 md:py-20 container mx-auto px-4 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[hsl(var(--brand))]/5 rounded-full blur-3xl -z-10" />

        <div className="flex justify-between items-end mb-12 animate-appear opacity-0">
          <div>
            <div className="inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--brand))] mb-3 bg-[hsl(var(--brand))]/10 px-4 py-2 rounded-full">
              <div className="w-2 h-2 rounded-full bg-[hsl(var(--brand))] animate-pulse"></div>
              SERVICES POPULAIRES
            </div>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2 gradient-brand">Nos Services</h2>
            <p className="text-muted-foreground text-lg">Tout ce dont votre maison a besoin</p>
          </div>
          <Button variant="link" className="text-lg gap-2 group hover:text-[hsl(var(--brand))] transition-all duration-300">
            Voir tout
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          <ServiceCard
            title="Électricité"
            icon={Zap}
            description="Installations et réparations"
          />
          <ServiceCard
            title="Plomberie"
            icon={Droplets}
            description="Fuites et canalisations"
          />
          <ServiceCard
            title="Climatisation"
            icon={Wrench}
            description="Entretien et dépannage"
          />
          <ServiceCard
            title="Nettoyage"
            icon={Paintbrush}
            description="Maison et bureaux"
          />
          <ServiceCard
            title="Jardinage"
            icon={Shovel}
            description="Entretien espaces verts"
          />
          <ServiceCard
            title="Électroménager"
            icon={Tv}
            description="Réparation TV, Cuisine"
          />
        </div>
      </section>

      {/* Featured Professionals Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-muted/20 to-background relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        {/* Decorative glow */}
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[hsl(var(--brand-foreground))]/5 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto px-4 relative">
          <div className="flex justify-between items-end mb-12 animate-appear opacity-0 delay-300">
            <div>
              <div className="inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--brand))] mb-3 bg-[hsl(var(--brand))]/10 px-4 py-2 rounded-full">
                <div className="w-2 h-2 rounded-full bg-[hsl(var(--brand))] animate-pulse"></div>
                PROFESSIONNELS VÉRIFIÉS
              </div>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2 gradient-brand">Professionnels à la une</h2>
              <p className="text-muted-foreground text-lg">Les mieux notés par nos clients</p>
            </div>
            <Link href="/professionals">
              <Button variant="link" className="text-lg gap-2 group hover:text-[hsl(var(--brand))] transition-all duration-300">
                Voir tout
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {professionals.slice(0, 3).map((pro) => (
              <ProCard key={pro.id} pro={pro} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 container mx-auto px-4">
        <div className="relative bg-gradient-to-br from-[hsl(var(--brand))] via-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] text-white rounded-3xl p-6 md:p-20 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 shadow-elevated-lg overflow-hidden group glow-brand-lg">
          {/* Animated background pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-[hsl(var(--brand-foreground))]/30 rounded-full blur-3xl -z-0 group-hover:scale-150 transition-transform duration-700" />

          <div className="space-y-6 max-w-2xl relative z-10 animate-appear opacity-0 delay-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-2 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              Offre limitée
            </div>
            <h2 className="text-xl md:text-5xl font-bold leading-tight">Vous êtes un professionnel ?</h2>
            <p className="text-white/90 text-xl leading-relaxed">
              Rejoignez notre réseau et développez votre clientèle. Inscription gratuite et sans engagement.
            </p>
            <ul className="space-y-3 text-white/90">
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm backdrop-blur-sm">✓</span>
                Visibilité maximale auprès de clients qualifiés
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm backdrop-blur-sm">✓</span>
                Gestion simplifiée de vos demandes
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm backdrop-blur-sm">✓</span>
                Paiements sécurisés et rapides
              </li>
            </ul>
          </div>
          <Button size="lg" variant="secondary" className="relative z-10 whitespace-nowrap text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-bold animate-appear opacity-0 delay-1000 bg-white text-[hsl(var(--brand))] hover:bg-white/90">
            Devenir partenaire
            <span className="ml-2">→</span>
          </Button>
        </div>
      </section>
    </div>
  )
}
