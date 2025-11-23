export function SiteFooter() {
    return (
        <footer className="relative border-t border-border/40 bg-gradient-to-b from-muted/30 to-muted/50 backdrop-blur-sm overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[hsl(var(--brand))]/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-[hsl(var(--brand-foreground))]/5 rounded-full blur-3xl -z-10" />
            
            <div className="container mx-auto px-4 py-12 md:py-16 relative">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2 group">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 glow-brand group-hover:scale-110">
                                <span className="text-white font-bold text-sm">HS</span>
                            </div>
                            <span className="font-bold text-lg gradient-brand">HomeService</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            La plateforme de confiance pour tous vos services à domicile.
                        </p>
                    </div>

                    {/* Services */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-foreground relative inline-block">
                            Services
                            <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))]"></span>
                        </h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-[hsl(var(--brand))] transition-colors duration-300 hover:translate-x-1 inline-block">Électricité</a></li>
                            <li><a href="#" className="hover:text-[hsl(var(--brand))] transition-colors duration-300 hover:translate-x-1 inline-block">Plomberie</a></li>
                            <li><a href="#" className="hover:text-[hsl(var(--brand))] transition-colors duration-300 hover:translate-x-1 inline-block">Climatisation</a></li>
                            <li><a href="#" className="hover:text-[hsl(var(--brand))] transition-colors duration-300 hover:translate-x-1 inline-block">Nettoyage</a></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-foreground relative inline-block">
                            Entreprise
                            <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))]"></span>
                        </h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-[hsl(var(--brand))] transition-colors duration-300 hover:translate-x-1 inline-block">À propos</a></li>
                            <li><a href="#" className="hover:text-[hsl(var(--brand))] transition-colors duration-300 hover:translate-x-1 inline-block">Carrières</a></li>
                            <li><a href="#" className="hover:text-[hsl(var(--brand))] transition-colors duration-300 hover:translate-x-1 inline-block">Blog</a></li>
                            <li><a href="#" className="hover:text-[hsl(var(--brand))] transition-colors duration-300 hover:translate-x-1 inline-block">Contact</a></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-foreground relative inline-block">
                            Légal
                            <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))]"></span>
                        </h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-[hsl(var(--brand))] transition-colors duration-300 hover:translate-x-1 inline-block">Confidentialité</a></li>
                            <li><a href="#" className="hover:text-[hsl(var(--brand))] transition-colors duration-300 hover:translate-x-1 inline-block">Conditions</a></li>
                            <li><a href="#" className="hover:text-[hsl(var(--brand))] transition-colors duration-300 hover:translate-x-1 inline-block">Cookies</a></li>
                            <li><a href="#" className="hover:text-[hsl(var(--brand))] transition-colors duration-300 hover:translate-x-1 inline-block">Mentions légales</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground text-center md:text-left">
                        © {new Date().getFullYear()} HomeService. Tous droits réservés.
                    </p>
                    <div className="flex items-center gap-4">
                        <a href="#" className="text-muted-foreground hover:text-[hsl(var(--brand))] transition-all duration-300 hover:scale-110" aria-label="Facebook">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </a>
                        <a href="#" className="text-muted-foreground hover:text-[hsl(var(--brand))] transition-all duration-300 hover:scale-110" aria-label="Twitter">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                            </svg>
                        </a>
                        <a href="#" className="text-muted-foreground hover:text-[hsl(var(--brand))] transition-all duration-300 hover:scale-110" aria-label="LinkedIn">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
