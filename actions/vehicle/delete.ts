"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/utils/response"
import type { ActionResponse } from "@/lib/types"
import { authOptions } from "@/lib/auth"

export async function deleteVehicle(vehicleId: string): Promise<ActionResponse> {
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
    if (vehicle.partner?.userId !== session.user.id && session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized")
    }

    // Check for active bookings
    const activeBookings = await prisma.booking.count({
      where: {
        vehicleId,
        status: { in: ["PENDING", "CONFIRMED", "ACTIVE"] },
      },
    })

    if (activeBookings > 0) {
      return errorResponse("Cannot delete vehicle with active bookings")
    }

    // Delete vehicle
    await prisma.vehicle.delete({
      where: { id: vehicleId },
    })

    return successResponse({ message: "Vehicle deleted successfully" })
  } catch (error) {
    console.error("[DELETE_VEHICLE_ERROR]", error)
    return errorResponse("Failed to delete vehicle")
  }
}
