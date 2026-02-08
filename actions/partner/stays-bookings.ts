"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { errorResponse, successResponse } from "@/lib/utils/response"

export async function getPartnerStaysBookings() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse("Not authenticated")
    }

    const partner = await prisma.partner.findUnique({
      where: { userId: session.user.id },
    })

    if (!partner) {
      return errorResponse("Partner not found")
    }

    const bookings = await prisma.staysBooking.findMany({
      where: { partnerId: partner.id },
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
      },
      orderBy: { createdAt: "desc" },
    })

    return successResponse({ data: bookings })
  } catch (error) {
    console.error("[GET_PARTNER_STAYS_BOOKINGS_ERROR]", error)
    return errorResponse("Failed to fetch stays bookings")
  }
}

export async function updateStaysBookingStatus(
  bookingId: string,
  status: "CONFIRMED" | "REJECTED" | "CANCELLED" | "COMPLETED",
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse("Not authenticated")
    }

    const partner = await prisma.partner.findUnique({
      where: { userId: session.user.id },
    })

    if (!partner) {
      return errorResponse("Partner not found")
    }

    const booking = await prisma.staysBooking.findUnique({
      where: { id: bookingId },
      include: { stays: true },
    })

    if (!booking) {
      return errorResponse("Booking not found")
    }

    if (booking.partnerId !== partner.id && session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized")
    }

    // Validate status transitions
    const validTransitions: Record<string, string[]> = {
      PENDING: ["CONFIRMED", "REJECTED"],
      CONFIRMED: ["ACTIVE", "CANCELLED"],
      ACTIVE: ["COMPLETED", "CANCELLED"],
    }

    if (booking.status !== "PENDING" && !validTransitions[booking.status]?.includes(status)) {
      return errorResponse(`Cannot change status from ${booking.status} to ${status}`)
    }

    const updatedBooking = await prisma.staysBooking.update({
      where: { id: bookingId },
      data: {
        status,
        partnerConfirmed: status === "CONFIRMED" ? true : booking.partnerConfirmed,
      },
    })

    return successResponse({
      message: `Booking ${status.toLowerCase()} successfully`,
      data: updatedBooking,
    })
  } catch (error) {
    console.error("[UPDATE_STAYS_BOOKING_STATUS_ERROR]", error)
    return errorResponse("Failed to update booking status")
  }
}
