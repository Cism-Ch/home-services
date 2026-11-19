/**
 * Client Upstash Redis & Rate Limiting serverless (Regle 6)
 * Gere le cache-aside du catalogue public et la protection anti-abus sur les Server Actions sensibles.
 */

import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

export const CATALOG_CACHE_KEYS = {
  CATEGORIES: "catalog:categories:v1",
  SERVICES: "catalog:services:v1",
  PROFESSIONALS: "catalog:professionals:v1",
} as const

export type RateLimitAction = "booking" | "review" | "upload" | "checkout"

const RATE_LIMIT_MESSAGE =
  "Trop de requêtes effectuées. Veuillez patienter quelques instants avant de réessayer."

let cachedRedisClient: Redis | null | undefined
const cachedLimiters = new Map<RateLimitAction, Ratelimit>()

/**
 * Retourne l'instance singleton Upstash Redis REST ou null si les identifiants sont absents.
 */
export function getRedisClient(): Redis | null {
  if (cachedRedisClient !== undefined) {
    return cachedRedisClient
  }

  const url = process.env.UPSTASH_REDIS_REST_URL?.trim()
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim()

  if (!url || !token) {
    cachedRedisClient = null
    return null
  }

  cachedRedisClient = new Redis({ url, token })
  return cachedRedisClient
}

/**
 * Pattern Cache-Aside avec bascule transparente (fail-open) vers Prisma en cas d'indisponibilite Redis.
 */
export async function getCachedOrFetch<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const redis = getRedisClient()
  if (!redis) {
    return fetcher()
  }

  try {
    const cached = await redis.get<T>(key)
    if (cached !== null && cached !== undefined) {
      return cached
    }
  } catch (err) {
    console.warn("[redis] Lecture cache impossible, bascule DB:", err)
    return fetcher()
  }

  const freshData = await fetcher()

  try {
    await redis.set(key, freshData, { ex: ttlSeconds })
  } catch (err) {
    console.warn("[redis] Ecriture cache impossible:", err)
  }

  return freshData
}

/**
 * Invalide les cles de cache du catalogue public apres toute mutation metier.
 */
export async function invalidateCatalogCache(): Promise<void> {
  const redis = getRedisClient()
  if (!redis) {
    return
  }

  try {
    const keys = Object.values(CATALOG_CACHE_KEYS)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  } catch (err) {
    console.warn("[redis] Invalidation cache impossible:", err)
  }
}

function getRateLimiter(action: RateLimitAction, redis: Redis): Ratelimit {
  const existing = cachedLimiters.get(action)
  if (existing) {
    return existing
  }

  const limiterConfig: Record<
    RateLimitAction,
    { requests: number; window: "10 m" | "1 h"; prefix: string }
  > = {
    booking: { requests: 10, window: "10 m", prefix: "hs:rl:booking" },
    review: { requests: 10, window: "1 h", prefix: "hs:rl:review" },
    upload: { requests: 20, window: "10 m", prefix: "hs:rl:upload" },
    checkout: { requests: 5, window: "10 m", prefix: "hs:rl:checkout" },
  }

  const cfg = limiterConfig[action]
  const instance = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(cfg.requests, cfg.window),
    prefix: cfg.prefix,
  })

  cachedLimiters.set(action, instance)
  return instance
}

/**
 * Applique un rate limiting par utilisateur/identifiant sur les Server Actions critiques.
 * Adopte une strategie fail-open si Redis est non configure ou temporairement injoignable.
 */
export async function enforceRateLimit(
  action: RateLimitAction,
  identifier: string
): Promise<{ allowed: boolean; error: string | null }> {
  const redis = getRedisClient()
  if (!redis) {
    return { allowed: true, error: null }
  }

  try {
    const limiter = getRateLimiter(action, redis)
    const result = await limiter.limit(identifier)

    if (!result.success) {
      return {
        allowed: false,
        error: RATE_LIMIT_MESSAGE,
      }
    }

    return { allowed: true, error: null }
  } catch (err) {
    console.warn("[redis] Verification rate limit impossible, mode fail-open:", err)
    return { allowed: true, error: null }
  }
}
