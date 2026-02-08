"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Heart, Car } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"

interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  pricePerDay: number
  images: string[]
  category: { name: string }
}

export function FavoriteVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // For now, show empty state - favorites functionality to be implemented
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-36" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-20 w-28 rounded-lg" />
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Favorite Vehicles
        </CardTitle>
      </CardHeader>
      <CardContent>
        {vehicles.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="mb-4">No favorites yet</p>
            <Button asChild variant="outline">
              <Link href="/vehicles">Browse Vehicles</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {vehicles.map((vehicle) => (
              <Link
                key={vehicle.id}
                href={`/vehicles/${vehicle.id}`}
                className="flex gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="relative h-20 w-28 rounded-lg overflow-hidden bg-muted">
                  {vehicle.images[0] ? (
                    <Image
                      src={vehicle.images[0] || "/placeholder.svg"}
                      alt={`${vehicle.make} ${vehicle.model}`}
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
                  <h4 className="font-semibold">
                    {vehicle.make} {vehicle.model}
                  </h4>
                  <p className="text-sm text-muted-foreground">{vehicle.category.name}</p>
                  <p className="text-sm font-medium mt-1">Rs {vehicle.pricePerDay?.toLocaleString()}/day</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
