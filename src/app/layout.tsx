import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appBaseUrl),
  title: {
    default: "HomeServices | Artisans et services à domicile en Côte d'Ivoire",
    template: "%s | HomeServices",
  },
  description:
    "Réservez un créneau horaire gratuit auprès d'artisans qualifiés (plomberie, électricité, climatisation, ménage) à Abidjan et en Côte d'Ivoire, sans commission sur les interventions.",
  openGraph: {
    type: "website",
    locale: "fr_CI",
    siteName: "HomeServices",
    title: "HomeServices | Artisans qualifiés près de chez vous",
    description:
      "Prise de rendez-vous directe par créneaux horaires, contact WhatsApp & téléphone et tarification transparente en FCFA.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background font-sans text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          themes={["light", "dark", "luxury", "system"]}
        >
          <AuthProvider>
            <TooltipProvider>
              <div className="relative flex min-h-screen flex-col">
                <SiteHeader />
                <div className="flex-1">{children}</div>
                <SiteFooter />
              </div>
              <Toaster position="top-right" richColors />
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
