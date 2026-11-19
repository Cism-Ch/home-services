"use client"

import Link from "next/link"
import { useState } from "react"
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

function getDashboardRoute(userType?: "client" | "pro" | "admin"): string {
  if (userType === "admin") return "/dashboard/admin"
  if (userType === "pro") return "/dashboard/pro"
  return "/dashboard/client"
}

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isAuthenticated, isLoading, logout } = useAuth()

  const dashboardHref = getDashboardRoute(user?.userType)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-sm animate-slide-down">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center">
          {/* Mobile Menu Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="xl:hidden mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetTitle className="sr-only">Menu principal</SheetTitle>
              <div className="flex flex-col gap-6 py-6">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">HS</span>
                  </div>
                  <span className="font-bold text-lg gradient-brand">
                    HomeService
                  </span>
                </Link>
                <div className="flex flex-col gap-2">
                  <Link href="/" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Accueil
                    </Button>
                  </Link>
                  <Link href="/services" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Services
                    </Button>
                  </Link>
                  <Link href="/professionals" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Professionnels
                    </Button>
                  </Link>
                  <Link href="/about" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      À propos
                    </Button>
                  </Link>
                </div>
                <div className="border-t pt-4 flex flex-col gap-2">
                  {isAuthenticated && user ? (
                    <>
                      <Link href={dashboardHref} onClick={() => setIsOpen(false)}>
                        <Button className="w-full gap-2">
                          <LayoutDashboard className="h-4 w-4" />
                          Mon tableau de bord
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsOpen(false)
                          void logout()
                        }}
                        className="w-full gap-2 text-destructive hover:text-destructive"
                      >
                        <LogOut className="h-4 w-4" />
                        Se déconnecter
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Se connecter
                        </Button>
                      </Link>
                      <Link href="/register" onClick={() => setIsOpen(false)}>
                        <Button className="w-full bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))]">
                          S&apos;inscrire
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="mr-8 flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 glow-brand">
              <span className="text-white font-bold text-sm">HS</span>
            </div>
            <span className="hidden font-bold sm:inline-block text-lg gradient-brand group-hover:scale-105 transition-transform duration-300">
              HomeService
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden xl:flex">
            <MainNav />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden xl:flex items-center gap-3">
            {!isLoading && isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="max-w-[140px] truncate">{user.name}</span>
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
                    onClick={() => void logout()}
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
                  className="text-base font-medium hover:text-[hsl(var(--brand))] transition-colors duration-300 hover:bg-[hsl(var(--brand))]/10"
                >
                  <Link href="/login">Se connecter</Link>
                </Button>
                <Button
                  asChild
                  className="text-base px-6 font-semibold shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] hover:scale-105 glow-brand"
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
