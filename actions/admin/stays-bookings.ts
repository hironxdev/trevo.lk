"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { errorResponse, successResponse } from "@/lib/utils/response"

export async function getAllStaysBookings() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized")
    }

    const bookings = await prisma.staysBooking.findMany({
      include: {
        stays: {
          select: {
            id: true,
            name: true,
            images: true,
            city: true,
            pricePerNight: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
          },
        },
        partner: {
          select: {
            id: true,
            businessName: true,
            fullName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return successResponse({ data: bookings })
  } catch (error) {
    console.error("[GET_ALL_STAYS_BOOKINGS_ERROR]", error)
    return errorResponse("Failed to fetch stays bookings")
  }
}

export async function updateAdminStaysBookingStatus(
  bookingId: string,
  status: "CONFIRMED" | "REJECTED" | "CANCELLED" | "COMPLETED",
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized")
    }

    const booking = await prisma.staysBooking.findUnique({
      where: { id: bookingId },
    })

    if (!booking) {
      return errorResponse("Booking not found")
    }

    const updatedBooking = await prisma.staysBooking.update({
      where: { id: bookingId },
      data: { status },
    })

    return successResponse({
      message: `Booking ${status.toLowerCase()} successfully`,
      data: updatedBooking,
    })
  } catch (error) {
    console.error("[UPDATE_ADMIN_STAYS_BOOKING_STATUS_ERROR]", error)
    return errorResponse("Failed to update booking status")
  }
}
