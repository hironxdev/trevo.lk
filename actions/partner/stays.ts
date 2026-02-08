"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/utils/response"
import { authOptions } from "@/lib/auth"

export async function getPartnerStays() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse("Not authenticated")
    }

    const partner = await prisma.partner.findUnique({
      where: { userId: session.user.id },
    })

    if (!partner) {
      return errorResponse("Partner not found")
    }

    const stays = await prisma.stays.findMany({
      where: { partnerId: partner.id },
      include: {
        category: {
          select: { name: true },
        },
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return successResponse(stays)
  } catch (error) {
    console.error("[GET_PARTNER_STAYS_ERROR]", error)
    return errorResponse("Failed to fetch properties")
  }
}

export async function getPartnerStaysStats() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse("Not authenticated")
    }

    const partner = await prisma.partner.findUnique({
      where: { userId: session.user.id },
    })

    if (!partner) {
      return errorResponse("Partner not found")
    }

    const [totalStays, activeStays, pendingStays, activeBookings, completedBookings, totalEarnings, monthlyEarnings] =
      await Promise.all([
        prisma.stays.count({ where: { partnerId: partner.id } }),
        prisma.stays.count({ where: { partnerId: partner.id, status: "AVAILABLE", isApproved: true } }),
        prisma.stays.count({ where: { partnerId: partner.id, isApproved: false } }),
        prisma.staysBooking.count({
          where: {
            stays: { partnerId: partner.id },
            status: { in: ["CONFIRMED", "ACTIVE"] },
          },
        }),
        prisma.staysBooking.count({
          where: {
            stays: { partnerId: partner.id },
            status: "COMPLETED",
          },
        }),
        prisma.staysBooking.aggregate({
          where: {
            stays: { partnerId: partner.id },
            status: "COMPLETED",
          },
          _sum: { totalAmount: true },
        }),
        prisma.staysBooking.aggregate({
          where: {
            stays: { partnerId: partner.id },
            status: "COMPLETED",
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
          _sum: { totalAmount: true },
        }),
      ])

    return successResponse({
      totalStays,
      activeStays,
      pendingStays,
      activeBookings,
      completedBookings,
      totalEarnings: totalEarnings._sum.totalAmount || 0,
      monthlyEarnings: monthlyEarnings._sum.totalAmount || 0,
    })
  } catch (error) {
    console.error("[GET_PARTNER_STAYS_STATS_ERROR]", error)
    return errorResponse("Failed to fetch stats")
  }
}

export async function getPartnerStaysBookings() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse("Not authenticated")
    }

    const partner = await prisma.partner.findUnique({
      where: { userId: session.user.id },
    })

    if (!partner) {
      return errorResponse("Partner not found")
    }

    const bookings = await prisma.staysBooking.findMany({
      where: {
        stays: { partnerId: partner.id },
      },
      include: {
        stays: {
          select: {
            id: true,
            title: true,
            images: true,
            location: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return successResponse(bookings)
  } catch (error) {
    console.error("[GET_PARTNER_STAYS_BOOKINGS_ERROR]", error)
    return errorResponse("Failed to fetch bookings")
  }
}
