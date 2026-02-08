"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Star, Loader2 } from "lucide-react"
import { createReview } from "@/actions/review/create"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const reviewFormSchema = z.object({
  bookingId: z.string().min(1),
  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z.string().min(10, "Comment must be at least 10 characters").optional(),
})

type ReviewFormValues = z.infer<typeof reviewFormSchema>

interface ReviewFormProps {
  bookingId: string
  vehicleName: string
  hasReview?: boolean
}

export function ReviewForm({ bookingId, vehicleName, hasReview }: ReviewFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [hoveredRating, setHoveredRating] = useState(0)

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      bookingId,
      rating: 0,
      comment: "",
    },
  })

  const rating = form.watch("rating")

  async function onSubmit(data: ReviewFormValues) {
    setLoading(true)
    try {
      const result = await createReview(data)

      if (result.success) {
        toast.success("Review submitted successfully!")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to submit review")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (hasReview) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Review Submitted</CardTitle>
          <CardDescription>Thank you for your feedback!</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-400" />
          Rate Your Experience
        </CardTitle>
        <CardDescription>How was your experience with {vehicleName}?</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => field.onChange(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="p-1 transition-transform hover:scale-110"
                        >
                          <Star
                            className={cn(
                              "h-8 w-8 transition-colors",
                              (hoveredRating || rating) >= star
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground",
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment (optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Share your experience..." className="min-h-[100px] resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading || rating === 0} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Review
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
