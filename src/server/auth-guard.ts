/**
 * Gardes d'authentification et controle d'acces RBAC cote serveur (RSC & Server Actions)
 */

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export type UserRole = "client" | "pro" | "admin"

export interface AuthenticatedUser {
  id: string
  email: string
  name: string
  image: string | null
  userType: UserRole
  phoneNumber: string | null
}

export interface ServerSessionContext {
  user: AuthenticatedUser
  session: {
    id: string
    userId: string
    expiresAt: Date
  }
}

export function normalizeUserRole(raw?: string | null): UserRole {
  if (raw === "admin") return "admin"
  if (raw === "pro") return "pro"
  return "client"
}

export function getDashboardHomeByRole(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/dashboard/admin"
    case "pro":
      return "/dashboard/pro"
    default:
      return "/dashboard/client"
  }
}

/**
 * Recupere la session serveur Better-Auth et resout le role canonique depuis Prisma
 */
export async function getServerSession(): Promise<ServerSessionContext | null> {
  const reqHeaders = await headers()
  const rawSession = await auth.api.getSession({
    headers: reqHeaders,
  })

  if (!rawSession?.user || !rawSession?.session) {
    return null
  }

  let canonicalRole = normalizeUserRole(
    (rawSession.user as { userType?: string | null }).userType
  )
  let canonicalPhone =
    (rawSession.user as { phoneNumber?: string | null }).phoneNumber ?? null

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: rawSession.user.id },
      select: { userType: true, phoneNumber: true },
    })
    if (dbUser) {
      canonicalRole = normalizeUserRole(dbUser.userType)
      canonicalPhone = dbUser.phoneNumber
    }
  } catch {
    // Tolere les erreurs DB transitoires en gardant le role issu du cookie de session signe
  }

  return {
    user: {
      id: rawSession.user.id,
      email: rawSession.user.email,
      name: rawSession.user.name,
      image: rawSession.user.image ?? null,
      userType: canonicalRole,
      phoneNumber: canonicalPhone,
    },
    session: {
      id: rawSession.session.id,
      userId: rawSession.session.userId,
      expiresAt: rawSession.session.expiresAt,
    },
  }
}

/**
 * Exige une session valide dans un Server Component (redirige vers /login sinon)
 */
export async function requireSession(): Promise<ServerSessionContext> {
  const ctx = await getServerSession()
  if (!ctx) {
    redirect("/login")
  }
  return ctx
}

/**
 * Exige un role autorise dans un Server Component (redirige vers son propre espace sinon)
 */
export async function requireRole(
  allowedRoles: UserRole[]
): Promise<ServerSessionContext> {
  const ctx = await requireSession()
  if (!allowedRoles.includes(ctx.user.userType)) {
    redirect(getDashboardHomeByRole(ctx.user.userType))
  }
  return ctx
}

/**
 * Verifie la session et le role dans une Server Action (pattern { user, session, error })
 */
export async function requireActionSession(
  allowedRoles?: UserRole[]
): Promise<
  | { user: AuthenticatedUser; session: ServerSessionContext["session"]; error: null }
  | { user: null; session: null; error: string }
> {
  const ctx = await getServerSession()
  if (!ctx) {
    return {
      user: null,
      session: null,
      error: "Authentification requise. Veuillez vous connecter.",
    }
  }

  if (allowedRoles && !allowedRoles.includes(ctx.user.userType)) {
    return {
      user: null,
      session: null,
      error: "Vous n'avez pas les permissions requises pour cette action.",
    }
  }

  return {
    user: ctx.user,
    session: ctx.session,
    error: null,
  }
}

/**
 * Exige un compte Prestataire (ou Admin) et charge son ProProfile depuis Prisma
 */
export async function requireProProfile() {
  const authRes = await requireActionSession(["pro", "admin"])
  if (authRes.error !== null) {
    return { user: null, proProfile: null, error: authRes.error } as const
  }

  const proProfile = await prisma.proProfile.findUnique({
    where: { userId: authRes.user.id },
  })

  if (!proProfile) {
    return {
      user: null,
      proProfile: null,
      error: "Profil prestataire introuvable. Veuillez compléter votre profil professionnel.",
    } as const
  }

  return {
    user: authRes.user,
    proProfile,
    error: null,
  } as const
}
