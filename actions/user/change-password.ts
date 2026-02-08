"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { hashPassword, verifyPassword } from "@/lib/utils/password"
import { changePasswordSchema, type ChangePasswordInput } from "@/lib/validations/user.schema"
import { errorResponse, successResponse, validationErrorResponse } from "@/lib/utils/response"
import type { ActionResponse } from "@/lib/types"
import { authOptions } from "@/lib/auth"

export async function changePassword(input: ChangePasswordInput) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse("Not authenticated")
    }

    const validatedFields = changePasswordSchema.safeParse(input)

    if (!validatedFields.success) {
      return validationErrorResponse(validatedFields.error.flatten().fieldErrors)
    }

    const { currentPassword, newPassword } = validatedFields.data

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    })

    if (!user?.password) {
      return errorResponse("User not found or no password set")
    }

    const isPasswordValid = await verifyPassword(currentPassword, user.password)

    if (!isPasswordValid) {
      return errorResponse("Current password is incorrect")
    }

    const hashedPassword = await hashPassword(newPassword)

    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    })

    return successResponse({ message: "Password changed successfully" })
  } catch (error) {
    console.error("[CHANGE_PASSWORD_ERROR]", error)
    return errorResponse("Failed to change password")
  }
}
