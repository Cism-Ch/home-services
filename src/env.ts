/**
 * Validation centralisee des variables d'environnement via Zod (Regle 9)
 * Evite les crashs silencieux au demarrage tout en tolerant les builds CI statiques.
 */

import { z } from "zod"

const optionalNonEmptyString = z.preprocess(
  (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
  z.string().min(1).optional()
)

const optionalUrl = z.preprocess(
  (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
  z.string().url().optional()
)

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.preprocess(
    (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
    z.string().url().default("http://localhost:3000")
  ),
  NEXT_PUBLIC_SUPABASE_URL: optionalUrl,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalNonEmptyString,
  NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: optionalNonEmptyString,
})

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: optionalNonEmptyString,
  DIRECT_URL: optionalNonEmptyString,
  SUPABASE_SERVICE_ROLE_KEY: optionalNonEmptyString,
  BETTER_AUTH_SECRET: optionalNonEmptyString,
  BETTER_AUTH_URL: optionalUrl,
  GOOGLE_CLIENT_ID: optionalNonEmptyString,
  GOOGLE_CLIENT_SECRET: optionalNonEmptyString,
  TIGRIS_BUCKET_NAME: optionalNonEmptyString,
  AWS_ACCESS_KEY_ID: optionalNonEmptyString,
  AWS_SECRET_ACCESS_KEY: optionalNonEmptyString,
  AWS_ENDPOINT_URL_S3: optionalUrl,
  AWS_REGION: optionalNonEmptyString,
  UPSTASH_REDIS_REST_URL: optionalUrl,
  UPSTASH_REDIS_REST_TOKEN: optionalNonEmptyString,
  QSTASH_URL: optionalUrl,
  QSTASH_TOKEN: optionalNonEmptyString,
  QSTASH_CURRENT_SIGNING_KEY: optionalNonEmptyString,
  QSTASH_NEXT_SIGNING_KEY: optionalNonEmptyString,
  RESEND_API_KEY: optionalNonEmptyString,
  EMAIL_FROM: optionalNonEmptyString,
  PAYSTACK_SECRET_KEY: optionalNonEmptyString,
  PAYSTACK_PLAN_PRO_STANDARD: optionalNonEmptyString,
  PAYSTACK_PLAN_PRO_PREMIUM: optionalNonEmptyString,
  PAYSTACK_PLAN_PRO_ENTERPRISE: optionalNonEmptyString,
  PAYSTACK_PLAN_CLIENT_GOLD: optionalNonEmptyString,
})

export type ClientEnv = z.infer<typeof clientEnvSchema>
export type ServerEnv = z.infer<typeof serverEnvSchema> & ClientEnv

function parseClientEnv(): ClientEnv {
  const parsed = clientEnvSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
  })

  if (!parsed.success) {
    console.warn("[env] Configuration client incomplete:", parsed.error.flatten().fieldErrors)
    return {
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
    }
  }

  return parsed.data
}

/**
 * Variables publiques accessibles cote client et serveur
 */
export const env: ClientEnv = parseClientEnv()

let cachedServerEnv: ServerEnv | null = null

/**
 * Recupere et valide toutes les variables d'environnement cote serveur.
 * En production runtime (hors phase de build statique), exige DATABASE_URL et BETTER_AUTH_SECRET.
 */
export function getServerEnv(): ServerEnv {
  if (typeof window !== "undefined") {
    throw new Error("getServerEnv() ne doit jamais etre appele cote client.")
  }

  if (cachedServerEnv) {
    return cachedServerEnv
  }

  const parsedServer = serverEnvSchema.safeParse(process.env)
  if (!parsedServer.success) {
    const details = JSON.stringify(parsedServer.error.flatten().fieldErrors)
    throw new Error(`Configuration serveur invalide : ${details}`)
  }

  const isNextBuildPhase = process.env.NEXT_PHASE === "phase-production-build"
  if (parsedServer.data.NODE_ENV === "production" && !isNextBuildPhase) {
    if (!parsedServer.data.DATABASE_URL) {
      throw new Error("DATABASE_URL est obligatoire en production.")
    }
    if (!parsedServer.data.BETTER_AUTH_SECRET) {
      throw new Error("BETTER_AUTH_SECRET est obligatoire en production.")
    }
  }

  cachedServerEnv = {
    ...env,
    ...parsedServer.data,
  }
  return cachedServerEnv
}
