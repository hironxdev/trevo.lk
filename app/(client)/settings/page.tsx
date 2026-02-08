import { Metadata } from "next"
import { Suspense } from "react"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardSidebar } from "@/app/(client)/dashboard/_components/dashboard-sidebar"
import { AlertCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Settings | Dashboard",
  description: "Manage your account settings",
}

export default async function SettingsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/sign-in")
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 p-4 md:p-8 pt-24">
      <div className="lg:col-span-1">
        <Suspense fallback={<div className="h-screen bg-muted rounded-lg animate-pulse" />}>
          <DashboardSidebar user={session.user} />
        </Suspense>
      </div>

      <div className="lg:col-span-4">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-2">Manage your account settings</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>Settings management features are under development</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Feature coming soon</p>
                  <p className="text-sm text-blue-700 mt-1">Settings management tools will be available in the next update.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
