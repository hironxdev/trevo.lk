"use server";

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/utils/response";
import { authOptions } from "@/lib/auth";

export async function getAllStays() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized");
    }

    const stays = await prisma.stays.findMany({
      include: {
        category: {
          select: { name: true },
        },
        partner: {
          select: {
            id: true,
            fullName: true,
            businessName: true,
          },
        },
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return successResponse(stays);
  } catch (error) {
    console.error("[GET_ALL_STAYS_ERROR]", error);
    return errorResponse("Failed to fetch properties");
  }
}

export async function approveStays(staysId: string, approved: boolean) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized");
    }

    await prisma.stays.update({
      where: { id: staysId },
      data: {
        isApproved: approved,
        status: approved ? "AVAILABLE" : "UNAVAILABLE",
      },
    });

    return successResponse({
      message: `Property ${approved ? "approved" : "unapproved"} successfully`,
    });
  } catch (error) {
    console.error("[APPROVE_STAYS_ERROR]", error);
    return errorResponse("Failed to update property status");
  }
}

export async function getStaysStats() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized");
    }

    const [total, pending, approved, available, totalBookings, totalRevenue] =
      await Promise.all([
        prisma.stays.count(),
        prisma.stays.count({ where: { isApproved: false } }),
        prisma.stays.count({ where: { isApproved: true } }),
        prisma.stays.count({ where: { status: "AVAILABLE" } }),
        prisma.staysBooking.count(),
        prisma.staysBooking.aggregate({
          where: { status: "COMPLETED" },
          _sum: { totalAmount: true },
        }),
      ]);

    return successResponse({
      total,
      pending,
      approved,
      available,
      totalBookings,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
    });
  } catch (error) {
    console.error("[GET_STAYS_STATS_ERROR]", error);
    return errorResponse("Failed to fetch stats");
  }
}
