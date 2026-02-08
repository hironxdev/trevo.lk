// components/admin/vehicle-create/created-vehicles-summary.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle, Plus, Car } from "lucide-react"
import Link from "next/link"

interface CreatedVehicle {
  id: string
  displayName?: string
  make?: string
  model?: string
  partnerName: string
}

interface CreatedVehiclesSummaryProps {
  vehicles: CreatedVehicle[]
  onAddAnother: () => void
}

export function CreatedVehiclesSummary({ vehicles, onAddAnother }: CreatedVehiclesSummaryProps) {
  if (vehicles.length === 0) return null

  const getVehicleDisplayName = (vehicle: CreatedVehicle) => {
    if (vehicle.displayName) return vehicle.displayName
    
    const makeModel = `${vehicle.make || ""} ${vehicle.model || ""}`.trim()
    return makeModel || "Vehicle"
  }

  return (
    <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-900">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="text-base flex items-center gap-2 text-green-700 dark:text-green-400">
            <CheckCircle className="h-5 w-5" />
            {vehicles.length === 1 ? "Vehicle Created Successfully" : `${vehicles.length} Vehicles Created`}
          </CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={onAddAnother} type="button">
              <Plus className="h-4 w-4 mr-1" />
              Add Another
            </Button>
            <Button size="sm" asChild>
              <Link href="/admin/vehicles">View All Vehicles</Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="max-h-40">
          <div className="space-y-2">
            {vehicles.map((vehicle, index) => (
              <div
                key={vehicle.id || index}
                className="flex items-center justify-between p-3 bg-white dark:bg-green-950/30 rounded-lg border border-green-200/50 dark:border-green-900/50"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Car className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-green-900 dark:text-green-100">
                      {getVehicleDisplayName(vehicle)}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      Partner: {vehicle.partnerName}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-900/30">
                  #{index + 1}
                </Badge>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
