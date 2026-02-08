"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/utils/response"
import { authOptions } from "@/lib/auth"
import type { Prisma, StaysBookingStatus } from "@prisma/client"

interface StaysBookingListParams {
  page?: number
  limit?: number
  status?: StaysBookingStatus | "ALL"
  partnerId?: string
}

export async function getStaysBookings(params: StaysBookingListParams = {}) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse("Not authenticated")
    }

    const { page = 1, limit = 10, status, partnerId } = params
    const skip = (page - 1) * limit

    const where: any = {}

    // For regular users, only show their bookings
    if (session.user.role === "USER") {
      where.userId = session.user.id
    }

    // For partners, show bookings for their properties
    if (session.user.role === "BUSINESS_PARTNER" || session.user.role === "INDIVIDUAL_PARTNER") {
      const partner = await prisma.partner.findUnique({
        where: { userId: session.user.id },
      })
      if (partner) {
        where.partnerId = partner.id
      }
    }

    // Admin can filter by partnerId
    if (session.user.role === "ADMIN" && partnerId) {
      where.partnerId = partnerId
    }

    // Filter by status
    if (status && status !== "ALL") {
      where.status = status
    }

    const [bookings, total] = await Promise.all([
      prisma.staysBooking.findMany({
        where,
        skip,
        take: limit,
        include: {
          stays: {
            select: {
              id: true,
              name: true,
              city: true,
              images: true,
              staysType: true,
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
          partner: {
            select: {
              id: true,
              businessName: true,
              fullName: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.staysBooking.count({ where }),
    ])

    return successResponse({
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("[GET_STAYS_BOOKINGS_ERROR]", error)
    return errorResponse("Failed to fetch bookings")
  }
}

export async function getMyStaysBookings(params: Omit<StaysBookingListParams, "partnerId"> = {}) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse("Not authenticated")
    }

    const { page = 1, limit = 10, status } = params
    const skip = (page - 1) * limit

    const where: Prisma.StaysBookingWhereInput = {
      userId: session.user.id,
    }

    if (status && status !== "ALL") {
      where.status = status
    }

    const [bookings, total] = await Promise.all([
      prisma.staysBooking.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          userId: true,
          partnerId: true,
          pricing: true,
          status: true,
          depositPaid: true,
          depositRefunded: true,
          cancelReason: true,
          partnerConfirmed: true,
          staysId: true,
          checkIn: true,
          checkOut: true,
          totalNights: true,
          guests: true,
          specialRequests: true,
          totalAmount: true,
          guestCount: true,
          stays: true,
          partner: {
            select: {
              id: true,
              businessName: true,
              fullName: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.staysBooking.count({ where }),
    ])

    return successResponse({
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("[GET_MY_STAYS_BOOKINGS_ERROR]", error)
    return errorResponse("Failed to fetch your bookings")
  }
}