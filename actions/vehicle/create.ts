"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { createVehicleSchema, type CreateVehicleInput } from "@/lib/validations/vehicle.schema"
import { errorResponse, successResponse, validationErrorResponse } from "@/lib/utils/response"
import type { ActionResponse } from "@/lib/types"
import { authOptions } from "@/lib/auth"

export async function createVehicle(input: CreateVehicleInput): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse("Not authenticated")
    }

    if (
      session.user.role !== "BUSINESS_PARTNER" &&
      session.user.role !== "INDIVIDUAL_PARTNER" &&
      session.user.role !== "ADMIN"
    ) {
      return errorResponse("Only partners can create vehicles")
    }

    // Get partner profile
    const partner = await prisma.partner.findUnique({
      where: { userId: session.user.id },
    })

    if (!partner) {
      return errorResponse("Partner profile not found")
    }

    if (partner.kycStatus === "REJECTED") {
      return errorResponse("Your partner account has been rejected. Please contact support for more information.")
    }

    const validatedFields = createVehicleSchema.safeParse(input)

    if (!validatedFields.success) {
      return validationErrorResponse(validatedFields.error.flatten().fieldErrors)
    }

    const data = validatedFields.data

    // Create vehicle
    const vehicle = await prisma.vehicle.create({
      data: {
        partnerId: partner.id,
        categoryId: data.categoryId,
        make: data.make,
        model: data.model,
        year: data.year,
        color: data.color,
        licensePlate: data.licensePlate,
        features: data.features,
        specifications: data.specifications,
        pricePerDay: data.pricePerDay,
        pricePerKm: data.pricePerKm,
        monthlyPrice: data.monthlyPrice,
        depositRequired: data.depositRequired,
        unlimitedMileage: data.unlimitedMileage,
        withDriver: data.withDriver,
        location: data.location,
        images: data.images,
        availableFrom: data.availableFrom,
        availableUntil: data.availableUntil,
        status: "AVAILABLE",
        isApproved: false,
        rentalType: data.rentalType,
        driverPricePerDay: data.driverPricePerDay,
        driverPricePerKm: data.driverPricePerKm,
        driverPricePerMonth: data.driverPricePerMonth,
        includedKmPerDay: data.includedKmPerDay,
        includedKmPerMonth: data.includedKmPerMonth,
      },
      include: {
        category: true,
      },
    })

    return successResponse({
      message: "Vehicle created successfully. Awaiting admin approval.",
      vehicle,
    })
  } catch (error) {
    console.error("[CREATE_VEHICLE_ERROR]", error)
    return errorResponse("Failed to create vehicle")
  }
}
