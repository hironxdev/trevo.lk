import { Suspense } from "react"
import { PartnerHeader } from "../_components/partner-header"
import { EarningsContent } from "./_components/earnings-content"
import { LoadingCard } from "@/components/partner/loading-card"

export const metadata = {
  title: "Earnings | Partner Dashboard",
  description: "Track your rental earnings and transactions",
}

export default function EarningsPage() {
  return (
    <div>
      <PartnerHeader />
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Earnings</h1>
        <p className="text-muted-foreground mt-1">Track your income and view transaction history</p>
      </div>
      <Suspense
        fallback={
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <LoadingCard key={i} showHeader={false} rows={1} />
              ))}
            </div>
            <LoadingCard rows={6} />
          </div>
        }
      >
        <EarningsContent />
      </Suspense>
    </div>
  )
}
