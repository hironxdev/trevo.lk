"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import Link from "next/link"
import { format, differenceInDays } from "date-fns"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  Car,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  MessageSquare,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react"
import { updateBookingStatus } from "@/actions/partner/bookings"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface BookingDetailContentProps {
  booking: {
    id: string
    status: string
    startDate: Date
    endDate: Date
    totalDays: number
    pickupLocation: string
    dropoffLocation: string
    notes: string | null
    cancelReason: string | null
    depositPaid: number
    depositRefunded: boolean
    withDriver: boolean
    rentalType: string | null
    pricing: Record<string, number>
    createdAt: Date
    vehicle: {
      id: string
      make: string
      model: string
      year: number
      licensePlate: string
      location: string
      images: string[]
      category: { name: string } | null
    }
    user: {
      name: string | null
      email: string | null
      phone: string | null
      image: string | null
    } | null
    payments: Array<{
      id: string
      amount: number
      status: string
      paidAt: Date | null
    }>
  }
}

const statusConfig: Record<string, { color: string; icon: typeof Clock; label: string }> = {
  PENDING: { color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20", icon: Clock, label: "Pending Approval" },
  CONFIRMED: { color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: CheckCircle, label: "Confirmed" },
  ACTIVE: { color: "bg-green-500/10 text-green-600 border-green-500/20", icon: Car, label: "Active" },
  COMPLETED: { color: "bg-muted text-muted-foreground", icon: CheckCircle, label: "Completed" },
  CANCELLED: { color: "bg-red-500/10 text-red-600 border-red-500/20", icon: XCircle, label: "Cancelled" },
  REJECTED: { color: "bg-red-500/10 text-red-600 border-red-500/20", icon: XCircle, label: "Rejected" },
}

export function BookingDetailContent({ booking }: BookingDetailContentProps) {
  const router = useRouter()
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [copied, setCopied] = useState(false)

  const totalPaid = booking.payments.reduce((sum, payment) => sum + (payment.amount || 0), 0)
  const duration = differenceInDays(new Date(booking.endDate), new Date(booking.startDate))
  const StatusIcon = statusConfig[booking.status]?.icon || Clock

  const handleStatusUpdate = async (status: "CONFIRMED" | "REJECTED" | "COMPLETED") => {
    setIsUpdating(true)
    try {
      const result = await updateBookingStatus(booking.id, status)
      if (result.success) {
        toast.success(result.data?.message || `Booking ${status.toLowerCase()} successfully`)
        router.refresh()
      } else {
        toast.error(result.error || "Failed to update booking")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsUpdating(false)
      setConfirmDialogOpen(false)
      setRejectDialogOpen(false)
      setCompleteDialogOpen(false)
    }
  }

  const copyBookingId = () => {
    navigator.clipboard.writeText(booking.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="flex-shrink-0">
            <Link href="/partner/bookings">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Booking Details</h1>
              <Badge variant="outline" className={cn("ml-2", statusConfig[booking.status]?.color)}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusConfig[booking.status]?.label || booking.status}
              </Badge>
            </div>
            <button
              onClick={copyBookingId}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ID: {booking.id.slice(0, 8)}...
              {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          {booking.status === "PENDING" && (
            <>
              <Button
                variant="outline"
                className="bg-transparent text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => setRejectDialogOpen(true)}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button onClick={() => setConfirmDialogOpen(true)}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Booking
              </Button>
            </>
          )}
          {booking.status === "ACTIVE" && (
            <Button onClick={() => setCompleteDialogOpen(true)}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Completed
            </Button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vehicle Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Car className="h-5 w-5" />
                Vehicle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
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
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {booking.vehicle.make} {booking.vehicle.model}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {booking.vehicle.year} • {booking.vehicle.category?.name}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/vehicles/${booking.vehicle.id}`}>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>Plate: {booking.vehicle.licensePlate}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {booking.vehicle.location}
                    </span>
                  </div>
                  {booking.withDriver && (
                    <Badge variant="secondary" className="mt-2">
                      With Driver
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={booking.user?.image || undefined} />
                  <AvatarFallback>{booking.user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <p className="font-semibold">{booking.user?.name || "Customer"}</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    {booking.user?.email && (
                      <a
                        href={`mailto:${booking.user.email}`}
                        className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                      >
                        <Mail className="h-4 w-4" />
                        {booking.user.email}
                      </a>
                    )}
                    {booking.user?.phone && (
                      <a
                        href={`tel:${booking.user.phone}`}
                        className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                      >
                        <Phone className="h-4 w-4" />
                        {booking.user.phone}
                      </a>
                    )}
                  </div>
                </div>
                {booking.user?.phone && (
                  <Button variant="outline" size="sm" asChild className="bg-transparent">
                    <a href={`https://wa.me/${booking.user.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      WhatsApp
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Rental Details */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5" />
                Rental Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Pickup</p>
                  <p className="font-semibold">{format(new Date(booking.startDate), "EEE, MMM d, yyyy")}</p>
                  <p className="text-sm flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {booking.pickupLocation}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Return</p>
                  <p className="font-semibold">{format(new Date(booking.endDate), "EEE, MMM d, yyyy")}</p>
                  <p className="text-sm flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {booking.dropoffLocation}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-semibold text-lg">
                    {duration} {duration === 1 ? "day" : "days"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rental Type</p>
                  <Badge variant="outline">{booking.rentalType || "SHORT_TERM"}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Booked On</p>
                  <p className="font-medium">{format(new Date(booking.createdAt), "MMM d, yyyy")}</p>
                </div>
              </div>

              {booking.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium mb-2">Customer Notes</p>
                    <p className="text-sm text-muted-foreground p-3 rounded-lg bg-muted/50">{booking.notes}</p>
                  </div>
                </>
              )}

              {booking.cancelReason && (
                <>
                  <Separator />
                  <div className="p-3 rounded-lg bg-red-50 border border-red-100">
                    <p className="text-sm font-medium text-red-600 mb-1">Cancellation Reason</p>
                    <p className="text-sm text-red-700">{booking.cancelReason}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Payment Info */}
        <div className="space-y-6">
          {/* Payment Summary */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-5 w-5" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {booking.pricing && (
                <div className="space-y-2">
                  {booking.pricing.basePrice && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Base Price</span>
                      <span>Rs {booking.pricing.basePrice?.toLocaleString()}</span>
                    </div>
                  )}
                  {booking.pricing.driverCost && booking.pricing.driverCost > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Driver Cost</span>
                      <span>Rs {booking.pricing.driverCost?.toLocaleString()}</span>
                    </div>
                  )}
                  {booking.pricing.serviceFee && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Service Fee</span>
                      <span>Rs {booking.pricing.serviceFee?.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>Rs {(booking.pricing?.total || 0)?.toLocaleString()}</span>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Deposit (Refundable)</span>
                  <span>Rs {booking.depositPaid?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Paid</span>
                  <span className="text-green-600 font-medium">Rs {totalPaid?.toLocaleString()}</span>
                </div>
                {booking.depositRefunded && (
                  <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                    Deposit Refunded
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          {booking.payments.length > 0 && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5" />
                  Payment History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {booking.payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium">Rs {payment.amount?.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">
                          {payment.paidAt ? format(new Date(payment.paidAt), "MMM d, yyyy 'at' h:mm a") : "Pending"}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          payment.status === "COMPLETED" && "bg-green-500/10 text-green-600 border-green-500/20",
                          payment.status === "FAILED" && "bg-red-500/10 text-red-600 border-red-500/20",
                          payment.status === "PENDING" && "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
                        )}
                      >
                        {payment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status Timeline Hint */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Status Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-yellow-500 mt-1.5" />
                <div>
                  <p className="font-medium">Pending</p>
                  <p className="text-muted-foreground">Waiting for your approval</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5" />
                <div>
                  <p className="font-medium">Confirmed</p>
                  <p className="text-muted-foreground">Booking confirmed, awaiting pickup</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5" />
                <div>
                  <p className="font-medium">Active</p>
                  <p className="text-muted-foreground">Vehicle is with customer</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-muted-foreground mt-1.5" />
                <div>
                  <p className="font-medium">Completed</p>
                  <p className="text-muted-foreground">Rental finished successfully</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirm Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              The customer will be notified that their booking has been confirmed. Make sure the vehicle is available
              for the requested dates.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleStatusUpdate("CONFIRMED")} disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              The customer will be notified that their booking request has been rejected. You may provide a reason
              below.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="rejectReason">Reason (optional)</Label>
            <Textarea
              id="rejectReason"
              placeholder="e.g., Vehicle not available for these dates"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="mt-2"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleStatusUpdate("REJECTED")}
              disabled={isUpdating}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reject Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Complete Dialog */}
      <AlertDialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark booking as completed?</AlertDialogTitle>
            <AlertDialogDescription>
              This indicates that the rental has finished and the vehicle has been returned. The customer will be
              notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleStatusUpdate("COMPLETED")} disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Mark as Completed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
