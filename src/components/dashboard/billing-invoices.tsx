"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Eye } from "lucide-react"

interface Invoice {
    id: string
    date: string
    amount: number
    status: "paid" | "pending" | "failed"
    period: string
    invoiceNumber: string
}

const mockInvoices: Invoice[] = [
    {
        id: "inv-001",
        date: "2024-11-01",
        amount: 29.99,
        status: "paid",
        period: "Novembre 2024",
        invoiceNumber: "INV-2024-11-001"
    },
    {
        id: "inv-002",
        date: "2024-10-01",
        amount: 29.99,
        status: "paid",
        period: "Octobre 2024",
        invoiceNumber: "INV-2024-10-001"
    },
    {
        id: "inv-003",
        date: "2024-09-01",
        amount: 29.99,
        status: "paid",
        period: "Septembre 2024",
        invoiceNumber: "INV-2024-09-001"
    },
    {
        id: "inv-004",
        date: "2024-08-01",
        amount: 29.99,
        status: "paid",
        period: "Août 2024",
        invoiceNumber: "INV-2024-08-001"
    },
    {
        id: "inv-005",
        date: "2024-07-01",
        amount: 29.99,
        status: "paid",
        period: "Juillet 2024",
        invoiceNumber: "INV-2024-07-001"
    }
]

export function BillingInvoices() {
    const getStatusColor = (status: Invoice["status"]) => {
        switch (status) {
            case "paid":
                return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            case "pending":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
            case "failed":
                return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
        }
    }

    const getStatusLabel = (status: Invoice["status"]) => {
        switch (status) {
            case "paid":
                return "Payée"
            case "pending":
                return "En attente"
            case "failed":
                return "Échec"
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Historique des factures</CardTitle>
                <CardDescription>
                    Consultez et téléchargez vos factures d&apos;abonnement.
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
                                <div className="flex items-center gap-3 mb-1">
                                    <p className="font-medium">{invoice.period}</p>
                                    <Badge variant="outline" className={getStatusColor(invoice.status)}>
                                        {getStatusLabel(invoice.status)}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {invoice.invoiceNumber} • {new Date(invoice.date).toLocaleDateString('fr-FR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <p className="font-semibold text-lg">{invoice.amount.toFixed(2)} €</p>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Eye className="h-4 w-4" />
                                        Voir
                                    </Button>
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Download className="h-4 w-4" />
                                        PDF
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
