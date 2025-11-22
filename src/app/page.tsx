import { ServiceCard } from "@/components/service-card"
import { ProCard } from "@/components/pro-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Sparkles, Zap, Wrench, Droplets, Paintbrush, Shovel, Tv } from "lucide-react"
import { professionals } from "@/lib/mock-data"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium backdrop-blur-sm border border-primary/20 animate-slide-down">
              <Sparkles className="h-4 w-4" />
              Trouvez le professionnel qu'il vous faut
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              Des services à domicile{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                de qualité
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Réservez en quelques clics les meilleurs professionnels près de chez vous
            </p>

            <div className="flex gap-4 max-w-xl mx-auto group">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Rechercher un service..."
                  className="pl-12 h-14 text-lg border-2 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
                />
              </div>
              <Button size="lg" className="h-14 px-8 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Rechercher
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground pt-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">✓</span>
                </div>
                <span><strong className="text-foreground">100%</strong> vérifiés</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">★</span>
                </div>
                <span><strong className="text-foreground">4.8/5</strong> en moyenne</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">⚡</span>
                </div>
                <span><strong className="text-foreground">24h</strong> réponse garantie</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10 animate-float" />
        <div className="absolute top-1/3 right-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl -z-10 animate-float" style={{ animationDelay: '2s' }} />
      </section>

      {/* Categories Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex justify-between items-end mb-12 animate-slide-up">
          <div>
            <div className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-3">
              <div className="w-8 h-0.5 bg-primary"></div>
              SERVICES POPULAIRES
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Nos Services</h2>
            <p className="text-muted-foreground text-lg">Tout ce dont votre maison a besoin</p>
          </div>
          <Button variant="link" className="text-lg hover:gap-2 transition-all duration-300">
            Voir tout
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
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
      <section className="py-20 bg-gradient-to-b from-muted/20 to-background relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

        <div className="container mx-auto px-4 relative">
          <div className="flex justify-between items-end mb-12 animate-slide-up">
            <div>
              <div className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-3">
                <div className="w-8 h-0.5 bg-primary"></div>
                PROFESSIONNELS VÉRIFIÉS
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Professionnels à la une</h2>
              <p className="text-muted-foreground text-lg">Les mieux notés par nos clients</p>
            </div>
            <Link href="/professionals">
              <Button variant="link" className="text-lg hover:gap-2 transition-all duration-300">
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
      <section className="py-20 container mx-auto px-4">
        <div className="relative bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground rounded-3xl p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 shadow-elevated-lg overflow-hidden group">
          {/* Animated background pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -z-0 group-hover:scale-150 transition-transform duration-700" />

          <div className="space-y-6 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 text-sm font-medium mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-foreground opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-foreground"></span>
              </span>
              Offre limitée
            </div>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">Vous êtes un professionnel ?</h2>
            <p className="text-primary-foreground/90 text-xl leading-relaxed">
              Rejoignez notre réseau et développez votre clientèle. Inscription gratuite et sans engagement.
            </p>
            <ul className="space-y-3 text-primary-foreground/90">
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-sm">✓</span>
                Visibilité maximale auprès de clients qualifiés
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-sm">✓</span>
                Gestion simplifiée de vos demandes
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-sm">✓</span>
                Paiements sécurisés et rapides
              </li>
            </ul>
          </div>
          <Button size="lg" variant="secondary" className="relative z-10 whitespace-nowrap text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-bold">
            Devenir partenaire
            <span className="ml-2">→</span>
          </Button>
        </div>
      </section>
    </div>
  )
}
