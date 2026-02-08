import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import { format } from "date-fns"
import { getVehicleById } from "@/actions/vehicle/info";

type VehicleWithRelations = Awaited<ReturnType<typeof getVehicleById>>["data"];

type VehicleSuccessType = Extract<VehicleWithRelations, { reviews: unknown[] }>;

interface VehicleReviewsProps {
  reviews: VehicleSuccessType["reviews"];
  averageRating: number
}

export function VehicleReviews({ reviews, averageRating }: VehicleReviewsProps) {
  if (reviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No reviews yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Reviews</CardTitle>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="font-bold">{averageRating.toFixed(1)}</span>
            <span className="text-muted-foreground">({reviews.length})</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="space-y-2">
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarImage src={review.user.image || undefined} />
                <AvatarFallback>{review.user.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium">{review.user.name}</p>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {format(new Date(review.createdAt), "MMM d, yyyy")}
                </p>
                {review.comment && <p className="text-sm">{review.comment}</p>}
                {review.response && (
                  <div className="mt-3 pl-4 border-l-2 border-primary">
                    <p className="text-sm font-medium mb-1">Response from owner:</p>
                    <p className="text-sm text-muted-foreground">{review.response}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
