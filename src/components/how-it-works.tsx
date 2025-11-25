import { Search, CalendarCheck, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function HowItWorks() {
    const steps = [
        {
            icon: Search,
            title: "Recherchez",
            description: "Trouvez le professionnel idéal parmi nos experts vérifiés.",
            color: "from-blue-500/20 to-cyan-500/20",
            aurora: "#3b82f6",
            iconColor: "text-blue-500",
        },
        {
            icon: CalendarCheck,
            title: "Réservez",
            description: "Choisissez le créneau qui vous convient en quelques clics.",
            color: "from-purple-500/20 to-pink-500/20",
            aurora: "#a855f7",
            iconColor: "text-purple-500",
        },
        {
            icon: Sparkles,
            title: "Profitez",
            description: "Laissez faire les pros et profitez d'un travail impeccable.",
            color: "from-amber-500/20 to-orange-500/20",
            aurora: "#f97316",
            iconColor: "text-amber-500",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 max-w-5xl mx-auto">
            {steps.map((step, index) => (
                <div key={index} className="relative group">
                    {/* Connecting line for desktop */}
                    {index < steps.length - 1 && (
                        <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-[2px] bg-border/50 z-0" />
                    )}

                    <Card className="h-full bg-white/80 dark:bg-black/80 backdrop-blur-xl border-white/50 dark:border-white/20 hover:border-white/80 dark:hover:border-white/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl overflow-hidden group shadow-lg relative z-20">
                        {/* Aurora Background Effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out">
                            <div
                                className="absolute -inset-[100%] blur-3xl opacity-40 animate-[spin_8s_linear_infinite]"
                                style={{
                                    background: `conic-gradient(from 90deg at 50% 50%, transparent 0%, ${step.aurora} 50%, transparent 100%)`
                                }}
                            />
                            <div
                                className="absolute -inset-[100%] blur-3xl opacity-40 animate-[spin_12s_linear_infinite_reverse]"
                                style={{
                                    background: `conic-gradient(from 0deg at 50% 50%, transparent 0%, ${step.aurora} 50%, transparent 100%)`
                                }}
                            />
                        </div>

                        <CardContent className="p-6 flex flex-col items-center text-center relative z-10 pt-8">
                            <div className={`w-16 h-16 rounded-2xl bg-background/80 shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 ${step.iconColor} relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <step.icon className="w-8 h-8 relative z-10" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {step.description}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            ))}
        </div>
    );
}
