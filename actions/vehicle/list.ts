"use server"

import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/utils/response"
import { type VehicleCategory, type VehicleType, type RentalType, VehicleStatus } from "@prisma/client"

interface VehicleListParams {
  page?: number
  limit?: number
  category?: VehicleCategory
  type?: VehicleType
  minPrice?: number
  maxPrice?: number
  location?: string
  search?: string
  startDate?: Date
  endDate?: Date
  withDriver?: "ALL" | "true" | "false"
  rentalType?: RentalType | "ALL"
}

export async function getVehicles(params: VehicleListParams = {}) {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      type,
      minPrice,
      maxPrice,
      location,
      search,
      startDate,
      endDate,
      withDriver,
      rentalType,
    } = params

    const skip = (page - 1) * limit

    const where: any = {
      isApproved: true,
      status: VehicleStatus.AVAILABLE,
    }

    if (category) {
      where.category = { category }
    }

    if (type) {
      where.vehicleType = type
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.pricePerDay = {}
      if (minPrice !== undefined) where.pricePerDay.gte = minPrice
      if (maxPrice !== undefined) where.pricePerDay.lte = maxPrice
    }

    if (location) {
      where.location = { contains: location, mode: "insensitive" }
    }

    if (withDriver !== undefined && withDriver !== "ALL") {
      where.withDriver = withDriver === "true"
    }

    if (rentalType !== undefined && rentalType !== "ALL") {
      where.rentalType = rentalType
    }

    if (search) {
      where.OR = [
        { make: { contains: search, mode: "insensitive" } },
        { model: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ]
    }

    // Check availability for date range
    if (startDate && endDate) {
      const conflictingBookings = await prisma.booking.findMany({
        where: {
          status: { in: ["CONFIRMED", "ACTIVE"] },
          OR: [{ startDate: { lte: endDate }, endDate: { gte: startDate } }],
        },
        select: { vehicleId: true },
      })

      const bookedVehicleIds = conflictingBookings.map((b) => b.vehicleId)
      if (bookedVehicleIds.length > 0) {
        where.id = { notIn: bookedVehicleIds }
      }
    }

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
          partner: {
            select: {
              businessName: true,
              kycStatus: true,
            },
          },
          bookings: {
            where: {
              status: { in: ["CONFIRMED", "ACTIVE"] },
              startDate: { lte: new Date() },
              endDate: { gte: new Date() },
            },
            select: {
              id: true,
              startDate: true,
              endDate: true,
            },
          },
          _count: {
            select: {
              reviews: true,
              bookings: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.vehicle.count({ where }),
    ])

    // Calculate average ratings
    const vehiclesWithRatings = await Promise.all(
      vehicles.map(async (vehicle) => {
        const avgRating = await prisma.review.aggregate({
          where: { vehicleId: vehicle.id, isApproved: true },
          _avg: { rating: true },
        })

        const isCurrentlyBooked = vehicle.bookings.length > 0

        return {
          ...vehicle,
          averageRating: avgRating._avg.rating || 0,
          reviewCount: vehicle._count.reviews,
          isCurrentlyBooked,
        }
      }),
    )

    return successResponse({
      data: vehiclesWithRatings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("[GET_VEHICLES_ERROR]", error)
    return errorResponse("Failed to fetch vehicles")
  }
}
