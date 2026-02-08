"use server";

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import {
  adminCreateVehicleSchema,
  type AdminCreateVehicleInput,
} from "@/lib/validations/vehicle.schema";
import {
  errorResponse,
  successResponse,
  validationErrorResponse,
} from "@/lib/utils/response";
import type { ActionResponse } from "@/lib/types";
import { authOptions } from "@/lib/auth";

function cleanValue<T>(value: T | "" | undefined): T | undefined {
  if (value === "" || value === undefined || value === null) return undefined;
  return value as T;
}

export async function adminCreateVehicle(
  input: AdminCreateVehicleInput,
): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized - Admin access required");
    }

    const validatedFields = adminCreateVehicleSchema.safeParse(input);

    if (!validatedFields.success) {
      return validationErrorResponse(
        validatedFields.error.flatten().fieldErrors,
      );
    }

    const data = validatedFields.data;

    let partnerInfo: { name: string; userId?: string } | null = null;

    if (data.partnerId) {
      // Verify partner exists
      const partner = await prisma.partner.findUnique({
        where: { id: data.partnerId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!partner) {
        return errorResponse("Partner not found");
      }

      partnerInfo = {
        name:
          partner.businessName ||
          partner.fullName ||
          partner.user.name ||
          "Unknown Partner",
        userId: partner.userId,
      };
    } else if (data.externalPartnerName) {
      partnerInfo = {
        name: data.externalPartnerName,
      };
    } else {
      return errorResponse(
        "Either select an existing partner or provide external partner details",
      );
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        partnerId: data.partnerId || undefined,
        categoryId: data.categoryId || undefined,
        displayName: cleanValue(data.displayName),
        make: cleanValue(data.make),
        model: cleanValue(data.model),
        year: cleanValue(data.year) ? Number(data.year) : undefined,
        color: cleanValue(data.color),
        licensePlate: cleanValue(data.licensePlate) || undefined,
        vehicleType: data.vehicleType,
        features: data.features,
        specifications: data.specifications,
        pricePerDay: cleanValue(data.pricePerDay)
          ? Number(data.pricePerDay)
          : undefined,
        pricePerKm: cleanValue(data.pricePerKm)
          ? Number(data.pricePerKm)
          : undefined,
        monthlyPrice: cleanValue(data.monthlyPrice)
          ? Number(data.monthlyPrice)
          : undefined,
        depositRequired: cleanValue(data.depositRequired)
          ? Number(data.depositRequired)
          : undefined,
        unlimitedMileage: data.unlimitedMileage,
        withDriver: data.withDriver,
        location: cleanValue(data.location),
        images: data.images || [],
        status: "AVAILABLE",
        isApproved: true, // Admin-created vehicles are auto-approved
        approvedAt: new Date(),
        rentalType: data.rentalType,
        driverPricePerDay: cleanValue(data.driverPricePerDay)
          ? Number(data.driverPricePerDay)
          : undefined,
        driverPricePerKm: cleanValue(data.driverPricePerKm)
          ? Number(data.driverPricePerKm)
          : undefined,
        driverPricePerMonth: cleanValue(data.driverPricePerMonth)
          ? Number(data.driverPricePerMonth)
          : undefined,
        includedKmPerDay: cleanValue(data.includedKmPerDay)
          ? Number(data.includedKmPerDay)
          : undefined,
        includedKmPerMonth: cleanValue(data.includedKmPerMonth)
          ? Number(data.includedKmPerMonth)
          : undefined,
        isAdminCreated: true,
        contactOnly: data.contactOnly,
        adminNotes: cleanValue(data.adminNotes),
        // External partner fields
        externalPartnerName: cleanValue(data.externalPartnerName),
        externalPartnerPhone: cleanValue(data.externalPartnerPhone),
        externalPartnerEmail: cleanValue(data.externalPartnerEmail),
        externalPartnerWhatsApp: cleanValue(data.externalPartnerWhatsApp),
        externalPartnerAddress: cleanValue(data.externalPartnerAddress),
        externalPartnerType: cleanValue(data.externalPartnerType),
      },
      include: {
        category: true,
        partner: {
          select: {
            businessName: true,
            fullName: true,
          },
        },
      },
    });

    // Log admin action
    await prisma.adminLog.create({
      data: {
        adminId: session.user.id,
        action: "CREATE_VEHICLE",
        target: "VEHICLE",
        targetId: vehicle.id,
        details: {
          partnerId: data.partnerId || null,
          externalPartnerName: data.externalPartnerName || null,
          partnerName: partnerInfo.name,
          vehicleMake: data.make,
          vehicleModel: data.model,
          displayName: data.displayName,
          contactOnly: data.contactOnly,
          isExternalPartner: !data.partnerId,
        },
      },
    });

    // Create notification for partner (only if existing partner)
    if (data.partnerId && partnerInfo.userId) {
      await prisma.notification.create({
        data: {
          userId: partnerInfo.userId,
          type: "VEHICLE_ADDED",
          title: "New Vehicle Added",
          message: `Admin has added a new vehicle (${data.displayName || `${data.make || ""} ${data.model || ""}`.trim() || "New Vehicle"}) to your account. It has been auto-approved and is now live.`,
          link: `/partner/vehicles`,
        },
      });
    }

    return successResponse({
      message: "Vehicle created successfully",
      vehicle,
    });
  } catch (error: any) {
    console.error("[ADMIN_CREATE_VEHICLE_ERROR]", error);

    if (
      error.code === "P2002" &&
      error.meta?.target?.includes("licensePlate")
    ) {
      return errorResponse("A vehicle with this license plate already exists");
    }

    return errorResponse("Failed to create vehicle");
  }
}
