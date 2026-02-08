"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/utils/response"
import type { ActionResponse } from "@/lib/types"
import { authOptions } from "@/lib/auth"

export async function getAllBookings(): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized")
    }

    const bookings = await prisma.booking.findMany({
      include: {
        vehicle: {
          select: {
            make: true,
            model: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        partner: {
          select: {
            businessName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    })

    return successResponse(bookings)
  } catch (error) {
    console.error("[GET_ALL_BOOKINGS_ERROR]", error)
    return errorResponse("Failed to fetch bookings")
  }
}
