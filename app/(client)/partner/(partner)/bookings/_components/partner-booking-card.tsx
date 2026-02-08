"use client"

import Image from "next/image"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, MapPin, Phone, Mail, CheckCircle, XCircle, Clock, User, LucideProps } from "lucide-react"
import { ForwardRefExoticComponent, RefAttributes, useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getPartnerBookings, updateBookingStatus } from "@/actions/partner/bookings"
import { JsonValue } from "@prisma/client/runtime/library"

type Booking = Awaited<ReturnType<typeof getPartnerBookings>>["data"]

type BookingSuccess = NonNullable<Booking>[number]

interface PartnerBookingCardProps {
  booking: BookingSuccess
}

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon:ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>> }
> = {
  PENDING: { label: "Pending", variant: "secondary", icon: Clock },
  CONFIRMED: { label: "Confirmed", variant: "default", icon: CheckCircle },
  ACTIVE: { label: "Active", variant: "default", icon: CheckCircle },
  COMPLETED: { label: "Completed", variant: "outline", icon: CheckCircle },
  CANCELLED: { label: "Cancelled", variant: "destructive", icon: XCircle },
  REJECTED: { label: "Rejected", variant: "destructive", icon: XCircle },
}

export function PartnerBookingCard({ booking }: PartnerBookingCardProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const status = statusConfig[booking.status] || { label: booking.status, variant: "secondary" as const, icon: Clock }
  const StatusIcon = status.icon

  const handleStatusUpdate = async (newStatus: "CONFIRMED" | "REJECTED" | "COMPLETED") => {
    setIsUpdating(true)
    try {
      const result = await updateBookingStatus(booking.id, newStatus)
      if (result.success) {
        toast.success(`Booking ${newStatus.toLowerCase()} successfully`)
        router.refresh()
      } else {
        toast.error(result.error || "Failed to update booking")
      }
    } catch {
      toast.error("An error occurred")
    } finally {
      setIsUpdating(false)
    }
  }

  const isPending = booking.status === "PENDING"
  const isActive = ["CONFIRMED", "ACTIVE"].includes(booking.status)

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row">
          {/* Vehicle Image */}
          <div className="relative w-full lg:w-48 h-40 lg:h-auto shrink-0">
            <Image
              src={booking.vehicle.images?.[0] || "/placeholder.svg?height=200&width=300&query=car"}
              alt={`${booking.vehicle.make} ${booking.vehicle.model}`}
              fill
              className="object-cover"
            />
          </div>

          {/* Booking Details */}
          <div className="flex-1 p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="space-y-3 flex-1">
                {/* Vehicle & Status */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-lg">
                    {booking.vehicle.make} {booking.vehicle.model} {booking.vehicle.year}
                  </span>
                  <Badge variant={status.variant} className="flex items-center gap-1">
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </Badge>
                </div>

                {/* Customer Info */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={booking.user?.image || "/placeholder.svg"} />
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{booking.user?.name}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      {booking.user?.phone && (
                        <a href={`tel:${booking.user?.phone}`} className="flex items-center gap-1 hover:text-primary">
                          <Phone className="h-3 w-3" />
                          {booking.user?.phone}
                        </a>
                      )}
                      <a href={`mailto:${booking.user?.email}`} className="flex items-center gap-1 hover:text-primary">
                        <Mail className="h-3 w-3" />
                        {booking.user?.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {format(new Date(booking.startDate), "MMM d")} -{" "}
                      {format(new Date(booking.endDate), "MMM d, yyyy")}
                    </span>
                  </div>
                  <span className="text-muted-foreground">({booking.totalDays} days)</span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{booking.pickupLocation}</span>
                </div>
              </div>

              {/* Pricing & Actions */}
              <div className="flex flex-col items-start lg:items-end gap-3">
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    Rs.
                    {typeof booking.pricing === "object" && booking.pricing !== null && "total" in booking.pricing
                      ? (booking.pricing as { total: number }).total?.toLocaleString()
                      : "--"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Deposit: Rs.
                    {typeof booking.pricing === "object" && booking.pricing !== null && "deposit" in booking.pricing
                      ? (booking.pricing as { deposit: number }).deposit?.toLocaleString()
                      : "--"}
                  </p>
                </div>

                {/* Actions */}
                {isPending && (
                  <div className="flex gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="default" size="sm" disabled={isUpdating}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Confirm
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Booking?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will confirm the booking and notify the customer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleStatusUpdate("CONFIRMED")}>
                            Confirm Booking
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" disabled={isUpdating}>
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reject Booking?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will reject the booking and notify the customer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleStatusUpdate("REJECTED")}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Reject Booking
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}

                {isActive && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" disabled={isUpdating}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Mark Complete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Complete Booking?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will mark the booking as completed. Make sure the vehicle has been returned.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleStatusUpdate("COMPLETED")}>
                          Complete Booking
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
