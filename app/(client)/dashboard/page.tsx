import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardStats } from "@/app/(client)/dashboard/_components/dashboard-stats"
import { RecentBookings } from "@/app/(client)/dashboard/_components/recent-bookings"
import { QuickActions } from "@/app/(client)/dashboard/_components/quick-actions"
import { FavoriteVehicles } from "@/app/(client)/dashboard/_components/favorite-vehicles"
import { DashboardSidebar } from "@/app/(client)/dashboard/_components/dashboard-sidebar"
import { MobileDashboardNav } from "@/app/(client)/dashboard/_components/mobile-dashboard-nav"
import { PopularVehicles } from "@/app/(client)/_components/popular-vehicles"
import { Suspense } from "react"
import { VehicleGridSkeleton } from "@/app/(client)/_components/vehicle-grid-skeleton"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/sign-in")
  }

  if (session.user.role === "ADMIN") {
    redirect("/admin")
  }

  if (session.user.role === "BUSINESS_PARTNER" || session.user.role === "INDIVIDUAL_PARTNER") {
    redirect("/partner/dashboard")
  }

  return (
    <div className="flex min-h-screen bg-muted/30 pt-20">
      {/* Desktop Sidebar */}
      <DashboardSidebar user={session.user} />

      {/* Main Content */}
      <main className="flex-1 pb-20 lg:pb-8">
        <div className="container mx-auto px-4 py-6 lg:py-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              Welcome back, {session.user.name?.split(" ")[0] || "there"}!
            </h1>
            <p className="text-muted-foreground">Here is what is happening with your bookings</p>
          </div>

          {/* Stats */}
          <div className="mb-8">
            <DashboardStats />
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <QuickActions />
          </div>

          {/* Recent Bookings & Favorites */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <RecentBookings />
            </div>
            <div className="lg:col-span-1">
              <FavoriteVehicles />
            </div>
          </div>

          {/* Recommended Vehicles */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
            <Suspense fallback={<VehicleGridSkeleton />}>
              <PopularVehicles />
            </Suspense>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <MobileDashboardNav />
    </div>
  )
}
