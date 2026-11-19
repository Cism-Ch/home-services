import { notFound } from "next/navigation"
import { Star, MessageCircle, ShieldCheck } from "lucide-react"
import { ProHeader } from "@/components/pro-header"
import { ProServicesList } from "@/components/pro-services-list"
import { ProReviews } from "@/components/pro-reviews"
import { AddReviewForm } from "@/components/add-review-form"
import { ProContactActions } from "@/components/pro-contact-actions"
import { getProfessionalDetail } from "@/server/queries/catalog"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProfessionalProfilePage({ params }: PageProps) {
  const { id } = await params
  const detail = await getProfessionalDetail(id)

  if (!detail) {
    notFound()
  }

  const { professional, services, reviews } = detail

  return (
    <div className="min-h-screen">
      <ProHeader professional={professional} />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-card rounded-lg p-6 border">
              <h2 className="text-2xl font-bold mb-4">À propos</h2>
              <p className="text-muted-foreground leading-relaxed">{professional.bio}</p>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <h3 className="font-semibold mb-2">Expérience</h3>
                  <p className="text-muted-foreground">{professional.experienceLabel}</p>
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
              <ProServicesList proId={professional.id} services={services} />
            </section>

            {/* Add Review Section */}
            <section>
              <AddReviewForm
                professionalId={professional.id}
                professionalName={professional.name}
              />
            </section>

            {/* Reviews Section */}
            <ProReviews reviews={reviews} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Direct Contact Card */}
            <div className="bg-card rounded-lg p-6 border shadow-sm space-y-4">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-emerald-600" />
                Contact direct avec le pro
              </h3>
              <p className="text-xs text-muted-foreground">
                Échangez directement par appel ou message WhatsApp pour poser vos questions ou demander un avis.
              </p>
              <ProContactActions
                proName={professional.name}
                phoneNumber={professional.phoneNumber}
                whatsappNumber={professional.whatsappNumber}
                variant="vertical"
              />
              <div className="flex items-center gap-2 pt-2 border-t text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Paiement direct de la main à la main après service.</span>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-card rounded-lg p-6 border sticky top-4">
              <h3 className="font-semibold mb-4">Statistiques</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Note moyenne</span>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-lg">{professional.rating}</span>
                    <Star className="h-4 w-4 fill-primary text-primary" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Avis clients</span>
                  <span className="font-bold text-lg">{professional.reviewsCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Missions réalisées</span>
                  <span className="font-bold text-lg">{professional.completedTasks}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
