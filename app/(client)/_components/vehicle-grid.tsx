import { getVehicles } from "@/actions/vehicle/list"
import { VehicleCard } from "./vehicle-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { VehicleCategory } from "@prisma/client"

interface VehicleGridProps {
  category?: string
  limit?: number
}

export async function VehicleGrid({ category, limit = 8 }: VehicleGridProps) {
  const result = await getVehicles({
    category: category as VehicleCategory,
    limit,
    page: 1,
  })

  if (!result.success || !result.data?.data?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No vehicles available at the moment.</p>
        <p className="text-sm text-muted-foreground mt-1">Check back later or try a different category.</p>
      </div>
    )
  }

  const vehicles = result.data.data

  return (
    <div>
      {/* Vehicle Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>

      {/* View All Button */}
      {result.data.pagination.total > limit && (
        <div className="flex justify-center mt-8">
          <Button asChild variant="outline" className="group bg-transparent">
            <Link href="/vehicles">
              View All Vehicles
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
