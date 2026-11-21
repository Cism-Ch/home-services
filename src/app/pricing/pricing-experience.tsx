"use client"

import * as React from "react"
import Link from "next/link"
import { AnimatePresence, m, useReducedMotion } from "framer-motion"
import {
  ArrowRight,
  Briefcase,
  Building2,
  Check,
  Crown,
  ShieldCheck,
  User,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AnimatedCounter } from "@/components/motion/animated-counter"
import { RevealOnScroll } from "@/components/motion/reveal"
import { EASE_OUT_EXPO, SPRING_SNAPPY } from "@/lib/motion"
import { cn } from "@/lib/utils"

type AudienceMode = "client" | "pro"

interface PlanCardModel {
  id: string
  name: string
  badge: string
  priceFCFA: number
  periodLabel: string
  trialLabel?: string
  description: string
  highlighted?: boolean
  features: string[]
  ctaLabel: string
  ctaHref: string
}

const CLIENT_PLANS: PlanCardModel[] = [
  {
    id: "client-free",
    name: "Client Standard",
    badge: "Gratuit à vie",
    priceFCFA: 0,
    periodLabel: "FCFA / mois",
    description:
      "Réservez vos artisans locaux en toute simplicité, sans frais cachés ni commission sur vos travaux.",
    features: [
      "Accès illimité au catalogue de services",
      "Réservation de créneaux horaires en temps réel",
      "Contact direct par téléphone et WhatsApp",
      "0 % commission sur le montant des travaux",
      "Système d'avis vérifiés après intervention",
    ],
    ctaLabel: "Créer un compte gratuit",
    ctaHref: "/register",
  },
  {
    id: "client-gold",
    name: "Client Premium Or",
    badge: "Recommandé",
    priceFCFA: 2000,
    periodLabel: "FCFA / mois",
    description:
      "Profitez d'un statut prioritaire auprès des meilleurs professionnels vérifiés et soutenez la plateforme.",
    highlighted: true,
    features: [
      "Tout ce qui est inclus dans Client Standard",
      "Badge Client Premium Or visible par les artisans",
      "Demandes mises en avant sur les créneaux demandés",
      "Support client prioritaire 7j/7",
      "Paiement sécurisé XOF via Paystack, résiliable à tout moment",
    ],
    ctaLabel: "Passer Client Or",
    ctaHref: "/register?plan=CLIENT_GOLD",
  },
]

const PRO_PLANS: PlanCardModel[] = [
  {
    id: "pro-standard",
    name: "Pro Standard",
    badge: "Artisan Indépendant",
    priceFCFA: 5000,
    periodLabel: "FCFA / mois",
    trialLabel: "1er mois offert (30 jours)",
    description:
      "Idéal pour lancer votre présence en ligne et recevoir des réservations qualifiées près de votre commune.",
    features: [
      "Profil public vérifié KYC (CNI / RCCM)",
      "Gestion de votre agenda & créneaux disponibles",
      "Réception directe des demandes sur WhatsApp",
      "0 % commission prélevée sur vos chantiers",
      "1er mois d'essai offert sans engagement",
    ],
    ctaLabel: "Démarrer avec 1 mois offert",
    ctaHref: "/register?plan=PRO_STANDARD",
  },
  {
    id: "pro-premium",
    name: "Pro Premium",
    badge: "Plus populaire",
    priceFCFA: 10000,
    periodLabel: "FCFA / mois",
    trialLabel: "1er mois offert (30 jours)",
    description:
      "Visibilité renforcée, prestations illimitées et mise en avant prioritaire dans les résultats locaux.",
    highlighted: true,
    features: [
      "Tout ce qui est inclus dans Pro Standard",
      "Prestations et photos de portfolio illimitées",
      "Positionnement prioritaire dans le catalogue",
      "Gestion avancée des congés et indisponibilités",
      "Statistiques détaillées de vues et réservations",
    ],
    ctaLabel: "Choisir Pro Premium",
    ctaHref: "/register?plan=PRO_PREMIUM",
  },
  {
    id: "pro-enterprise",
    name: "Pro Entreprise",
    badge: "PME & Équipes",
    priceFCFA: 20000,
    periodLabel: "FCFA / mois",
    trialLabel: "1er mois offert (30 jours)",
    description:
      "Conçu pour les PME et équipes multi-techniciens gérant plusieurs chantiers simultanés sur plusieurs villes.",
    features: [
      "Tout ce qui est inclus dans Pro Premium",
      "Capacité multi-chantiers simultanés (1 à N équipes)",
      "Couverture multi-communes et multi-villes",
      "Badge Entreprise vérifiée RCCM",
      "Accompagnement et support dédié",
    ],
    ctaLabel: "Équiper mon entreprise",
    ctaHref: "/register?plan=PRO_ENTERPRISE",
  },
]

/**
 * Experience interactive plein ecran (Cover) de la page Tarifs.
 * Demande de maniere animee si le visiteur est Client/Particulier ou Professionnel/Entreprise.
 */
export function PricingExperience() {
  const [audience, setAudience] = React.useState<AudienceMode>("client")
  const prefersReducedMotion = useReducedMotion()

  const activePlans = audience === "client" ? CLIENT_PLANS : PRO_PLANS

  return (
    <div className="min-h-screen">
      {/* Cover Plein Ecran */}
      <section
        data-pricing-cover="true"
        className="relative min-h-[calc(100svh-4rem)] flex flex-col justify-center py-12 sm:py-16 lg:py-20 overflow-x-clip"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_65%_55%_at_50%_0%,hsla(var(--brand)/0.14)_0%,transparent_72%),radial-gradient(ellipse_55%_50%_at_85%_85%,hsla(var(--brand-foreground)/0.1)_0%,transparent_70%)]"
        />

        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <div className="max-w-5xl mx-auto text-center">
            <m.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(var(--brand))]/10 border border-[hsl(var(--brand))]/20 text-xs sm:text-sm font-bold text-[hsl(var(--brand))] mb-5"
            >
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>0 % COMMISSION SUR VOS INTERVENTIONS</span>
            </m.div>

            <m.h1
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05, ease: EASE_OUT_EXPO }}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 gradient-brand"
            >
              Des tarifs simples et transparents
            </m.h1>

            <m.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: EASE_OUT_EXPO }}
              className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed"
            >
              Dites-nous qui vous êtes pour découvrir les offres adaptées à vos
              besoins en Franc CFA (XOF).
            </m.p>

            {/* Selecteur Anime Client/Particulier vs Professionnel/Entreprise */}
            <div
              role="radiogroup"
              aria-label="Choisissez votre profil"
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto mb-10 sm:mb-12"
            >
              {(
                [
                  {
                    id: "client" as const,
                    title: "Client / Particulier",
                    subtitle: "Je cherche un artisan fiable près de chez moi",
                    icon: User,
                    badge: "Gratuit ou Or",
                  },
                  {
                    id: "pro" as const,
                    title: "Professionnel / Entreprise",
                    subtitle: "Je propose mes services et gère mes chantiers",
                    icon: Building2,
                    badge: "1er mois offert",
                  },
                ] as const
              ).map((option) => {
                const isSelected = audience === option.id
                const Icon = option.icon

                return (
                  <Button
                    key={option.id}
                    type="button"
                    variant="ghost"
                    role="radio"
                    aria-checked={isSelected}
                    data-pricing-audience={option.id}
                    onClick={() => setAudience(option.id)}
                    className={cn(
                      "relative h-auto p-4 sm:p-5 rounded-2xl border-2 text-left flex items-start gap-3.5 justify-start whitespace-normal transition-[border-color,background-color,box-shadow] duration-200",
                      isSelected
                        ? "border-[hsl(var(--brand))] bg-card/95 shadow-lg hover:bg-card"
                        : "border-border/60 bg-card/55 hover:bg-card/85 hover:border-[hsl(var(--brand))]/40"
                    )}
                  >
                    {isSelected && (
                      <m.span
                        layoutId="pricing-audience-highlight"
                        transition={SPRING_SNAPPY}
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-2xl bg-[hsl(var(--brand))]/[0.06]"
                      />
                    )}
                    <div
                      className={cn(
                        "relative z-10 w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                        isSelected
                          ? "bg-[hsl(var(--brand))] text-white shadow-md"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="relative z-10 min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-extrabold text-sm sm:text-base text-foreground">
                          {option.title}
                        </span>
                        <Badge
                          variant={isSelected ? "default" : "secondary"}
                          className="text-[11px] font-semibold"
                        >
                          {option.badge}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground font-normal leading-snug">
                        {option.subtitle}
                      </p>
                    </div>
                  </Button>
                )
              })}
            </div>

            {/* Cartes des Formules Animees */}
            <AnimatePresence mode="wait">
              <m.div
                key={audience}
                data-pricing-panel={audience}
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: EASE_OUT_EXPO }}
                className={cn(
                  "grid gap-6 text-left mx-auto",
                  audience === "client"
                    ? "grid-cols-1 md:grid-cols-2 max-w-4xl"
                    : "grid-cols-1 lg:grid-cols-3 max-w-6xl"
                )}
              >
                {activePlans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={cn(
                      "relative flex flex-col h-full rounded-2xl overflow-hidden transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1",
                      plan.highlighted
                        ? "border-2 border-[hsl(var(--brand))] bg-card shadow-xl"
                        : "border border-border/60 bg-card/85 shadow-sm hover:shadow-lg"
                    )}
                  >
                    {plan.highlighted && (
                      <div className="h-1.5 w-full bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))]" />
                    )}

                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <Badge
                          variant={plan.highlighted ? "default" : "secondary"}
                          className="gap-1 font-semibold"
                        >
                          {plan.highlighted ? (
                            <Crown className="h-3 w-3" />
                          ) : (
                            <Briefcase className="h-3 w-3" />
                          )}
                          {plan.badge}
                        </Badge>
                        {plan.trialLabel && (
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            {plan.trialLabel}
                          </span>
                        )}
                      </div>

                      <CardTitle className="text-xl sm:text-2xl font-extrabold">
                        {plan.name}
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed">
                        {plan.description}
                      </CardDescription>

                      <div className="pt-4 flex items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl font-extrabold tracking-tight gradient-brand">
                          <AnimatedCounter value={plan.priceFCFA} />
                        </span>
                        <span className="text-sm font-semibold text-muted-foreground">
                          {plan.periodLabel}
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1">
                      <ul className="space-y-2.5 text-sm">
                        {plan.features.map((feat) => (
                          <li key={feat} className="flex items-start gap-2.5">
                            <span className="mt-0.5 inline-flex size-5 items-center justify-center rounded-full bg-[hsl(var(--brand))]/12 text-[hsl(var(--brand))] shrink-0">
                              <Check className="h-3 w-3" aria-hidden="true" />
                            </span>
                            <span className="text-foreground/90 leading-snug">
                              {feat}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>

                    <CardFooter className="pt-4 mt-auto">
                      <Button
                        asChild
                        size="lg"
                        variant={plan.highlighted ? "default" : "outline"}
                        className={cn(
                          "w-full rounded-xl font-bold gap-2",
                          plan.highlighted &&
                            "bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] text-white shadow-md hover:shadow-lg"
                        )}
                      >
                        <Link href={plan.ctaHref}>
                          <span>{plan.ctaLabel}</span>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </m.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Bandeau Reassurance Paiement XOF */}
      <section className="w-full pb-14 sm:pb-20">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <RevealOnScroll>
            <div className="max-w-5xl mx-auto rounded-3xl border border-border/60 bg-card/80 backdrop-blur-sm p-6 sm:p-10 text-center shadow-sm">
              <h2 className="text-xl sm:text-2xl font-extrabold mb-2 gradient-brand">
                Paiement local XOF sécurisé &amp; zéro commission sur vos prestations
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Les clients règlent toujours leurs artisans directement après
                intervention. Les abonnements optionnels sont encaissés en Franc
                CFA via Paystack (Mobile Money &amp; cartes bancaires) et
                résiliables à tout moment depuis votre tableau de bord.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  )
}
