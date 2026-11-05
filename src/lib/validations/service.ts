import { z } from "zod"

export const createServiceSchema = z.object({
  title: z.string().min(5, "L'intitulé de la prestation doit comporter au moins 5 caractères").max(100),
  description: z.string().min(15, "La description doit comporter au moins 15 caractères").max(1500),
  categoryId: z.string().min(2, "Veuillez sélectionner une catégorie de métier"),
  price: z.number().int().min(1000, "Le tarif indicatif minimum est de 1 000 FCFA"),
  duration: z.number().int().min(15, "La durée estimée minimum est de 15 minutes"),
  isActive: z.boolean().default(true),
})

export type CreateServiceInput = z.infer<typeof createServiceSchema>
