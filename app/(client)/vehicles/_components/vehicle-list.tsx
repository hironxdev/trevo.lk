"use client"

import { useEffect, useState } from "react"
import { getVehicles } from "@/actions/vehicle/list"
import { VehicleCard } from "@/app/(client)/vehicles/_components/vehicle-card"
import { EnhancedVehicleCard } from "@/app/(client)/_components/enhanced-vehicle-card"
import { Button } from "@/components/ui/button"
import { Loader2, LayoutGrid, List, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import type { VehicleCategory } from "@prisma/client"

type getVehiclesReturnType = Awaited<ReturnType<typeof getVehicles>>["data"]

type VehicleWithRelations = Extract<getVehiclesReturnType, { data: unknown }>

interface VehicleListProps {
  onOpenFilters?: () => void
}

export function VehicleList({ onOpenFilters }: VehicleListProps) {
  const searchParams = useSearchParams()
  const [vehicles, setVehicles] = useState<VehicleWithRelations["data"]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    async function fetchVehicles() {
      setLoading(true)
      const category = searchParams.get("category")
      const location = searchParams.get("location")
      const search = searchParams.get("search")
      const minPrice = searchParams.get("minPrice")
      const maxPrice = searchParams.get("maxPrice")
      const startDate = searchParams.get("startDate")
      const endDate = searchParams.get("endDate")
      const withDriver = searchParams.get("withDriver")

      const result = await getVehicles({
        page,
        limit: 12,
        ...(category &&
          category !== "ALL_CATEGORIES" && {
            category: category as VehicleCategory,
          }),
        ...(location && { location }),
        ...(search && { search }),
        ...(minPrice && { minPrice: Number.parseInt(minPrice) }),
        ...(maxPrice && { maxPrice: Number.parseInt(maxPrice) }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(withDriver && { withDriver: withDriver as "ALL" | "true" | "false" | undefined }),
      })

      if (result.success && result.data) {
        setVehicles(result.data.data)
        setTotalPages(result.data.pagination.totalPages)
        setTotalCount(result.data.pagination.total)
      }
      setLoading(false)
    }

    fetchVehicles()
  }, [searchParams, page])

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [searchParams])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Finding the best vehicles for you...</p>
      </div>
    )
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-20 bg-muted/30 rounded-2xl">
        <div className="max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <SlidersHorizontal className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No vehicles found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your filters or search criteria to find more vehicles.
          </p>
          <Button onClick={() => (window.location.href = "/vehicles")} variant="default">
            Clear All Filters
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{vehicles.length}</span> of{" "}
            <span className="font-medium text-foreground">{totalCount}</span> vehicles
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Mobile filter button */}
          <Button variant="outline" size="sm" onClick={onOpenFilters} className="lg:hidden bg-transparent">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>
          {/* View toggle */}
          <div className="hidden sm:flex items-center border rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-1.5 rounded transition-colors",
                viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-1.5 rounded transition-colors",
                viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Vehicle Grid/List */}
      <div
        className={cn(
          viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6" : "flex flex-col gap-4",
        )}
      >
        {vehicles.map((vehicle, index) => (
          viewMode === "grid" ? (
            <EnhancedVehicleCard key={vehicle.id} vehicle={vehicle} index={index} />
          ) : (
            <VehicleCard key={vehicle.id} vehicle={vehicle} variant="list" />
          )
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="bg-transparent"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (page <= 3) {
                pageNum = i + 1
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = page - 2 + i
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={cn(
                    "h-8 min-w-[32px] px-2 rounded text-sm font-medium transition-colors",
                    page === pageNum ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                  )}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="bg-transparent"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}
