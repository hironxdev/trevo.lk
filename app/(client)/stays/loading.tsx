import { Skeleton } from "@/components/ui/skeleton"

export default function StaysLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <main className="flex-1 pt-20">
        {/* Search bar skeleton */}
        <div className="w-full px-4 md:px-8 py-6 bg-background">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto container px-4 py-8">
          <div className="flex gap-8">
            {/* Desktop Sidebar Skeleton */}
            <aside className="hidden lg:block w-80 shrink-0">
              <Skeleton className="h-[600px] rounded-lg" />
            </aside>

            {/* Grid Skeleton */}
            <div className="flex-1 min-w-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-[4/3] rounded-xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
