import { Suspense } from "react"
import { AdminStaysBookingsContent } from "./_components/admin-stays-bookings-content"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Stays Bookings | Admin Dashboard",
  description: "Manage all stays bookings",
}

export default function AdminStaysBookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Stays Bookings</h1>
        <p className="text-muted-foreground mt-1">View and manage all stays bookings</p>
      </div>
      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <AdminStaysBookingsContent />
      </Suspense>
    </div>
  )
}
