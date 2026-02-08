"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { format, differenceInDays } from "date-fns"
import Link from "next/link"
import Image from "next/image"
import {
  Calendar,
  MapPin,
  Home,
  Users,
  Clock,
  Phone,
  Mail,
  MessageSquare,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

const statusConfig: Record<string, { label: string; color: string; description: string }> = {
  PENDING: {
    label: "Pending",
    color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    description: "Waiting for host confirmation",
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    description: "Your booking is confirmed",
  },
  ACTIVE: {
    label: "Active",
    color: "bg-green-500/10 text-green-600 border-green-500/20",
    description: "You are currently staying",
  },
  COMPLETED: { label: "Completed", color: "bg-muted text-muted-foreground", description: "Stay completed" },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-500/10 text-red-600 border-red-500/20",
    description: "Booking was cancelled",
  },
  REJECTED: {
    label: "Rejected",
    color: "bg-red-500/10 text-red-600 border-red-500/20",
    description: "Booking was rejected by host",
  },
}

interface StaysBookingDetailsProps {
  booking: any
}

export function StaysBookingDetails({ booking }: StaysBookingDetailsProps) {
  const status = statusConfig[booking.status] || statusConfig.PENDING
  const nights = differenceInDays(new Date(booking.checkOut), new Date(booking.checkIn))
  const property = booking.stays

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/stays-bookings">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My Stays
        </Link>
      </Button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Booking Details</h1>
          <p className="text-muted-foreground">Booking ID: {booking.id.slice(0, 8).toUpperCase()}</p>
        </div>
        <Badge variant="outline" className={cn("text-sm px-4 py-2", status.color)}>
          {status.label}
        </Badge>
      </div>

      {/* Status Alert */}
      <Card
        className={cn(
          "mb-6",
          booking.status === "CONFIRMED" && "border-blue-500/30 bg-blue-500/5",
          booking.status === "ACTIVE" && "border-green-500/30 bg-green-500/5",
          booking.status === "PENDING" && "border-yellow-500/30 bg-yellow-500/5",
        )}
      >
        <CardContent className="flex items-center gap-4 py-4">
          {booking.status === "CONFIRMED" || booking.status === "ACTIVE" ? (
            <CheckCircle className="h-6 w-6 text-green-600" />
          ) : (
            <AlertCircle className="h-6 w-6 text-yellow-600" />
          )}
          <div>
            <p className="font-medium">{status.description}</p>
            {booking.status === "CONFIRMED" && (
              <p className="text-sm text-muted-foreground">
                Check-in on {format(new Date(booking.checkIn), "EEEE, MMMM d, yyyy")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property Card */}
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="relative w-32 h-24 rounded-lg overflow-hidden shrink-0">
                  {property.images?.[0] ? (
                    <Image
                      src={property.images[0] || "/placeholder.svg"}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-muted">
                      <Home className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{property.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{property.category?.name}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {property.location}
                  </div>
                </div>
              </div>

              {(booking.status === "CONFIRMED" || booking.status === "ACTIVE") && property.address && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-1">Full Address</p>
                  <p className="text-sm text-muted-foreground">{property.address}</p>
                </div>
              )}

              <div className="mt-4">
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href={`/stays/${property.id}`}>View Property Details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stay Details */}
          <Card>
            <CardHeader>
              <CardTitle>Stay Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Check-in</p>
                    <p className="font-medium">{format(new Date(booking.checkIn), "EEE, MMM d, yyyy")}</p>
                    <p className="text-sm text-muted-foreground">After {property.checkInTime || "14:00"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Check-out</p>
                    <p className="font-medium">{format(new Date(booking.checkOut), "EEE, MMM d, yyyy")}</p>
                    <p className="text-sm text-muted-foreground">Before {property.checkOutTime || "11:00"}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Guests</p>
                    <p className="font-medium">{booking.guestCount} guests</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">
                      {nights} night{nights > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>

              {booking.specialRequests && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Special Requests</p>
                    <p className="text-sm">{booking.specialRequests}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Host Contact - Only show for confirmed bookings */}
          {(booking.status === "CONFIRMED" || booking.status === "ACTIVE") && property.partner && (
            <Card>
              <CardHeader>
                <CardTitle>Host Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">
                      {(property.partner.businessName || property.partner.fullName || "H").charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{property.partner.businessName || property.partner.fullName}</p>
                    <p className="text-sm text-muted-foreground">Property Host</p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  {property.partner.phone && (
                    <Button variant="outline" size="sm" className="bg-transparent" asChild>
                      <a href={`tel:${property.partner.phone}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </a>
                    </Button>
                  )}
                  {property.partner.email && (
                    <Button variant="outline" size="sm" className="bg-transparent" asChild>
                      <a href={`mailto:${property.partner.email}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </a>
                    </Button>
                  )}
                  {property.contactWhatsApp && (
                    <Button variant="outline" size="sm" className="bg-transparent" asChild>
                      <a
                        href={`https://wa.me/${property.contactWhatsApp.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        WhatsApp
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pricing Sidebar */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Rs {property.pricePerNight?.toLocaleString()} x {nights} nights
                  </span>
                  <span>Rs {booking.pricing?.baseAmount?.toLocaleString()}</span>
                </div>

                {booking.pricing?.cleaningFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cleaning fee</span>
                    <span>Rs {booking.pricing.cleaningFee?.toLocaleString()}</span>
                  </div>
                )}

                {booking.pricing?.serviceFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service fee</span>
                    <span>Rs {booking.pricing.serviceFee?.toLocaleString()}</span>
                  </div>
                )}

                {booking.pricing?.securityDeposit > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Security deposit (refundable)</span>
                    <span>Rs {booking.pricing.securityDeposit?.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-primary">Rs {booking.totalAmount?.toLocaleString()}</span>
              </div>

              {booking.paymentStatus && (
                <Badge
                  variant="outline"
                  className={cn(
                    "w-full justify-center py-2",
                    booking.paymentStatus === "PAID" && "bg-green-500/10 text-green-600 border-green-500/20",
                    booking.paymentStatus === "PENDING" && "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
                  )}
                >
                  Payment: {booking.paymentStatus}
                </Badge>
              )}

              <p className="text-xs text-muted-foreground text-center">
                Booked on {format(new Date(booking.createdAt), "MMM d, yyyy")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
