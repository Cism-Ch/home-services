"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
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
import { useState } from "react"

interface NavLinkItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  exact: boolean
}

interface NavContentProps {
  roleMode: "client" | "pro" | "admin"
  userName: string
  userType: string
  links: NavLinkItem[]
  pathname: string
  onItemClick: () => void
}

function NavContent({
  roleMode,
  userName,
  userType,
  links,
  pathname,
  onItemClick,
}: NavContentProps) {
  const initials =
    roleMode === "admin" ? "AD" : roleMode === "pro" ? "AK" : "JK"

  return (
    <div className="space-y-4">
      <div className="p-4 bg-card rounded-lg border shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-bold",
              roleMode === "admin"
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : roleMode === "pro"
                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                : "bg-primary/10 text-primary"
            )}
          >
            {initials}
          </div>
          <div>
            <p className="font-medium text-sm">{userName}</p>
            <p className="text-xs text-muted-foreground">{userType}</p>
          </div>
        </div>

        <nav className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href)

            return (
              <Link key={link.href} href={link.href} onClick={onItemClick}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2",
                    isActive && "font-medium"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Bascule rapide d'espaces pour navigation fluide */}
        <div className="pt-4 mt-4 border-t space-y-1">
          <p className="px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Espaces de gestion
          </p>
          <Link href="/dashboard/client" onClick={onItemClick}>
            <Button
              variant={roleMode === "client" ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start text-xs h-8"
            >
              Espace Client
            </Button>
          </Link>
          <Link href="/dashboard/pro" onClick={onItemClick}>
            <Button
              variant={roleMode === "pro" ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start text-xs h-8"
            >
              Espace Prestataire
            </Button>
          </Link>
          <Link href="/dashboard/admin" onClick={onItemClick}>
            <Button
              variant={roleMode === "admin" ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start text-xs h-8"
            >
              Portail Admin
            </Button>
          </Link>
        </div>

        <div className="pt-3 mt-3 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </Button>
        </div>
      </div>
    </div>
  )
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/dashboard/admin")
  const isPro = pathname.startsWith("/dashboard/pro")
  const roleMode: "client" | "pro" | "admin" = isAdmin
    ? "admin"
    : isPro
    ? "pro"
    : "client"
  const [open, setOpen] = useState(false)

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
  const userType =
    roleMode === "admin"
      ? "Administrateur"
      : roleMode === "pro"
      ? "Artisan Prestataire"
      : "Compte Client"
  const userName =
    roleMode === "admin"
      ? "Direction HomeServices"
      : roleMode === "pro"
      ? "Amadou Kouassi"
      : "Jean-Marc Kouadio"

  return (
    <>
      {/* Mobile Sidebar Trigger */}
      <div className="md:hidden w-full mb-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Menu className="h-4 w-4" />
              Menu Dashboard
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0 pt-10">
            <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
            <div className="px-4">
              <NavContent
                roleMode={roleMode}
                userName={userName}
                userType={userType}
                links={links}
                pathname={pathname}
                onItemClick={() => setOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 flex-shrink-0">
        <div className="sticky top-24">
          <NavContent
            roleMode={roleMode}
            userName={userName}
            userType={userType}
            links={links}
            pathname={pathname}
            onItemClick={() => {}}
          />
        </div>
      </aside>
    </>
  )
}
