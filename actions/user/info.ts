"use server"

import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/utils/response"
import type { ActionResponse } from "@/lib/types"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function getCurrentUser(): Promise<ActionResponse> {
  try {
        const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse("Not authenticated")
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        role: true,
        emailVerified: true,
        phoneVerified: true,
        createdAt: true,
      },
    })

    if (!user) {
      return errorResponse("User not found")
    }

    return successResponse(user)
  } catch (error) {
    console.error("[GET_CURRENT_USER_ERROR]", error)
    return errorResponse("Failed to fetch user information")
  }
}

export async function getUserById(userId: string): Promise<ActionResponse> {
  try {
        const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse("Not authenticated")
    }

    // Only allow users to view their own profile, or admins to view any profile
    if (session.user.id !== userId && session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized")
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        role: true,
        emailVerified: true,
        phoneVerified: true,
        createdAt: true,
        businessPartner: {
          select: {
            id: true,
            businessName: true,
            kycStatus: true,
          },
        },
      },
    })

    if (!user) {
      return errorResponse("User not found")
    }

    return successResponse(user)
  } catch (error) {
    console.error("[GET_USER_BY_ID_ERROR]", error)
    return errorResponse("Failed to fetch user information")
  }
}
