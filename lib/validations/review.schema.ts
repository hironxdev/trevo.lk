import { z } from "zod"

export const createReviewSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  rating: z.number().int().min(1).max(5, "Rating must be between 1 and 5"),
  comment: z.string().min(10, "Comment must be at least 10 characters").optional(),
})

export const respondToReviewSchema = z.object({
  reviewId: z.string().min(1, "Review ID is required"),
  response: z.string().min(10, "Response must be at least 10 characters"),
})

export type CreateReviewInput = z.infer<typeof createReviewSchema>
export type RespondToReviewInput = z.infer<typeof respondToReviewSchema>
