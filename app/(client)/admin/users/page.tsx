import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Navigation } from "@/app/(client)/_components/layout/navigation"
import { Footer } from "@/app/(client)/_components/layout/footer"
import { UserManagement } from "@/app/(client)/admin/_components/user-management"
import { authOptions } from "@/lib/auth"

export default async function AdminUsersPage() {
      const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  return (
      <main className="flex-1 bg-muted/30 py-24">
        <div className="mx-auto container px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">User Management</h1>
            <p className="text-muted-foreground">View and manage all users</p>
          </div>

          <UserManagement />
        </div>
      </main>
  )
}
