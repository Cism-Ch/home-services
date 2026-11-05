import { reviews as allReviews, Review } from "@/lib/mock-data"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ShieldCheck } from "lucide-react"

interface ProReviewsProps {
  proId: string
}

export function ProReviews({ proId }: ProReviewsProps) {
  const reviews: Review[] = allReviews.filter((r: Review) => r.professionalId === proId)

  if (reviews.length === 0) {
    return (
      <section>
        <h2 className="text-2xl font-bold mb-6">Avis mutuels vérifiés</h2>
        <div className="text-center py-12 border border-dashed rounded-lg">
          <p className="text-muted-foreground">Aucun avis publié pour le moment.</p>
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Avis mutuels ({reviews.length})</h2>
        <Badge variant="outline" className="gap-1.5 text-xs">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          100% Post-prestation
        </Badge>
      </div>
      <div className="space-y-4">
        {reviews.map((review: Review) => (
          <Card key={review.id}>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Avatar>
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {review.author.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{review.author}</h4>
                    <Badge variant="secondary" className="text-[10px]">
                      {review.authorType === "PRO_TO_CLIENT"
                        ? "Avis Prestataire -> Client"
                        : "Avis Client -> Prestataire"}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
                <div className="flex items-center gap-0.5 mt-1">
                  {Array.from({ length: 5 }).map((_, i: number) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < review.rating
                          ? "fill-amber-500 text-amber-500"
                          : "fill-muted text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
