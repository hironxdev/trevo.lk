"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { createStaysCategorySchema, type CreateStaysCategoryInput } from "@/lib/validations/stays-category.schema"
import { errorResponse, successResponse, validationErrorResponse } from "@/lib/utils/response"
import type { ActionResponse } from "@/lib/types"
import { authOptions } from "@/lib/auth"

export async function createStaysCategory(input: CreateStaysCategoryInput): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse("Not authenticated")
    }

    if (session.user.role !== "ADMIN") {
      return errorResponse("Only admins can create categories")
    }

    const validatedFields = createStaysCategorySchema.safeParse(input)

    if (!validatedFields.success) {
      return validationErrorResponse(validatedFields.error.flatten().fieldErrors)
    }

    const data = validatedFields.data

    // Check if category already exists
    const existingCategory = await prisma.staysCategory.findFirst({
      where: {
        OR: [{ name: data.name }, { slug: data.slug }],
      },
    })

    if (existingCategory) {
      return errorResponse("A category with this name or slug already exists")
    }

    const category = await prisma.staysCategory.create({
      data: {
        name: data.name,
        description: data.description,
        icon: data.icon,
        slug: data.slug,
        category: data.category,
      },
    })

    return successResponse({
      message: "Stays category created successfully",
      category,
    })
  } catch (error) {
    console.error("[CREATE_STAYS_CATEGORY_ERROR]", error)
    return errorResponse("Failed to create category")
  }
}
