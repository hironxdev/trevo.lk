"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/utils/response"
import type { ActionResponse } from "@/lib/types"
import { authOptions } from "@/lib/auth"

export async function getPartnerVehicles() {
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

    const vehicles = await prisma.vehicle.findMany({
      where: { partnerId: partner.id },
      include: {
        category: true,
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    // Calculate average ratings
    const vehiclesWithRatings = await Promise.all(
      vehicles.map(async (vehicle) => {
        const avgRating = await prisma.review.aggregate({
          where: { vehicleId: vehicle.id, isApproved: true },
          _avg: { rating: true },
        })

        return {
          ...vehicle,
          averageRating: avgRating._avg.rating || 0,
        }
      }),
    )

    return successResponse(vehiclesWithRatings)
  } catch (error) {
    console.error("[GET_PARTNER_VEHICLES_ERROR]", error)
    return errorResponse("Failed to fetch vehicles")
  }
}
