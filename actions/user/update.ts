"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { updateUserSchema, type UpdateUserInput } from "@/lib/validations/user.schema"
import { errorResponse, successResponse, validationErrorResponse } from "@/lib/utils/response"
import type { ActionResponse } from "@/lib/types"
import { authOptions } from "@/lib/auth"

export async function updateUser(input: UpdateUserInput): Promise<ActionResponse> {
  try {
        const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse("Not authenticated")
    }

    const validatedFields = updateUserSchema.safeParse(input)

    if (!validatedFields.success) {
      return validationErrorResponse(validatedFields.error.flatten().fieldErrors)
    }

    const { name, phone, image } = validatedFields.data

    // Check if phone is already taken by another user
    if (phone) {
      const existingUser = await prisma.user.findFirst({
        where: {
          phone,
          NOT: { id: session.user.id },
        },
      })

      if (existingUser) {
        return errorResponse("Phone number already in use")
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name && { name }),
        ...(phone && { phone, phoneVerified: null }),
        ...(image && { image }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        role: true,
      },
    })

    return successResponse({
      message: "Profile updated successfully",
      user: updatedUser,
    })
  } catch (error) {
    console.error("[UPDATE_USER_ERROR]", error)
    return errorResponse("Failed to update profile")
  }
}
