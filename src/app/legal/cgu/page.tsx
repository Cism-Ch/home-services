import type { Metadata } from "next"
import Link from "next/link"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation",
  description:
    "Conditions Générales d'Utilisation de HomeServices : réservation de créneaux horaires sans commission et abonnements Paystack en FCFA.",
}

export default function LegalCguPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
      <PageBreadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Conditions Générales d'Utilisation" },
        ]}
      />
      <div className="space-y-2 border-b pb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Cadre Contractuel
        </p>
        <h1 className="text-3xl font-bold tracking-tight">
          Conditions Générales d&apos;Utilisation (CGU)
        </h1>
        <p className="text-sm text-muted-foreground">
          Dernière mise à jour : Novembre 2026 — Applicable en Côte d&apos;Ivoire et dans l&apos;espace UEMOA.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">1. Objet de la plateforme</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          HomeServices est une plateforme de mise en relation et de prise de rendez-vous par créneaux horaires entre des particuliers ou entreprises (les Clients) et des artisans ou prestataires de services à domicile (les Prestataires).
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">
          2. Modèle économique : zéro commission sur les prestations
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          La réservation effectuée sur HomeServices sert exclusivement à bloquer un créneau horaire dans l&apos;agenda du prestataire et à qualifier le besoin. HomeServices ne perçoit aucune commission sur le montant des travaux et ne réalise aucun encaissement en ligne pour les interventions. Le tarif indicatif affiché en Franc CFA (FCFA / XOF) est réglé directement entre le client et l&apos;artisan après exécution.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">
          3. Abonnements Paystack en Franc CFA (XOF)
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          L&apos;accès aux fonctionnalités de publication et de mise en avant des Prestataires repose sur des formules d&apos;abonnement mensuelles gérées de manière sécurisée par Paystack (5 000 FCFA, 10 000 FCFA ou 20 000 FCFA par mois, avec premier mois offert selon la formule). Les Clients bénéficient d&apos;un accès gratuit et peuvent souscrire librement au statut optionnel Membre Premium Or (2 000 FCFA par mois).
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">
          4. Vérification KYC & Avis mutuels
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Les prestataires peuvent soumettre leurs justificatifs d&apos;identité (CNI, passeport ou registre RCCM) pour obtenir le badge vérifié après contrôle de notre équipe d&apos;administration. À l&apos;issue des interventions finalisées, client et prestataire peuvent publier une évaluation mutuelle loyale et conforme aux bonnes mœurs.
        </p>
      </section>

      <div className="pt-4 border-t flex flex-wrap gap-3">
        <Button variant="outline" asChild>
          <Link href="/legal/confidentialite">Politique de confidentialité</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/legal/mentions-legales">Mentions légales</Link>
        </Button>
      </div>
    </main>
  )
}
