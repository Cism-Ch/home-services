import { Search, CalendarCheck, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

/**
 * Etapes cles du parcours client affichees dans la couverture Hero.
 * Utilise des gradients radiaux CSS purs sans flou GPU lourd ni rotation infinie couteuse.
 */
export function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Recherchez",
      description: "Trouvez le professionnel idéal parmi nos experts vérifiés.",
      aurora: "#3b82f6",
      iconColor: "text-blue-500",
    },
    {
      icon: CalendarCheck,
      title: "Réservez",
      description: "Choisissez le créneau qui vous convient en quelques clics.",
      aurora: "#a855f7",
      iconColor: "text-purple-500",
    },
    {
      icon: Sparkles,
      title: "Profitez",
      description: "Laissez faire les pros et profitez d'un travail impeccable.",
      aurora: "#f97316",
      iconColor: "text-amber-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 relative z-10 w-full">
      {steps.map((step, index) => (
        <div key={index} className="relative group">
          {/* Connecting line for desktop */}
          {index < steps.length - 1 && (
            <div className="hidden md:block absolute top-1/2 -right-6 w-6 h-[2px] bg-border/50 z-0" />
          )}

          <Card className="h-full bg-white/80 dark:bg-black/75 backdrop-blur-md border-border/60 dark:border-white/15 hover:border-[hsl(var(--brand))]/40 dark:hover:border-white/35 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden group shadow-md relative z-20">
            {/* Halo radial leger au survol (zero flou GPU lourd, zero rotation continue) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `radial-gradient(ellipse 80% 70% at 50% 0%, ${step.aurora}24 0%, transparent 72%)`,
              }}
            />

            <CardContent className="flex flex-col items-center text-center relative z-10 py-1">
              <div
                className={`w-14 h-14 rounded-2xl bg-background/85 shadow-sm flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform duration-300 ${step.iconColor} relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <step.icon className="w-7 h-7 relative z-10" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-1.5">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}
