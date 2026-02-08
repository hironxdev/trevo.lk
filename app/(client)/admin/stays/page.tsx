import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { StaysManagement } from "@/app/(client)/admin/_components/stays-management"
import { authOptions } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LayoutDashboard, Plus } from "lucide-react"

export default async function AdminStaysPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  return (
    <main className="flex-1 bg-muted/30 py-24">
      <div className="mx-auto container px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Stays Management</h1>
            <p className="text-muted-foreground">View and manage all property listings</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link href="/admin/stays/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
          </div>
        </div>

        <StaysManagement />
      </div>
    </main>
  )
}
