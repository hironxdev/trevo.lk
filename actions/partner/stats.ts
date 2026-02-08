"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/utils/response"
import type { ActionResponse } from "@/lib/types"
import { authOptions } from "@/lib/auth"

export async function getPartnerStats() {
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

    const [vehicleCount, pendingVehicleCount, vehicles, bookings] = await Promise.all([
      prisma.vehicle.count({
        where: { partnerId: partner.id, isApproved: true },
      }),
      prisma.vehicle.count({
        where: { partnerId: partner.id, isApproved: false },
      }),
      prisma.vehicle.findMany({
        where: { partnerId: partner.id, isApproved: true, status: "AVAILABLE" },
        select: { id: true },
      }),
      prisma.booking.findMany({
        where: { partnerId: partner.id },
        select: {
          status: true,
          pricing: true,
          createdAt: true,
        },
      }),
    ])

    const activeVehicles = vehicles.length

    const activeBookings = bookings.filter((b) => ["PENDING", "CONFIRMED", "ACTIVE"].includes(b.status)).length
    const completedBookings = bookings.filter((b) => b.status === "COMPLETED").length

    // Calculate total earnings from completed bookings
    const totalEarnings = bookings
      .filter((b) => b.status === "COMPLETED")
      .reduce((sum, booking) => {
        const pricing = booking.pricing as { subtotal?: number; total?: number }
        return sum + (pricing?.subtotal || pricing?.total || 0)
      }, 0)

    // Calculate monthly earnings from completed bookings in the current month
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthlyEarnings = bookings
      .filter(
        (b) =>
          b.status === "COMPLETED" &&
          b.createdAt >= startOfMonth
      )
      .reduce((sum, booking) => {
        const pricing = booking.pricing as { subtotal?: number; total?: number }
        return sum + (pricing?.subtotal || pricing?.total || 0)
      }, 0)

    return successResponse({
      totalVehicles: vehicleCount,
      pendingVehicles: pendingVehicleCount,
      activeVehicles,
      activeBookings,
      completedBookings,
      totalEarnings,
      monthlyEarnings,
      kycStatus: partner.kycStatus,
    })
  } catch (error) {
    console.error("[GET_PARTNER_STATS_ERROR]", error)
    return errorResponse("Failed to fetch stats")
  }
}
