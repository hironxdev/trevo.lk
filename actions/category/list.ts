"use server"

import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/utils/response"
import type { ActionResponse } from "@/lib/types"

export async function getCategories(){
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            vehicles: {
              where: {
                isApproved: true,
                status: "AVAILABLE",
              },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    })

    return successResponse(categories)
  } catch (error) {
    console.error("[GET_CATEGORIES_ERROR]", error)
    return errorResponse("Failed to fetch categories")
  }
}
