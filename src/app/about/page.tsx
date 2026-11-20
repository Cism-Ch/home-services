import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  CheckCircle2,
  Users,
  Shield,
  Clock,
  Target,
  Heart,
  Zap,
  TrendingUp,
} from "lucide-react"

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Découvrez la mission de HomeServices en Côte d'Ivoire : réservation directe par créneaux horaires sans commission sur les interventions.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Header Section */}
      <section className="relative bg-gradient-to-br from-[hsl(var(--brand))]/10 via-background to-[hsl(var(--brand-foreground))]/10 py-14 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-[420px] bg-[hsl(var(--brand))]/20 rounded-full blur-3xl -z-10" />

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center animate-appear">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(var(--brand))]/10 border border-[hsl(var(--brand))]/20 text-xs sm:text-sm font-medium mb-6 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-[hsl(var(--brand))] animate-pulse" />
              <span className="text-[hsl(var(--brand))]">NOTRE HISTOIRE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-6 gradient-brand">
              À propos de HomeServices
            </h1>

            <p className="text-base sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              La plateforme de référence en Côte d&apos;Ivoire pour trouver un artisan fiable près de votre commune et réserver un créneau horaire en direct.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="w-full py-12 sm:py-20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto animate-appear">
            <div className="bg-gradient-to-br from-[hsl(var(--brand))]/5 to-[hsl(var(--brand-foreground))]/5 rounded-3xl p-6 sm:p-10 md:p-14 border border-border/50 shadow-elevated">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[hsl(var(--brand))]/10 flex items-center justify-center shrink-0">
                  <Target className="h-6 w-6 text-[hsl(var(--brand))]" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold gradient-brand">Notre Mission</h2>
              </div>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-4">
                Simplifier l&apos;accès aux artisans du quotidien (plomberie, électricité, climatisation, ménage, menuiserie) en permettant une prise de rendez-vous claire par créneaux horaires.
              </p>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Contrairement aux intermédiaires classiques, HomeServices ne prélève aucune commission sur le prix des prestations : vous négociez librement avec votre artisan via appel ou WhatsApp et réglez directement après l&apos;intervention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics Section */}
      <section className="w-full py-12 sm:py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 animate-appear">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(var(--brand))]/10 border border-[hsl(var(--brand))]/20 text-xs sm:text-sm font-medium mb-4 backdrop-blur-sm">
              <TrendingUp className="h-4 w-4 text-[hsl(var(--brand))]" />
              <span className="text-[hsl(var(--brand))]">MODÈLE TRANSPARENT</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4 gradient-brand">
              HomeServices en pratique
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Pensé pour les réalités locales à Abidjan et partout en Côte d&apos;Ivoire
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
            <Card className="h-full text-center border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="py-2">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[hsl(var(--brand))]/10 flex items-center justify-center">
                  <Users className="h-7 w-7 text-[hsl(var(--brand))]" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold mb-2 gradient-brand">
                  0 %
                </div>
                <p className="text-sm text-muted-foreground">Commission sur vos travaux</p>
              </CardContent>
            </Card>

            <Card className="h-full text-center border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="py-2">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[hsl(var(--brand))]/10 flex items-center justify-center">
                  <Shield className="h-7 w-7 text-[hsl(var(--brand))]" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold mb-2 gradient-brand">
                  KYC
                </div>
                <p className="text-sm text-muted-foreground">Contrôle CNI / RCCM des pros</p>
              </CardContent>
            </Card>

            <Card className="h-full text-center border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="py-2">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[hsl(var(--brand))]/10 flex items-center justify-center">
                  <Zap className="h-7 w-7 text-[hsl(var(--brand))]" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold mb-2 gradient-brand">
                  50+
                </div>
                <p className="text-sm text-muted-foreground">Communes & villes couvertes</p>
              </CardContent>
            </Card>

            <Card className="h-full text-center border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="py-2">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[hsl(var(--brand))]/10 flex items-center justify-center">
                  <Heart className="h-7 w-7 text-[hsl(var(--brand))]" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold mb-2 gradient-brand">
                  XOF
                </div>
                <p className="text-sm text-muted-foreground">Tarifs clairs en Franc CFA</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="w-full py-12 sm:py-20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 animate-appear">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(var(--brand))]/10 border border-[hsl(var(--brand))]/20 text-xs sm:text-sm font-medium mb-4 backdrop-blur-sm">
              <Heart className="h-4 w-4 text-[hsl(var(--brand))]" />
              <span className="text-[hsl(var(--brand))]">NOS ENGAGEMENTS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4 gradient-brand">
              Ce qui nous guide
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Des principes simples pour une confiance durable entre clients et artisans
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[hsl(var(--brand))]/10 flex items-center justify-center shrink-0">
                    <Users className="h-6 w-6 sm:h-7 sm:w-7 text-[hsl(var(--brand))]" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl">Professionnels Vérifiés</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Chaque artisan peut déposer sa CNI ou son RCCM via notre espace sécurisé afin d&apos;obtenir le badge vérifié après validation par notre équipe.
                </p>
              </CardContent>
            </Card>

            <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[hsl(var(--brand))]/10 flex items-center justify-center shrink-0">
                    <Shield className="h-6 w-6 sm:h-7 sm:w-7 text-[hsl(var(--brand))]" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl">Aucun paiement bloqué</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Les clients accèdent gratuitement à la plateforme et règlent l&apos;artisan directement après l&apos;intervention. Seuls les abonnements professionnels optionnels passent par Paystack (XOF).
                </p>
              </CardContent>
            </Card>

            <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[hsl(var(--brand))]/10 flex items-center justify-center shrink-0">
                    <Clock className="h-6 w-6 sm:h-7 sm:w-7 text-[hsl(var(--brand))]" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl">Créneaux en temps réel</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Consultez l&apos;agenda réel du prestataire, ses congés exceptionnels et son statut en direct avant de réserver votre plage horaire.
                </p>
              </CardContent>
            </Card>

            <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[hsl(var(--brand))]/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7 text-[hsl(var(--brand))]" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl">Évaluation mutuelle</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Une fois la mission confirmée terminée, client et professionnel peuvent partager un avis vérifié afin de renforcer la confiance sur la plateforme.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 sm:py-20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] text-white rounded-3xl p-6 sm:p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-elevated-lg overflow-hidden group glow-brand-lg">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="pointer-events-none absolute top-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

            <div className="space-y-6 max-w-2xl relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm font-medium backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                </span>
                Rejoignez la plateforme
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-tight">
                Prêt à nous rejoindre ?
              </h2>
              <p className="text-white/90 text-base sm:text-xl leading-relaxed">
                Que vous soyez artisan à la recherche de nouveaux chantiers ou client à la recherche d&apos;un professionnel de confiance, démarrez dès maintenant.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto text-base sm:text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all duration-300 font-bold bg-white text-[hsl(var(--brand))] hover:bg-white/90"
                >
                  <Link href="/register">
                    Devenir professionnel
                    <span className="ml-2">→</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-base sm:text-lg px-8 py-6 h-auto shadow-lg transition-all duration-300 font-bold border-white/40 bg-transparent text-white hover:bg-white/15"
                >
                  <Link href="/services">Trouver un service</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
