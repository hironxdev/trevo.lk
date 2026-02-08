"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/utils/response"
import { authOptions } from "@/lib/auth"

export async function getPartnerProfile() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse("Not authenticated")
    }

    const partner = await prisma.partner.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            image: true,
          },
        },
        _count: {
          select: {
            vehicles: true,
            bookings: true,
            stays: true,
            staysBookings: true,
          },
        },
      },
    })

    if (!partner) {
      return errorResponse("Partner profile not found")
    }

    return successResponse(partner)
  } catch (error) {
    console.error("[GET_PARTNER_PROFILE_ERROR]", error)
    return errorResponse("Failed to fetch partner profile")
  }
}

export async function getPartnerById(id: string) {
  try {
    const partner = await prisma.partner.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            createdAt: true,
          },
        },
        vehicles: {
          include: {
            category: true,
            _count: {
              select: {
                bookings: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        stays: {
          include: {
            category: true,
            _count: {
              select: {
                bookings: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        bookings: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            vehicle: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        staysBookings: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            stays: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            vehicles: true,
            bookings: true,
            stays: true,
            staysBookings: true,
          },
        },
      },
    })

    if (!partner) {
      return errorResponse("Partner profile not found")
    }

    return successResponse(partner)
  } catch (error) {
    console.error("[GET_PARTNER_PROFILE_ERROR]", error)
    return errorResponse("Failed to fetch partner profile")
  }
}
