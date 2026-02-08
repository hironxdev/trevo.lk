"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getMyStaysBookings } from "@/actions/stays-booking/list"
import { format } from "date-fns"
import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin, Home, Users, ArrowRight, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { Stays } from "@prisma/client"

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  CONFIRMED: { label: "Confirmed", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  ACTIVE: { label: "Active", color: "bg-green-500/10 text-green-600 border-green-500/20" },
  COMPLETED: { label: "Completed", color: "bg-muted text-muted-foreground" },
  CANCELLED: { label: "Cancelled", color: "bg-red-500/10 text-red-600 border-red-500/20" },
  REJECTED: { label: "Rejected", color: "bg-red-500/10 text-red-600 border-red-500/20" },
}

interface StaysBooking {
  id: string
  status: string
  checkIn: Date
  checkOut: Date
  totalAmount: number
  guestCount: number
  stays: Stays
}

export function StaysBookingsList() {
  const [bookings, setBookings] = useState<StaysBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    async function fetchBookings() {
      try {
        const result = await getMyStaysBookings({})
        if (result.success && result.data) {
          setBookings(result.data.data)
        }
      } catch (err) {
        console.error("Failed to fetch bookings:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  const filterBookings = (status: string) => {
    if (status === "all") return bookings
    if (status === "upcoming") return bookings.filter((b) => ["PENDING", "CONFIRMED"].includes(b.status))
    if (status === "active") return bookings.filter((b) => b.status === "ACTIVE")
    if (status === "completed") return bookings.filter((b) => b.status === "COMPLETED")
    if (status === "cancelled") return bookings.filter((b) => ["CANCELLED", "REJECTED"].includes(b.status))
    return bookings
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <Skeleton className="h-32 w-48 rounded-lg" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const displayedBookings = filterBookings(activeTab)

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-5 mb-6">
        <TabsTrigger value="all">All ({bookings.length})</TabsTrigger>
        <TabsTrigger value="upcoming">
          Upcoming ({bookings.filter((b) => ["PENDING", "CONFIRMED"].includes(b.status)).length})
        </TabsTrigger>
        <TabsTrigger value="active">Active ({bookings.filter((b) => b.status === "ACTIVE").length})</TabsTrigger>
        <TabsTrigger value="completed">
          Completed ({bookings.filter((b) => b.status === "COMPLETED").length})
        </TabsTrigger>
        <TabsTrigger value="cancelled">
          Cancelled ({bookings.filter((b) => ["CANCELLED", "REJECTED"].includes(b.status)).length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value={activeTab} className="space-y-4">
        {displayedBookings.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-2">No bookings found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {activeTab === "all"
                ? "You haven't made any stays bookings yet"
                : `No ${activeTab} bookings at the moment`}
            </p>
            <Button asChild>
              <Link href="/stays">Browse Stays</Link>
            </Button>
          </Card>
        ) : (
          displayedBookings.map((booking) => {
            const status = statusConfig[booking.status] || statusConfig.PENDING
            const nights = Math.ceil(
              (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24),
            )

            return (
              <Card key={booking.id} className="overflow-hidden hover:border-primary/30 transition-colors">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="relative w-full md:w-48 h-48 md:h-auto shrink-0">
                      {booking.stays.images?.[0] ? (
                        <Image
                          src={booking.stays.images[0] || "/placeholder.svg"}
                          alt={booking.stays.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-muted">
                          <Home className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 md:p-6">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{booking.stays.name}</h3>
                          {/* <p className="text-sm text-muted-foreground">{booking.stays.category?.name}</p> */}
                        </div>
                        <Badge variant="outline" className={cn(status.color)}>
                          {status.label}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <div>
                            <p className="font-medium text-foreground">Check-in</p>
                            <p>{format(new Date(booking.checkIn), "MMM d, yyyy")}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <div>
                            <p className="font-medium text-foreground">Check-out</p>
                            <p>{format(new Date(booking.checkOut), "MMM d, yyyy")}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <div>
                            <p className="font-medium text-foreground">Guests</p>
                            <p>{booking.guestCount} guests</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <div>
                            <p className="font-medium text-foreground">Location</p>
                            <p className="truncate">{booking.stays.location}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {nights} night{nights > 1 ? "s" : ""}
                          </p>
                          <p className="text-lg font-bold text-primary">Rs {booking.totalAmount?.toLocaleString()}</p>
                        </div>

                        <div className="flex gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/stays/${booking.stays.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Property
                            </Link>
                          </Button>
                          <Button asChild size="sm">
                            <Link href={`/stays-bookings/${booking.id}`}>
                              Details
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </TabsContent>
    </Tabs>
  )
}
