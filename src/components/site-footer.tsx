import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border/40 bg-gradient-to-b from-muted/30 to-muted/50 backdrop-blur-sm overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[hsl(var(--brand))]/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-[hsl(var(--brand-foreground))]/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 py-12 md:py-16 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 glow-brand group-hover:scale-105">
                <span className="text-white font-bold text-sm">HS</span>
              </div>
              <span className="font-bold text-lg gradient-brand">HomeServices</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              La plateforme de confiance pour réserver un créneau avec des artisans qualifiés en Côte d&apos;Ivoire, sans commission sur vos prestations.
            </p>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-foreground relative inline-block">
              Services populaires
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))]" />
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/services?category=electricite"
                  className="hover:text-[hsl(var(--brand))] transition-colors duration-300 inline-block"
                >
                  Électricité & Dépannage
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
                  Climatisation & Froid
                </Link>
              </li>
              <li>
                <Link
                  href="/services?category=menage"
                  className="hover:text-[hsl(var(--brand))] transition-colors duration-300 inline-block"
                >
                  Ménage & Entretien
                </Link>
              </li>
            </ul>
          </div>

          {/* Plateforme */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-foreground relative inline-block">
              Plateforme
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))]" />
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
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
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-foreground relative inline-block">
              Informations légales
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))]" />
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
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
        <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4">
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
