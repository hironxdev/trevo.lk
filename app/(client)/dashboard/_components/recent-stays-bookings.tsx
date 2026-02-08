"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getMyStaysBookings } from "@/actions/stays-booking/list"
import { format } from "date-fns"
import Link from "next/link"
import { Calendar, MapPin, Home, ArrowRight, Clock, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  PENDING: { label: "Pending", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20", icon: Clock },
  CONFIRMED: { label: "Confirmed", color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: Clock },
  ACTIVE: { label: "Active", color: "bg-green-500/10 text-green-600 border-green-500/20", icon: Home },
  COMPLETED: { label: "Completed", color: "bg-muted text-muted-foreground", icon: Home },
  CANCELLED: { label: "Cancelled", color: "bg-red-500/10 text-red-600 border-red-500/20", icon: Clock },
  REJECTED: { label: "Rejected", color: "bg-red-500/10 text-red-600 border-red-500/20", icon: Clock },
}

interface StaysBooking {
  id: string
  status: string
  checkIn: string
  checkOut: string
  totalAmount: number
  guestCount: number
  stays: {
    id: string
    title: string
    location: string
    images: string[]
    category?: { name: string }
  }
}

export function RecentStaysBookings() {
  const [bookings, setBookings] = useState<StaysBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBookings() {
      try {
        const result = await getMyStaysBookings({ limit: 5 })
        if (result.success && result.data) {
          setBookings(result.data.data)
        } else {
          setError(result.error || "Failed to load stays bookings")
        }
      } catch (err) {
        setError("An error occurred while loading stays bookings")
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-8 w-20" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 p-4 rounded-xl border">
              <Skeleton className="h-20 w-28 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6">
        <p className="text-destructive text-center">{error}</p>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg">Recent Stays</CardTitle>
        <Button asChild variant="ghost" size="sm" className="text-primary">
          <Link href="/stays-bookings">
            View All
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-2">No stays booked yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Explore amazing properties for your next getaway</p>
            <Button asChild>
              <Link href="/stays">Browse Stays</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const status = statusConfig[booking.status] || statusConfig.PENDING

              return (
                <Link
                  key={booking.id}
                  href={`/stays-bookings/${booking.id}`}
                  className="flex items-start gap-4 p-4 rounded-xl border hover:border-primary/50 hover:bg-muted/30 transition-colors"
                >
                  {/* Property Image */}
                  <div className="relative h-20 w-28 rounded-lg overflow-hidden bg-muted shrink-0">
                    {booking.stays.images?.[0] ? (
                      <Image
                        src={booking.stays.images[0] || "/placeholder.svg"}
                        alt={booking.stays.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Home className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Booking Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="font-semibold truncate">{booking.stays.title}</h4>
                        <p className="text-xs text-muted-foreground">{booking.stays.category?.name}</p>
                      </div>
                      <Badge variant="outline" className={cn("shrink-0", status.color)}>
                        {status.label}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          {format(new Date(booking.checkIn), "MMM d")} -{" "}
                          {format(new Date(booking.checkOut), "MMM d, yyyy")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="truncate">{booking.stays.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        <span>{booking.guestCount} guests</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
