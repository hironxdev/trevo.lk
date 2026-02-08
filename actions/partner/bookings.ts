"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/utils/response"
import type { ActionResponse } from "@/lib/types"
import { authOptions } from "@/lib/auth"

export async function getPartnerBookings() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse("Not authenticated")
    }

    const partner = await prisma.partner.findUnique({
      where: { userId: session.user.id },
    })

    if (!partner) {
      return errorResponse("Partner profile not found")
    }

    const bookings = await prisma.booking.findMany({
      where: { partnerId: partner.id },
      include: {
        vehicle: {
          include: {
            category: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            image: true,
          },
        },
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return successResponse(bookings)
  } catch (error) {
    console.error("[GET_PARTNER_BOOKINGS_ERROR]", error)
    return errorResponse("Failed to fetch bookings")
  }
}

export async function updateBookingStatus(
  bookingId: string,
  status: "CONFIRMED" | "REJECTED" | "COMPLETED",
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
      return errorResponse("Partner profile not found")
    }

    // Verify the booking belongs to this partner
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        vehicle: true,
        user: true,
      },
    })

    if (!booking) {
      return errorResponse("Booking not found")
    }

    if (booking.partnerId !== partner.id) {
      return errorResponse("Unauthorized")
    }

    // Validate status transitions
    const validTransitions: Record<string, string[]> = {
      PENDING: ["CONFIRMED", "REJECTED"],
      CONFIRMED: ["ACTIVE", "COMPLETED", "CANCELLED"],
      ACTIVE: ["COMPLETED"],
    }

    if (!validTransitions[booking.status]?.includes(status)) {
      return errorResponse(`Cannot change status from ${booking.status} to ${status}`)
    }

    // Update booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    })

    // Create notification for user
    const notificationMessages: Record<string, { title: string; message: string }> = {
      CONFIRMED: {
        title: "Booking Confirmed",
        message: `Your booking for ${booking.vehicle.make} ${booking.vehicle.model} has been confirmed!`,
      },
      REJECTED: {
        title: "Booking Rejected",
        message: `Unfortunately, your booking for ${booking.vehicle.make} ${booking.vehicle.model} has been rejected.`,
      },
      COMPLETED: {
        title: "Booking Completed",
        message: `Your rental of ${booking.vehicle.make} ${booking.vehicle.model} has been completed. Thank you for using Trevo!`,
      },
    }

    if (notificationMessages[status]) {
      await prisma.notification.create({
        data: {
          userId: booking.userId,
          type: `BOOKING_${status}`,
          title: notificationMessages[status].title,
          message: notificationMessages[status].message,
          link: `/bookings/${bookingId}`,
        },
      })
    }

    return successResponse({
      message: `Booking ${status.toLowerCase()} successfully`,
      booking: updatedBooking,
    })
  } catch (error) {
    console.error("[UPDATE_BOOKING_STATUS_ERROR]", error)
    return errorResponse("Failed to update booking status")
  }
}
