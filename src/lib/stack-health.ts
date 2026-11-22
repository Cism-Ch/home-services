/**
 * Sondes de sante et d'uptime temps reel pour l'ensemble du stack HomeServices.
 * Reserve a l'administration (/dashboard/admin/health et GET /api/admin/health).
 */

import { HeadBucketCommand } from "@aws-sdk/client-s3"
import { prisma } from "@/lib/prisma"
import { getRedisClient } from "@/lib/redis"
import { getS3Client } from "@/lib/storage"

export type ServiceHealthStatus =
  | "operational"
  | "degraded"
  | "unconfigured"
  | "down"

export interface StackDependencyProbe {
  id: string
  name: string
  category: "Database" | "Auth" | "Storage" | "Cache & Queue" | "Communication" | "Payments"
  status: ServiceHealthStatus
  latencyMs: number | null
  message: string
  hint?: string
  checkedAt: string
}

export interface StackHealthReport {
  overallStatus: "operational" | "degraded" | "down"
  operationalCount: number
  totalCount: number
  checkedAt: string
  environment: string
  probes: StackDependencyProbe[]
}

async function probePostgres(): Promise<StackDependencyProbe> {
  const start = Date.now()
  const checkedAt = new Date().toISOString()
  try {
    await prisma.$queryRaw`SELECT 1`
    const [users, services] = await Promise.all([
      prisma.user.count(),
      prisma.service.count(),
    ])
    return {
      id: "postgres",
      name: "Supabase PostgreSQL (Prisma)",
      category: "Database",
      status: "operational",
      latencyMs: Date.now() - start,
      message: `Connexion active (${users} utilisateurs, ${services} prestations).`,
      checkedAt,
    }
  } catch (err) {
    return {
      id: "postgres",
      name: "Supabase PostgreSQL (Prisma)",
      category: "Database",
      status: "down",
      latencyMs: Date.now() - start,
      message: err instanceof Error ? err.message.slice(0, 140) : "Base inaccessible.",
      hint: "Vérifiez DATABASE_URL / DIRECT_URL et le pooler Supabase.",
      checkedAt,
    }
  }
}

async function probeBetterAuth(): Promise<StackDependencyProbe> {
  const start = Date.now()
  const checkedAt = new Date().toISOString()
  const hasSecret = Boolean(process.env.BETTER_AUTH_SECRET?.trim())
  const hasBaseUrl = Boolean(
    process.env.BETTER_AUTH_URL?.trim() || process.env.NEXT_PUBLIC_APP_URL?.trim()
  )

  if (!hasSecret) {
    return {
      id: "better-auth",
      name: "Better-Auth (Sessions & RBAC)",
      category: "Auth",
      status: "down",
      latencyMs: Date.now() - start,
      message: "BETTER_AUTH_SECRET manquante.",
      hint: "Définissez une clé secrète >= 32 caractères dans l'environnement.",
      checkedAt,
    }
  }

  try {
    const activeSessions = await prisma.session.count({
      where: { expiresAt: { gt: new Date() } },
    })
    return {
      id: "better-auth",
      name: "Better-Auth (Sessions & RBAC)",
      category: "Auth",
      status: hasBaseUrl ? "operational" : "degraded",
      latencyMs: Date.now() - start,
      message: hasBaseUrl
        ? `Opérationnel (${activeSessions} session(s) active(s)).`
        : `Actif (${activeSessions} session(s)), BETTER_AUTH_URL non définie.`,
      hint: hasBaseUrl
        ? undefined
        : "Définissez BETTER_AUTH_URL pour les liens de réinitialisation et cookies en production.",
      checkedAt,
    }
  } catch (err) {
    return {
      id: "better-auth",
      name: "Better-Auth (Sessions & RBAC)",
      category: "Auth",
      status: "down",
      latencyMs: Date.now() - start,
      message: err instanceof Error ? err.message.slice(0, 120) : "Erreur table sessions.",
      checkedAt,
    }
  }
}

async function probeTigrisS3(): Promise<StackDependencyProbe> {
  const start = Date.now()
  const checkedAt = new Date().toISOString()
  const s3 = getS3Client()
  const bucket = process.env.TIGRIS_BUCKET_NAME?.trim() || "home-services-assets"

  if (!s3) {
    return {
      id: "tigris-s3",
      name: "Tigris Object Storage (S3)",
      category: "Storage",
      status: "unconfigured",
      latencyMs: null,
      message: "Clés AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY absentes.",
      hint: "Ajoutez les identifiants Tigris S3 dans .env pour activer les uploads avatars, portfolio et KYC.",
      checkedAt,
    }
  }

  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucket }))
    return {
      id: "tigris-s3",
      name: "Tigris Object Storage (S3)",
      category: "Storage",
      status: "operational",
      latencyMs: Date.now() - start,
      message: `Bucket "${bucket}" accessible et authentifié.`,
      checkedAt,
    }
  } catch (err) {
    const detail = err instanceof Error ? err.message : "Erreur S3 inconnue"
    return {
      id: "tigris-s3",
      name: "Tigris Object Storage (S3)",
      category: "Storage",
      status: "down",
      latencyMs: Date.now() - start,
      message: `Échec HeadBucket sur "${bucket}" : ${detail.slice(0, 120)}`,
      hint: "Vérifiez TIGRIS_BUCKET_NAME, AWS_ENDPOINT_URL_S3 et les permissions de la clé Tigris.",
      checkedAt,
    }
  }
}

async function probeUpstashRedis(): Promise<StackDependencyProbe> {
  const start = Date.now()
  const checkedAt = new Date().toISOString()
  const redis = getRedisClient()

  if (!redis) {
    return {
      id: "upstash-redis",
      name: "Upstash Redis (Cache & Rate-Limit)",
      category: "Cache & Queue",
      status: "unconfigured",
      latencyMs: null,
      message: "Variables UPSTASH_REDIS_REST_URL / TOKEN absentes (fallback mémoire actif).",
      hint: "Configurez Upstash Redis pour le cache distribué et le rate-limiting en production.",
      checkedAt,
    }
  }

  try {
    const pong = await redis.ping()
    return {
      id: "upstash-redis",
      name: "Upstash Redis (Cache & Rate-Limit)",
      category: "Cache & Queue",
      status: pong === "PONG" ? "operational" : "degraded",
      latencyMs: Date.now() - start,
      message: `Réponse PING : ${String(pong)}.`,
      checkedAt,
    }
  } catch (err) {
    return {
      id: "upstash-redis",
      name: "Upstash Redis (Cache & Rate-Limit)",
      category: "Cache & Queue",
      status: "down",
      latencyMs: Date.now() - start,
      message: err instanceof Error ? err.message.slice(0, 120) : "Échec PING Redis.",
      hint: "Vérifiez l'URL REST et le token Upstash Redis.",
      checkedAt,
    }
  }
}

function probeUpstashQStash(): StackDependencyProbe {
  const checkedAt = new Date().toISOString()
  const hasToken = Boolean(process.env.QSTASH_TOKEN?.trim())
  const hasSigningKeys = Boolean(
    process.env.QSTASH_CURRENT_SIGNING_KEY?.trim() &&
      process.env.QSTASH_NEXT_SIGNING_KEY?.trim()
  )

  if (!hasToken) {
    return {
      id: "upstash-qstash",
      name: "Upstash QStash (Tâches Asynchrones)",
      category: "Cache & Queue",
      status: "unconfigured",
      latencyMs: null,
      message: "QSTASH_TOKEN non configuré (exécution locale/différée désactivée).",
      hint: "Ajoutez QSTASH_TOKEN et les clés de signature webhook pour les relances et nettoyages S3.",
      checkedAt,
    }
  }

  return {
    id: "upstash-qstash",
    name: "Upstash QStash (Tâches Asynchrones)",
    category: "Cache & Queue",
    status: hasSigningKeys ? "operational" : "degraded",
    latencyMs: 0,
    message: hasSigningKeys
      ? "Token et clés de signature webhook configurés."
      : "Token présent mais clés de signature webhook incomplètes.",
    hint: hasSigningKeys
      ? undefined
      : "Définissez QSTASH_CURRENT_SIGNING_KEY et QSTASH_NEXT_SIGNING_KEY.",
    checkedAt,
  }
}

function probeResend(): StackDependencyProbe {
  const checkedAt = new Date().toISOString()
  const hasApiKey = Boolean(process.env.RESEND_API_KEY?.trim())
  const fromEmail = process.env.RESEND_FROM_EMAIL?.trim()

  if (!hasApiKey) {
    return {
      id: "resend",
      name: "Resend (Emails Transactionnels)",
      category: "Communication",
      status: "unconfigured",
      latencyMs: null,
      message: "RESEND_API_KEY absente (emails non expédiés).",
      hint: "Configurez RESEND_API_KEY et RESEND_FROM_EMAIL pour les confirmations et réinitialisations.",
      checkedAt,
    }
  }

  return {
    id: "resend",
    name: "Resend (Emails Transactionnels)",
    category: "Communication",
    status: "operational",
    latencyMs: 0,
    message: `Clé API configurée (expéditeur : ${fromEmail || "par défaut"}).`,
    checkedAt,
  }
}

function probePaystack(): StackDependencyProbe {
  const checkedAt = new Date().toISOString()
  const secret = process.env.PAYSTACK_SECRET_KEY?.trim() || ""

  if (!secret) {
    return {
      id: "paystack",
      name: "Paystack (Abonnements XOF)",
      category: "Payments",
      status: "unconfigured",
      latencyMs: null,
      message: "PAYSTACK_SECRET_KEY absente (mode simulation local uniquement).",
      hint: "Renseignez PAYSTACK_SECRET_KEY pour encaisser les abonnements Pro et Client Or en FCFA.",
      checkedAt,
    }
  }

  const isLive = secret.startsWith("sk_live_")
  return {
    id: "paystack",
    name: "Paystack (Abonnements XOF)",
    category: "Payments",
    status: "operational",
    latencyMs: 0,
    message: isLive
      ? "Clé Paystack LIVE configurée (XOF)."
      : "Clé Paystack TEST configurée (mode sandbox XOF).",
    checkedAt,
  }
}

/**
 * Execute en parallele toutes les sondes d'etat du stack et consolide le bilan global.
 */
export async function runStackHealthChecks(): Promise<StackHealthReport> {
  const [postgres, betterAuth, tigris, redis] = await Promise.all([
    probePostgres(),
    probeBetterAuth(),
    probeTigrisS3(),
    probeUpstashRedis(),
  ])

  const probes: StackDependencyProbe[] = [
    postgres,
    betterAuth,
    tigris,
    redis,
    probeUpstashQStash(),
    probeResend(),
    probePaystack(),
  ]

  const operationalCount = probes.filter((p) => p.status === "operational").length
  const hasCriticalDown =
    postgres.status === "down" || betterAuth.status === "down"
  const hasAnyIssue = probes.some((p) => p.status !== "operational")

  const overallStatus: StackHealthReport["overallStatus"] = hasCriticalDown
    ? "down"
    : hasAnyIssue
    ? "degraded"
    : "operational"

  return {
    overallStatus,
    operationalCount,
    totalCount: probes.length,
    checkedAt: new Date().toISOString(),
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "development",
    probes,
  }
}
