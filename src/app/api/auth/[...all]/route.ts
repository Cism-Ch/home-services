/**
 * API Routes Better-auth
 * 
 * Expose les endpoints d'authentification de Better-auth via le handler Next.js officiel:
 * - POST /api/auth/sign-in/email
 * - POST /api/auth/sign-up/email
 * - POST /api/auth/sign-in/social
 * - POST /api/auth/sign-out
 * - POST /api/auth/forget-password
 * - POST /api/auth/reset-password
 * - GET /api/auth/session
 */

import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
