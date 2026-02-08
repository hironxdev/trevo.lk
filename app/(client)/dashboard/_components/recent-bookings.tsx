"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getMyBookings } from "@/actions/booking/list"
import { format } from "date-fns"
import Link from "next/link"
import { Calendar, MapPin, Car, ArrowRight, Clock } from "lucide-react"
import { RecentBookingsSkeleton } from "@/components/ui/skeletons"
import { cn } from "@/lib/utils"
import Image from "next/image"

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  PENDING: { label: "Pending", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20", icon: Clock },
  CONFIRMED: { label: "Confirmed", color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: Clock },
  ACTIVE: { label: "Active", color: "bg-green-500/10 text-green-600 border-green-500/20", icon: Car },
  COMPLETED: { label: "Completed", color: "bg-muted text-muted-foreground", icon: Car },
  CANCELLED: { label: "Cancelled", color: "bg-red-500/10 text-red-600 border-red-500/20", icon: Clock },
  REJECTED: { label: "Rejected", color: "bg-red-500/10 text-red-600 border-red-500/20", icon: Clock },
}

interface Booking {
  id: string
  status: string
  startDate: string
  endDate: string
  pickupLocation: string
  totalAmount: number
  vehicle: {
    make: string
    model: string
    images: string[]
    category: { name: string }
  }
}

export function RecentBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBookings() {
      try {
        const result = await getMyBookings({ limit: 5 })
        if (result.success && result.data) {
          setBookings(result.data.data)
        } else {
          setError(result.error || "Failed to load bookings")
        }
      } catch (err) {
        setError("An error occurred while loading bookings")
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  if (loading) {
    return <RecentBookingsSkeleton />
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
        <CardTitle className="text-lg">Recent Bookings</CardTitle>
        <Button asChild variant="ghost" size="sm" className="text-primary">
          <Link href="/bookings">
            View All
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-2">No bookings yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Start exploring vehicles to book your first ride</p>
            <Button asChild>
              <Link href="/vehicles">Browse Vehicles</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const status = statusConfig[booking.status] || statusConfig.PENDING

              return (
                <Link
                  key={booking.id}
                  href={`/bookings/${booking.id}`}
                  className="flex items-start gap-4 p-4 rounded-xl border hover:border-primary/50 hover:bg-muted/30 transition-colors"
                >
                  {/* Vehicle Image */}
                  <div className="relative h-20 w-28 rounded-lg overflow-hidden bg-muted shrink-0">
                    {booking.vehicle.images?.[0] ? (
                      <Image
                        src={booking.vehicle.images[0] || "/placeholder.svg"}
                        alt={`${booking.vehicle.make} ${booking.vehicle.model}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Car className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Booking Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="font-semibold truncate">
                          {booking.vehicle.make} {booking.vehicle.model}
                        </h4>
                        <p className="text-xs text-muted-foreground">{booking.vehicle.category.name}</p>
                      </div>
                      <Badge variant="outline" className={cn("shrink-0", status.color)}>
                        {status.label}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          {format(new Date(booking.startDate), "MMM d")} -{" "}
                          {format(new Date(booking.endDate), "MMM d, yyyy")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="truncate">{booking.pickupLocation}</span>
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
