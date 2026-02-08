"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { createBookingSchema, type CreateBookingInput } from "@/lib/validations/booking.schema"
import { errorResponse, successResponse } from "@/lib/utils/response"
import {
  calculateBookingPrice,
  calculateDays,
  calculateMonths,
  isValidRentalDuration,
} from "@/lib/utils/pricing-calculator"
import { authOptions } from "@/lib/auth"
import { RentalType } from "@prisma/client"

export async function createBooking(input: CreateBookingInput) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse("Not authenticated")
    }

    const validatedFields = createBookingSchema.safeParse(input)

    if (!validatedFields.success) {
      console.log(validatedFields.error.flatten().fieldErrors)
      return errorResponse("Invalid booking data")
    }

    const { vehicleId, startDate, endDate, pickupLocation, dropoffLocation, notes, withDriver, rentalType } =
      validatedFields.data

    // Get vehicle details
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: { partner: true },
    })

    if (!vehicle) {
      return errorResponse("Vehicle not found")
    }

    if (vehicle.status !== "AVAILABLE") {
      return errorResponse("Vehicle is not available")
    }

    // Validate rental duration for rental type
    const durationValidation = isValidRentalDuration(startDate, endDate, rentalType)
    if (!durationValidation.valid) {
      return errorResponse(durationValidation.message || "Invalid rental duration")
    }

    // Check for conflicting bookings
    const conflictingBookings = await prisma.booking.count({
      where: {
        vehicleId,
        status: { in: ["CONFIRMED", "ACTIVE"] },
        OR: [{ startDate: { lte: endDate }, endDate: { gte: startDate } }],
      },
    })

    if (conflictingBookings > 0) {
      return errorResponse("Vehicle is not available for selected dates")
    }

    // Calculate pricing using the new pricing calculator
    const pricingBreakdown = calculateBookingPrice({
      vehicle: {
        pricePerDay: vehicle.pricePerDay,
        pricePerKm: vehicle.pricePerKm,
        monthlyPrice: vehicle.monthlyPrice,
        depositRequired: vehicle.depositRequired,
        driverPricePerDay: vehicle.driverPricePerDay,
        driverPricePerKm: vehicle.driverPricePerKm,
        driverPricePerMonth: vehicle.driverPricePerMonth,
        includedKmPerDay: vehicle.includedKmPerDay,
        includedKmPerMonth: vehicle.includedKmPerMonth,
        unlimitedMileage: vehicle.unlimitedMileage,
      },
      startDate,
      endDate,
      rentalType,
      withDriver,
    })

    const totalDays = calculateDays(startDate, endDate)
    const totalMonths = rentalType === RentalType.LONG_TERM ? calculateMonths(startDate, endDate) : null

    // Prepare pricing object for storage
    const pricing = {
      rentalType,
      withDriver,
      dailyRate: pricingBreakdown.dailyRate,
      monthlyRate: pricingBreakdown.monthlyRate,
      totalDays: pricingBreakdown.totalDays,
      totalMonths: pricingBreakdown.totalMonths,
      vehicleSubtotal: pricingBreakdown.vehicleSubtotal,
      driverDailyRate: pricingBreakdown.driverDailyRate,
      driverMonthlyRate: pricingBreakdown.driverMonthlyRate,
      driverSubtotal: pricingBreakdown.driverSubtotal,
      includedKm: pricingBreakdown.includedKm,
      extraKmRate: pricingBreakdown.extraKmRate,
      subtotal: pricingBreakdown.subtotal,
      deposit: pricingBreakdown.deposit,
      total: pricingBreakdown.total,
    }

    // Determine dropoff location
    // For with-driver rentals, dropoff might be same as pickup or not required
    const finalDropoffLocation = dropoffLocation || pickupLocation

    // Create booking with new fields
    const booking = await prisma.booking.create({
      data: {
        vehicleId,
        userId: session.user.id,
        partnerId: vehicle.partnerId,
        startDate,
        endDate,
        totalDays,
        totalMonths,
        pickupLocation,
        dropoffLocation: finalDropoffLocation,
        depositPaid: pricingBreakdown.deposit,
        pricing,
        notes,
        status: "PENDING",
        withDriver,
        rentalType,
        partnerConfirmed: false,
        includedKm: pricingBreakdown.includedKm,
      },
      include: {
        vehicle: {
          include: {
            category: true,
          },
        },
      },
    })

    // Create notification for partner
    const rentalTypeLabel = rentalType === RentalType.LONG_TERM ? "long-term" : "short-term"
    const driverLabel = withDriver ? "with driver" : "self-drive"

    await prisma.notification.create({
      data: {
        userId: vehicle.partner.userId,
        type: "NEW_BOOKING",
        title: "New Booking Request",
        message: `You have a new ${rentalTypeLabel} ${driverLabel} booking request for ${vehicle.make} ${vehicle.model}`,
        link: `/partner/bookings/${booking.id}`,
      },
    })

    return successResponse({
      message: "Booking created successfully. Awaiting partner confirmation.",
      booking,
    })
  } catch (error) {
    console.error("[CREATE_BOOKING_ERROR]", error)
    return errorResponse("Failed to create booking")
  }
}
