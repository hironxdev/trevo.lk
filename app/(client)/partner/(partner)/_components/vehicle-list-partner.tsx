"use client"

import { useEffect, useState, useCallback } from "react"
import { getPartnerVehicles } from "@/actions/partner/vehicles"
import { deleteVehicle } from "@/actions/vehicle/delete"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import Link from "next/link"
import { Edit, Eye, Trash2, MoreVertical, Car, Plus, Star, Calendar, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { ErrorState } from "@/components/partner/error-state"
import { EmptyState } from "@/components/partner/empty-state"
import { cn } from "@/lib/utils"

type VehicleWithRelations = {
  id: string
  make: string
  model: string
  year: number
  pricePerDay: number
  isApproved: boolean
  status: string
  images: string[]
  averageRating: number
  category: { name: string }
  _count: { bookings: number; reviews: number }
}

export function VehicleListPartner() {
  const [vehicles, setVehicles] = useState<VehicleWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchVehicles = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getPartnerVehicles()
      if (result.success && result.data) {
        setVehicles(result.data as VehicleWithRelations[])
      } else {
        setError(result.error || "Failed to load vehicles")
      }
    } catch (err) {
      setError("An error occurred while loading vehicles")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

  async function handleDelete() {
    if (!vehicleToDelete) return

    setIsDeleting(true)
    try {
      const result = await deleteVehicle(vehicleToDelete)

      if (result.success) {
        toast.success("Vehicle deleted successfully")
        fetchVehicles()
      } else {
        toast.error(result.error || "Failed to delete vehicle")
      }
    } catch (err) {
      toast.error("An error occurred while deleting")
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setVehicleToDelete(null)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="animate-pulse">
              <div className="aspect-video bg-muted" />
              <div className="p-4 space-y-3">
                <div className="h-5 w-3/4 bg-muted rounded" />
                <div className="h-4 w-1/2 bg-muted rounded" />
                <div className="h-6 w-1/3 bg-muted rounded" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchVehicles} />
  }

  if (vehicles.length === 0) {
    return (
      <EmptyState
        icon={Car}
        title="No vehicles listed"
        description="Start earning by listing your first vehicle. It only takes a few minutes to get started."
        actionLabel="Add Your First Vehicle"
        actionHref="/partner/vehicles/new"
      />
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="overflow-hidden group hover:border-primary/30 transition-colors">
            <div className="relative aspect-video">
              {vehicle.images[0] ? (
                <Image
                  src={vehicle.images[0] || "/placeholder.svg"}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-muted">
                  <Car className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "backdrop-blur-sm",
                    vehicle.isApproved
                      ? "bg-green-500/80 text-white border-green-500"
                      : "bg-yellow-500/80 text-white border-yellow-500",
                  )}
                >
                  {vehicle.isApproved ? "Approved" : "Pending"}
                </Badge>
              </div>
              <div className="absolute top-2 left-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "backdrop-blur-sm",
                    vehicle.status === "AVAILABLE"
                      ? "bg-green-500/80 text-white border-green-500"
                      : "bg-muted/80 text-foreground",
                  )}
                >
                  {vehicle.status}
                </Badge>
              </div>
            </div>

            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <h3 className="font-semibold text-lg truncate">
                    {vehicle.make} {vehicle.model}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {vehicle.year} • {vehicle.category.name}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/vehicles/${vehicle.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Public Page
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/partner/vehicles/${vehicle.id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Vehicle
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => {
                        setVehicleToDelete(vehicle.id)
                        setDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                {vehicle.averageRating > 0 && (
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    {vehicle.averageRating.toFixed(1)} ({vehicle._count.reviews})
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {vehicle._count.bookings} bookings
                </span>
              </div>

              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-xl font-bold text-primary">Rs {vehicle.pricePerDay?.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">/day</span>
              </div>

              <div className="flex gap-2 mt-4">
                <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Link href={`/vehicles/${vehicle.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Link>
                </Button>
                <Button asChild size="sm" className="flex-1">
                  <Link href={`/partner/vehicles/${vehicle.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Vehicle Card */}
        <Card className="overflow-hidden border-dashed">
          <Link
            href="/partner/vehicles/new"
            className="flex flex-col items-center justify-center h-full min-h-[300px] text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Plus className="h-8 w-8" />
            </div>
            <p className="font-medium">Add New Vehicle</p>
            <p className="text-sm">List another vehicle to earn more</p>
          </Link>
        </Card>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this vehicle?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your vehicle listing. You cannot delete
              vehicles with active bookings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Vehicle
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
