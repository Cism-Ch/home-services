"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutDashboard, LogOut, Menu, User } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { useAuth } from "@/contexts/auth-context"
import { notify } from "@/lib/notifications"
import { cn } from "@/lib/utils"

function getDashboardRoute(userType?: "client" | "pro" | "admin"): string {
  if (userType === "admin") return "/dashboard/admin"
  if (userType === "pro") return "/dashboard/pro"
  return "/dashboard/client"
}

/**
 * Barre de navigation principale translucide sans bordure,
 * avec legere densification verre au defilement et notifications normalisees.
 */
export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, isAuthenticated, isLoading, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const dashboardHref = getDashboardRoute(user?.userType)

  const handleLogout = async () => {
    setIsOpen(false)
    try {
      await logout()
      notify.success("Vous êtes déconnecté.", {
        id: "auth-logout",
        description: "À bientôt sur HomeServices.",
      })
    } catch {
      notify.error("Erreur lors de la déconnexion.", { id: "auth-logout" })
    }
  }

  return (
    <header
      data-site-header="translucent"
      className={cn(
        "sticky top-0 z-50 w-full transition-[background-color,box-shadow,backdrop-filter] duration-300",
        isScrolled
          ? "bg-background/65 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.32)]"
          : "bg-transparent backdrop-blur-md"
      )}
    >
      <div
        data-layout-container="page"
        className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 flex h-16 items-center justify-between gap-2"
      >
        <div className="flex items-center min-w-0">
          {/* Mobile Menu Trigger (< lg) */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden mr-2 shrink-0 rounded-full">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[min(85vw,320px)] sm:w-[360px] px-6 py-6 overflow-y-auto">
              <SheetTitle className="sr-only">Menu principal</SheetTitle>
              <div className="flex flex-col gap-6 pt-2">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2.5 w-fit"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] flex items-center justify-center shadow-md">
                    <span className="text-white font-extrabold text-sm">HS</span>
                  </div>
                  <span className="font-extrabold text-lg tracking-tight gradient-brand">
                    HomeServices
                  </span>
                </Link>

                <nav className="flex flex-col gap-1.5">
                  <Button asChild variant="ghost" className="w-full justify-start min-h-10">
                    <Link href="/" onClick={() => setIsOpen(false)}>
                      Accueil
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="w-full justify-start min-h-10">
                    <Link href="/services" onClick={() => setIsOpen(false)}>
                      Services
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="w-full justify-start min-h-10">
                    <Link href="/professionals" onClick={() => setIsOpen(false)}>
                      Professionnels
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="w-full justify-start min-h-10">
                    <Link href="/pricing" onClick={() => setIsOpen(false)}>
                      Tarifs
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="w-full justify-start min-h-10">
                    <Link href="/about" onClick={() => setIsOpen(false)}>
                      À propos
                    </Link>
                  </Button>
                </nav>

                <div className="border-t pt-4 flex flex-col gap-2">
                  {isAuthenticated && user ? (
                    <>
                      <Button asChild className="w-full gap-2 min-h-10">
                        <Link href={dashboardHref} onClick={() => setIsOpen(false)}>
                          <LayoutDashboard className="h-4 w-4" />
                          Mon tableau de bord
                        </Link>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => void handleLogout()}
                        className="w-full gap-2 min-h-10 text-destructive hover:text-destructive"
                      >
                        <LogOut className="h-4 w-4" />
                        Se déconnecter
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild variant="outline" className="w-full min-h-10">
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          Se connecter
                        </Link>
                      </Button>
                      <Button
                        asChild
                        className="w-full min-h-10 bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] text-white"
                      >
                        <Link href="/register" onClick={() => setIsOpen(false)}>
                          S&apos;inscrire
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="mr-4 lg:mr-8 flex items-center space-x-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-[transform,box-shadow] duration-300 glow-brand">
              <span className="text-white font-extrabold text-sm tracking-tight">HS</span>
            </div>
            <span className="font-extrabold text-base sm:text-lg tracking-tight gradient-brand truncate">
              HomeServices
            </span>
          </Link>

          {/* Desktop Nav (>= lg) */}
          <div className="hidden lg:flex">
            <MainNav />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-2.5">
            {!isLoading && isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 rounded-full bg-background/60 backdrop-blur-sm border border-border/50 hover:bg-background/90 px-3.5"
                  >
                    <User className="h-4 w-4 text-[hsl(var(--brand))]" />
                    <span className="max-w-[140px] truncate font-semibold">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem asChild>
                    <Link href={dashboardHref} className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Mon tableau de bord
                    </Link>
                  </DropdownMenuItem>
                  {(user.userType === "pro" || user.userType === "admin") && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/client" className="cursor-pointer">
                        Espace Client
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => void handleLogout()}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  asChild
                  className="text-sm font-semibold rounded-full px-4 hover:text-[hsl(var(--brand))] transition-colors duration-200 hover:bg-[hsl(var(--brand))]/10"
                >
                  <Link href="/login">Se connecter</Link>
                </Button>
                <Button
                  asChild
                  className="text-sm px-5 rounded-full font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-[transform,box-shadow] duration-200 bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] text-white glow-brand"
                >
                  <Link href="/register">S&apos;inscrire</Link>
                </Button>
              </>
            )}
          </div>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
