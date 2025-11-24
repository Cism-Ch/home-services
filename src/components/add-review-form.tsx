"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"

interface AddReviewFormProps {
    professionalId: string
    professionalName: string
    onReviewSubmitted?: () => void
}

export function AddReviewForm({ professionalId, professionalName, onReviewSubmitted }: AddReviewFormProps) {
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [comment, setComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (rating === 0) {
            alert("Veuillez sélectionner une note")
            return
        }

        if (comment.trim().length < 10) {
            alert("Votre commentaire doit contenir au moins 10 caractères")
            return
        }

        setIsSubmitting(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // TODO: Replace with actual API call
        console.log("Submitting review:", {
            professionalId,
            rating,
            comment,
            date: new Date().toISOString()
        })

        // Reset form
        setRating(0)
        setComment("")
        setIsSubmitting(false)

        alert("Merci pour votre avis !")

        if (onReviewSubmitted) {
            onReviewSubmitted()
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Laisser un avis</CardTitle>
                <CardDescription>
                    Partagez votre expérience avec {professionalName}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Star Rating */}
                    <div className="space-y-2">
                        <Label>Votre note</Label>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand))] rounded"
                                >
                                    <Star
                                        className={`h-8 w-8 transition-colors ${star <= (hoverRating || rating)
                                                ? "fill-[hsl(var(--brand))] text-[hsl(var(--brand))]"
                                                : "fill-muted text-muted-foreground"
                                            }`}
                                    />
                                </button>
                            ))}
                            {rating > 0 && (
                                <span className="ml-2 text-sm text-muted-foreground">
                                    {rating} / 5
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Comment */}
                    <div className="space-y-2">
                        <Label htmlFor="comment">Votre commentaire</Label>
                        <Textarea
                            id="comment"
                            placeholder="Décrivez votre expérience avec ce professionnel..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={5}
                            className="resize-none"
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            {comment.length} / 500 caractères (minimum 10)
                        </p>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setRating(0)
                                setComment("")
                            }}
                            disabled={isSubmitting}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
                        >
                            {isSubmitting ? "Envoi en cours..." : "Publier l'avis"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
