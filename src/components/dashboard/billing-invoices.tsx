"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Eye } from "lucide-react"
import { formatFCFA } from "@/lib/mock-data"
import { toast } from "sonner"

interface Invoice {
  id: string
  date: string
  amount: number
  status: "paid" | "trial" | "pending" | "failed"
  period: string
  invoiceNumber: string
  planLabel: string
}

const mockInvoices: Invoice[] = [
  {
    id: "inv-001",
    date: "2026-11-01",
    amount: 0,
    status: "trial",
    period: "Novembre 2026 (1er mois offert)",
    invoiceNumber: "PSK-2026-11-001",
    planLabel: "Premium Pro (Essai gratuit)",
  },
  {
    id: "inv-002",
    date: "2026-10-01",
    amount: 10000,
    status: "paid",
    period: "Octobre 2026",
    invoiceNumber: "PSK-2026-10-001",
    planLabel: "Premium Pro",
  },
  {
    id: "inv-003",
    date: "2026-09-01",
    amount: 5000,
    status: "paid",
    period: "Septembre 2026",
    invoiceNumber: "PSK-2026-09-001",
    planLabel: "Standard Pro",
  },
]

export function BillingInvoices() {
  const getStatusColor = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
      case "trial":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    }
  }

  const getStatusLabel = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return "Réglée (Paystack)"
      case "trial":
        return "Mois offert"
      case "pending":
        return "En attente"
      case "failed":
        return "Échec"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique des reçus Paystack (FCFA)</CardTitle>
        <CardDescription>
          Consultez et téléchargez vos justificatifs d&apos;abonnement en Franc CFA (XOF).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockInvoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <p className="font-medium">{invoice.period}</p>
                  <Badge variant="outline" className={getStatusColor(invoice.status)}>
                    {getStatusLabel(invoice.status)}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="font-mono">{invoice.invoiceNumber}</span>
                  <span>•</span>
                  <span>{invoice.planLabel}</span>
                  <span>•</span>
                  <span>
                    {new Date(invoice.date).toLocaleDateString("fr-FR", {
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
                    {invoice.amount === 0 ? "0 FCFA (Offert)" : formatFCFA(invoice.amount)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => toast.info(`Aperçu du reçu ${invoice.invoiceNumber}`)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="hidden sm:inline">Voir</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => toast.success(`Reçu ${invoice.invoiceNumber} téléchargé.`)}
                  >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">PDF</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
