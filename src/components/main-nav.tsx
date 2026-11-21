"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { m } from "framer-motion"
import { SPRING_SNAPPY } from "@/lib/motion"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/", label: "Accueil" },
  { href: "/services", label: "Services" },
  { href: "/professionals", label: "Professionnels" },
  { href: "/pricing", label: "Tarifs" },
  { href: "/about", label: "À propos" },
] as const

/**
 * Barre de navigation principale avec detection de route active, aria-current
 * et indicateur glissant partage (layoutId) sur GPU.
 */
export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Navigation principale"
      className={cn("flex items-center space-x-1 lg:space-x-2", className)}
      {...props}
    >
      {NAV_ITEMS.map(({ href, label }) => {
        const isActive =
          href === "/"
            ? pathname === "/"
            : pathname === href || pathname.startsWith(`${href}/`)

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative px-4 py-2 text-sm font-medium transition-colors duration-200 hover:text-[hsl(var(--brand))] rounded-md hover:bg-[hsl(var(--brand))]/10 group",
              isActive
                ? "text-[hsl(var(--brand))] font-semibold"
                : "text-muted-foreground"
            )}
          >
            {isActive && (
              <m.span
                layoutId="main-nav-active-pill"
                transition={SPRING_SNAPPY}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-md bg-[hsl(var(--brand))]/10"
              />
            )}
            <span className="relative z-10">{label}</span>
            {isActive ? (
              <m.span
                layoutId="main-nav-active-underline"
                transition={SPRING_SNAPPY}
                aria-hidden="true"
                className="pointer-events-none absolute bottom-1 left-0 right-0 mx-auto h-0.5 w-8 rounded-full bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))]"
              />
            ) : (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-1 left-0 right-0 mx-auto h-0.5 w-0 rounded-full bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] transition-[width] duration-200 group-hover:w-8"
              />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
