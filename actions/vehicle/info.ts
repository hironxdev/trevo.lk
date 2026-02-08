"use server"

import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/utils/response"

export async function getVehicleById(vehicleId: string) {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: {
        category: true,
        partner: {
          select: {
            id: true,
            businessName: true,
            fullName: true,
            kycStatus: true,
            whatsappNumber: true,
            businessHotline: true,
            businessEmail: true,
            user: {
              select: {
                name: true,
                image: true,
                phone: true,
                email: true,
              },
            },
          },
        },
        bookings: {
          where: {
            status: { in: ["CONFIRMED", "ACTIVE"] },
          },
          select: {
            startDate: true,
            endDate: true,
          },
        },
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
    })

    if (!vehicle) {
      return errorResponse("Vehicle not found")
    }

    if (!vehicle.isApproved) {
      return errorResponse("This vehicle is not available")
    }

    // Calculate average rating
    const avgRating = await prisma.review.aggregate({
      where: { vehicleId: vehicle.id, isApproved: true },
      _avg: { rating: true },
    })

    return successResponse({
      ...vehicle,
      contactOnly: vehicle.contactOnly,
      isAdminCreated: vehicle.isAdminCreated,
      externalPartnerName: vehicle.externalPartnerName,
      externalPartnerPhone: vehicle.externalPartnerPhone,
      externalPartnerEmail: vehicle.externalPartnerEmail,
      externalPartnerWhatsApp: vehicle.externalPartnerWhatsApp,
      externalPartnerAddress: vehicle.externalPartnerAddress,
      externalPartnerType: vehicle.externalPartnerType,
      displayName: vehicle.displayName,
      averageRating: avgRating._avg.rating || 0,
      reviewCount: vehicle._count.reviews,
      bookingCount: vehicle._count.bookings,
    })
  } catch (error) {
    console.error("[GET_VEHICLE_BY_ID_ERROR]", error)
    return errorResponse("Failed to fetch vehicle")
  }
}

export async function getVehicleByIdAdmin(vehicleId: string) {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: {
        category: true,
        partner: {
          select: {
            id: true,
            businessName: true,
            fullName: true,
          },
        },
      },
    })

    if (!vehicle) {
      return errorResponse("Vehicle not found")
    }
    return successResponse({
      ...vehicle,
    })
  } catch (error) {
    console.error("[GET_VEHICLE_BY_ID_ERROR]", error)
    return errorResponse("Failed to fetch vehicle")
  }
}

export async function getVehicleDetailByIdAdmin(vehicleId: string) {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: {
        category: true,
        partner: {
          include: {
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
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        reviews: {
          include: {
            user: {
              select: {
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

    if (!vehicle) {
      return errorResponse("Vehicle not found")
    }
    return successResponse({
      ...vehicle,
    })
  } catch (error) {
    console.error("[GET_VEHICLE_BY_ID_ERROR]", error)
    return errorResponse("Failed to fetch vehicle")
  }
}

export async function getVehicleAvailability(vehicleId: string, startDate: Date, endDate: Date) {
  try {
    const conflictingBookings = await prisma.booking.count({
      where: {
        vehicleId,
        status: { in: ["CONFIRMED", "ACTIVE"] },
        OR: [{ startDate: { lte: endDate }, endDate: { gte: startDate } }],
      },
    })

    return successResponse({ available: conflictingBookings === 0 })
  } catch (error) {
    console.error("[GET_VEHICLE_AVAILABILITY_ERROR]", error)
    return errorResponse("Failed to check availability")
  }
}
