import type { Metadata } from "next"
import Link from "next/link"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Mentions Légales",
  description:
    "Mentions légales, éditeur et coordonnées de support de la plateforme HomeServices.",
}

export default function LegalMentionsPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
      <PageBreadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Mentions Légales" },
        ]}
      />
      <div className="space-y-2 border-b pb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Informations Réglementaires
        </p>
        <h1 className="text-3xl font-bold tracking-tight">Mentions Légales</h1>
      </div>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Éditeur de la plateforme</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Plateforme HomeServices — Services à domicile et mise en relation d&apos;artisans qualifiés en Côte d&apos;Ivoire (Abidjan, Yamoussoukro, Bouaké, San-Pédro) et en Afrique francophone.
        </p>
        <p className="text-sm text-muted-foreground">
          Contact support & conformité : support@homeservices.ci
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Infrastructure & Hébergement</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Base de données PostgreSQL & Realtime hébergées sur Supabase (Union Européenne — Nord). Stockage d&apos;objets S3 assuré par Tigris Data. Orchestration des files asynchrones et cache opérés via Upstash.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Propriété intellectuelle</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          L&apos;architecture logicielle, les interfaces et les contenus éditoriaux de HomeServices sont protégés. Chaque prestataire demeure seul responsable des photographies de chantier et des informations tarifaires indicatives qu&apos;il publie sur sa fiche.
        </p>
      </section>

      <div className="pt-4 border-t flex flex-wrap gap-3">
        <Button variant="outline" asChild>
          <Link href="/legal/cgu">Conditions d&apos;utilisation</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/legal/confidentialite">Confidentialité</Link>
        </Button>
      </div>
    </main>
  )
}
