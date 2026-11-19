/**
 * Charge les variables d'environnement pour les scripts Prisma CLI (`db:seed`).
 * Respecte la priorite Next.js : `.env.local` puis `.env` sans ecraser les variables deja definies.
 */

import fs from "node:fs"
import path from "node:path"
import dotenv from "dotenv"

const cwd = process.cwd()
const envLocalPath = path.resolve(cwd, ".env.local")
const envPath = path.resolve(cwd, ".env")

if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath })
}
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
}
