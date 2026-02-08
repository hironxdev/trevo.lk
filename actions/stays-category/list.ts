"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { errorResponse, successResponse } from "@/lib/utils/response"
import type { ActionResponse } from "@/lib/types"
import type { StaysCategoryType } from "@prisma/client"

export async function getStaysCategories(): Promise<ActionResponse> {
  try {
    const categories = await prisma.staysCategory.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { stays: true },
        },
      },
    })

    return successResponse({ data: categories })
  } catch (error) {
    console.error("[GET_STAYS_CATEGORIES_ERROR]", error)
    return errorResponse("Failed to fetch categories")
  }
}

export async function createStaysCategory(input: {
  name: string
  description: string
  category: StaysCategoryType
  icon?: string
}): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized")
    }

    const slug = input.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Check if slug already exists
    const existing = await prisma.staysCategory.findUnique({
      where: { slug },
    })

    if (existing) {
      return errorResponse("Category with this name already exists")
    }

    const category = await prisma.staysCategory.create({
      data: {
        name: input.name,
        description: input.description,
        category: input.category,
        icon: input.icon,
        slug,
      },
    })

    return successResponse({
      message: "Category created successfully",
      data: category,
    })
  } catch (error) {
    console.error("[CREATE_STAYS_CATEGORY_ERROR]", error)
    return errorResponse("Failed to create category")
  }
}
