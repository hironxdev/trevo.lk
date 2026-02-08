"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/utils/response"
import type { ActionResponse } from "@/lib/types"
import type { BookingStatus } from "@prisma/client"
import { authOptions } from "@/lib/auth"

interface GetBookingsParams {
  status?: BookingStatus
  page?: number
  limit?: number
}

export async function getMyBookings(params: GetBookingsParams = {}){
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse("Not authenticated")
    }

    const { status, page = 1, limit = 10 } = params
    const skip = (page - 1) * limit

    const where: any = { userId: session.user.id }
    if (status) {
      where.status = status
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: limit,
        include: {
          review: true,
          vehicle: {
            include: {
              category: true,
              partner: {
                select: {
                  businessName: true,
                  user: {
                    select: {
                      name: true,
                      phone: true,
                    },
                  },
                },
              },
            },
          },
          payments: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.booking.count({ where }),
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
    console.error("[GET_MY_BOOKINGS_ERROR]", error)
    return errorResponse("Failed to fetch bookings")
  }
}

export async function getBookingById(bookingId: string): Promise<ActionResponse> {
  try {
        const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse("Not authenticated")
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        vehicle: {
          include: {
            category: true,
            partner: {
              select: {
                businessName: true,
                user: {
                  select: {
                    name: true,
                    phone: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        payments: true,
        review: true,
      },
    })

    if (!booking) {
      return errorResponse("Booking not found")
    }

    // Check authorization
    if (booking.userId !== session.user.id && session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized")
    }

    return successResponse(booking)
  } catch (error) {
    console.error("[GET_BOOKING_BY_ID_ERROR]", error)
    return errorResponse("Failed to fetch booking")
  }
}
