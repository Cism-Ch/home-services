/**
 * Instance Prisma Client (Singleton)
 * Conforme a Prisma 7 avec adaptateur PostgreSQL (@prisma/adapter-pg)
 * et gestion SSL robuste pour Supabase / environnements serverless.
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function normalizeConnectionString(rawUrl: string): {
  connectionString: string;
  useSsl: boolean;
} {
  const trimmed = rawUrl.trim();
  const isLocalHost =
    trimmed.includes("localhost") ||
    trimmed.includes("127.0.0.1") ||
    trimmed.includes("::1");
  const isCloudHost =
    trimmed.includes("supabase.com") ||
    trimmed.includes("supabase.co") ||
    trimmed.includes("sslmode=") ||
    (!isLocalHost && process.env.NODE_ENV === "production");

  if (!isCloudHost) {
    return { connectionString: trimmed, useSsl: false };
  }

  // Retire sslmode de l'URL pour eviter que pg v8.20+ ne force verify-full
  // sur la chaine TLS du pooler Supabase et applique ssl.rejectUnauthorized = false.
  try {
    const parsed = new URL(trimmed);
    parsed.searchParams.delete("sslmode");
    return { connectionString: parsed.toString(), useSsl: true };
  } catch {
    return { connectionString: trimmed, useSsl: true };
  }
}

function createPrismaClient() {
  const rawUrl =
    process.env.DATABASE_URL || "postgresql://localhost:5432/postgres";
  const { connectionString, useSsl } = normalizeConnectionString(rawUrl);

  const adapter = new PrismaPg({
    connectionString,
    max: process.env.NODE_ENV === "production" ? 5 : 10,
    ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {}),
  });

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();
globalForPrisma.prisma = prisma;
