"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Database,
  HardDrive,
  Mail,
  RefreshCw,
  Server,
  ShieldCheck,
  Wallet,
  XCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { notify } from "@/lib/notifications"
import type {
  ServiceHealthStatus,
  StackDependencyProbe,
  StackHealthReport,
} from "@/lib/stack-health"

function getStatusBadge(status: ServiceHealthStatus) {
  switch (status) {
    case "operational":
      return <Badge variant="success">Opérationnel</Badge>
    case "degraded":
      return <Badge variant="warning">Dégradé</Badge>
    case "unconfigured":
      return <Badge variant="secondary">Non configuré</Badge>
    case "down":
      return <Badge variant="destructive">Indisponible</Badge>
  }
}

function getCategoryIcon(category: StackDependencyProbe["category"]) {
  switch (category) {
    case "Database":
      return Database
    case "Auth":
      return ShieldCheck
    case "Storage":
      return HardDrive
    case "Cache & Queue":
      return Server
    case "Communication":
      return Mail
    case "Payments":
      return Wallet
  }
}

export function HealthMonitorView({
  initialReport,
}: {
  initialReport: StackHealthReport
}) {
  const [report, setReport] = useState<StackHealthReport>(initialReport)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      const res = await fetch("/api/admin/health", { cache: "no-store" })
      const payload = (await res.json()) as {
        data: StackHealthReport | null
        error: string | null
      }
      if (!res.ok || !payload.data) {
        notify.error(payload.error || "Impossible d'actualiser les sondes.")
        return
      }
      setReport(payload.data)
      notify.success("Sondes de santé actualisées.", {
        id: "admin-health-refresh",
        description: `${payload.data.operationalCount}/${payload.data.totalCount} services opérationnels.`,
      })
    } catch {
      notify.error("Erreur réseau lors du contrôle de santé.")
    } finally {
      setIsRefreshing(false)
    }
  }

  const overallBanner =
    report.overallStatus === "operational"
      ? {
          icon: CheckCircle2,
          color: "text-emerald-600 dark:text-emerald-400",
          border: "border-emerald-500/40 bg-emerald-500/5",
          title: "Tous les services du stack sont opérationnels",
        }
      : report.overallStatus === "degraded"
      ? {
          icon: AlertTriangle,
          color: "text-amber-600 dark:text-amber-400",
          border: "border-amber-500/40 bg-amber-500/5",
          title: "Stack partiellement opérationnel (services dégradés ou non configurés)",
        }
      : {
          icon: XCircle,
          color: "text-destructive",
          border: "border-destructive/40 bg-destructive/5",
          title: "Incident critique détecté sur un service cœur",
        }

  const OverallIcon = overallBanner.icon

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button asChild variant="ghost" size="sm" className="-ml-2 gap-1.5">
              <Link href="/dashboard/admin">
                <ArrowLeft className="h-4 w-4" />
                Gouvernance
              </Link>
            </Button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2.5">
            <Activity className="h-7 w-7 text-[hsl(var(--brand))] shrink-0" />
            <span>Santé &amp; Uptime du Stack</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Supervision en direct des dépendances critiques (Supabase, Better-Auth, Tigris S3, Upstash, Resend, Paystack).
          </p>
        </div>

        <Button
          type="button"
          onClick={() => void handleRefresh()}
          disabled={isRefreshing}
          className="gap-2 w-full sm:w-auto shrink-0"
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          {isRefreshing ? "Analyse en cours..." : "Relancer les sondes"}
        </Button>
      </div>

      {/* Global Status Banner */}
      <Card className={`border-2 ${overallBanner.border}`}>
        <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <OverallIcon className={`h-7 w-7 shrink-0 ${overallBanner.color}`} />
            <div className="min-w-0">
              <p className="font-bold text-base sm:text-lg leading-snug">
                {overallBanner.title}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Environnement :{" "}
                <span className="font-mono font-semibold text-foreground">
                  {report.environment}
                </span>{" "}
                • Dernier contrôle :{" "}
                <span className="tabular-nums">
                  {new Date(report.checkedAt).toLocaleTimeString("fr-FR")}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-2xl font-extrabold tabular-nums">
              {report.operationalCount}/{report.totalCount}
            </span>
            <span className="text-xs text-muted-foreground">actifs</span>
          </div>
        </CardContent>
      </Card>

      {/* Dependency Probes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
        {report.probes.map((probe) => {
          const Icon = getCategoryIcon(probe.category)
          return (
            <Card key={probe.id} className="flex flex-col h-full min-w-0 overflow-hidden">
              <CardHeader className="pb-3 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-2 min-w-0">
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <div className="p-2 rounded-lg bg-muted shrink-0">
                      <Icon className="h-4 w-4 text-[hsl(var(--brand))]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base leading-snug break-words">
                        {probe.name}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {probe.category}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="shrink-0">{getStatusBadge(probe.status)}</div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-2.5 text-sm min-w-0">
                <p className="text-foreground/90 leading-relaxed [overflow-wrap:anywhere]">
                  {probe.message}
                </p>
                {probe.hint && (
                  <p className="text-xs text-muted-foreground rounded-lg bg-muted/50 border border-border/60 p-2.5 [overflow-wrap:anywhere]">
                    {probe.hint}
                  </p>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs text-muted-foreground">
                  <span>Latence sonde</span>
                  <span className="font-mono font-semibold text-foreground tabular-nums">
                    {probe.latencyMs !== null ? `${probe.latencyMs} ms` : "Config uniquement"}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
