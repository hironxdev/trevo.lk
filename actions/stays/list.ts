"use server";

import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/utils/response";
import {
  type StaysType,
  type StaysCategoryType,
  VehicleStatus,
} from "@prisma/client";

interface StaysListParams {
  page?: number;
  limit?: number;
  category?: StaysCategoryType;
  type?: StaysType;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  district?: string;
  guests?: number;
  bedrooms?: number;
  amenities?: string[];
  search?: string;
  checkIn?: Date;
  checkOut?: Date;
}

export async function getStays(params: StaysListParams = {}) {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      type,
      minPrice,
      maxPrice,
      city,
      district,
      guests,
      bedrooms,
      amenities,
      search,
      checkIn,
      checkOut,
    } = params;

    const skip = (page - 1) * limit;

    const where: any = {
      isApproved: true,
      status: VehicleStatus.AVAILABLE,
    };

    if (category) {
      where.staysCategory = { category };
    }

    if (type) {
      where.staysType = type;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.pricePerNight = {};
      if (minPrice !== undefined) where.pricePerNight.gte = minPrice;
      if (maxPrice !== undefined) where.pricePerNight.lte = maxPrice;
    }

    if (city) {
      where.city = { contains: city, mode: "insensitive" };
    }

    if (district) {
      where.district = { contains: district, mode: "insensitive" };
    }

    if (guests) {
      where.maxGuests = { gte: guests };
    }

    if (bedrooms) {
      where.bedrooms = { gte: bedrooms };
    }

    if (amenities && amenities.length > 0) {
      where.amenities = { hasEvery: amenities };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { district: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }

    // Check availability for date range
    if (checkIn && checkOut) {
      const conflictingBookings = await prisma.staysBooking.findMany({
        where: {
          status: { in: ["CONFIRMED", "ACTIVE"] },
          OR: [{ checkIn: { lte: checkOut }, checkOut: { gte: checkIn } }],
        },
        select: { staysId: true },
      });

      const bookedStaysIds = conflictingBookings.map((b) => b.staysId);
      if (bookedStaysIds.length > 0) {
        where.id = { notIn: bookedStaysIds };
      }
    }

    const [stays, total] = await Promise.all([
      prisma.stays.findMany({
        where,
        skip,
        take: limit,
        include: {
          staysCategory: true,
          partner: {
            select: {
              businessName: true,
              fullName: true,
              kycStatus: true,
            },
          },
          bookings: {
            where: {
              status: { in: ["CONFIRMED", "ACTIVE"] },
              checkIn: { lte: new Date() },
              checkOut: { gte: new Date() },
            },
            select: {
              id: true,
              checkIn: true,
              checkOut: true,
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
      prisma.stays.count({ where }),
    ]);

    // Calculate average ratings
    const staysWithRatings = await Promise.all(
      stays.map(async (stay) => {
        const avgRating = await prisma.staysReview.aggregate({
          where: { staysId: stay.id, isApproved: true },
          _avg: { rating: true },
        });

        const isCurrentlyBooked = stay.bookings.length > 0;

        return {
          ...stay,
          averageRating: avgRating._avg.rating || 0,
          reviewCount: stay._count.reviews,
          isCurrentlyBooked,
        };
      })
    );

    return successResponse({
      data: staysWithRatings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET_STAYS_ERROR]", error);
    return errorResponse("Failed to fetch stays listings");
  }
}

export async function getPopularStays(limit = 8) {
  try {
    const stays = await prisma.stays.findMany({
      where: {
        isApproved: true,
        status: VehicleStatus.AVAILABLE,
      },
      take: limit,
      include: {
        staysCategory: true,
        bookings: true,
        partner: {
          select: {
            businessName: true,
            fullName: true,
            kycStatus: true,
          },
        },
        _count: {
          select: {
            reviews: true,
            bookings: true,
          },
        },
      },
      orderBy: [{ bookings: { _count: "desc" } }, { createdAt: "desc" }],
    });

    // Calculate average ratings
    const staysWithRatings = await Promise.all(
      stays.map(async (stay) => {
        const avgRating = await prisma.staysReview.aggregate({
          where: { staysId: stay.id, isApproved: true },
          _avg: { rating: true },
        });

        return {
          ...stay,
          averageRating: avgRating._avg.rating || 0,
          reviewCount: stay._count.reviews,
        };
      })
    );

    return successResponse({
      data: staysWithRatings,
    });
  } catch (error) {
    console.error("[GET_POPULAR_STAYS_ERROR]", error);
    return errorResponse("Failed to fetch popular stays");
  }
}
