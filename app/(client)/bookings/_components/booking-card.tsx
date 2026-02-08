"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  MapPin,
  Phone,
  Star,
  MessageSquare,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { cancelBooking } from "@/actions/booking/cancel";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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
} from "@/components/ui/alert-dialog";
import { getMyBookings } from "@/actions/booking/list";

type BookingType = Awaited<ReturnType<typeof getMyBookings>>["data"];

type BookingSuccessType = Extract<BookingType, { data: unknown }>;

interface BookingCardProps {
  booking: BookingSuccessType["data"][number];
}

const statusConfig: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  PENDING: { label: "Pending", variant: "secondary" },
  CONFIRMED: { label: "Confirmed", variant: "default" },
  ACTIVE: { label: "Active", variant: "default" },
  COMPLETED: { label: "Completed", variant: "outline" },
  CANCELLED: { label: "Cancelled", variant: "destructive" },
  REJECTED: { label: "Rejected", variant: "destructive" },
};

export function BookingCard({ booking }: BookingCardProps) {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);
  const status = statusConfig[booking.status] || {
    label: booking.status,
    variant: "secondary" as const,
  };

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      const result = await cancelBooking({
        bookingId: booking.id,
        reason: "User requested cancellation",
      });
      if (result.success) {
        toast.success("Booking cancelled successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to cancel booking");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsCancelling(false);
    }
  };

  const canCancel = ["PENDING", "CONFIRMED"].includes(booking.status);
  const canReview = booking.status === "COMPLETED" && !booking.review;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Vehicle Image */}
          <div className="relative w-full md:w-48 h-40 md:h-auto shrink-0">
            <Image
              src={
                booking.vehicle.images?.[0] ||
                "/placeholder.svg?height=200&width=300&query=car"
              }
              alt={`${booking.vehicle.make} ${booking.vehicle.model}`}
              fill
              className="object-cover"
            />
          </div>

          {/* Booking Details */}
          <div className="flex-1 p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="space-y-3">
                {/* Vehicle Name & Status */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    href={`/vehicles/${booking.vehicle.id}`}
                    className="font-semibold text-lg hover:text-primary transition-colors"
                  >
                    {booking.vehicle.make} {booking.vehicle.model}{" "}
                    {booking.vehicle.year}
                  </Link>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>

                {/* Partner Info */}
                <p className="text-sm text-muted-foreground">
                  By{" "}
                  {booking.vehicle.partner.businessName ||
                    booking.vehicle.partner.user.name}
                </p>

                {/* Dates */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {format(new Date(booking.startDate), "MMM d")} -{" "}
                      {format(new Date(booking.endDate), "MMM d, yyyy")}
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    ({booking.totalDays} days)
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{booking.pickupLocation}</span>
                </div>

                {/* Contact */}
                {booking.vehicle.partner.user.phone && (
                  <div className="flex items-center gap-1 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`tel:${booking.vehicle.partner.user.phone}`}
                      className="text-primary hover:underline"
                    >
                      {booking.vehicle.partner.user.phone}
                    </a>
                  </div>
                )}
              </div>

              {/* Pricing & Actions */}
              <div className="flex flex-col items-start md:items-end gap-3">
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    Rs.
                    {typeof booking.pricing === "object" &&
                    booking.pricing !== null &&
                    "total" in booking.pricing &&
                    typeof (booking.pricing).total === "number"
                      ? (booking.pricing).total?.toLocaleString()
                      : "--"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Rs.
                    {typeof booking.pricing === "object" &&
                    booking.pricing !== null &&
                    "dailyRate" in booking.pricing &&
                    typeof (booking.pricing).dailyRate === "number"
                      ? (booking.pricing).dailyRate?.toLocaleString()
                      : "--"}
                    /day × {booking.totalDays} days
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {canReview && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/bookings/${booking.id}/review`}>
                        <Star className="h-4 w-4 mr-1" />
                        Review
                      </Link>
                    </Button>
                  )}

                  {canCancel && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={isCancelling}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to cancel this booking? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>No, keep it</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleCancel}
                            disabled={isCancelling}
                          >
                            {isCancelling
                              ? "Cancelling..."
                              : "Yes, cancel booking"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}

                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/bookings/${booking.id}`}>
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Details
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
