"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { createStaysSchema, type CreateStaysInput } from "@/lib/validations/stays.schema"
import { errorResponse, successResponse, validationErrorResponse } from "@/lib/utils/response"
import type { ActionResponse } from "@/lib/types"
import { authOptions } from "@/lib/auth"

export async function createStays(input: CreateStaysInput): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse("Not authenticated")
    }

    if (
      session.user.role !== "BUSINESS_PARTNER" &&
      session.user.role !== "INDIVIDUAL_PARTNER" &&
      session.user.role !== "ADMIN"
    ) {
      return errorResponse("Only partners can create stays listings")
    }

    // Get partner profile
    const partner = await prisma.partner.findUnique({
      where: { userId: session.user.id },
    })

    if (!partner) {
      return errorResponse("Partner profile not found")
    }

    if (partner.kycStatus === "REJECTED") {
      return errorResponse("Your partner account has been rejected. Please contact support for more information.")
    }

    // Check if partner is registered for stays
    if (partner.serviceType !== "STAYS") {
      return errorResponse(
        "Your partner account is not registered for stays rentals. Please contact support to update your account.",
      )
    }

    const validatedFields = createStaysSchema.safeParse(input)

    if (!validatedFields.success) {
      return validationErrorResponse(validatedFields.error.flatten().fieldErrors)
    }

    const data = validatedFields.data

    // Create stays listing
    const stays = await prisma.stays.create({
      data: {
        partnerId: partner.id,
        categoryId: data.categoryId || undefined,
        name: data.name,
        description: data.description,
        staysType: data.staysType,
        address: data.address,
        city: data.city,
        district: data.district,
        location: data.location,
        coordinates: data.coordinates,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        maxGuests: data.maxGuests,
        beds: data.beds,
        amenities: data.amenities,
        houseRules: data.houseRules,
        features: data.features,
        pricePerNight: data.pricePerNight,
        pricePerWeek: data.pricePerWeek === "" ? undefined : Number(data.pricePerWeek) || undefined,
        pricePerMonth: data.pricePerMonth === "" ? undefined : Number(data.pricePerMonth) || undefined,
        cleaningFee: data.cleaningFee === "" ? undefined : Number(data.cleaningFee) || undefined,
        depositRequired: data.depositRequired,
        availableFrom: data.availableFrom,
        availableUntil: data.availableUntil,
        minNights: data.minNights,
        maxNights: data.maxNights,
        images: data.images,
        status: "AVAILABLE",
        isApproved: false,
      },
      include: {
        staysCategory: true,
      },
    })

    return successResponse({
      message: "Property listing created successfully. Awaiting admin approval.",
      stays,
    })
  } catch (error) {
    console.error("[CREATE_STAYS_ERROR]", error)
    return errorResponse("Failed to create property listing")
  }
}
