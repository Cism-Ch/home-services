"use client"

import { useEffect, useState } from "react"
import { ProHeader } from "@/components/pro-header"
import { ProServicesList } from "@/components/pro-services-list"
import { ProReviews } from "@/components/pro-reviews"
import { AddReviewForm } from "@/components/add-review-form"
import { professionals } from "@/lib/mock-data"
import { notFound } from "next/navigation"

interface PageProps {
    params: Promise<{ id: string }>
}

export default function ProfessionalProfilePage({ params }: PageProps) {
    const [proId, setProId] = useState<string | null>(null)

    useEffect(() => {
        params.then(p => setProId(p.id))
    }, [params])

    if (!proId) {
        return <div className="container mx-auto px-4 py-20">Chargement...</div>
    }

    const professional = professionals.find(p => p.id === proId)

    if (!professional) {
        notFound()
    }

    return (
        <div className="min-h-screen">
            <ProHeader professional={professional} />

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* About Section */}
                        <section className="bg-card rounded-lg p-6 border">
                            <h2 className="text-2xl font-bold mb-4">À propos</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {professional.bio}
                            </p>

                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div>
                                    <h3 className="font-semibold mb-2">Expérience</h3>
                                    <p className="text-muted-foreground">{professional.experience}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Localisation</h3>
                                    <p className="text-muted-foreground">{professional.location}</p>
                                </div>
                            </div>
                        </section>

                        {/* Services Section */}
                        <section>
                            <h2 className="text-2xl font-bold mb-6">Services proposés</h2>
                            <ProServicesList proId={professional.id} />
                        </section>

                        {/* Add Review Section */}
                        <section>
                            <AddReviewForm
                                professionalId={professional.id}
                                professionalName={professional.name}
                            />
                        </section>

                        {/* Reviews Section */}
                        <ProReviews proId={professional.id} />
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Stats Card */}
                        <div className="bg-card rounded-lg p-6 border sticky top-4">
                            <h3 className="font-semibold mb-4">Statistiques</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Note moyenne</span>
                                    <span className="font-bold text-lg">{professional.rating} ⭐</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Avis clients</span>
                                    <span className="font-bold text-lg">{professional.reviewsCount}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Missions réalisées</span>
                                    <span className="font-bold text-lg">50+</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
