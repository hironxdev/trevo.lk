"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/utils/response"
import type { ActionResponse } from "@/lib/types"
import { authOptions } from "@/lib/auth"

export async function deleteAccount(): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse("Not authenticated")
    }

    // Check if user has active bookings
    const activeBookings = await prisma.booking.count({
      where: {
        userId: session.user.id,
        status: {
          in: ["PENDING", "CONFIRMED", "ACTIVE"],
        },
      },
    })

    if (activeBookings > 0) {
      return errorResponse("Cannot delete account with active bookings. Please cancel or complete them first.")
    }

    // Delete user (cascade will handle related data)
    await prisma.user.delete({
      where: { id: session.user.id },
    })

    return successResponse({ message: "Account deleted successfully" })
  } catch (error) {
    console.error("[DELETE_ACCOUNT_ERROR]", error)
    return errorResponse("Failed to delete account")
  }
}
