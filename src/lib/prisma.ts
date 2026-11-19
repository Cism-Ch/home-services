/**
 * Instance Prisma Client (Singleton)
 * Conforme a Prisma 7 avec adaptateur PostgreSQL (@prisma/adapter-pg)
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Singleton pattern pour eviter les multiples instances en developpement
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString =
    process.env.DATABASE_URL || "postgresql://localhost:5432/postgres";
  const isSupabase = connectionString.includes("supabase.com");
  const adapter = new PrismaPg({
    connectionString,
    ...(isSupabase ? { ssl: { rejectUnauthorized: false } } : {}),
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
