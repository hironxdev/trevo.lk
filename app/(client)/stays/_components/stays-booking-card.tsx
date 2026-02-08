"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { createStaysBooking } from "@/actions/stays-booking/create"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, AlertCircle, Users, Info } from "lucide-react"
import { format } from "date-fns"
import type { getStaysById } from "@/actions/stays/info"
import {
  calculateStaysBookingPrice,
  calculateNights,
  isValidStaysBookingDuration,
} from "@/lib/utils/stays-pricing-calculator"

type StaysType = Awaited<ReturnType<typeof getStaysById>>["data"]

interface StaysBookingCardProps {
  stays: StaysType
}

export function StaysBookingCard({ stays }: StaysBookingCardProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [dateError, setDateError] = useState<string>("")
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    specialRequests: "",
  })

  // Validate dates
  const validateDates = (checkIn: string, checkOut: string) => {
    if (!checkIn || !checkOut) {
      setDateError("")
      return
    }

    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)

    // Check minimum/maximum nights
    const durationValidation = isValidStaysBookingDuration(
      checkInDate,
      checkOutDate,
      stays?.minNights,
      stays?.maxNights,
    )
    if (!durationValidation.valid) {
      setDateError(durationValidation.message || "Invalid duration")
      return
    }

    // Check for booking conflicts
    const hasConflict = stays?.bookings?.some((booking) => {
      const bookingStart = new Date(booking.checkIn)
      const bookingEnd = new Date(booking.checkOut)
      return (
        (checkInDate >= bookingStart && checkInDate < bookingEnd) ||
        (checkOutDate > bookingStart && checkOutDate <= bookingEnd) ||
        (checkInDate <= bookingStart && checkOutDate >= bookingEnd)
      )
    })

    if (hasConflict) {
      setDateError("Property is already booked for selected dates")
      return
    }

    setDateError("")
  }

  // Calculate pricing
  const pricing = useMemo(() => {
    if (!formData.checkIn || !formData.checkOut || !stays) return null

    const checkIn = new Date(formData.checkIn)
    const checkOut = new Date(formData.checkOut)

    return calculateStaysBookingPrice({
      stays: {
        pricePerNight: stays.pricePerNight,
        pricePerWeek: stays.pricePerWeek,
        pricePerMonth: stays.pricePerMonth,
        cleaningFee: stays.cleaningFee,
        depositRequired: stays.depositRequired,
      },
      checkIn,
      checkOut,
    })
  }, [formData.checkIn, formData.checkOut, stays])

  const totalNights =
    formData.checkIn && formData.checkOut ? calculateNights(new Date(formData.checkIn), new Date(formData.checkOut)) : 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (dateError) {
      toast.error(dateError)
      return
    }

    if (formData.guests > (stays?.maxGuests || 1)) {
      toast.error(`Maximum ${stays?.maxGuests} guests allowed`)
      return
    }

    setIsLoading(true)

    const result = await createStaysBooking({
      staysId: stays?.id || "",
      checkIn: new Date(formData.checkIn),
      checkOut: new Date(formData.checkOut),
      guests: formData.guests,
      specialRequests: formData.specialRequests,
    })

    if (result.success) {
      toast.success("Booking request submitted! Awaiting host confirmation.")
      router.push(`/dashboard/stays-bookings/${result.data?.booking.id}`)
    } else {
      toast.error(result.error || "Failed to create booking")
      setIsLoading(false)
    }
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Book This Property</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Price Display */}
          <div className="p-4 bg-primary/10 rounded-lg">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">Rs {stays?.pricePerNight?.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">/night</span>
            </div>
            {stays?.minNights && stays.minNights > 1 && (
              <p className="text-xs text-muted-foreground mt-1">Minimum {stays.minNights} nights required</p>
            )}
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Check-in</Label>
              <Input
                type="date"
                required
                min={format(new Date(), "yyyy-MM-dd")}
                value={formData.checkIn}
                onChange={(e) => {
                  setFormData({ ...formData, checkIn: e.target.value })
                  validateDates(e.target.value, formData.checkOut)
                }}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label>Check-out</Label>
              <Input
                type="date"
                required
                min={formData.checkIn || format(new Date(), "yyyy-MM-dd")}
                value={formData.checkOut}
                onChange={(e) => {
                  setFormData({ ...formData, checkOut: e.target.value })
                  validateDates(formData.checkIn, e.target.value)
                }}
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

          {/* Guests */}
          <div>
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Guests
            </Label>
            <Input
              type="number"
              min={1}
              max={stays?.maxGuests || 10}
              value={formData.guests}
              onChange={(e) => setFormData({ ...formData, guests: Number.parseInt(e.target.value) || 1 })}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground mt-1">Maximum {stays?.maxGuests} guests</p>
          </div>

          {/* Special Requests */}
          <div>
            <Label>Special Requests (Optional)</Label>
            <Textarea
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
              disabled={isLoading}
              rows={3}
              placeholder="Early check-in, late check-out, special arrangements..."
            />
          </div>

          {/* Pricing Breakdown */}
          {pricing && totalNights > 0 && !dateError && (
            <div className="space-y-2 p-4 bg-muted rounded-lg">
              <div className="flex justify-between text-sm">
                <span>
                  Rs {pricing.pricePerNight?.toLocaleString()} x {pricing.totalNights} night
                  {pricing.totalNights !== 1 && "s"}
                </span>
                <span>Rs {pricing.nightsSubtotal?.toLocaleString()}</span>
              </div>

              {pricing.weeklyDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Weekly discount</span>
                  <span>- Rs {pricing.weeklyDiscount?.toLocaleString()}</span>
                </div>
              )}

              {pricing.monthlyDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Monthly discount</span>
                  <span>- Rs {pricing.monthlyDiscount?.toLocaleString()}</span>
                </div>
              )}

              {pricing.cleaningFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Cleaning fee</span>
                  <span>Rs {pricing.cleaningFee?.toLocaleString()}</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between font-semibold">
                <span>Subtotal</span>
                <span>Rs {pricing.subtotal?.toLocaleString()}</span>
              </div>

              {pricing.deposit > 0 && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Security Deposit (refundable)</span>
                  <span>Rs {pricing.deposit?.toLocaleString()}</span>
                </div>
              )}

              <Alert className="mt-2">
                <Info className="h-3 w-3" />
                <AlertDescription className="text-xs">
                  Deposit is <strong>not</strong> included in the rental price. It will be refunded after checkout.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading || totalNights <= 0 || !!dateError}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {totalNights <= 0
              ? "Select Dates"
              : dateError
                ? "Dates Not Available"
                : `Request Booking - Rs ${pricing?.subtotal?.toLocaleString()}`}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Your booking will be confirmed by the property owner
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
