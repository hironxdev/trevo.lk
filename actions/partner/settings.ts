"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/utils/response"
import { authOptions } from "@/lib/auth"
import { z } from "zod"

const updateProfileSchema = z.object({
  whatsappNumber: z.string().optional(),
  businessHotline: z.string().optional(),
  businessEmail: z.string().email().optional(),
  residentialAddress: z.string().optional(),
  businessAddress: z.string().optional(),
})

export async function updatePartnerProfile(input: z.infer<typeof updateProfileSchema>) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse("Not authenticated")
    }

    const partner = await prisma.partner.findUnique({
      where: { userId: session.user.id },
    })

    if (!partner) {
      return errorResponse("Partner profile not found")
    }

    const validatedFields = updateProfileSchema.safeParse(input)
    if (!validatedFields.success) {
      return errorResponse("Invalid input data")
    }

    const data = validatedFields.data

    // Build update object based on partner type
    const updateData: Record<string, string | undefined> = {}

    if (partner.partnerType === "INDIVIDUAL") {
      if (data.whatsappNumber) updateData.whatsappNumber = data.whatsappNumber
      if (data.residentialAddress) updateData.residentialAddress = data.residentialAddress
    } else {
      if (data.businessHotline) updateData.businessHotline = data.businessHotline
      if (data.businessEmail) updateData.businessEmail = data.businessEmail
      if (data.businessAddress) updateData.businessAddress = data.businessAddress
    }

    const updatedPartner = await prisma.partner.update({
      where: { id: partner.id },
      data: updateData,
    })

    return successResponse({ message: "Profile updated successfully", partner: updatedPartner })
  } catch (error) {
    console.error("[UPDATE_PARTNER_PROFILE_ERROR]", error)
    return errorResponse("Failed to update profile")
  }
}

export async function getPartnerSettings() {
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
            createdAt: true,
          },
        },
      },
    })

    if (!partner) {
      return errorResponse("Partner profile not found")
    }

    return successResponse(partner)
  } catch (error) {
    console.error("[GET_PARTNER_SETTINGS_ERROR]", error)
    return errorResponse("Failed to fetch settings")
  }
}
