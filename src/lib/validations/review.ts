import { z } from "zod"

export const createReviewSchema = z.object({
  bookingId: z.string().min(1, "Identifiant de réservation requis"),
  targetId: z.string().min(1, "Identifiant du destinataire requis"),
  rating: z.number().int().min(1, "La note minimale est de 1 étoile").max(5, "La note maximale est de 5 étoiles"),
  comment: z.string().min(10, "L'avis doit comporter au moins 10 caractères").max(1000),
  authorType: z.enum(["CLIENT_TO_PRO", "PRO_TO_CLIENT"], {
    message: "Type d'avis mutuel invalide",
  }),
})

export type CreateReviewInput = z.infer<typeof createReviewSchema>
