"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { cancelBookingSchema, type CancelBookingInput } from "@/lib/validations/booking.schema"
import { errorResponse, successResponse, validationErrorResponse } from "@/lib/utils/response"
import type { ActionResponse } from "@/lib/types"
import { authOptions } from "@/lib/auth"

export async function cancelBooking(input: CancelBookingInput): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse("Not authenticated")
    }

    const validatedFields = cancelBookingSchema.safeParse(input)

    if (!validatedFields.success) {
      return validationErrorResponse(validatedFields.error.flatten().fieldErrors)
    }

    const { bookingId, reason } = validatedFields.data

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { vehicle: true, partner: true },
    })

    if (!booking) {
      return errorResponse("Booking not found")
    }

    if (booking.userId !== session.user.id) {
      return errorResponse("Unauthorized")
    }

    if (!["PENDING", "CONFIRMED"].includes(booking.status)) {
      return errorResponse("This booking cannot be cancelled")
    }

    // Update booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "CANCELLED",
        cancelReason: reason,
      },
    })

    // Create notification for partner
    await prisma.notification.create({
      data: {
        userId: booking.partner.userId,
        type: "BOOKING_CANCELLED",
        title: "Booking Cancelled",
        message: `A booking for ${booking.vehicle.make} ${booking.vehicle.model} has been cancelled`,
        link: `/partner/bookings/${bookingId}`,
      },
    })

    return successResponse({
      message: "Booking cancelled successfully",
      booking: updatedBooking,
    })
  } catch (error) {
    console.error("[CANCEL_BOOKING_ERROR]", error)
    return errorResponse("Failed to cancel booking")
  }
}
