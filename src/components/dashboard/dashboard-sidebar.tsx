"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Calendar,
  Settings,
  LogOut,
  Briefcase,
  User,
  Clock,
  Menu,
  ShieldCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

interface NavLinkItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  exact: boolean
}

export interface SidebarUserProps {
  id: string
  name: string
  email: string
  image?: string | null
  userType: "client" | "pro" | "admin"
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "HS"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

interface NavContentProps {
  roleMode: "client" | "pro" | "admin"
  actualRole: "client" | "pro" | "admin"
  userName: string
  userTypeLabel: string
  initials: string
  links: NavLinkItem[]
  pathname: string
  isLoggingOut: boolean
  onLogout: () => void
  onItemClick: () => void
}

function NavContent({
  roleMode,
  actualRole,
  userName,
  userTypeLabel,
  initials,
  links,
  pathname,
  isLoggingOut,
  onLogout,
  onItemClick,
}: NavContentProps) {
  const canAccessPro = actualRole === "pro" || actualRole === "admin"
  const canAccessAdmin = actualRole === "admin"

  return (
    <div className="space-y-4">
      <div className="p-4 bg-card rounded-lg border shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0",
              roleMode === "admin"
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : roleMode === "pro"
                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                : "bg-primary/10 text-primary"
            )}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">{userName}</p>
            <p className="text-xs text-muted-foreground">{userTypeLabel}</p>
          </div>
        </div>

        <nav className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href)

            return (
              <Button
                key={link.href}
                asChild
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2 min-h-10",
                  isActive && "font-medium"
                )}
              >
                <Link href={link.href} onClick={onItemClick}>
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{link.label}</span>
                </Link>
              </Button>
            )
          })}
        </nav>

        {(canAccessPro || canAccessAdmin) && (
          <div className="pt-4 mt-4 border-t space-y-1">
            <p className="px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Espaces autorisés
            </p>
            <Button
              asChild
              variant={roleMode === "client" ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start text-xs min-h-9"
            >
              <Link href="/dashboard/client" onClick={onItemClick}>
                Espace Client
              </Link>
            </Button>
            {canAccessPro && (
              <Button
                asChild
                variant={roleMode === "pro" ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start text-xs min-h-9"
              >
                <Link href="/dashboard/pro" onClick={onItemClick}>
                  Espace Prestataire
                </Link>
              </Button>
            )}
            {canAccessAdmin && (
              <Button
                asChild
                variant={roleMode === "admin" ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start text-xs min-h-9"
              >
                <Link href="/dashboard/admin" onClick={onItemClick}>
                  Portail Admin
                </Link>
              </Button>
            )}
          </div>
        )}

        <div className="pt-3 mt-3 border-t">
          <Button
            variant="ghost"
            onClick={onLogout}
            disabled={isLoggingOut}
            className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            {isLoggingOut ? "Déconnexion..." : "Se déconnecter"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export function DashboardSidebar({ user }: { user: SidebarUserProps }) {
  const pathname = usePathname()
  const { logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const isAdminRoute = pathname.startsWith("/dashboard/admin")
  const isProRoute = pathname.startsWith("/dashboard/pro")
  const roleMode: "client" | "pro" | "admin" = isAdminRoute
    ? "admin"
    : isProRoute
    ? "pro"
    : "client"

  const clientLinks: NavLinkItem[] = [
    {
      href: "/dashboard/client",
      label: "Vue d'ensemble",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/dashboard/client/bookings",
      label: "Mes réservations",
      icon: Calendar,
      exact: false,
    },
    {
      href: "/dashboard/client/settings",
      label: "Paramètres & Or",
      icon: Settings,
      exact: false,
    },
  ]

  const proLinks: NavLinkItem[] = [
    {
      href: "/dashboard/pro",
      label: "Vue d'ensemble",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/dashboard/pro/schedule",
      label: "Agenda & Offres",
      icon: Calendar,
      exact: false,
    },
    {
      href: "/dashboard/pro/services",
      label: "Mes services (FCFA)",
      icon: Briefcase,
      exact: false,
    },
    {
      href: "/dashboard/pro/profile",
      label: "Mon profil & KYC",
      icon: User,
      exact: false,
    },
    {
      href: "/dashboard/pro/availability",
      label: "Disponibilités",
      icon: Clock,
      exact: false,
    },
    {
      href: "/dashboard/pro/settings",
      label: "Abonnement Paystack",
      icon: Settings,
      exact: false,
    },
  ]

  const adminLinks: NavLinkItem[] = [
    {
      href: "/dashboard/admin",
      label: "Gouvernance & KYC",
      icon: ShieldCheck,
      exact: true,
    },
  ]

  const links =
    roleMode === "admin"
      ? adminLinks
      : roleMode === "pro"
      ? proLinks
      : clientLinks

  const userTypeLabel =
    user.userType === "admin"
      ? "Administrateur"
      : user.userType === "pro"
      ? "Artisan Prestataire"
      : "Compte Client"

  const initials = getInitials(user.name)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      toast.success("Vous êtes déconnecté.")
    } catch {
      toast.error("Erreur lors de la déconnexion.")
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      <div className="md:hidden w-full mb-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Menu className="h-4 w-4" />
              Menu Dashboard
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[min(85vw,320px)] sm:w-[360px] p-0 pt-10">
            <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
            <div className="px-4">
              <NavContent
                roleMode={roleMode}
                actualRole={user.userType}
                userName={user.name}
                userTypeLabel={userTypeLabel}
                initials={initials}
                links={links}
                pathname={pathname}
                isLoggingOut={isLoggingOut}
                onLogout={handleLogout}
                onItemClick={() => setOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <aside className="hidden md:block w-64 shrink-0">
        <div className="sticky top-24">
          <NavContent
            roleMode={roleMode}
            actualRole={user.userType}
            userName={user.name}
            userTypeLabel={userTypeLabel}
            initials={initials}
            links={links}
            pathname={pathname}
            isLoggingOut={isLoggingOut}
            onLogout={handleLogout}
            onItemClick={() => {}}
          />
        </div>
      </aside>
    </>
  )
}
