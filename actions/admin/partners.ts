"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/utils/response"
import type { ActionResponse } from "@/lib/types"
import type { KYCStatus } from "@prisma/client"
import { authOptions } from "@/lib/auth"

export async function getPendingPartners(): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized")
    }

    const partners = await prisma.partner.findMany({
      where: { kycStatus: "PENDING" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    })

    return successResponse(partners)
  } catch (error) {
    console.error("[GET_PENDING_PARTNERS_ERROR]", error)
    return errorResponse("Failed to fetch pending partners")
  }
}

export async function getAllPartners(): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized")
    }

    const partners = await prisma.partner.findMany({
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
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return successResponse(partners)
  } catch (error) {
    console.error("[GET_ALL_PARTNERS_ERROR]", error)
    return errorResponse("Failed to fetch partners")
  }
}

export async function getPartnerById(partnerId: string): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized")
    }

    const partner = await prisma.partner.findUnique({
      where: { id: partnerId },
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
        vehicles: {
          include: {
            category: true,
          },
        },
        _count: {
          select: {
            vehicles: true,
            bookings: true,
          },
        },
      },
    })

    if (!partner) {
      return errorResponse("Partner not found")
    }

    return successResponse(partner)
  } catch (error) {
    console.error("[GET_PARTNER_BY_ID_ERROR]", error)
    return errorResponse("Failed to fetch partner")
  }
}

export async function verifyPartnerKYC(
  partnerId: string,
  status: KYCStatus,
  rejectionReason?: string,
): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized")
    }

    const partner = await prisma.partner.update({
      where: { id: partnerId },
      data: {
        kycStatus: status,
        verifiedAt: status === "VERIFIED" ? new Date() : null,
        rejectionReason: status === "REJECTED" ? rejectionReason : null,
      },
      include: {
        user: true,
      },
    })

    // Create notification for partner
    await prisma.notification.create({
      data: {
        userId: partner.userId,
        type: status === "VERIFIED" ? "KYC_APPROVED" : "KYC_REJECTED",
        title: status === "VERIFIED" ? "Application Approved!" : "Application Rejected",
        message:
          status === "VERIFIED"
            ? "Congratulations! Your partner application has been approved. You can now add vehicles and start receiving bookings."
            : `Your partner application was rejected. ${rejectionReason || "Please contact support for more information."}`,
        link: "/partner/dashboard",
      },
    })

    // Log action
    await prisma.adminLog.create({
      data: {
        adminId: session.user.id,
        action: "VERIFY_KYC",
        target: "PARTNER",
        targetId: partnerId,
        details: { status, rejectionReason },
      },
    })

    return successResponse({
      message: `Partner ${status === "VERIFIED" ? "verified" : "rejected"} successfully`,
      partner,
    })
  } catch (error) {
    console.error("[VERIFY_PARTNER_KYC_ERROR]", error)
    return errorResponse("Failed to verify partner")
  }
}

export async function searchPartners(query: string): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized")
    }

    const partners = await prisma.partner.findMany({
      where: {
        OR: [
          { fullName: { contains: query, mode: "insensitive" } },
          { businessName: { contains: query, mode: "insensitive" } },
          { user: { name: { contains: query, mode: "insensitive" } } },
          { user: { email: { contains: query, mode: "insensitive" } } },
          { user: { phone: { contains: query, mode: "insensitive" } } },
        ],
      },
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
          },
        },
      },
      take: 10,
      orderBy: { createdAt: "desc" },
    })

    return successResponse(partners)
  } catch (error) {
    console.error("[SEARCH_PARTNERS_ERROR]", error)
    return errorResponse("Failed to search partners")
  }
}
