import { z } from "zod"
import { VehicleStatus, VehicleCategory, VehicleType, RentalType } from "@prisma/client"

export const createVehicleSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  color: z.string().min(1, "Color is required"),
  licensePlate: z.string().min(1, "License plate is required"),
  vehicleType: z.nativeEnum(VehicleType).optional(),
  features: z.array(z.string()).optional(),
  specifications: z
    .object({
      fuelType: z.string().optional(),
      transmission: z.string().optional(),
      seatingCapacity: z.number().optional(),
      mileage: z.number().optional(),
      engineCapacity: z.string().optional(),
    })
    .optional(),
  pricePerDay: z.number().positive("Price per day must be positive"),
  pricePerKm: z.number().positive().optional(),
  monthlyPrice: z.number().positive().optional(),
  depositRequired: z.number().min(0, "Deposit cannot be negative"),
  unlimitedMileage: z.boolean().default(false),
  withDriver: z.boolean().default(false),
  location: z.string().min(1, "Location is required"),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  availableFrom: z.date().optional(),
  availableUntil: z.date().optional(),

  rentalType: z.nativeEnum(RentalType).default(RentalType.SHORT_TERM),
  driverPricePerDay: z.number().positive().optional(),
  driverPricePerKm: z.number().positive().optional(),
  driverPricePerMonth: z.number().positive().optional(),
  includedKmPerDay: z.number().int().positive().optional(),
  includedKmPerMonth: z.number().int().positive().optional(),
})

export const updateVehicleSchema = createVehicleSchema.partial().extend({
  status: z.nativeEnum(VehicleStatus).optional(),
})

export const vehicleFilterSchema = z.object({
  category: z.nativeEnum(VehicleCategory).optional(),
  type: z.nativeEnum(VehicleType).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  location: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  features: z.array(z.string()).optional(),
  withDriver: z.boolean().optional(),
  rentalType: z.nativeEnum(RentalType).optional(),
})

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>
export type VehicleFilterInput = z.infer<typeof vehicleFilterSchema>

export const adminCreateVehicleSchema = z
  .object({
    // Partner selection - either existing or external
    partnerId: z.string().optional(), // Optional now - can use external partner

    // External partner details (when no partnerId)
    externalPartnerName: z.string().optional(),
    externalPartnerPhone: z.string().optional(),
    externalPartnerEmail: z.string().email().optional().or(z.literal("")),
    externalPartnerWhatsApp: z.string().optional(),
    externalPartnerAddress: z.string().optional(),
    externalPartnerType: z.enum(["individual", "business"]).optional(),

    // Vehicle details - all optional for admin flexibility
    categoryId: z.string().optional(),
    displayName: z.string().optional(),
    make: z.string().optional(),
    model: z.string().optional(),
    year: z.coerce
      .number()
      .int()
      .min(1900)
      .max(new Date().getFullYear() + 1)
      .optional()
      .or(z.literal("")),
    color: z.string().optional(),
    licensePlate: z.string().optional(),
    vehicleType: z.nativeEnum(VehicleType).optional(),
    features: z.array(z.string()).optional(),
    specifications: z
      .object({
        fuelType: z.string().optional(),
        transmission: z.string().optional(),
        seatingCapacity: z.number().optional(),
        mileage: z.number().optional(),
        engineCapacity: z.string().optional(),
      })
      .optional(),

    // Pricing - optional for contact-only vehicles
    pricePerDay: z.coerce.number().positive().optional().or(z.literal("")),
    pricePerKm: z.coerce.number().positive().optional().or(z.literal("")),
    monthlyPrice: z.coerce.number().positive().optional().or(z.literal("")),
    depositRequired: z.coerce.number().min(0).optional().or(z.literal("")),
    unlimitedMileage: z.boolean().default(false),
    withDriver: z.boolean().default(false),
    location: z.string().optional(),
    images: z.array(z.string()).optional().default([]),
    rentalType: z.nativeEnum(RentalType).default(RentalType.SHORT_TERM),
    driverPricePerDay: z.coerce.number().positive().optional().or(z.literal("")),
    driverPricePerKm: z.coerce.number().positive().optional().or(z.literal("")),
    driverPricePerMonth: z.coerce.number().positive().optional().or(z.literal("")),
    includedKmPerDay: z.coerce.number().int().positive().optional().or(z.literal("")),
    includedKmPerMonth: z.coerce.number().int().positive().optional().or(z.literal("")),
    contactOnly: z.boolean().default(true),
    adminNotes: z.string().optional(),
  })
  .refine(
    (data) => {
      // Must have either existing partner or external partner name
      return data.partnerId || data.externalPartnerName
    },
    {
      message: "Either select an existing partner or provide external partner name",
      path: ["partnerId"],
    },
  )
  .refine(
    (data) => {
      // External partner must have at least phone or email
      if (!data.partnerId && data.externalPartnerName) {
        return data.externalPartnerPhone || data.externalPartnerEmail
      }
      return true
    },
    {
      message: "External partner must have at least phone or email",
      path: ["externalPartnerPhone"],
    },
  )

export type AdminCreateVehicleInput = z.infer<typeof adminCreateVehicleSchema>
