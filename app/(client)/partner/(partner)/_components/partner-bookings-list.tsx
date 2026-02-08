"use client";

import { useEffect, useState } from "react";
import {
  getPartnerBookings,
  updateBookingStatus,
} from "@/actions/partner/bookings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  CheckCircle,
  XCircle,
  Calendar,
  MapPin,
  User,
  Phone,
} from "lucide-react";
import Image from "next/image";

type getPartnerBookingsType = Awaited<
  ReturnType<typeof getPartnerBookings>
>["data"];

type getPartnerBookingsSuccessType = Extract<getPartnerBookingsType, any[]>;

export function PartnerBookingsList() {
  const [bookings, setBookings] = useState<getPartnerBookingsSuccessType>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  async function fetchBookings() {
    const result = await getPartnerBookings();
    if (result.success && result.data) {
      setBookings(result.data);
    }
    setLoading(false);
  }

  useEffect(() => {
    const fetch = async () => {
      await fetchBookings();
    };
    fetch();
  }, []);

  async function handleStatusUpdate(
    bookingId: string,
    status: "CONFIRMED" | "REJECTED" | "COMPLETED"
  ) {
    const result = await updateBookingStatus(bookingId, status);

    if (result.success) {
      toast.success(result.data?.message || "Booking updated successfully");
      fetchBookings();
    } else {
      toast.error(result.error || "Failed to update booking");
    }
  }

  const filterBookings = (status?: string) => {
    if (!status || status === "all") return bookings;
    return bookings.filter((booking) => booking.status === status);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        className?: string;
      }
    > = {
      PENDING: {
        variant: "secondary",
        className: "bg-yellow-500/20 text-yellow-700",
      },
      CONFIRMED: {
        variant: "default",
        className: "bg-blue-500/20 text-blue-700",
      },
      ACTIVE: {
        variant: "default",
        className: "bg-green-500/20 text-green-700",
      },
      COMPLETED: { variant: "outline" },
      CANCELLED: { variant: "destructive" },
      REJECTED: { variant: "destructive" },
    };
    return variants[status] || { variant: "secondary" };
  };

  const displayedBookings = filterBookings(
    activeTab === "all" ? undefined : activeTab.toUpperCase()
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="h-40 bg-muted/50" />
          </Card>
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">No bookings yet</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {displayedBookings.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                No {activeTab !== "all" ? activeTab : ""} bookings found
              </p>
            </Card>
          ) : (
            displayedBookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                        <Image
                          src={booking.vehicle.images[0] || "/placeholder.svg"}
                          alt={`${booking.vehicle.make} ${booking.vehicle.model}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">
                            {booking.vehicle.make} {booking.vehicle.model}
                          </CardTitle>
                          <Badge {...getStatusBadge(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Booking ID: {booking.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <Separator />

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Customer Details
                      </h4>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={booking.user?.image || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {booking.user?.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{booking.user?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.user?.email}
                          </p>
                        </div>
                      </div>
                      {booking.user?.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={`tel:${booking.user?.phone}`}
                            className="hover:underline"
                          >
                            {booking.user?.phone}
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Booking Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Start Date:
                          </span>
                          <span className="font-medium">
                            {format(
                              new Date(booking.startDate),
                              "MMM dd, yyyy"
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            End Date:
                          </span>
                          <span className="font-medium">
                            {format(new Date(booking.endDate), "MMM dd, yyyy")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Duration:
                          </span>
                          <span className="font-medium">
                            {booking.totalDays} days
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold">
                          <span>Total Amount:</span>
                          <span className="text-primary">
                            Rs{" "}
                            {typeof booking.pricing === "object" &&
                            booking.pricing !== null &&
                            "totalPrice" in booking.pricing &&
                            typeof (booking.pricing).totalPrice === "number"
                              ? (booking.pricing).totalPrice?.toLocaleString()
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Pickup:</span>
                      <span className="font-medium">
                        {booking.pickupLocation}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Dropoff:</span>
                      <span className="font-medium">
                        {booking.dropoffLocation}
                      </span>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-sm text-muted-foreground mb-1">
                        Customer Notes:
                      </p>
                      <p className="text-sm">{booking.notes}</p>
                    </div>
                  )}

                  {booking.status === "PENDING" && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        className="flex-1"
                        onClick={() =>
                          handleStatusUpdate(booking.id, "CONFIRMED")
                        }
                        variant="default"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Confirm Booking
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={() =>
                          handleStatusUpdate(booking.id, "REJECTED")
                        }
                        variant="destructive"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  )}

                  {booking.status === "ACTIVE" && (
                    <Button
                      className="w-full"
                      onClick={() =>
                        handleStatusUpdate(booking.id, "COMPLETED")
                      }
                    >
                      Mark as Completed
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
