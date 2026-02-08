"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getPartnerBookings, updateBookingStatus } from "@/actions/partner/bookings"
import { format, differenceInDays } from "date-fns"
import Link from "next/link"
import Image from "next/image"
import {
  Calendar,
  Car,
  MapPin,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  CalendarX,
  ChevronRight,
} from "lucide-react"
import { ErrorState } from "@/components/partner/error-state"
import { EmptyState } from "@/components/partner/empty-state"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Booking {
  id: string
  status: string
  startDate: Date
  endDate: Date
  totalDays: number
  pickupLocation: string
  dropoffLocation: string
  notes: string | null
  withDriver: boolean
  pricing: { total?: number }
  createdAt: Date
  vehicle: {
    make: string
    model: string
    images: string[]
  }
  user: {
    name: string | null
    email: string | null
    phone: string | null
    image: string | null
  } | null
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  CONFIRMED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  ACTIVE: "bg-green-500/10 text-green-600 border-green-500/20",
  COMPLETED: "bg-muted text-muted-foreground",
  CANCELLED: "bg-red-500/10 text-red-600 border-red-500/20",
  REJECTED: "bg-red-500/10 text-red-600 border-red-500/20",
}

export function PartnerBookingsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTab = searchParams.get("status")?.toLowerCase() || "pending"

  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState(initialTab)

  // Action states
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getPartnerBookings()
      if (result.success && result.data) {
        setBookings(result.data as Booking[])
      } else {
        setError(result.error || "Failed to load bookings")
      }
    } catch (err) {
      setError("An error occurred while loading bookings")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const handleStatusUpdate = async (bookingId: string, status: "CONFIRMED" | "REJECTED") => {
    setIsUpdating(true)
    try {
      const result = await updateBookingStatus(bookingId, status)
      if (result.success) {
        toast.success(result.data?.message || `Booking ${status.toLowerCase()} successfully`)
        fetchBookings()
      } else {
        toast.error(result.error || "Failed to update booking")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsUpdating(false)
      setConfirmingId(null)
      setRejectingId(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="flex gap-4">
                <div className="h-20 w-28 rounded-lg bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-48 bg-muted rounded" />
                  <div className="h-4 w-32 bg-muted rounded" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchBookings} />
  }

  const pendingBookings = bookings.filter((b) => b.status === "PENDING")
  const activeBookings = bookings.filter((b) => ["CONFIRMED", "ACTIVE"].includes(b.status))
  const completedBookings = bookings.filter((b) => b.status === "COMPLETED")
  const cancelledBookings = bookings.filter((b) => ["CANCELLED", "REJECTED"].includes(b.status))

  const getTabBookings = (tab: string) => {
    switch (tab) {
      case "pending":
        return pendingBookings
      case "active":
        return activeBookings
      case "completed":
        return completedBookings
      case "cancelled":
        return cancelledBookings
      default:
        return []
    }
  }

  const renderBookingCard = (booking: Booking) => {
    const duration = differenceInDays(new Date(booking.endDate), new Date(booking.startDate))

    return (
      <Card key={booking.id} className="overflow-hidden hover:border-primary/30 transition-colors">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            {/* Vehicle Image */}
            <div className="relative w-full sm:w-40 h-32 sm:h-auto bg-muted flex-shrink-0">
              {booking.vehicle.images?.[0] ? (
                <Image
                  src={booking.vehicle.images[0] || "/placeholder.svg"}
                  alt={`${booking.vehicle.make} ${booking.vehicle.model}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Car className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
              <Badge variant="outline" className={cn("absolute top-2 left-2", statusColors[booking.status])}>
                {booking.status}
              </Badge>
            </div>

            {/* Content */}
            <div className="flex-1 p-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* Main Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {booking.vehicle.make} {booking.vehicle.model}
                  </h3>

                  {/* Customer */}
                  <div className="flex items-center gap-2 mt-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={booking.user?.image || undefined} />
                      <AvatarFallback className="text-xs">{booking.user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{booking.user?.name || "Customer"}</span>
                    {booking.user?.phone && (
                      <a
                        href={`tel:${booking.user.phone}`}
                        className="text-muted-foreground hover:text-foreground"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Phone className="h-3 w-3" />
                      </a>
                    )}
                  </div>

                  {/* Dates & Location */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(new Date(booking.startDate), "MMM d")} - {format(new Date(booking.endDate), "MMM d")}
                    </span>
                    <span>
                      {duration} {duration === 1 ? "day" : "days"}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {booking.pickupLocation}
                    </span>
                  </div>

                  {booking.withDriver && (
                    <Badge variant="secondary" className="mt-2 text-xs">
                      With Driver
                    </Badge>
                  )}

                  {booking.notes && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-1">Note: {booking.notes}</p>
                  )}
                </div>

                {/* Price & Actions */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3">
                  <div className="text-right">
                    <p className="font-bold text-lg">Rs {(booking.pricing?.total || 0)?.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      Booked {format(new Date(booking.createdAt), "MMM d")}
                    </p>
                  </div>

                  {booking.status === "PENDING" ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-transparent text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                        onClick={(e) => {
                          e.preventDefault()
                          setRejectingId(booking.id)
                        }}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          setConfirmingId(booking.id)
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Confirm
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={`/partner/bookings/${booking.id}`}>
                        View
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={CalendarX}
        title="No bookings yet"
        description="When customers book your vehicles, they'll appear here. Make sure your vehicles are listed and available."
        actionLabel="View Vehicles"
        actionHref="/partner/vehicles"
      />
    )
  }

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="pending" className="relative">
            Pending
            {pendingBookings.length > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 min-w-5 px-1.5 text-xs">
                {pendingBookings.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="active">Active ({activeBookings.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedBookings.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({cancelledBookings.length})</TabsTrigger>
        </TabsList>

        {["pending", "active", "completed", "cancelled"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            {getTabBookings(tab).length === 0 ? (
              <Card className="p-12 text-center">
                <div className="flex flex-col items-center">
                  {tab === "pending" && <Clock className="h-12 w-12 text-muted-foreground mb-4" />}
                  {tab === "active" && <Car className="h-12 w-12 text-muted-foreground mb-4" />}
                  {tab === "completed" && <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />}
                  {tab === "cancelled" && <XCircle className="h-12 w-12 text-muted-foreground mb-4" />}
                  <p className="text-muted-foreground">
                    No {tab} bookings
                    {tab === "pending" && ". New booking requests will appear here."}
                  </p>
                </div>
              </Card>
            ) : (
              getTabBookings(tab).map(renderBookingCard)
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Confirm Dialog */}
      <AlertDialog open={!!confirmingId} onOpenChange={() => setConfirmingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              The customer will be notified that their booking has been confirmed. Make sure the vehicle is available.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmingId && handleStatusUpdate(confirmingId, "CONFIRMED")}
              disabled={isUpdating}
            >
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={!!rejectingId} onOpenChange={() => setRejectingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              The customer will be notified that their booking has been rejected. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => rejectingId && handleStatusUpdate(rejectingId, "REJECTED")}
              disabled={isUpdating}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reject Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
