"use server"

import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/utils/response"

export async function getStaysById(id: string) {
  try {
    const stays = await prisma.stays.findUnique({
      where: { id },
      include: {
        staysCategory: true,
        partner: {
          select: {
            id: true,
            fullName: true,
            businessName: true,
            businessHotline: true,
            businessEmail: true,
            whatsappNumber: true,
            kycStatus: true,
            user: {
              select: {
                name: true,
                email: true,
                phone: true,
                image: true,
              },
            },
          },
        },
        bookings: {
          where: {
            status: { in: ["PENDING", "CONFIRMED", "ACTIVE"] },
          },
          select: {
            checkIn: true,
            checkOut: true,
          },
        },
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
    })

    if (!stays) {
      return errorResponse("Property not found")
    }

    // Calculate average rating
    const avgRating = await prisma.staysReview.aggregate({
      where: { staysId: id, isApproved: true },
      _avg: { rating: true },
    })

    return successResponse({
      ...stays,
      averageRating: avgRating._avg.rating || 0,
    })
  } catch (error) {
    console.error("[GET_STAYS_BY_ID_ERROR]", error)
    return errorResponse("Failed to fetch property details")
  }
}
