"use server";

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/utils/response";
import type { ActionResponse, PaginatedResponse } from "@/lib/types";
import type { UserRole } from "@prisma/client";
import { authOptions } from "@/lib/auth";

interface GetUsersParams {
  page?: number;
  limit?: number;
  role?: UserRole;
  search?: string;
}

export async function getUsers(params: GetUsersParams = {}) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized");
    }

    const { page = 1, limit = 20, role, search } = params;
    const skip = (page - 1) * limit;

    const where: {
      role?: UserRole;
      OR?: Array<{
        name?: { contains: string; mode: "insensitive" };
        email?: { contains: string; mode: "insensitive" };
      }>;
    } = {};

    if (role) {
      where.role = role;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: {
          partner: {
            select: {
              id: true,
              partnerType: true,
              businessName: true,
              fullName: true,
              kycStatus: true,
            },
          },
          _count: {
            select: {
              bookings: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    return successResponse({
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET_USERS_ERROR]", error);
    return errorResponse("Failed to fetch users");
  }
}

export async function updateUserRole(
  userId: string,
  role: UserRole,
): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized");
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    // Log action
    await prisma.adminLog.create({
      data: {
        adminId: session.user.id,
        action: "UPDATE_USER_ROLE",
        target: "USER",
        targetId: userId,
        details: { newRole: role },
      },
    });

    return successResponse({ message: "User role updated successfully", user });
  } catch (error) {
    console.error("[UPDATE_USER_ROLE_ERROR]", error);
    return errorResponse("Failed to update user role");
  }
}
