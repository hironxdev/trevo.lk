"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { updateVehicleSchema, type UpdateVehicleInput } from "@/lib/validations/vehicle.schema"
import { errorResponse, successResponse, validationErrorResponse } from "@/lib/utils/response"
import type { ActionResponse } from "@/lib/types"
import { authOptions } from "@/lib/auth"

export async function updateVehicle(vehicleId: string, input: UpdateVehicleInput): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse("Not authenticated")
    }

    // Get vehicle
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: { partner: true },
    })

    if (!vehicle) {
      return errorResponse("Vehicle not found")
    }

    // Check authorization
    if (vehicle.partner.userId !== session.user.id && session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized")
    }

    const validatedFields = updateVehicleSchema.safeParse(input)

    if (!validatedFields.success) {
      return validationErrorResponse(validatedFields.error.flatten().fieldErrors)
    }

    const data = validatedFields.data

    // Update vehicle
    const updatedVehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        ...(data.categoryId && { categoryId: data.categoryId }),
        ...(data.make && { make: data.make }),
        ...(data.model && { model: data.model }),
        ...(data.year && { year: data.year }),
        ...(data.color && { color: data.color }),
        ...(data.licensePlate && { licensePlate: data.licensePlate }),
        ...(data.features && { features: data.features }),
        ...(data.specifications && { specifications: data.specifications }),
        ...(data.pricePerDay && { pricePerDay: data.pricePerDay }),
        ...(data.pricePerKm !== undefined && { pricePerKm: data.pricePerKm }),
        ...(data.monthlyPrice !== undefined && { monthlyPrice: data.monthlyPrice }),
        ...(data.depositRequired !== undefined && { depositRequired: data.depositRequired }),
        ...(data.unlimitedMileage !== undefined && { unlimitedMileage: data.unlimitedMileage }),
        ...(data.withDriver !== undefined && { withDriver: data.withDriver }),
        ...(data.location && { location: data.location }),
        ...(data.images && { images: data.images }),
        ...(data.availableFrom && { availableFrom: data.availableFrom }),
        ...(data.availableUntil && { availableUntil: data.availableUntil }),
        ...(data.status && { status: data.status }),
        ...(data.rentalType !== undefined && { rentalType: data.rentalType }),
        ...(data.driverPricePerDay !== undefined && { driverPricePerDay: data.driverPricePerDay }),
        ...(data.driverPricePerKm !== undefined && { driverPricePerKm: data.driverPricePerKm }),
        ...(data.driverPricePerMonth !== undefined && { driverPricePerMonth: data.driverPricePerMonth }),
        ...(data.includedKmPerDay !== undefined && { includedKmPerDay: data.includedKmPerDay }),
        ...(data.includedKmPerMonth !== undefined && { includedKmPerMonth: data.includedKmPerMonth }),
      },
      include: {
        category: true,
      },
    })

    return successResponse({
      message: "Vehicle updated successfully",
      vehicle: updatedVehicle,
    })
  } catch (error) {
    console.error("[UPDATE_VEHICLE_ERROR]", error)
    return errorResponse("Failed to update vehicle")
  }
}
