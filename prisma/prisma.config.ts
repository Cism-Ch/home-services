/**
 * Configuration Prisma 7
 * Ce fichier remplace la propriété `url` dans schema.prisma
 */

export default {
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
};