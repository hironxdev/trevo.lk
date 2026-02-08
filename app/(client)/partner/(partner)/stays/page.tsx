import { PartnerHeader } from "../_components/partner-header"
import { StaysListPartner } from "../_components/stays-list-partner"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export const metadata = {
  title: "My Properties | Partner Dashboard",
  description: "Manage your property listings",
}

export default function PartnerStaysPage() {
  return (
    <div>
      <PartnerHeader />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">My Properties</h1>
          <p className="text-muted-foreground mt-1">Manage your stays and accommodation listings</p>
        </div>
        <Button asChild>
          <Link href="/partner/stays/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Link>
        </Button>
      </div>
      <StaysListPartner />
    </div>
  )
}
