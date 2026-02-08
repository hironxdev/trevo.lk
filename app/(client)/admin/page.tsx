import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { AdminStats } from "@/app/(client)/admin/_components/admin-stats"
import { AdminQuickActions } from "@/app/(client)/admin/_components/admin-quick-actions"
import { PendingApprovals } from "@/app/(client)/admin/_components/pending-approvals"
import { RecentActivity } from "@/app/(client)/admin/_components/recent-activity"
import { authOptions } from "@/lib/auth"

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  return (
    <main className="flex-1 bg-muted/30 py-24">
      <div className="mx-auto container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage the Trevo platform</p>
        </div>

        <div className="grid gap-6">
          <AdminStats />
          <AdminQuickActions />
          <div className="grid lg:grid-cols-2 gap-6">
            <PendingApprovals />
            <RecentActivity />
          </div>
        </div>
      </div>
    </main>
  )
}
