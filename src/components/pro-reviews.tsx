import { Review } from "@/lib/mock-data"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Star } from "lucide-react"

interface ProReviewsProps {
    reviews: Review[]
}

export function ProReviews({ reviews }: ProReviewsProps) {
    if (reviews.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                Aucun avis pour le moment.
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
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
                                {Array.from({ length: 5 }).map((_, i) => (
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
    )
}
