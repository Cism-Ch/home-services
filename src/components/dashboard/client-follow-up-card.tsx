"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { StarRating } from "@/components/star-rating"
import { CheckCircle2, Clock, AlertCircle, Sparkles, RefreshCw } from "lucide-react"
import { answerTaskFollowUpAction } from "@/server/actions/booking-status"
import { submitMutualReviewAction } from "@/server/actions/reviews"
import { toast } from "sonner"

export interface ActiveTaskItem {
  id: string
  serviceName: string
  proName: string
  proId: string
  bookingDate: Date | string
  timeSlot: string
  indicativePrice: number
}

interface ClientFollowUpCardProps {
  tasks: ActiveTaskItem[]
  onTaskCompleted?: (taskId: string) => void
  className?: string
}

/**
 * Carte interactive de suivi des interventions en cours et evaluation post-cloture.
 */
export function ClientFollowUpCard({
  tasks,
  onTaskCompleted,
  className = "",
}: ClientFollowUpCardProps) {
  const router = useRouter()
  const [completedTaskIds, setCompletedTaskIds] = React.useState<string[]>([])
  const [loadingTaskId, setLoadingTaskId] = React.useState<string | null>(null)
  const [reviewDialogOpen, setReviewDialogOpen] = React.useState(false)
  const [selectedTaskForReview, setSelectedTaskForReview] =
    React.useState<ActiveTaskItem | null>(null)
  const [rating, setRating] = React.useState(5)
  const [comment, setComment] = React.useState("")
  const [isSubmittingReview, setIsSubmittingReview] = React.useState(false)

  const activeTasks = tasks.filter((t) => !completedTaskIds.includes(t.id))

  // Conserve le composant monte tant que le dialogue post-prestation est ouvert
  if (activeTasks.length === 0 && !reviewDialogOpen) {
    return null
  }

  const handleAnswer = async (
    task: ActiveTaskItem,
    answer: "YES" | "IN_PROGRESS" | "NO"
  ) => {
    setLoadingTaskId(task.id)

    try {
      const res = await answerTaskFollowUpAction(task.id, answer)

      if (res.error) {
        toast.error("Impossible d'actualiser le statut de la tâche.")
        return
      }

      if (answer === "YES") {
        toast.success("Tâche marquée comme terminée ! L'artisan est libéré.")
        setCompletedTaskIds((prev) => [...prev, task.id])
        onTaskCompleted?.(task.id)
        setSelectedTaskForReview(task)
        setRating(5)
        setComment("")
        setReviewDialogOpen(true)
      } else if (answer === "IN_PROGRESS") {
        toast.info("Statut maintenu en cours de traitement.")
      } else {
        toast.warning(
          "Nous avons pris note du problème rencontré. Le support peut vous aider."
        )
      }
    } catch {
      toast.error("Une erreur réseau est survenue.")
    } finally {
      setLoadingTaskId(null)
    }
  }

  const trimmedCommentLength = comment.trim().length

  const handleSubmitReview = async () => {
    if (!selectedTaskForReview) return

    if (rating < 1 || rating > 5) {
      toast.error("Veuillez attribuer une note entre 1 et 5 étoiles.")
      return
    }

    if (trimmedCommentLength < 10) {
      toast.error("Votre commentaire doit comporter au moins 10 caractères.")
      return
    }

    setIsSubmittingReview(true)
    try {
      const res = await submitMutualReviewAction("session", {
        bookingId: selectedTaskForReview.id,
        targetId: selectedTaskForReview.proId,
        rating,
        comment: comment.trim(),
        authorType: "CLIENT_TO_PRO",
      })

      if (res.error) {
        toast.error(res.error)
        return
      }

      toast.success("Merci ! Votre avis a bien été publié.")
      setReviewDialogOpen(false)
      setSelectedTaskForReview(null)
      setRating(5)
      setComment("")
      router.refresh()
    } catch {
      toast.error("Une erreur réseau est survenue lors de l'envoi.")
    } finally {
      setIsSubmittingReview(false)
    }
  }

  return (
    <>
      {activeTasks.length > 0 && (
        <div className={`space-y-4 ${className}`}>
          {activeTasks.map((task) => (
            <Card
              key={task.id}
              className="border-2 border-primary/25 bg-gradient-to-r from-primary/5 via-background to-secondary/5 shadow-sm"
            >
              <CardContent className="p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="info" className="gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        Mission en cours
                      </Badge>
                      <span className="text-xs text-muted-foreground font-mono">
                        #{task.id}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-foreground">
                      Suivi d&apos;intervention : {task.serviceName}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Artisan :{" "}
                      <strong className="text-foreground">{task.proName}</strong> |
                      Créneau : {task.timeSlot}
                    </p>
                  </div>

                  <div className="rounded-lg bg-card p-3 border text-center min-w-[200px]">
                    <p className="text-xs font-semibold text-foreground mb-1">
                      Vos tâches ont-elles été finalisées ?
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Confirmez pour libérer le planning du prestataire
                    </p>
                  </div>
                </div>

                {/* Action Buttons: Oui / En cours / Non */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t">
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex-1 min-w-[140px] gap-1.5"
                    disabled={loadingTaskId === task.id}
                    onClick={() => handleAnswer(task, "YES")}
                  >
                    {loadingTaskId === task.id ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    )}
                    Oui, c&apos;est finalisé
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-400/40 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 flex-1 min-w-[130px] gap-1.5"
                    disabled={loadingTaskId === task.id}
                    onClick={() => handleAnswer(task, "IN_PROGRESS")}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    Toujours en cours
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-muted-foreground hover:text-destructive gap-1.5 text-xs"
                    disabled={loadingTaskId === task.id}
                    onClick={() => handleAnswer(task, "NO")}
                  >
                    <AlertCircle className="h-3.5 w-3.5" />
                    Non, problème
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog d'attribution d'avis immediat post-finalisation */}
      <Dialog
        open={reviewDialogOpen}
        onOpenChange={(open) => {
          setReviewDialogOpen(open)
          if (!open) {
            setSelectedTaskForReview(null)
            setComment("")
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Noter la prestation de {selectedTaskForReview?.proName}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <p className="text-xs text-muted-foreground">
              Votre note aide la communauté et renforce la réputation des artisans
              locaux méritants.
            </p>

            <div className="space-y-2 text-center py-2">
              <Label className="text-xs text-muted-foreground block">
                Votre note globale
              </Label>
              <StarRating
                value={rating}
                onChange={setRating}
                disabled={isSubmittingReview}
                size="md"
                className="justify-center"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="review-comment">
                Votre commentaire d&apos;appréciation
              </Label>
              <Textarea
                id="review-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Qualité du travail, ponctualité, propreté du chantier..."
                rows={3}
                disabled={isSubmittingReview}
              />
              <p className="text-xs text-muted-foreground">
                {trimmedCommentLength} / 1000 caractères (minimum 10)
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                disabled={isSubmittingReview}
                onClick={() => {
                  setReviewDialogOpen(false)
                  setSelectedTaskForReview(null)
                  setComment("")
                }}
              >
                Plus tard
              </Button>
              <Button
                className="flex-1"
                disabled={isSubmittingReview || trimmedCommentLength < 10}
                onClick={() => void handleSubmitReview()}
              >
                {isSubmittingReview ? "Publication..." : "Publier mon avis"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
