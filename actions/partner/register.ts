"use server";

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import {
  registerPartnerSchema,
  type RegisterPartnerInput,
} from "@/lib/validations/partner.schema";
import {
  errorResponse,
  successResponse,
  validationErrorResponse,
} from "@/lib/utils/response";
import type { ActionResponse } from "@/lib/types";
import { authOptions } from "@/lib/auth";

export async function registerPartner(
  input: RegisterPartnerInput,
): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return errorResponse("Not authenticated. Please sign in first.");
    }

    // Check if user already has a partner profile
    const existingPartner = await prisma.partner.findUnique({
      where: { userId: session.user.id },
    });

    if (existingPartner) {
      return errorResponse("You already have a partner profile");
    }

    const validatedFields = registerPartnerSchema.safeParse(input);

    if (!validatedFields.success) {
      return validationErrorResponse(
        validatedFields.error.flatten().fieldErrors,
      );
    }

    const data = validatedFields.data;

    if (data.partnerType === "INDIVIDUAL") {
      // Create individual partner - no service type restriction, can list any service later
      const partner = await prisma.partner.create({
        data: {
          userId: session.user.id,
          partnerType: "INDIVIDUAL",
          serviceType: "BOTH", // Partners can now manage all service types
          kycStatus: "PENDING",
          fullName: data.fullName,
          nicNumber: data.nicNumber,
          dateOfBirth: new Date(data.dateOfBirth),
          gender: data.gender,
          whatsappNumber: data.whatsappNumber,
          residentialAddress: data.residentialAddress,
          drivingLicenseNumber: data.drivingLicenseNumber,
          drivingLicenseExpiry: data.drivingLicenseExpiry
            ? new Date(data.drivingLicenseExpiry)
            : undefined,
          documents: data.documents,
        },
      });

      // Update user role
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          role: "INDIVIDUAL_PARTNER",
          phone: data.phone,
        },
      });

      await prisma.notification.create({
        data: {
          userId: session.user.id,
          type: "PARTNER_REGISTRATION",
          title: "Registration Submitted",
          message: `Your individual partner registration has been submitted. We will review your application and notify you once verified. After approval, you can list vehicles, properties, or events.`,
          link: "/partner/dashboard",
        },
      });

      const admins = await prisma.user.findMany({
        where: { role: "ADMIN" },
        select: { id: true },
      });

      if (admins.length > 0) {
        await prisma.notification.createMany({
          data: admins.map((admin) => ({
            userId: admin.id,
            type: "NEW_PARTNER_APPLICATION",
            title: "New Individual Partner Application",
            message: `${data.fullName} has submitted an individual partner registration.`,
            link: "/admin/partners",
          })),
        });
      }

      return successResponse({
        message: "Individual partner registration submitted successfully. Your application is under review.",
        partner,
      });
    } else {
      // Create business partner - no service type restriction, can list any service later
      const partner = await prisma.partner.create({
        data: {
          userId: session.user.id,
          partnerType: "BUSINESS",
          serviceType: "BOTH", // Partners can now manage all service types
          kycStatus: "PENDING",
          businessName: data.businessName,
          businessRegNumber: data.businessRegNumber,
          businessRegDate: new Date(data.businessRegDate),
          businessType: data.businessType,
          vatNumber: data.vatNumber,
          authorizedPersonName: data.authorizedPersonName,
          authorizedPersonNic: data.authorizedPersonNic,
          authorizedPersonDesignation: data.authorizedPersonDesignation,
          businessAddress: data.businessAddress,
          businessHotline: data.businessHotline,
          businessEmail: data.businessEmail,
          documents: data.documents,
        },
      });

      // Update user role
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          role: "BUSINESS_PARTNER",
          phone: data.authorizedPersonPhone,
        },
      });

      await prisma.notification.create({
        data: {
          userId: session.user.id,
          type: "PARTNER_REGISTRATION",
          title: "Registration Submitted",
          message: `Your business partner registration has been submitted. We will review your application and notify you once verified. After approval, you can list vehicles, properties, or events.`,
          link: "/partner/dashboard",
        },
      });

      const admins = await prisma.user.findMany({
        where: { role: "ADMIN" },
        select: { id: true },
      });

      if (admins.length > 0) {
        await prisma.notification.createMany({
          data: admins.map((admin) => ({
            userId: admin.id,
            type: "NEW_PARTNER_APPLICATION",
            title: "New Business Partner Application",
            message: `${data.businessName} has submitted a business partner registration.`,
            link: "/admin/partners",
          })),
        });
      }

      return successResponse({
        message: "Business partner registration submitted successfully. Your application is under review.",
        partner,
      });
    }
  } catch (error) {
    console.error("[REGISTER_PARTNER_ERROR]", error);
    return errorResponse("Failed to register as partner. Please try again.");
  }
}
