import { professionals } from "@/lib/mock-data"
import { ProCard } from "@/components/pro-card"

export default function ProfessionalsPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold tracking-tight mb-4">
                    Nos Professionnels
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Découvrez nos professionnels qualifiés et expérimentés, prêts à répondre à tous vos besoins.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {professionals.map((pro) => (
                    <ProCard key={pro.id} pro={pro} />
                ))}
            </div>
        </div>
    )
}
