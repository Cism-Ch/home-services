import { professionals } from "@/lib/mock-data"
import { ProHeader } from "@/components/pro-header"
import { ProServicesList } from "@/components/pro-services-list"
import { ProReviews } from "@/components/pro-reviews"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { notFound } from "next/navigation"
import Image from "next/image"

interface ProPageProps {
    params: Promise<{
        id: string
    }>
}

export async function generateStaticParams() {
    return professionals.map((pro) => ({
        id: pro.id,
    }))
}

export default async function ProPage({ params }: ProPageProps) {
    const { id } = await params
    const professional = professionals.find((p) => p.id === id)

    if (!professional) {
        notFound()
    }

    return (
        <div className="min-h-screen pb-20">
            <ProHeader professional={professional} />

            <div className="container mx-auto px-4">
                <Tabs defaultValue="services" className="space-y-8">
                    <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent space-x-8">
                        <TabsTrigger
                            value="about"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3"
                        >
                            À propos
                        </TabsTrigger>
                        <TabsTrigger
                            value="services"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3"
                        >
                            Services
                        </TabsTrigger>
                        <TabsTrigger
                            value="portfolio"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3"
                        >
                            Réalisations
                        </TabsTrigger>
                        <TabsTrigger
                            value="reviews"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3"
                        >
                            Avis ({professional.reviewsCount})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="about" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold mb-3">Biographie</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {professional.bio}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="services">
                        <ProServicesList services={professional.services} proId={professional.id} />
                    </TabsContent>

                    <TabsContent value="portfolio">
                        {professional.portfolio.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {professional.portfolio.map((image, index) => (
                                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                                        <Image
                                            src={image}
                                            alt={`Réalisation ${index + 1}`}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                Aucune photo disponible pour le moment.
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="reviews">
                        <div className="max-w-2xl">
                            <ProReviews reviews={professional.reviews} />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
