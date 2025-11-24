import { reviews as allReviews, Review } from "@/lib/mock-data"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Star } from "lucide-react"

interface ProReviewsProps {
    proId: string
}

export function ProReviews({ proId }: ProReviewsProps) {
    const reviews: Review[] = allReviews.filter((r: Review) => r.professionalId === proId)

    if (reviews.length === 0) {
        return (
            <section>
                <h2 className="text-2xl font-bold mb-6">Avis clients</h2>
                <div className="text-center py-12 border border-dashed rounded-lg">
                    <p className="text-muted-foreground">Aucun avis pour le moment.</p>
                </div>
            </section>
        )
    }

    return (
        <section>
            <h2 className="text-2xl font-bold mb-6">Avis clients</h2>
            <div className="space-y-6">
                {reviews.map((review: Review) => (
                    <Card key={review.id}>
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            <Avatar>
                                <AvatarFallback>{review.author.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold">{review.author}</h4>
                                    <span className="text-xs text-muted-foreground">{review.date}</span>
                                </div>
                                <div className="flex items-center gap-0.5 mt-1">
                                    {Array.from({ length: 5 }).map((_, i: number) => (
                                        <Star
                                            key={i}
                                            className={`h-3.5 w-3.5 ${i < review.rating
                                                ? "fill-primary text-primary"
                                                : "fill-muted text-muted-foreground"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{review.comment}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    )
}
