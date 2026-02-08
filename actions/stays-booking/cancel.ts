"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { cancelStaysBookingSchema, type CancelStaysBookingInput } from "@/lib/validations/stays-booking.schema"
import { errorResponse, successResponse } from "@/lib/utils/response"
import { authOptions } from "@/lib/auth"

export async function cancelStaysBooking(input: CancelStaysBookingInput) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse("Not authenticated")
    }

    const validatedFields = cancelStaysBookingSchema.safeParse(input)

    if (!validatedFields.success) {
      return errorResponse("Invalid cancellation data")
    }

    const { bookingId, reason } = validatedFields.data

    // Get booking details
    const booking = await prisma.staysBooking.findUnique({
      where: { id: bookingId },
      include: {
        stays: true,
        partner: true,
        user: true,
      },
    })

    if (!booking) {
      return errorResponse("Booking not found")
    }

    // Check if user owns the booking or is the partner
    const isOwner = booking.userId === session.user.id
    const isPartner = booking.partner.userId === session.user.id
    const isAdmin = session.user.role === "ADMIN"

    if (!isOwner && !isPartner && !isAdmin) {
      return errorResponse("You don't have permission to cancel this booking")
    }

    // Check if booking can be cancelled
    if (!["PENDING", "CONFIRMED"].includes(booking.status)) {
      return errorResponse("This booking cannot be cancelled")
    }

    // Update booking status
    const updatedBooking = await prisma.staysBooking.update({
      where: { id: bookingId },
      data: {
        status: "CANCELLED",
        cancelReason: reason,
      },
    })

    // Create notification for the other party
    const notifyUserId = isOwner ? booking.partner.userId : booking.userId
    if (notifyUserId) {
      await prisma.notification.create({
        data: {
          userId: notifyUserId,
          type: "STAYS_BOOKING_CANCELLED",
          title: "Booking Cancelled",
          message: `Booking for ${booking.stays.name} has been cancelled. Reason: ${reason}`,
          link: isOwner ? `/partner/stays-bookings/${bookingId}` : `/dashboard/stays-bookings/${bookingId}`,
        },
      })
    }

    return successResponse({
      message: "Booking cancelled successfully",
      booking: updatedBooking,
    })
  } catch (error) {
    console.error("[CANCEL_STAYS_BOOKING_ERROR]", error)
    return errorResponse("Failed to cancel booking")
  }
}
