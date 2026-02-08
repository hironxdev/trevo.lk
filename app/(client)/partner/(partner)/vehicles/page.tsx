import { PartnerHeader } from "../_components/partner-header"
import { VehicleListPartner } from "../_components/vehicle-list-partner"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export const metadata = {
  title: "My Vehicles | Partner Dashboard",
  description: "Manage your vehicle listings",
}

export default function PartnerVehiclesPage() {
  return (
    <div>
      <PartnerHeader />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">My Vehicles</h1>
          <p className="text-muted-foreground mt-1">Manage your vehicle listings</p>
        </div>
        <Button asChild>
          <Link href="/partner/vehicles/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </Link>
        </Button>
      </div>
      <VehicleListPartner />
    </div>
  )
}
