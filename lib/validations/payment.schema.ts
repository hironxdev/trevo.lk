import { z } from "zod"

export const createPaymentSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  amount: z.number().positive("Amount must be positive"),
  method: z.enum(["CARD", "BANK_TRANSFER", "CASH", "MOBILE_PAYMENT"]),
  transactionId: z.string().optional(),
})

export const verifyPaymentSchema = z.object({
  paymentId: z.string().min(1, "Payment ID is required"),
  transactionId: z.string().min(1, "Transaction ID is required"),
})

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>
