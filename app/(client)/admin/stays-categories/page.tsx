import { Suspense } from "react"
import { StaysCategoryManagement } from "./_components/stays-category-management"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Stays Categories | Admin Dashboard",
  description: "Manage stays/property categories",
}

export default function AdminStaysCategoriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Stays Categories</h1>
        <p className="text-muted-foreground mt-1">Manage property categories for stays listings</p>
      </div>
      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <StaysCategoryManagement />
      </Suspense>
    </div>
  )
}
