import { getBookingById } from "@/actions/booking/list"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, Phone, Mail, Car, CreditCard, ArrowLeft, User } from "lucide-react"
import { ReviewForm } from "@/components/review-form"

interface BookingDetailsProps {
  bookingId: string
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PENDING: { label: "Pending Confirmation", variant: "secondary" },
  CONFIRMED: { label: "Confirmed", variant: "default" },
  ACTIVE: { label: "Active", variant: "default" },
  COMPLETED: { label: "Completed", variant: "outline" },
  CANCELLED: { label: "Cancelled", variant: "destructive" },
  REJECTED: { label: "Rejected", variant: "destructive" },
}

export async function BookingDetails({ bookingId }: BookingDetailsProps) {
  const result = await getBookingById(bookingId)

  if (!result.success || !result.data) {
    notFound()
  }

  const booking = result.data
  const status = statusConfig[booking.status] || { label: booking.status, variant: "secondary" as const }
  const pricing = booking.pricing as {
    dailyRate: number
    totalDays: number
    subtotal: number
    deposit: number
    total: number
  }

  const hasReview = !!(booking as any).review

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/bookings">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bookings
          </Link>
        </Button>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">Booking Details</h1>
            <p className="text-muted-foreground text-sm">Booking #{booking.id.slice(-8).toUpperCase()}</p>
          </div>
          <Badge variant={status.variant} className="text-sm px-3 py-1">
            {status.label}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vehicle Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Vehicle Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative w-full md:w-48 h-36 rounded-lg overflow-hidden shrink-0">
                <Image
                  src={booking.vehicle.images?.[0] || "/placeholder.svg?height=200&width=300&query=car"}
                  alt={`${booking.vehicle.make} ${booking.vehicle.model}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-2">
                <Link
                  href={`/vehicles/${booking.vehicle.id}`}
                  className="text-xl font-semibold hover:text-primary transition-colors"
                >
                  {booking.vehicle.make} {booking.vehicle.model} {booking.vehicle.year}
                </Link>
                <p className="text-sm text-muted-foreground">{booking.vehicle.category.name}</p>
                <p className="text-sm">
                  Provided by:{" "}
                  <span className="font-medium">
                    {booking.vehicle.partner.businessName || booking.vehicle.partner.user.name}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Daily Rate</span>
              <span>Rs.{pricing.dailyRate?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Duration</span>
              <span>{pricing.totalDays || booking.totalDays} days</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>Rs.{pricing.subtotal?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Deposit</span>
              <span>Rs.{pricing.deposit?.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-primary">Rs.{pricing.total?.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Dates & Location */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Schedule & Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Pickup Date</p>
                <p className="font-medium">{format(new Date(booking.startDate), "EEEE, MMMM d, yyyy")}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Return Date</p>
                <p className="font-medium">{format(new Date(booking.endDate), "EEEE, MMMM d, yyyy")}</p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  Pickup Location
                </p>
                <p className="font-medium">{booking.pickupLocation}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  Drop-off Location
                </p>
                <p className="font-medium">{booking.dropoffLocation}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Partner Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{booking.vehicle.partner.user.name}</span>
            </div>
            {booking.vehicle.partner.user.phone && (
              <a
                href={`tel:${booking.vehicle.partner.user.phone}`}
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <Phone className="h-4 w-4" />
                {booking.vehicle.partner.user.phone}
              </a>
            )}
            {booking.vehicle.partner.user.email && (
              <a
                href={`mailto:${booking.vehicle.partner.user.email}`}
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <Mail className="h-4 w-4" />
                {booking.vehicle.partner.user.email}
              </a>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      {booking.notes && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{booking.notes}</p>
          </CardContent>
        </Card>
      )}

      {booking.status === "COMPLETED" && (
        <div className="mt-6">
          <ReviewForm
            bookingId={booking.id}
            vehicleName={`${booking.vehicle.make} ${booking.vehicle.model}`}
            hasReview={hasReview}
          />
        </div>
      )}
    </div>
  )
}
