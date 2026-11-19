"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Download, Eye, Receipt } from "lucide-react"
import { formatFCFA } from "@/lib/formatters"
import type { DashboardSubscriptionItem } from "@/lib/types/catalog"

interface BillingInvoicesProps {
  subscriptions?: DashboardSubscriptionItem[]
}

function getStatusColor(status: DashboardSubscriptionItem["status"]): string {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
    case "TRIALING":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    case "PAST_DUE":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
    case "CANCELLED":
      return "bg-muted text-muted-foreground"
  }
}

function getStatusLabel(status: DashboardSubscriptionItem["status"]): string {
  switch (status) {
    case "ACTIVE":
      return "Actif (Paystack)"
    case "TRIALING":
      return "Mois offert"
    case "PAST_DUE":
      return "Paiement en échec"
    case "CANCELLED":
      return "Résilié"
  }
}

function formatPeriodLabel(sub: DashboardSubscriptionItem): string {
  const start = new Date(sub.currentPeriodStart).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
  const end = new Date(sub.currentPeriodEnd).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
  return `Du ${start} au ${end}`
}

export function BillingInvoices({ subscriptions = [] }: BillingInvoicesProps) {
  const [selectedItem, setSelectedItem] =
    useState<DashboardSubscriptionItem | null>(null)

  const handleDownloadReceipt = (sub: DashboardSubscriptionItem) => {
    const content = [
      "HOMESERVICES - JUSTIFICATIF D'ABONNEMENT PAYSTACK",
      "=================================================",
      `Reference       : ${sub.referenceCode}`,
      `Formule         : ${sub.planLabel} (${sub.plan})`,
      `Statut          : ${getStatusLabel(sub.status)}`,
      `Montant         : ${sub.status === "TRIALING" ? "0 FCFA (1er mois offert)" : formatFCFA(sub.amount)}`,
      `Devise          : ${sub.currency}`,
      `Periode         : ${formatPeriodLabel(sub)}`,
      `Date emission   : ${new Date(sub.createdAt).toLocaleDateString("fr-FR")}`,
      "=================================================",
      "Zero commission sur vos prestations de service.",
    ].join("\n")

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `recu-${sub.referenceCode.toLowerCase()}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique des abonnements & reçus Paystack (FCFA)</CardTitle>
        <CardDescription>
          Consultez et téléchargez vos justificatifs d&apos;abonnement enregistrés en Franc CFA (XOF).
        </CardDescription>
      </CardHeader>
      <CardContent>
        {subscriptions.length === 0 ? (
          <div className="text-center py-8 border rounded-lg bg-muted/20">
            <Receipt className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium">
              Aucun abonnement enregistré pour le moment
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Vos souscriptions Paystack apparaîtront ici dès leur activation.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {subscriptions.map((sub) => (
              <div
                key={sub.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <p className="font-medium">{sub.planLabel}</p>
                    <Badge variant="outline" className={getStatusColor(sub.status)}>
                      {getStatusLabel(sub.status)}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-mono">{sub.referenceCode}</span>
                    <span>•</span>
                    <span>{formatPeriodLabel(sub)}</span>
                    <span>•</span>
                    <span>
                      Souscrit le{" "}
                      {new Date(sub.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-base font-bold text-primary">
                      {sub.status === "TRIALING"
                        ? "0 FCFA (Offert)"
                        : formatFCFA(sub.amount)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => setSelectedItem(sub)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="hidden sm:inline">Voir</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleDownloadReceipt(sub)}
                    >
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">Reçu</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog
        open={selectedItem !== null}
        onOpenChange={(open) => !open && setSelectedItem(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détail du justificatif Paystack</DialogTitle>
            <DialogDescription>
              Référence {selectedItem?.referenceCode}
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-3 text-sm pt-2">
              <div className="flex justify-between py-1.5 border-b">
                <span className="text-muted-foreground">Formule</span>
                <span className="font-medium">{selectedItem.planLabel}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b">
                <span className="text-muted-foreground">Statut</span>
                <Badge variant="outline" className={getStatusColor(selectedItem.status)}>
                  {getStatusLabel(selectedItem.status)}
                </Badge>
              </div>
              <div className="flex justify-between py-1.5 border-b">
                <span className="text-muted-foreground">Montant mensuel</span>
                <span className="font-bold text-primary">
                  {selectedItem.status === "TRIALING"
                    ? "0 FCFA (Période d'essai)"
                    : formatFCFA(selectedItem.amount)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b">
                <span className="text-muted-foreground">Période couverte</span>
                <span>{formatPeriodLabel(selectedItem)}</span>
              </div>
              {selectedItem.trialEndDate && (
                <div className="flex justify-between py-1.5 border-b">
                  <span className="text-muted-foreground">Fin du mois offert</span>
                  <span>
                    {new Date(selectedItem.trialEndDate).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              )}
              <div className="pt-2 flex justify-end">
                <Button
                  type="button"
                  size="sm"
                  className="gap-2"
                  onClick={() => handleDownloadReceipt(selectedItem)}
                >
                  <Download className="h-4 w-4" />
                  Télécharger le justificatif
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
