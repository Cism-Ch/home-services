"use client"

import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutDashboard, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { useState } from "react"

export function SiteHeader() {
    const [isOpen, setIsOpen] = useState(false)

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
                                <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] flex items-center justify-center shadow-md">
                                        <span className="text-white font-bold text-sm">HS</span>
                                    </div>
                                    <span className="font-bold text-lg gradient-brand">
                                        HomeService
                                    </span>
                                </Link>
                                <div className="flex flex-col gap-2">
                                    <Link href="/" onClick={() => setIsOpen(false)}>
                                        <Button variant="ghost" className="w-full justify-start">Accueil</Button>
                                    </Link>
                                    <Link href="/services" onClick={() => setIsOpen(false)}>
                                        <Button variant="ghost" className="w-full justify-start">Services</Button>
                                    </Link>
                                    <Link href="/professionals" onClick={() => setIsOpen(false)}>
                                        <Button variant="ghost" className="w-full justify-start">Professionnels</Button>
                                    </Link>
                                    <Link href="/about" onClick={() => setIsOpen(false)}>
                                        <Button variant="ghost" className="w-full justify-start">À propos</Button>
                                    </Link>
                                </div>
                                <div className="border-t pt-4 flex flex-col gap-2">
                                    <Link href="/login" onClick={() => setIsOpen(false)}>
                                        <Button variant="outline" className="w-full">Se connecter</Button>
                                    </Link>
                                    <Link href="/register" onClick={() => setIsOpen(false)}>
                                        <Button className="w-full bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))]">S&apos;inscrire</Button>
                                    </Link>
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
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <LayoutDashboard className="h-4 w-4" />
                                    Dashboards (Demo)
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/client">Espace Client</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/pro">Espace Professionnel</Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button variant="ghost" asChild className="text-base font-medium hover:text-[hsl(var(--brand))] transition-colors duration-300 hover:bg-[hsl(var(--brand))]/10">
                            <Link href="/login">Se connecter</Link>
                        </Button>
                        <Button asChild className="text-base px-6 font-semibold shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] hover:scale-105 glow-brand">
                            <Link href="/register">S&apos;inscrire</Link>
                        </Button>
                    </div>
                    <ModeToggle />
                </div>
            </div>
        </header>
    )
}
