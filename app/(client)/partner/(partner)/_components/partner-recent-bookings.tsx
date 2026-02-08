"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getPartnerBookings } from "@/actions/partner/bookings"
import { format } from "date-fns"
import Link from "next/link"
import { Calendar, User } from "lucide-react"
import { RecentBookingsSkeleton } from "@/components/ui/skeletons"

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  CONFIRMED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  ACTIVE: "bg-green-500/10 text-green-600 border-green-500/20",
  COMPLETED: "bg-muted text-muted-foreground",
  CANCELLED: "bg-red-500/10 text-red-600 border-red-500/20",
  REJECTED: "bg-red-500/10 text-red-600 border-red-500/20",
}

interface Booking {
  id: string
  status: string
  startDate: string
  endDate: string
  totalAmount: number
  vehicle: {
    make: string
    model: string
  }
  user: {
    name: string
    email: string
  }
}

export function PartnerRecentBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBookings() {
      try {
        const result = await getPartnerBookings()
        if (result.success && result.data) {
          setBookings(
            result.data.slice(0, 5).map((b) => ({
              id: b.id,
              status: b.status,
              startDate: (b.startDate instanceof Date ? b.startDate.toISOString() : b.startDate) ?? "",
              endDate: (b.endDate instanceof Date ? b.endDate.toISOString() : b.endDate) ?? "",
              totalAmount: Array.isArray(b.payments)
                ? b.payments.reduce((sum: number, p) => sum + (p.amount || 0), 0)
                : 0,
              vehicle: {
                make: b.vehicle?.make ?? "",
                model: b.vehicle?.model ?? "",
              },
              user: {
                name: b.user?.name ?? "",
                email: b.user?.email ?? "",
              },
            })),
          )
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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Bookings</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link href="/partner/bookings">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No bookings yet</p>
            <p className="text-sm mt-1">Bookings will appear here when customers rent your vehicles</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Link
                key={booking.id}
                href={`/partner/bookings/${booking.id}`}
                className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">
                        {booking.vehicle.make} {booking.vehicle.model}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{booking.user.name}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className={statusColors[booking.status]}>
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(booking.startDate), "MMM d")} - {format(new Date(booking.endDate), "MMM d")}
                      </span>
                    </div>
                    <span className="font-medium">Rs {booking.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
