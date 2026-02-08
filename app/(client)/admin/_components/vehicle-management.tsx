"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAllVehicles, approveVehicle } from "@/actions/admin/vehicles"
import { deleteVehicle } from "@/actions/vehicle/delete"
import { toast } from "sonner"
import { CheckCircle, Eye, Trash2, Edit, Phone, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

type VehicleWithRelations = Awaited<ReturnType<typeof getAllVehicles>>["data"]

type VehicleSuccessType = Extract<VehicleWithRelations, any[]>

export function VehicleManagement() {
  const [vehicles, setVehicles] = useState<VehicleSuccessType>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleSuccessType[number] | null>(null)

  async function fetchVehicles() {
    const result = await getAllVehicles()

    if (result.success && result.data) {
      setVehicles(result.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    ;(async () => {
      await fetchVehicles()
    })()
  }, [])

  async function handleApprove(vehicleId: string) {
    const result = await approveVehicle(vehicleId, true)

    if (result.success) {
      toast.success(result.data?.message || "Vehicle approved")
      fetchVehicles()
    } else {
      toast.error(result.error || "Failed to approve vehicle")
    }
  }

  async function handleDelete() {
    if (!selectedVehicle) return

    const result = await deleteVehicle(selectedVehicle.id)

    if (result.success) {
      toast.success("Vehicle deleted successfully")
      fetchVehicles()
    } else {
      toast.error(result.error || "Failed to delete vehicle")
    }

    setDeleteDialogOpen(false)
    setSelectedVehicle(null)
  }

  const filterVehicles = (status?: string) => {
    if (!status || status === "all") return vehicles
    if (status === "approved") return vehicles.filter((v) => v.isApproved)
    if (status === "pending") return vehicles.filter((v) => !v.isApproved)
    if (status === "admin-created") return vehicles.filter((v) => v.isAdminCreated)
    return vehicles.filter((v) => v.status === status.toUpperCase())
  }

  const displayedVehicles = filterVehicles(activeTab)

  if (loading) {
    return <Card className="p-6 text-center">Loading...</Card>
  }

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({vehicles.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({vehicles.filter((v) => !v.isApproved).length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({vehicles.filter((v) => v.isApproved).length})</TabsTrigger>
          <TabsTrigger value="admin-created">Admin ({vehicles.filter((v) => v.isAdminCreated).length})</TabsTrigger>
          <TabsTrigger value="available">
            Available ({vehicles.filter((v) => v.status === "AVAILABLE").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {displayedVehicles.map((vehicle) => (
            <Card key={vehicle.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={vehicle.images?.[0] || "/placeholder.svg"}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-lg">
                            {vehicle.make} {vehicle.model} ({vehicle.year})
                          </h3>
                          <Badge variant={vehicle.isApproved ? "default" : "secondary"}>
                            {vehicle.isApproved ? "Approved" : "Pending"}
                          </Badge>
                          <Badge variant="outline">{vehicle.status}</Badge>
                          {vehicle.isAdminCreated && (
                            <Badge className="bg-purple-500/10 text-purple-600 border-purple-200">
                              <Shield className="h-3 w-3 mr-1" />
                              Admin Created
                            </Badge>
                          )}
                          {vehicle.contactOnly && (
                            <Badge variant="secondary">
                              <Phone className="h-3 w-3 mr-1" />
                              Contact Only
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Partner: {vehicle.partner?.businessName || vehicle.partner?.fullName} • {vehicle.category?.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          License: {vehicle.licensePlate} • {vehicle.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      <div>
                        <span className="text-lg font-bold text-primary">
                          Rs {vehicle.pricePerDay?.toLocaleString()}/day
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">{vehicle._count.bookings} bookings</div>
                    </div>

                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/vehicles/${vehicle.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/vehicles/${vehicle.id}/edit`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </Button>
                      {!vehicle.isApproved && (
                        <Button size="sm" variant="default" onClick={() => handleApprove(vehicle.id)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive bg-transparent"
                        onClick={() => {
                          setSelectedVehicle(vehicle)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {displayedVehicles.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No vehicles found</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>

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
    </>
  )
}
