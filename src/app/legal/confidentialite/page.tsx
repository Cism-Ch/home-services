import type { Metadata } from "next"
import Link from "next/link"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Politique de Confidentialité",
  description:
    "Protection des données personnelles et chiffrement des documents KYC sur HomeServices.",
}

export default function LegalConfidentialitePage() {
  return (
    <main className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-10 sm:py-12 space-y-8">
      <PageBreadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Politique de Confidentialité" },
        ]}
      />
      <div className="space-y-2 border-b pb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Protection des Données
        </p>
        <h1 className="text-3xl font-bold tracking-tight">
          Politique de Confidentialité & Cookies
        </h1>
        <p className="text-sm text-muted-foreground">
          Dernière mise à jour : Novembre 2026
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">1. Données collectées</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Nous collectons uniquement les données strictement nécessaires au fonctionnement du service : nom, adresse email, numéro de téléphone / WhatsApp, ville ou commune d&apos;intervention, historique de réservations de créneaux et, pour les prestataires souhaitant être vérifiés, leur justificatif KYC (CNI / RCCM).
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">
          2. Hébergement et sécurité des documents KYC
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Les justificatifs KYC déposés par les artisans sont stockés sur un compartiment objet privé compatible S3 (Tigris Data) et accessibles uniquement aux administrateurs habilités via des URLs temporaires signées à durée limitée. Les données applicatives sont hébergées dans PostgreSQL (Supabase) avec règles d&apos;isolation par rôle et contrôle d&apos;accès côté serveur.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">
          3. Sous-traitants techniques et paiements
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Les souscriptions d&apos;abonnements sont traitées par Paystack ; aucune donnée complète de carte bancaire ou code secret Mobile Money n&apos;est conservé sur nos serveurs. Les notifications transactionnelles sont acheminées via Upstash QStash et Resend.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">4. Vos droits & Cookies</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          La plateforme utilise exclusivement des cookies techniques essentiels d&apos;authentification de session et de préférence d&apos;affichage (thème). Vous pouvez demander l&apos;accès, la rectification ou la suppression de votre compte à tout moment via l&apos;adresse support indiquée dans nos mentions légales.
        </p>
      </section>

      <div className="pt-4 border-t flex flex-wrap gap-3">
        <Button variant="outline" asChild>
          <Link href="/legal/cgu">Conditions d&apos;utilisation</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/legal/mentions-legales">Mentions légales</Link>
        </Button>
      </div>
    </main>
  )
}
