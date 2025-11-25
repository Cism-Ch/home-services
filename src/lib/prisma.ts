/**
 * Instance Prisma Client (Singleton)
 * Compatible avec Prisma 7
 */

import { PrismaClient } from "@prisma/client";

// Singleton pattern pour éviter les multiples instances en développement
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}