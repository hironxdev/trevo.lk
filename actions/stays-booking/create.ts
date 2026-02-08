"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/utils/response"
import type { ActionResponse } from "@/lib/types"
import { authOptions } from "@/lib/auth"
import { calculateStaysBookingPrice, calculateNights } from "@/lib/utils/stays-pricing-calculator"

interface CreateStaysBookingInput {
  staysId: string
  checkIn: Date
  checkOut: Date
  guests: number
  specialRequests?: string
}

export async function createStaysBooking(input: CreateStaysBookingInput): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse("Please sign in to book this property")
    }

    const { staysId, checkIn, checkOut, guests, specialRequests } = input

    // Get the stays property
    const stays = await prisma.stays.findUnique({
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

    if (!stays) {
      return errorResponse("Property not found")
    }

    if (stays.status !== "AVAILABLE") {
      return errorResponse("This property is not available for booking")
    }

    if (!stays.isApproved) {
      return errorResponse("This property is pending approval")
    }

    if (stays.contactOnly) {
      return errorResponse("This property requires direct contact for booking")
    }

    // Validate guests
    if (guests > stays.maxGuests) {
      return errorResponse(`Maximum ${stays.maxGuests} guests allowed`)
    }

    // Validate dates
    const nights = calculateNights(new Date(checkIn), new Date(checkOut))

    if (nights <= 0) {
      return errorResponse("Check-out must be after check-in")
    }

    if (stays.minNights && nights < stays.minNights) {
      return errorResponse(`Minimum stay is ${stays.minNights} nights`)
    }

    if (stays.maxNights && nights > stays.maxNights) {
      return errorResponse(`Maximum stay is ${stays.maxNights} nights`)
    }

    // Check for date conflicts
    const hasConflict = stays.bookings.some((booking) => {
      const bookingStart = new Date(booking.checkIn)
      const bookingEnd = new Date(booking.checkOut)
      const newStart = new Date(checkIn)
      const newEnd = new Date(checkOut)

      return (
        (newStart >= bookingStart && newStart < bookingEnd) ||
        (newEnd > bookingStart && newEnd <= bookingEnd) ||
        (newStart <= bookingStart && newEnd >= bookingEnd)
      )
    })

    if (hasConflict) {
      return errorResponse("Property is not available for the selected dates")
    }

    // Calculate pricing
    const pricing = calculateStaysBookingPrice({
      stays: {
        pricePerNight: stays.pricePerNight,
        pricePerWeek: stays.pricePerWeek,
        pricePerMonth: stays.pricePerMonth,
        cleaningFee: stays.cleaningFee,
        depositRequired: stays.depositRequired,
      },
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
    })

    // Create booking
    const booking = await prisma.staysBooking.create({
      data: {
        staysId,
        userId: session.user.id,
        partnerId: stays.partnerId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guests,
        totalPrice: pricing.subtotal,
        cleaningFee: pricing.cleaningFee,
        depositAmount: pricing.deposit,
        specialRequests,
        status: "PENDING",
      },
      include: {
        stays: {
          select: {
            name: true,
            city: true,
          },
        },
      },
    })

    // Create notification for partner
    if (stays.partner?.userId) {
      await prisma.notification.create({
        data: {
          userId: stays.partner.userId,
          type: "NEW_BOOKING",
          title: "New Booking Request",
          message: `New booking request for ${stays.name} from ${new Date(checkIn).toLocaleDateString()} to ${new Date(checkOut).toLocaleDateString()}`,
          link: `/partner/stays-bookings/${booking.id}`,
        },
      })
    }

    // Create notification for user
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        type: "BOOKING_CREATED",
        title: "Booking Request Submitted",
        message: `Your booking request for ${stays.name} has been submitted. Awaiting host confirmation.`,
        link: `/dashboard/stays-bookings/${booking.id}`,
      },
    })

    return successResponse({
      message: "Booking request submitted successfully",
      booking,
    })
  } catch (error) {
    console.error("[CREATE_STAYS_BOOKING_ERROR]", error)
    return errorResponse("Failed to create booking")
  }
}
