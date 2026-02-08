import { z } from "zod"
import { RentalType } from "@prisma/client"

export const createBookingSchema = z
  .object({
    vehicleId: z.string().min(1, "Vehicle is required"),
    startDate: z.date(),
    endDate: z.date(),
    pickupLocation: z.string().min(1, "Pickup location is required"),
    dropoffLocation: z.string().optional(), // Made optional for driver rentals
    notes: z.string().optional(),
    withDriver: z.boolean().default(false),
    rentalType: z.nativeEnum(RentalType).default(RentalType.SHORT_TERM),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  })
  .refine(
    (data) => {
      // Long-term rentals must be at least 30 days
      if (data.rentalType === RentalType.LONG_TERM) {
        const diffTime = Math.abs(data.endDate.getTime() - data.startDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays >= 30
      }
      return true
    },
    {
      message: "Long-term rentals must be at least 30 days (1 month)",
      path: ["endDate"],
    },
  )

export const cancelBookingSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  reason: z.string().min(10, "Please provide a reason (at least 10 characters)"),
})

export type CreateBookingInput = z.infer<typeof createBookingSchema>
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>
