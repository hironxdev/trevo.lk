import { Metadata } from "next"
import { AdminSidebar } from "@/app/(client)/admin/_components/admin-sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Analytics | Admin",
  description: "Platform analytics and insights",
}

export default function AdminAnalyticsPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 p-4 md:p-8">
      <div className="lg:col-span-1">
        <AdminSidebar />
      </div>

      <div className="lg:col-span-4">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
            <BreadcrumbSeparator />
            <BreadcrumbPage>Analytics</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground mt-2">View platform metrics and insights</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>Advanced analytics features are under development</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Feature coming soon</p>
                  <p className="text-sm text-blue-700 mt-1">Comprehensive analytics dashboard will be available in the next update.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
