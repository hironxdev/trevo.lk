import { Suspense } from "react"
import { PartnerHeader } from "../_components/partner-header"
import { NotificationsContent } from "./_components/notifications-content"
import { LoadingCard } from "@/components/partner/loading-card"

export const metadata = {
  title: "Notifications | Partner Dashboard",
  description: "View your notifications and updates",
}

export default function NotificationsPage() {
  return (
    <div>
      <PartnerHeader />
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground mt-1">Stay updated on your bookings and account</p>
      </div>
      <Suspense fallback={<LoadingCard rows={5} />}>
        <NotificationsContent />
      </Suspense>
    </div>
  )
}
