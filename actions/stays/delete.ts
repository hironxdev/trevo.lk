"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/utils/response"
import type { ActionResponse } from "@/lib/types"
import { authOptions } from "@/lib/auth"

export async function deleteStays(staysId: string): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse("Not authenticated")
    }

    // Get the stays listing
    const existingStays = await prisma.stays.findUnique({
      where: { id: staysId },
      include: {
        partner: true,
        bookings: {
          where: {
            status: { in: ["PENDING", "CONFIRMED", "ACTIVE"] },
          },
        },
      },
    })

    if (!existingStays) {
      return errorResponse("Property listing not found")
    }

    // Check ownership (unless admin)
    if (session.user.role !== "ADMIN") {
      if (!existingStays.partner || existingStays.partner.userId !== session.user.id) {
        return errorResponse("You don't have permission to delete this property")
      }
    }

    // Check for active bookings
    if (existingStays.bookings.length > 0) {
      return errorResponse("Cannot delete property with active bookings")
    }

    // Delete stays listing
    await prisma.stays.delete({
      where: { id: staysId },
    })

    return successResponse({
      message: "Property listing deleted successfully",
    })
  } catch (error) {
    console.error("[DELETE_STAYS_ERROR]", error)
    return errorResponse("Failed to delete property listing")
  }
}
