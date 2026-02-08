import { Skeleton } from "@/components/ui/skeleton"

export function VehicleGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-card rounded-xl overflow-hidden border border-border">
          {/* Image Skeleton */}
          <Skeleton className="aspect-[4/3] w-full" />

          {/* Content Skeleton */}
          <div className="p-3 md:p-4 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
