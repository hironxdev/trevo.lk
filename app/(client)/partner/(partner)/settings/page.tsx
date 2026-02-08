import { Suspense } from "react"
import { PartnerHeader } from "../_components/partner-header"
import { SettingsContent } from "./_components/settings-content"
import { LoadingCard } from "@/components/partner/loading-card"

export const metadata = {
  title: "Settings | Partner Dashboard",
  description: "Manage your partner account settings",
}

export default function SettingsPage() {
  return (
    <div>
      <PartnerHeader />
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>
      <Suspense
        fallback={
          <div className="max-w-2xl space-y-6">
            <LoadingCard rows={4} />
            <LoadingCard rows={3} />
          </div>
        }
      >
        <SettingsContent />
      </Suspense>
    </div>
  )
}
