"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { createBooking } from "@/actions/booking/create"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, AlertCircle, CalendarIcon, UserRound, Info, Clock, CalendarDays, Car } from "lucide-react"
import { format, differenceInDays, isWithinInterval } from "date-fns"
import type { getVehicleById } from "@/actions/vehicle/info"
import { RentalType } from "@prisma/client"
import {
  calculateBookingPrice,
  calculateMonths,
  isValidRentalDuration,
  type PricingBreakdown,
} from "@/lib/utils/pricing-calculator"

type getVehicleByIdReturnType = Awaited<ReturnType<typeof getVehicleById>>["data"]

type VehicleSuccessType = Extract<getVehicleByIdReturnType, { id: string }>

interface BookingCardProps {
  vehicle: VehicleSuccessType
}

export function BookingCard({ vehicle }: BookingCardProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [dateError, setDateError] = useState<string>("")
  const [withDriver, setWithDriver] = useState(false)
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    pickupLocation: vehicle.location,
    dropoffLocation: vehicle.location,
    notes: "",
  })

  // Determine rental type from vehicle
  const vehicleRentalType = vehicle.rentalType || RentalType.SHORT_TERM
  const isLongTerm = vehicleRentalType === RentalType.LONG_TERM

  const bookedDateRanges = vehicle.bookings?.map((booking) => ({
    start: new Date(booking.startDate),
    end: new Date(booking.endDate),
  }))

  // Validate dates
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)

      // Check for booking conflicts
      const hasConflict = bookedDateRanges?.some((range) => {
        return (
          (start >= range.start && start <= range.end) ||
          (end >= range.start && end <= range.end) ||
          (start <= range.start && end >= range.end)
        )
      })

      if (hasConflict) {
        setDateError("Vehicle is already booked for selected dates. Please choose different dates.")
        return
      }

      // Validate rental duration for long-term
      const durationValidation = isValidRentalDuration(start, end, vehicleRentalType)
      if (!durationValidation.valid) {
        setDateError(durationValidation.message || "Invalid rental duration")
        return
      }

      setDateError("")
    } else {
      setDateError("")
    }
  }, [formData.startDate, formData.endDate, bookedDateRanges, vehicleRentalType])

  // Calculate pricing using the pricing calculator
  const pricing: PricingBreakdown | null = useMemo(() => {
    if (!formData.startDate || !formData.endDate) return null

    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)

    return calculateBookingPrice({
      vehicle: {
        pricePerDay: vehicle.pricePerDay,
        pricePerKm: vehicle.pricePerKm,
        monthlyPrice: vehicle.monthlyPrice,
        depositRequired: vehicle.depositRequired,
        driverPricePerDay: vehicle.driverPricePerDay,
        driverPricePerKm: vehicle.driverPricePerKm,
        driverPricePerMonth: vehicle.driverPricePerMonth,
        includedKmPerDay: vehicle.includedKmPerDay,
        includedKmPerMonth: vehicle.includedKmPerMonth,
        unlimitedMileage: vehicle.unlimitedMileage,
      },
      startDate: start,
      endDate: end,
      rentalType: vehicleRentalType,
      withDriver,
    })
  }, [formData.startDate, formData.endDate, vehicle, vehicleRentalType, withDriver])

  const totalDays =
    formData.startDate && formData.endDate
      ? differenceInDays(new Date(formData.endDate), new Date(formData.startDate))
      : 0

  const totalMonths =
    formData.startDate && formData.endDate
      ? calculateMonths(new Date(formData.startDate), new Date(formData.endDate))
      : 0

  const isDateDisabled = (dateString: string) => {
    const date = new Date(dateString)
    return bookedDateRanges?.some((range) => isWithinInterval(date, { start: range.start, end: range.end }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (dateError) {
      toast.error(dateError)
      return
    }

    setIsLoading(true)

    const result = await createBooking({
      vehicleId: vehicle.id,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      pickupLocation: formData.pickupLocation,
      dropoffLocation: withDriver ? undefined : formData.dropoffLocation,
      notes: formData.notes,
      withDriver,
      rentalType: vehicleRentalType,
    })

    if (result.success) {
      toast.success("Booking request submitted! Awaiting partner confirmation.")
      router.push(`/bookings/${result.data?.booking.id}`)
    } else {
      toast.error(result.error || "Failed to create booking")
      setIsLoading(false)
    }
  }

  // Display price based on rental type
  const displayPrice = isLongTerm && vehicle.monthlyPrice ? vehicle.monthlyPrice : vehicle.pricePerDay
  const priceLabel = isLongTerm && vehicle.monthlyPrice ? "/month" : "/day"

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Book This Vehicle</CardTitle>
          <Badge variant={isLongTerm ? "default" : "secondary"}>
            {isLongTerm ? (
              <>
                <CalendarDays className="h-3 w-3 mr-1" />
                Long-term
              </>
            ) : (
              <>
                <Clock className="h-3 w-3 mr-1" />
                Short-term
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Price Display */}
          <div className="p-4 bg-primary/10 rounded-lg">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">Rs {displayPrice?.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">{priceLabel}</span>
            </div>
            {isLongTerm && <p className="text-xs text-muted-foreground mt-1">Minimum 30 days (1 month) required</p>}
          </div>

          {/* Long-term notice */}
          {isLongTerm && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                This is a <strong>long-term rental</strong>. Minimum booking period is 30 days (1 month). Pricing is
                calculated monthly.
                <span className="block mt-1 text-muted-foreground">
                  මෙය දිගු කාලීන කුලියකි. අවම වෙන්කිරීම් කාලය දින 30 (මාස 1) වේ.
                </span>
              </AlertDescription>
            </Alert>
          )}

          {/* Booked dates info */}
          {bookedDateRanges && bookedDateRanges.length > 0 && (
            <Alert>
              <CalendarIcon className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Booked dates:</strong>{" "}
                {bookedDateRanges.map((range, idx) => (
                  <span key={idx} className="block">
                    {format(range.start, "MMM d")} - {format(range.end, "MMM d, yyyy")}
                  </span>
                ))}
              </AlertDescription>
            </Alert>
          )}

          {/* Date Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <Input
                type="date"
                required
                min={format(new Date(), "yyyy-MM-dd")}
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label>End Date</Label>
              <Input
                type="date"
                required
                min={formData.startDate || format(new Date(), "yyyy-MM-dd")}
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                disabled={isLoading}
              />
            </div>
          </div>

          {dateError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{dateError}</AlertDescription>
            </Alert>
          )}

          {/* With Driver Option */}
          {vehicle.withDriver && (
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <Checkbox
                id="withDriver"
                checked={withDriver}
                onCheckedChange={(checked) => setWithDriver(checked === true)}
                disabled={isLoading}
              />
              <div className="flex-1">
                <Label htmlFor="withDriver" className="flex items-center gap-2 cursor-pointer">
                  <UserRound className="h-4 w-4 text-blue-600" />
                  <span>Book with Driver</span>
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isLongTerm && vehicle.driverPricePerMonth
                    ? `+ Rs ${vehicle.driverPricePerMonth?.toLocaleString()}/month`
                    : vehicle.driverPricePerDay
                      ? `+ Rs ${vehicle.driverPricePerDay?.toLocaleString()}/day`
                      : "Driver available"}
                </p>
              </div>
            </div>
          )}

          {/* Pickup Location */}
          <div>
            <Label>Pickup Location</Label>
            <Input
              required
              value={formData.pickupLocation}
              onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
              disabled={isLoading}
            />
          </div>

          {/* Dropoff Location - only show if not with driver */}
          {!withDriver && (
            <div>
              <Label>Dropoff Location</Label>
              <Input
                value={formData.dropoffLocation}
                onChange={(e) => setFormData({ ...formData, dropoffLocation: e.target.value })}
                disabled={isLoading}
                placeholder="Same as pickup if left empty"
              />
            </div>
          )}

          {withDriver && (
            <p className="text-xs text-muted-foreground">
              <Info className="h-3 w-3 inline mr-1" />
              Dropoff location will be arranged with the driver
            </p>
          )}

          {/* Notes */}
          <div>
            <Label>Notes (Optional)</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              disabled={isLoading}
              rows={3}
              placeholder="Special requests or requirements..."
            />
          </div>

          {/* Pricing Breakdown */}
          {pricing && totalDays > 0 && !dateError && (
            <div className="space-y-2 p-4 bg-muted rounded-lg">
              {/* Vehicle Cost */}
              {isLongTerm ? (
                <div className="flex justify-between text-sm">
                  <span>
                    Rs {pricing.monthlyRate?.toLocaleString()} x {pricing.totalMonths}{" "}
                    {pricing.totalMonths === 1 ? "month" : "months"}
                  </span>
                  <span>Rs {pricing.vehicleSubtotal?.toLocaleString()}</span>
                </div>
              ) : (
                <div className="flex justify-between text-sm">
                  <span>
                    Rs {pricing.dailyRate?.toLocaleString()} x {pricing.totalDays}{" "}
                    {pricing.totalDays === 1 ? "day" : "days"}
                  </span>
                  <span>Rs {pricing.vehicleSubtotal?.toLocaleString()}</span>
                </div>
              )}

              {/* Driver Cost */}
              {withDriver && pricing.driverSubtotal > 0 && (
                <div className="flex justify-between text-sm text-blue-600">
                  <span className="flex items-center gap-1">
                    <UserRound className="h-3 w-3" />
                    Driver (
                    {isLongTerm
                      ? `Rs ${pricing.driverMonthlyRate?.toLocaleString()}/mo`
                      : `Rs ${pricing.driverDailyRate?.toLocaleString()}/day`}
                    )
                  </span>
                  <span>+ Rs {pricing.driverSubtotal?.toLocaleString()}</span>
                </div>
              )}

              {/* Included KM */}
              {!vehicle.unlimitedMileage && pricing.includedKm > 0 && (
                <>
                  <Separator />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Car className="h-3 w-3" />
                      Included KM
                    </span>
                    <span>{pricing.includedKm?.toLocaleString()} km</span>
                  </div>
                  {pricing.extraKmRate > 0 && (
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Extra KM rate</span>
                      <span>Rs {pricing.extraKmRate?.toLocaleString()}/km</span>
                    </div>
                  )}
                </>
              )}

              {vehicle.unlimitedMileage && (
                <>
                  <Separator />
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <Car className="h-3 w-3" />
                    <span>Unlimited mileage included</span>
                  </div>
                </>
              )}

              <Separator />

              {/* Subtotal */}
              <div className="flex justify-between font-semibold">
                <span>Subtotal</span>
                <span>Rs {pricing.subtotal?.toLocaleString()}</span>
              </div>

              {/* Deposit - shown separately */}
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Security Deposit (refundable)</span>
                <span>Rs {pricing.deposit?.toLocaleString()}</span>
              </div>

              <Alert className="mt-2">
                <Info className="h-3 w-3" />
                <AlertDescription className="text-xs">
                  Deposit is <strong>not</strong> included in the rental price. It will be refunded after the vehicle is
                  returned in good condition.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading || totalDays <= 0 || !!dateError}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {totalDays <= 0
              ? "Select Dates"
              : dateError
                ? "Dates Not Available"
                : `Request Booking - Rs ${pricing?.subtotal?.toLocaleString()}`}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Your booking will be confirmed by the rental partner
            <span className="block">ඔබේ වෙන්කිරීම කුලී හවුල්කරු විසින් තහවුරු කරනු ඇත</span>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
