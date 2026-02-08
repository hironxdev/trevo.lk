import { Suspense } from "react"
import { PartnerHeader } from "../_components/partner-header"
import { AnalyticsContent } from "./_components/analytics-content"
import { LoadingCard } from "@/components/partner/loading-card"

export const metadata = {
  title: "Analytics | Partner Dashboard",
  description: "View insights and performance metrics for your vehicles",
}

export default function AnalyticsPage() {
  return (
    <div>
      <PartnerHeader />
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">Performance insights and metrics for your rental business</p>
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
        <AnalyticsContent />
      </Suspense>
    </div>
  )
}
