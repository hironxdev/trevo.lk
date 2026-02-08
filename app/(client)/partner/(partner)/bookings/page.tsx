import { Suspense } from "react"
import { PartnerHeader } from "../_components/partner-header"
import { PartnerBookingsContent } from "./_components/partner-bookings-content"
import { LoadingCard } from "@/components/partner/loading-card"

export const metadata = {
  title: "Manage Bookings | Partner Dashboard",
  description: "View and manage booking requests for your vehicles",
}

export default function PartnerBookingsPage() {
  return (
    <div>
      <PartnerHeader />
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Manage Bookings</h1>
        <p className="text-muted-foreground mt-1">View and manage booking requests for your vehicles</p>
      </div>
      <Suspense
        fallback={
          <div className="space-y-4">
            <LoadingCard rows={1} showHeader={false} />
            <LoadingCard rows={4} />
          </div>
        }
      >
        <PartnerBookingsContent />
      </Suspense>
    </div>
  )
}
