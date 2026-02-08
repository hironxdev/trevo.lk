import { VehicleGridSkeleton } from "@/components/ui/skeletons"

export default function VehiclesLoading() {
  return (
    <main className="flex-1 bg-muted/30 py-24">
      <div className="mx-auto container px-4 py-8">
        <div className="mb-8 space-y-2">
          <div className="h-9 w-48 bg-muted animate-pulse rounded-md" />
          <div className="h-5 w-64 bg-muted animate-pulse rounded-md" />
        </div>
        <VehicleGridSkeleton count={9} />
      </div>
    </main>
  )
}
