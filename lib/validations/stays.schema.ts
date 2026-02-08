import { z } from "zod"
import { StaysType, VehicleStatus, StaysCategoryType } from "@prisma/client"

// Common amenities for stays
export const STAYS_AMENITIES = [
  "WiFi",
  "Air Conditioning",
  "Hot Water",
  "Kitchen",
  "TV",
  "Washing Machine",
  "Parking",
  "Pool",
  "Garden",
  "Balcony",
  "Beach Access",
  "Mountain View",
  "BBQ",
  "Gym",
  "Security",
  "CCTV",
  "Generator Backup",
  "Elevator",
  "Wheelchair Accessible",
  "Pet Friendly",
] as const

export const createStaysSchema = z.object({
  categoryId: z.string().optional(),
  name: z.string().min(3, "Property name must be at least 3 characters"),
  description: z.string().min(20, "Description must be at least 20 characters").optional(),
  staysType: z.nativeEnum(StaysType),

  // Location
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  district: z.string().optional(),
  location: z.string().optional(),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),

  // Capacity
  bedrooms: z.coerce.number().int().min(0, "Bedrooms cannot be negative"),
  bathrooms: z.coerce.number().int().min(1, "At least 1 bathroom is required"),
  maxGuests: z.coerce.number().int().min(1, "At least 1 guest capacity is required"),
  beds: z.coerce.number().int().min(0).optional(),

  // Amenities & Features
  amenities: z.array(z.string()).default([]),
  houseRules: z.array(z.string()).default([]),
  features: z.record(z.any()).optional(),

  // Pricing
  pricePerNight: z.coerce.number().positive("Price per night must be positive"),
  pricePerWeek: z.coerce.number().positive().optional().or(z.literal("")),
  pricePerMonth: z.coerce.number().positive().optional().or(z.literal("")),
  cleaningFee: z.coerce.number().min(0).optional().or(z.literal("")),
  depositRequired: z.coerce.number().min(0, "Deposit cannot be negative"),

  // Availability
  availableFrom: z.date().optional(),
  availableUntil: z.date().optional(),
  minNights: z.coerce.number().int().min(1).default(1),
  maxNights: z.coerce.number().int().positive().optional(),

  // Media
  images: z.array(z.string().url()).min(1, "At least one image is required"),
})

export const updateStaysSchema = createStaysSchema.partial().extend({
  status: z.nativeEnum(VehicleStatus).optional(),
})

export const staysFilterSchema = z.object({
  category: z.nativeEnum(StaysCategoryType).optional(),
  type: z.nativeEnum(StaysType).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  guests: z.number().optional(),
  bedrooms: z.number().optional(),
  amenities: z.array(z.string()).optional(),
  checkIn: z.date().optional(),
  checkOut: z.date().optional(),
})

export const adminCreateStaysSchema = z
  .object({
    // Partner selection
    partnerId: z.string().optional(),

    // External partner details
    externalPartnerName: z.string().optional(),
    externalPartnerPhone: z.string().optional(),
    externalPartnerEmail: z.string().email().optional().or(z.literal("")),
    externalPartnerWhatsApp: z.string().optional(),
    externalPartnerAddress: z.string().optional(),
    externalPartnerType: z.enum(["individual", "business"]).optional(),

    // Property details
    categoryId: z.string().optional(),
    name: z.string().min(1, "Property name is required"),
    description: z.string().optional(),
    staysType: z.nativeEnum(StaysType),

    // Location
    address: z.string().optional(),
    city: z.string().min(1, "City is required"),
    district: z.string().optional(),
    location: z.string().optional(),
    coordinates: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .optional(),

    // Capacity
    bedrooms: z.coerce.number().int().min(0).default(1),
    bathrooms: z.coerce.number().int().min(0).default(1),
    maxGuests: z.coerce.number().int().min(1).default(2),
    beds: z.coerce.number().int().min(0).optional(),

    // Amenities
    amenities: z.array(z.string()).default([]),
    houseRules: z.array(z.string()).default([]),

    // Pricing
    pricePerNight: z.coerce.number().positive().optional().or(z.literal("")),
    pricePerWeek: z.coerce.number().positive().optional().or(z.literal("")),
    pricePerMonth: z.coerce.number().positive().optional().or(z.literal("")),
    cleaningFee: z.coerce.number().min(0).optional().or(z.literal("")),
    depositRequired: z.coerce.number().min(0).optional().or(z.literal("")),

    // Availability
    minNights: z.coerce.number().int().min(1).default(1),
    maxNights: z.coerce.number().int().positive().optional(),

    // Media
    images: z.array(z.string()).default([]),

    // Admin options
    contactOnly: z.boolean().default(true),
    adminNotes: z.string().optional(),
  })
  .refine(
    (data) => {
      return data.partnerId || data.externalPartnerName
    },
    {
      message: "Either select an existing partner or provide external partner name",
      path: ["partnerId"],
    },
  )
  .refine(
    (data) => {
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

export type CreateStaysInput = z.infer<typeof createStaysSchema>
export type UpdateStaysInput = z.infer<typeof updateStaysSchema>
export type StaysFilterInput = z.infer<typeof staysFilterSchema>
export type AdminCreateStaysInput = z.infer<typeof adminCreateStaysSchema>
