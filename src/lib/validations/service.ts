import { z } from "zod"
import { DURATION_UNIT_LIMITS } from "@/lib/scheduling"
import { durationUnitSchema } from "./booking"

export const createServiceSchema = z
  .object({
    title: z.string().min(5, "L'intitulé de la prestation doit comporter au moins 5 caractères").max(100),
    description: z.string().min(15, "La description doit comporter au moins 15 caractères").max(1500),
    categoryId: z.string().min(2, "Veuillez sélectionner une catégorie de métier"),
    price: z.number().int().min(1000, "Le tarif indicatif minimum est de 1 000 FCFA"),
    duration: z.number().int().min(15).optional(),
    durationUnit: durationUnitSchema.default("MINUTES"),
    durationValue: z.number().int().min(1, "La durée doit être positive").max(1440),
    isActive: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    const limits = DURATION_UNIT_LIMITS[data.durationUnit]
    if (data.durationValue < limits.min || data.durationValue > limits.max) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["durationValue"],
        message: `La durée pour cette unité doit être comprise entre ${limits.min} et ${limits.max}.`,
      })
    }
  })

export type CreateServiceInput = z.input<typeof createServiceSchema>
