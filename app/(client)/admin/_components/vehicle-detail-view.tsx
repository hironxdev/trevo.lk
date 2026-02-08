"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Car,
  Calendar,
  Star,
  Phone,
  Mail,
  User,
  Building2,
} from "lucide-react"
import { approveVehicle } from "@/actions/admin/vehicles"
import { deleteVehicle } from "@/actions/vehicle/delete"
import { toast } from "sonner"
import { format } from "date-fns"
import { getVehicleDetailByIdAdmin } from "@/actions/vehicle/info"

type getVehicleDetailByIdAdminReturn = Awaited<ReturnType<typeof getVehicleDetailByIdAdmin>>["data"];

type VehicleWithRelations = Extract<getVehicleDetailByIdAdminReturn, {approvedAt: Date | null }>;


interface VehicleDetailViewProps {
  vehicle: VehicleWithRelations
}

export function VehicleDetailView({ vehicle }: VehicleDetailViewProps) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [processing, setProcessing] = useState(false)

  async function handleApprove() {
    setProcessing(true)
    const result = await approveVehicle(vehicle.id, true)
    if (result.success) {
      toast.success("Vehicle approved successfully")
      router.refresh()
    } else {
      toast.error(result.error || "Failed to approve vehicle")
    }
    setProcessing(false)
  }

  async function handleReject() {
    setProcessing(true)
    const result = await approveVehicle(vehicle.id, false, rejectionReason)
    if (result.success) {
      toast.success("Vehicle rejected")
      setRejectDialogOpen(false)
      router.refresh()
    } else {
      toast.error(result.error || "Failed to reject vehicle")
    }
    setProcessing(false)
  }

  async function handleDelete() {
    setProcessing(true)
    const result = await deleteVehicle(vehicle.id)
    if (result.success) {
      toast.success("Vehicle deleted successfully")
      router.push("/admin/vehicles")
    } else {
      toast.error(result.error || "Failed to delete vehicle")
    }
    setProcessing(false)
  }

  const averageRating =
    vehicle.reviews?.length > 0
      ? (vehicle.reviews.reduce((sum: number, r) => sum + r.rating, 0) / vehicle.reviews.length).toFixed(1)
      : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/vehicles">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {vehicle.make} {vehicle.model} ({vehicle.year})
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={vehicle.isApproved ? "default" : "secondary"}>
                {vehicle.isApproved ? "Approved" : "Pending Approval"}
              </Badge>
              <Badge variant="outline">{vehicle.status}</Badge>
              {vehicle.withDriver && <Badge className="bg-blue-600 text-white">With Driver</Badge>}
              <span className="text-muted-foreground">{vehicle.licensePlate}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/vehicles/${vehicle.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          {!vehicle.isApproved && (
            <>
              <Button onClick={handleApprove} disabled={processing}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button variant="destructive" onClick={() => setRejectDialogOpen(true)} disabled={processing}>
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </>
          )}
          <Button
            variant="outline"
            className="text-destructive bg-transparent"
            onClick={() => setDeleteDialogOpen(true)}
            disabled={processing}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Images & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-4 gap-2">
                {vehicle.images?.map((image: string, index: number) => (
                  <div
                    key={index}
                    className={`relative rounded-lg overflow-hidden ${index === 0 ? "col-span-4 aspect-video" : "aspect-square"}`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Vehicle image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
                {(!vehicle.images || vehicle.images.length === 0) && (
                  <div className="col-span-4 aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <Car className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tabs for Details */}
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="bookings">Bookings ({vehicle._count?.bookings || 0})</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({vehicle._count?.reviews || 0})</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Vehicle Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Make</span>
                        <span className="font-medium">{vehicle.make}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Model</span>
                        <span className="font-medium">{vehicle.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Year</span>
                        <span className="font-medium">{vehicle.year}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Color</span>
                        <span className="font-medium">{vehicle.color}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category</span>
                        <span className="font-medium">{vehicle.category?.name}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">License Plate</span>
                        <span className="font-medium">{vehicle.licensePlate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location</span>
                        <span className="font-medium">{vehicle.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant="outline">{vehicle.status}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Unlimited Mileage</span>
                        <span className="font-medium">{vehicle.unlimitedMileage ? "Yes" : "No"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">With Driver</span>
                        <span className="font-medium">{vehicle.withDriver ? "Yes" : "No"}</span>
                      </div>
                    </div>
                  </div>

                  {vehicle.specifications && Object.keys(vehicle.specifications).length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <h4 className="font-medium mb-3">Additional Specifications</h4>
                      <div className="grid md:grid-cols-2 gap-2">
                        {Object.entries(vehicle.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-muted-foreground capitalize">{key.replace(/_/g, " ")}</span>
                            <span>{value as string}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {vehicle.features && vehicle.features.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <h4 className="font-medium mb-3">Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {vehicle.features?.map((feature: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {vehicle.rejectionReason && (
                <Card className="border-destructive">
                  <CardHeader>
                    <CardTitle className="text-destructive">Rejection Reason</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{vehicle.rejectionReason}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="bookings">
              <Card>
                <CardContent className="p-4">
                  {vehicle.bookings?.length > 0 ? (
                    <div className="space-y-4">
                      {vehicle.bookings.map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{booking.user?.name || "Unknown User"}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(booking.startDate), "MMM d, yyyy")} -{" "}
                              {format(new Date(booking.endDate), "MMM d, yyyy")}
                            </p>
                          </div>
                          <Badge
                            variant={
                              booking.status === "CONFIRMED" || booking.status === "COMPLETED"
                                ? "default"
                                : booking.status === "CANCELLED" || booking.status === "REJECTED"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {booking.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No bookings yet</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <Card>
                <CardContent className="p-4">
                  {vehicle.reviews?.length > 0 ? (
                    <div className="space-y-4">
                      {vehicle.reviews.map((review) => (
                        <div key={review.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-4 w-4" />
                              </div>
                              <span className="font-medium">{review.user?.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{review.rating}</span>
                            </div>
                          </div>
                          {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No reviews yet</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Pricing & Partner Info */}
        <div className="space-y-6">
          {/* Pricing Card */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Daily Rate</span>
                <span className="font-bold text-lg text-primary">Rs {vehicle.pricePerDay?.toLocaleString()}</span>
              </div>
              {vehicle.pricePerKm && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Per KM</span>
                  <span className="font-medium">Rs {vehicle.pricePerKm?.toLocaleString()}</span>
                </div>
              )}
              {vehicle.monthlyPrice && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly</span>
                  <span className="font-medium">Rs {vehicle.monthlyPrice?.toLocaleString()}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Deposit Required</span>
                <span className="font-medium">Rs {vehicle.depositRequired?.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{vehicle._count?.bookings || 0}</p>
                  <p className="text-sm text-muted-foreground">Bookings</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-2xl font-bold">{averageRating || "-"}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Partner Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {vehicle.partner?.partnerType === "BUSINESS" ? (
                  <Building2 className="h-5 w-5" />
                ) : (
                  <User className="h-5 w-5" />
                )}
                Partner Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold">{vehicle.partner?.businessName || vehicle.partner?.fullName}</p>
                <Badge variant="outline" className="mt-1">
                  {vehicle.partner?.partnerType}
                </Badge>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{vehicle.partner?.user?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{vehicle.partner?.user?.email}</span>
                </div>
                {vehicle.partner?.user?.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{vehicle.partner?.user?.phone}</span>
                  </div>
                )}
              </div>
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href={`/admin/partners/${vehicle.partner?.id}`}>View Partner Profile</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Dates Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{format(new Date(vehicle.createdAt), "MMM d, yyyy")}</span>
              </div>
              {vehicle.approvedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Approved</span>
                  <span>{format(new Date(vehicle.approvedAt), "MMM d, yyyy")}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span>{format(new Date(vehicle.updatedAt), "MMM d, yyyy")}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Vehicle</DialogTitle>
            <DialogDescription>Provide a reason for rejecting this vehicle listing</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea
                id="reason"
                placeholder="Please provide a clear reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={!rejectionReason.trim() || processing}>
              Reject Vehicle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Vehicle</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this vehicle? This action cannot be undone. Vehicles with
              active bookings cannot be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
