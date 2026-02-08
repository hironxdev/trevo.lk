"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/utils/response"
import type { ActionResponse } from "@/lib/types"
import { authOptions } from "@/lib/auth"

export async function getPendingVehicles(): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized")
    }

    const vehicles = await prisma.vehicle.findMany({
      where: { isApproved: false },
      include: {
        category: true,
        partner: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    })

    return successResponse(vehicles)
  } catch (error) {
    console.error("[GET_PENDING_VEHICLES_ERROR]", error)
    return errorResponse("Failed to fetch pending vehicles")
  }
}

export async function approveVehicle(vehicleId: string, approved: boolean, rejectionReason?: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized")
    }

    const vehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        isApproved: approved,
        approvedAt: approved ? new Date() : null,
        rejectionReason: approved ? null : rejectionReason,
      },
      include: {
        partner: true,
      },
    })

    // Create notification for partner
    if (vehicle.partner) {
      await prisma.notification.create({
        data: {
          userId: vehicle.partner.userId,
          type: approved ? "VEHICLE_APPROVED" : "VEHICLE_REJECTED",
          title: approved ? "Vehicle Approved" : "Vehicle Rejected",
          message: approved
            ? `Your vehicle ${vehicle.make} ${vehicle.model} has been approved and is now live on the platform.`
            : `Your vehicle ${vehicle.make} ${vehicle.model} was not approved. ${rejectionReason || "Please review and resubmit."}`,
          link: `/partner/vehicles`,
        },
      })
    }

    // Log action
    await prisma.adminLog.create({
      data: {
        adminId: session.user.id,
        action: approved ? "APPROVE_VEHICLE" : "REJECT_VEHICLE",
        target: "VEHICLE",
        targetId: vehicleId,
        details: { approved, rejectionReason },
      },
    })

    return successResponse({
      message: `Vehicle ${approved ? "approved" : "rejected"} successfully`,
      vehicle,
    })
  } catch (error) {
    console.error("[APPROVE_VEHICLE_ERROR]", error)
    return errorResponse("Failed to approve vehicle")
  }
}

export async function getAllVehicles() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized")
    }

    const vehicles = await prisma.vehicle.findMany({
      include: {
        category: true,
        partner: {
          select: {
            id: true,
            partnerType: true,
            businessName: true,
            fullName: true,
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
            bookings: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return successResponse(vehicles)
  } catch (error) {
    console.error("[GET_ALL_VEHICLES_ERROR]", error)
    return errorResponse("Failed to fetch vehicles")
  }
}
