"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { createReviewSchema, type CreateReviewInput } from "@/lib/validations/review.schema"
import { errorResponse, successResponse, validationErrorResponse } from "@/lib/utils/response"
import type { ActionResponse } from "@/lib/types"
import { authOptions } from "@/lib/auth"

export async function createReview(input: CreateReviewInput): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse("Not authenticated")
    }

    const validatedFields = createReviewSchema.safeParse(input)

    if (!validatedFields.success) {
      return validationErrorResponse(validatedFields.error.flatten().fieldErrors)
    }

    const { bookingId, rating, comment } = validatedFields.data

    // Check if booking exists and belongs to user
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        vehicle: true,
        partner: true,
      },
    })

    if (!booking) {
      return errorResponse("Booking not found")
    }

    if (booking.userId !== session.user.id) {
      return errorResponse("Unauthorized")
    }

    if (booking.status !== "COMPLETED") {
      return errorResponse("You can only review completed bookings")
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: { bookingId },
    })

    if (existingReview) {
      return errorResponse("You have already reviewed this booking")
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        bookingId,
        vehicleId: booking.vehicleId,
        userId: session.user.id,
        rating,
        comment,
      },
    })

    // Create notification for partner
    await prisma.notification.create({
      data: {
        userId: booking.partner.userId,
        type: "NEW_REVIEW",
        title: "New Review",
        message: `You received a ${rating}-star review for ${booking.vehicle.make} ${booking.vehicle.model}`,
        link: `/partner/vehicles/${booking.vehicleId}`,
      },
    })

    return successResponse({
      message: "Review submitted successfully",
      review,
    })
  } catch (error) {
    console.error("[CREATE_REVIEW_ERROR]", error)
    return errorResponse("Failed to submit review")
  }
}
