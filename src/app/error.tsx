"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  void error

  return (
    <main className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center min-h-[60vh] space-y-6">
      <div className="space-y-2 max-w-md">
        <p className="text-sm font-semibold uppercase tracking-wider text-destructive">
          Incident applicatif
        </p>
        <h1 className="text-3xl font-bold tracking-tight">
          Une erreur inattendue est survenue
        </h1>
        <p className="text-sm text-muted-foreground">
          Veuillez réessayer le chargement de la page ou revenir à l&apos;accueil.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button type="button" onClick={() => reset()}>
          Réessayer
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Retour à l&apos;accueil</Link>
        </Button>
      </div>
    </main>
  )
}
