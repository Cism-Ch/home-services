import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border/40 bg-gradient-to-b from-muted/30 to-muted/50 backdrop-blur-sm overflow-hidden">
      {/* Decorative background (gradient radial pur GPU-friendly) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_60%_at_25%_10%,hsla(var(--brand)/0.06)_0%,transparent_70%),radial-gradient(ellipse_50%_60%_at_80%_90%,hsla(var(--brand-foreground)/0.06)_0%,transparent_70%)]"
      />

      <div
        data-layout-container="page"
        className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-12 md:py-16 relative"
      >
        <div
          data-footer-grid="true"
          className="grid grid-cols-1 min-[360px]:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 lg:gap-10 mb-8"
        >
          {/* Brand */}
          <div className="space-y-3 min-w-0">
            <Link href="/" className="flex items-center space-x-2 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] flex items-center justify-center shadow-md group-hover:shadow-lg transition-[transform,box-shadow] duration-300 glow-brand group-hover:scale-105 shrink-0">
                <span className="text-white font-bold text-sm">HS</span>
              </div>
              <span className="font-bold text-base sm:text-lg gradient-brand truncate">
                HomeServices
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Réservez un créneau avec des artisans qualifiés en Côte d&apos;Ivoire, sans commission sur vos prestations.
            </p>
          </div>

          {/* Services */}
          <div className="space-y-3 min-w-0">
            <h3 className="font-semibold text-sm text-foreground relative inline-block">
              Services populaires
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))]" />
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>
                <Link
                  href="/services?category=electricite"
                  className="hover:text-[hsl(var(--brand))] transition-colors duration-300 inline-block"
                >
                  Électricité &amp; Dépannage
                </Link>
              </li>
              <li>
                <Link
                  href="/services?category=plomberie"
                  className="hover:text-[hsl(var(--brand))] transition-colors duration-300 inline-block"
                >
                  Plomberie Sanitaire
                </Link>
              </li>
              <li>
                <Link
                  href="/services?category=climatisation"
                  className="hover:text-[hsl(var(--brand))] transition-colors duration-300 inline-block"
                >
                  Climatisation &amp; Froid
                </Link>
              </li>
              <li>
                <Link
                  href="/services?category=menage"
                  className="hover:text-[hsl(var(--brand))] transition-colors duration-300 inline-block"
                >
                  Ménage &amp; Entretien
                </Link>
              </li>
            </ul>
          </div>

          {/* Plateforme */}
          <div className="space-y-3 min-w-0">
            <h3 className="font-semibold text-sm text-foreground relative inline-block">
              Plateforme
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))]" />
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>
                <Link
                  href="/services"
                  className="hover:text-[hsl(var(--brand))] transition-colors duration-300 inline-block"
                >
                  Explorer les services
                </Link>
              </li>
              <li>
                <Link
                  href="/professionals"
                  className="hover:text-[hsl(var(--brand))] transition-colors duration-300 inline-block"
                >
                  Trouver un artisan
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-[hsl(var(--brand))] transition-colors duration-300 inline-block"
                >
                  Tarifs &amp; Abonnements
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-[hsl(var(--brand))] transition-colors duration-300 inline-block"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="hover:text-[hsl(var(--brand))] transition-colors duration-300 inline-block"
                >
                  Devenir prestataire
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3 min-w-0">
            <h3 className="font-semibold text-sm text-foreground relative inline-block">
              Informations légales
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))]" />
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>
                <Link
                  href="/legal/cgu"
                  className="hover:text-[hsl(var(--brand))] transition-colors duration-300 inline-block"
                >
                  Conditions d&apos;utilisation (CGU)
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/confidentialite"
                  className="hover:text-[hsl(var(--brand))] transition-colors duration-300 inline-block"
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/mentions-legales"
                  className="hover:text-[hsl(var(--brand))] transition-colors duration-300 inline-block"
                >
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <Separator className="mb-8 bg-border/40" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} HomeServices. Tous droits réservés.
          </p>
          <p className="text-xs text-muted-foreground text-center md:text-right">
            Côte d&apos;Ivoire • Paiements d&apos;abonnements XOF sécurisés via Paystack
          </p>
        </div>
      </div>
    </footer>
  )
}
