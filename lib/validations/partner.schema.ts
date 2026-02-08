import { z } from "zod"

// Service type is no longer required at registration - partners can list any service type after signup
export const serviceTypeSchema = z.enum(["VEHICLE_RENTAL" , "STAYS" , "BOTH"])

// Bank Details Schema (shared)
export const bankDetailsSchema = z.object({
  bankName: z.string().optional(),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  branch: z.string().optional(),
})

// Individual Partner Schema
export const individualPartnerSchema = z.object({
  partnerType: z.literal("INDIVIDUAL"),

  // Personal Details
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  nicNumber: z.string().min(9, "Valid NIC/Passport number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["Male", "Female", "Other"], { required_error: "Gender is required" }),

  // Contact Details
  phone: z.string().min(10, "Valid phone number is required"),
  whatsappNumber: z.string().optional(),
  residentialAddress: z.string().min(10, "Residential address is required"),

  // Driving License (optional - can be added later when listing vehicles with driver)
  drivingLicenseNumber: z.string().optional(),
  drivingLicenseExpiry: z.string().optional(),

  // Bank Details (optional at registration)
  bankDetails: bankDetailsSchema.optional(),

  // Documents
  documents: z
    .array(
      z.object({
        type: z.string(),
        url: z.string().url(),
        name: z.string().optional(),
      }),
    )
    .min(1, "At least one document is required"),

  // Terms
  termsAccepted: z.boolean().refine((val) => val === true, "You must accept the terms and conditions"),
})

// Business Partner Schema
export const businessPartnerSchema = z.object({
  partnerType: z.literal("BUSINESS"),

  // Business Information
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  businessRegNumber: z.string().min(2, "Business registration number is required"),
  businessRegDate: z.string().min(1, "Business registration date is required"),
  businessType: z.enum(["Sole Proprietor", "Partnership", "Pvt Ltd", "PLC"], {
    required_error: "Business type is required",
  }),
  vatNumber: z.string().optional(),

  // Authorized Person
  authorizedPersonName: z.string().min(2, "Authorized person name is required"),
  authorizedPersonNic: z.string().min(9, "Authorized person NIC is required"),
  authorizedPersonDesignation: z.string().min(2, "Designation is required"),
  authorizedPersonPhone: z.string().min(10, "Phone number is required"),

  // Business Contact
  businessAddress: z.string().min(10, "Business address is required"),
  businessHotline: z.string().min(10, "Hotline number is required"),
  businessWhatsapp: z.string().optional(),
  businessEmail: z.string().email("Valid email is required"),

  // Bank Details (optional at registration)
  bankDetails: bankDetailsSchema.optional(),

  // Documents
  documents: z
    .array(
      z.object({
        type: z.string(),
        url: z.string().url(),
        name: z.string().optional(),
      }),
    )
    .min(1, "At least one document is required"),

  // Terms
  termsAccepted: z.boolean().refine((val) => val === true, "You must accept the terms and conditions"),
})

// Combined schema for partner registration
export const registerPartnerSchema = z.discriminatedUnion("partnerType", [
  individualPartnerSchema,
  businessPartnerSchema,
])

export type IndividualPartnerInput = z.infer<typeof individualPartnerSchema>
export type BusinessPartnerInput = z.infer<typeof businessPartnerSchema>
export type RegisterPartnerInput = z.infer<typeof registerPartnerSchema>
export type ServiceType = z.infer<typeof serviceTypeSchema>
