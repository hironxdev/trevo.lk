import { z } from "zod"
import { StaysCategoryType } from "@prisma/client"

export const createStaysCategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  icon: z.string().optional(),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  category: z.nativeEnum(StaysCategoryType),
})

export const updateStaysCategorySchema = createStaysCategorySchema.partial()

export type CreateStaysCategoryInput = z.infer<typeof createStaysCategorySchema>
export type UpdateStaysCategoryInput = z.infer<typeof updateStaysCategorySchema>
