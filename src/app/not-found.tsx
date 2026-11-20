import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
  return (
    <main className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-16 sm:py-20 flex flex-col items-center justify-center text-center min-h-[60vh] space-y-6">
      <div className="space-y-2 max-w-md">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Erreur 404
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Page introuvable
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          La page ou la fiche artisan que vous recherchez n&apos;existe plus ou a été déplacée.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/">Retour à l&apos;accueil</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/services">Explorer les services</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/professionals">Voir les artisans</Link>
        </Button>
      </div>
    </main>
  )
}
