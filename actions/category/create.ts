"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/utils/response"
import type { ActionResponse } from "@/lib/types"
import type { VehicleCategory } from "@prisma/client"
import { authOptions } from "@/lib/auth"

interface CreateCategoryInput {
  name: string
  description: string
  icon?: string
  category: VehicleCategory
}

export async function createCategory(input: CreateCategoryInput): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized")
    }

    const slug = input.name.toLowerCase().replace(/\s+/g, "-")

    const category = await prisma.category.create({
      data: {
        name: input.name,
        description: input.description,
        icon: input.icon,
        slug,
        category: input.category,
      },
    })

    return successResponse({ message: "Category created successfully", category })
  } catch (error) {
    console.error("[CREATE_CATEGORY_ERROR]", error)
    return errorResponse("Failed to create category")
  }
}
