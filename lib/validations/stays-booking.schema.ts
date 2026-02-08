import { z } from "zod"

export const createStaysBookingSchema = z
  .object({
    staysId: z.string().min(1, "Property is required"),
    checkIn: z.date(),
    checkOut: z.date(),
    guests: z.coerce.number().int().min(1, "At least 1 guest is required"),
    specialRequests: z.string().optional(),
  })
  .refine((data) => data.checkOut > data.checkIn, {
    message: "Check-out date must be after check-in date",
    path: ["checkOut"],
  })

export const cancelStaysBookingSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  reason: z.string().min(10, "Please provide a reason (at least 10 characters)"),
})

export type CreateStaysBookingInput = z.infer<typeof createStaysBookingSchema>
export type CancelStaysBookingInput = z.infer<typeof cancelStaysBookingSchema>
