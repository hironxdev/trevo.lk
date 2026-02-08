"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getPartnerVehicles } from "@/actions/partner/vehicles"
import Link from "next/link"
import { Car, Plus, Eye, Clock, CheckCircle, XCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"

interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  pricePerDay: number
  isApproved: boolean
  isAvailable: boolean
  images: string[]
}

export function PartnerVehiclesList() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const result = await getPartnerVehicles()
        if (result.success && result.data) {
          setVehicles(result.data.slice(0, 4))
        } else {
          setError(result.error || "Failed to load vehicles")
        }
      } catch (err) {
        setError("An error occurred while loading vehicles")
      } finally {
        setLoading(false)
      }
    }
    fetchVehicles()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-9 w-28" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-16 w-24 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6">
        <p className="text-destructive text-center">{error}</p>
      </Card>
    )
  }

  const getStatusBadge = (vehicle: Vehicle) => {
    if (!vehicle.isApproved) {
      return (
        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      )
    }
    if (vehicle.isAvailable) {
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
          <CheckCircle className="h-3 w-3 mr-1" />
          Available
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="bg-muted text-muted-foreground">
        <XCircle className="h-3 w-3 mr-1" />
        Unavailable
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>My Vehicles</CardTitle>
        <Button asChild size="sm">
          <Link href="/partner/vehicles/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {vehicles.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="mb-4">No vehicles listed yet</p>
            <Button asChild>
              <Link href="/partner/vehicles/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Vehicle
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {vehicles.map((vehicle) => (
              <Link
                key={vehicle.id}
                href={`/partner/vehicles/${vehicle.id}/edit`}
                className="flex gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <div className="relative h-16 w-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  {vehicle.images[0] ? (
                    <Image
                      src={vehicle.images[0] || "/placeholder.svg"}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Car className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="font-semibold truncate group-hover:text-primary transition-colors">
                        {vehicle.make} {vehicle.model}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {vehicle.year} • Rs {vehicle.pricePerDay?.toLocaleString()}/day
                      </p>
                    </div>
                    {getStatusBadge(vehicle)}
                  </div>
                </div>
                <Eye className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
              </Link>
            ))}
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/partner/vehicles">View All Vehicles</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
