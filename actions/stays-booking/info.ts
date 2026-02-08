"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/utils/response"
import { authOptions } from "@/lib/auth"

export async function getStaysBookingById(id: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse("Not authenticated")
    }

    const booking = await prisma.staysBooking.findUnique({
      where: { id },
      include: {
        stays: {
          include: {
            category: true,
            partner: {
              select: {
                id: true,
                fullName: true,
                businessName: true,
                phone: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    })

    if (!booking) {
      return errorResponse("Booking not found")
    }

    return successResponse(booking)
  } catch (error) {
    console.error("[GET_STAYS_BOOKING_BY_ID_ERROR]", error)
    return errorResponse("Failed to fetch booking")
  }
}
