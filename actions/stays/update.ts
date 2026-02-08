"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { updateStaysSchema, type UpdateStaysInput } from "@/lib/validations/stays.schema"
import { errorResponse, successResponse, validationErrorResponse } from "@/lib/utils/response"
import type { ActionResponse } from "@/lib/types"
import { authOptions } from "@/lib/auth"

export async function updateStays(staysId: string, input: UpdateStaysInput): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse("Not authenticated")
    }

    // Get the stays listing
    const existingStays = await prisma.stays.findUnique({
      where: { id: staysId },
      include: { partner: true },
    })

    if (!existingStays) {
      return errorResponse("Property listing not found")
    }

    // Check ownership (unless admin)
    if (session.user.role !== "ADMIN") {
      if (!existingStays.partner || existingStays.partner.userId !== session.user.id) {
        return errorResponse("You don't have permission to edit this property")
      }
    }

    const validatedFields = updateStaysSchema.safeParse(input)

    if (!validatedFields.success) {
      return validationErrorResponse(validatedFields.error.flatten().fieldErrors)
    }

    const data = validatedFields.data

    // Update stays listing
    const stays = await prisma.stays.update({
      where: { id: staysId },
      data: {
        categoryId: data.categoryId,
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
        pricePerWeek: data.pricePerWeek === "" ? null : Number(data.pricePerWeek) || undefined,
        pricePerMonth: data.pricePerMonth === "" ? null : Number(data.pricePerMonth) || undefined,
        cleaningFee: data.cleaningFee === "" ? null : Number(data.cleaningFee) || undefined,
        depositRequired: data.depositRequired,
        availableFrom: data.availableFrom,
        availableUntil: data.availableUntil,
        minNights: data.minNights,
        maxNights: data.maxNights,
        images: data.images,
        status: data.status,
      },
      include: {
        staysCategory: true,
      },
    })

    return successResponse({
      message: "Property listing updated successfully",
      stays,
    })
  } catch (error) {
    console.error("[UPDATE_STAYS_ERROR]", error)
    return errorResponse("Failed to update property listing")
  }
}
