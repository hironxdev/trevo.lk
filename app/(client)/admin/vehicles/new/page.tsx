import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { AdminVehicleCreateForm } from "@/app/(client)/admin/_components/admin-vehicle-create-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Add New Vehicle | Admin Dashboard",
  description: "Create a vehicle for a partner",
}

export default async function AdminNewVehiclePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  return (
    <main className="flex-1 bg-muted/30 py-24">
      <div className="mx-auto container px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/vehicles">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold mb-1">Add New Vehicle</h1>
            <p className="text-muted-foreground">Create a vehicle for a partner account</p>
          </div>
        </div>

        <AdminVehicleCreateForm />
      </div>
    </main>
  )
}
