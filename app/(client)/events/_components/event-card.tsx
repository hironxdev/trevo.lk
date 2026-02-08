import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Ticket } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

interface EventCardProps {
  id: string
  slug: string
  titleEn: string
  titleSi?: string
  city: string
  venueName: string
  startAt: Date
  endAt?: Date
  posterUrl?: string
  category?: string
  minPrice?: number
  maxPrice?: number
}

export function EventCard({
  slug,
  titleEn,
  titleSi,
  city,
  venueName,
  startAt,
  posterUrl,
  category,
  minPrice,
  maxPrice,
}: EventCardProps) {
  const formattedDate = format(new Date(startAt), "MMM dd, yyyy")
  const formattedTime = format(new Date(startAt), "h:mm a")

  return (
    <Link href={`/events/${slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        {/* Poster Image */}
        <div className="relative w-full h-48 bg-muted overflow-hidden">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={titleEn}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
              <Ticket className="h-12 w-12 text-gray-300" />
            </div>
          )}
          {category && (
            <Badge className="absolute top-3 right-3 bg-blue-600 hover:bg-blue-700">
              {category}
            </Badge>
          )}
        </div>

        <CardContent className="pt-4 flex flex-col flex-1">
          {/* Title */}
          <h3 className="font-semibold text-base line-clamp-2 mb-2">{titleEn}</h3>

          {/* Sinhala Title */}
          {titleSi && <p className="text-sm text-muted-foreground line-clamp-1 mb-3">{titleSi}</p>}

          {/* Date & Time */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">
              {venueName}, {city}
            </span>
          </div>

          {/* Price Range */}
          {minPrice !== undefined && (
            <div className="flex items-center gap-2 text-sm font-semibold mb-4">
              <Ticket className="h-4 w-4 text-blue-600" />
              <span>
                From Rs. {Math.floor(minPrice).toLocaleString()}
              </span>
            </div>
          )}

          {/* View Details Button */}
          <Button className="w-full mt-auto" variant="default" size="sm">
            View Details
          </Button>
        </CardContent>
      </Card>
    </Link>
  )
}
