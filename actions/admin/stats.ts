"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/utils/response"
import type { ActionResponse } from "@/lib/types"
import { authOptions } from "@/lib/auth"
import { startOfMonth, subDays } from "date-fns"

export async function getAdminStats(): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized")
    }

    const monthStart = startOfMonth(new Date())

    const [
      totalUsers,
      totalPartners,
      totalVehicles,
      totalBookings,
      pendingPartners,
      pendingVehicles,
      completedBookings,
      monthlyBookings,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "USER" } }),
      prisma.partner.count({ where: { kycStatus: "VERIFIED" } }),
      prisma.vehicle.count({ where: { isApproved: true } }),
      prisma.booking.count(),
      prisma.partner.count({ where: { kycStatus: "PENDING" } }),
      prisma.vehicle.count({ where: { isApproved: false } }),
      prisma.booking.findMany({
        where: { status: "COMPLETED" },
        select: { pricing: true },
      }),
      prisma.booking.findMany({
        where: {
          status: "COMPLETED",
          createdAt: { gte: monthStart },
        },
        select: { pricing: true },
      }),
    ])

    // Calculate total revenue
    const totalRevenue = completedBookings.reduce((sum, booking) => {
      const pricing = booking.pricing as { subtotal?: number; total?: number }
      return sum + (pricing?.subtotal || pricing?.total || 0)
    }, 0)

    // Calculate monthly revenue
    const monthlyRevenue = monthlyBookings.reduce((sum, booking) => {
      const pricing = booking.pricing as { subtotal?: number; total?: number }
      return sum + (pricing?.subtotal || pricing?.total || 0)
    }, 0)

    return successResponse({
      totalUsers,
      totalPartners,
      totalVehicles,
      totalBookings,
      pendingPartners,
      pendingVehicles,
      totalRevenue,
      monthlyRevenue,
    })
  } catch (error) {
    console.error("[GET_ADMIN_STATS_ERROR]", error)
    return errorResponse("Failed to fetch admin stats")
  }
}

export async function getRecentActivity(): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized")
    }

    const sevenDaysAgo = subDays(new Date(), 7)

    // Get recent users
    const recentUsers = await prisma.user.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { id: true, name: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    })

    // Get recent partners
    const recentPartners = await prisma.partner.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: {
        id: true,
        businessName: true,
        fullName: true,
        partnerType: true,
        kycStatus: true,
        createdAt: true,
        verifiedAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    })

    // Get recent bookings
    const recentBookings = await prisma.booking.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: {
        id: true,
        createdAt: true,
        user: { select: { name: true } },
        vehicle: { select: { make: true, model: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    })

    // Get recent vehicles
    const recentVehicles = await prisma.vehicle.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: {
        id: true,
        make: true,
        model: true,
        createdAt: true,
        partner: { select: { businessName: true, fullName: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    })

    // Combine and format activities
    const activities = [
      ...recentUsers.map((u) => ({
        id: `user-${u.id}`,
        type: "user_registered" as const,
        message: `${u.name} registered as a new user`,
        createdAt: u.createdAt.toISOString(),
      })),
      ...recentPartners.map((p) => ({
        id: `partner-${p.id}`,
        type:
          p.kycStatus === "VERIFIED"
            ? ("partner_approved" as const)
            : p.kycStatus === "REJECTED"
              ? ("partner_rejected" as const)
              : ("partner_registered" as const),
        message:
          p.kycStatus === "VERIFIED"
            ? `${p.businessName || p.fullName} was approved as a partner`
            : p.kycStatus === "REJECTED"
              ? `${p.businessName || p.fullName} was rejected`
              : `${p.businessName || p.fullName} applied as ${p.partnerType.toLowerCase()} partner`,
        createdAt: (p.verifiedAt || p.createdAt).toISOString(),
      })),
      ...recentBookings.map((b) => ({
        id: `booking-${b.id}`,
        type: "booking_created" as const,
        message: `${b.user?.name} booked ${b.vehicle.make} ${b.vehicle.model}`,
        createdAt: b.createdAt.toISOString(),
      })),
      ...recentVehicles.map((v) => ({
        id: `vehicle-${v.id}`,
        type: "vehicle_added" as const,
        message: `${v.partner.businessName || v.partner.fullName} added ${v.make} ${v.model}`,
        createdAt: v.createdAt.toISOString(),
      })),
    ]

    // Sort by date and take top 10
    activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return successResponse(activities.slice(0, 10))
  } catch (error) {
    console.error("[GET_RECENT_ACTIVITY_ERROR]", error)
    return errorResponse("Failed to fetch recent activity")
  }
}
