"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Star, ShieldCheck } from "lucide-react"
import { submitMutualReviewAction } from "@/server/actions/reviews"
import { toast } from "sonner"

interface AddReviewFormProps {
  professionalId: string
  professionalName: string
  bookingId?: string
  authorType?: "CLIENT_TO_PRO" | "PRO_TO_CLIENT"
  onReviewSubmitted?: () => void
}

export function AddReviewForm({
  professionalId,
  professionalName,
  bookingId = "booking-completed-ref",
  authorType = "CLIENT_TO_PRO",
  onReviewSubmitted,
}: AddReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast.error("Veuillez sélectionner une note entre 1 et 5 étoiles.")
      return
    }

    if (comment.trim().length < 10) {
      toast.error("Votre commentaire doit comporter au moins 10 caractères.")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await submitMutualReviewAction("user-1", {
        bookingId,
        targetId: professionalId,
        rating,
        comment: comment.trim(),
        authorType,
      })

      if (res.error) {
        toast.error(res.error)
        return
      }

      setRating(0)
      setComment("")
      toast.success(
        authorType === "CLIENT_TO_PRO"
          ? `Merci ! Votre avis sur ${professionalName} a été publié.`
          : `Merci ! Votre évaluation du client ${professionalName} a été enregistrée.`
      )
      onReviewSubmitted?.()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              {authorType === "CLIENT_TO_PRO"
                ? "Évaluer ce prestataire"
                : "Évaluer le client après intervention"}
            </CardTitle>
            <CardDescription>
              Partagez votre retour d&apos;expérience suite à votre prestation avec {professionalName}.
            </CardDescription>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <ShieldCheck className="h-4 w-4" />
            Avis mutuel post-prestation
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating */}
          <div className="space-y-2">
            <Label>Note globale</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none rounded"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? "fill-amber-500 text-amber-500"
                        : "fill-muted text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm font-medium text-foreground">
                  {rating} / 5
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Votre commentaire détaillé</Label>
            <Textarea
              id="comment"
              placeholder={
                authorType === "CLIENT_TO_PRO"
                  ? "Ponctualité, qualité des travaux, respect du tarif convenu..."
                  : "Courtoisie du client, clarté du besoin, règlement fluide..."
              }
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="resize-none"
              required
            />
            <p className="text-xs text-muted-foreground">
              {comment.length} / 1000 caractères (minimum 10)
            </p>
          </div>

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
              Réinitialiser
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
            >
              {isSubmitting ? "Publication..." : "Publier mon avis"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
