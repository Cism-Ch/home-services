import { Search, CalendarCheck, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

/**
 * Etapes cles du parcours client affichees dans la couverture Hero.
 * Cartes verre translucide avec numerotation editoriale et gradients radiaux CSS purs.
 */
export function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Recherchez",
      description: "Trouvez le professionnel idéal parmi nos experts vérifiés près de votre commune.",
      aurora: "#3b82f6",
      iconBg: "from-blue-500/15 to-cyan-500/10 ring-blue-500/20",
      iconColor: "text-blue-500",
    },
    {
      number: "02",
      icon: CalendarCheck,
      title: "Réservez",
      description: "Choisissez le créneau libre et la durée adaptée (heures, jours, semaines).",
      aurora: "#a855f7",
      iconBg: "from-purple-500/15 to-pink-500/10 ring-purple-500/20",
      iconColor: "text-purple-500",
    },
    {
      number: "03",
      icon: Sparkles,
      title: "Profitez",
      description: "Échangez directement sur WhatsApp et réglez le pro après intervention.",
      aurora: "#f97316",
      iconBg: "from-amber-500/15 to-orange-500/10 ring-amber-500/20",
      iconColor: "text-amber-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 relative z-10 w-full">
      {steps.map((step, index) => (
        <div key={step.number} className="relative group">
          {index < steps.length - 1 && (
            <div className="hidden md:block absolute top-1/2 -right-6 w-6 h-[2px] bg-gradient-to-r from-border/70 to-transparent z-0" />
          )}

          <Card className="h-full bg-card/75 dark:bg-card/65 backdrop-blur-md border border-border/60 hover:border-[hsl(var(--brand))]/45 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden shadow-sm relative z-20 rounded-2xl">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `radial-gradient(ellipse 80% 70% at 50% 0%, ${step.aurora}22 0%, transparent 72%)`,
              }}
            />

            <CardContent className="flex flex-col items-center text-center relative z-10 py-2 px-5">
              <span className="absolute top-2 right-4 text-xs font-extrabold tracking-widest text-muted-foreground/45 tabular-nums group-hover:text-[hsl(var(--brand))]/70 transition-colors">
                {step.number}
              </span>
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.iconBg} ring-1 shadow-xs flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform duration-300 ${step.iconColor}`}
              >
                <step.icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold tracking-tight mb-1.5 group-hover:text-foreground">
                {step.title}
              </h3>
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
