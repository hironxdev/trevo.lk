"use client"

import { useEffect, useState } from "react"
import { getStays } from "@/actions/stays/list"
import { StaysCard, type StaysSuccessType } from "@/app/(client)/stays/_components/stays-card"
import { Button } from "@/components/ui/button"
import { Loader2, LayoutGrid, List, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import type { StaysCategoryType, StaysType } from "@prisma/client"

interface StaysListProps {
  onOpenFilters?: () => void
}

export function StaysList({ onOpenFilters }: StaysListProps) {
  const searchParams = useSearchParams()
  const [stays, setStays] = useState<StaysSuccessType["data"]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    async function fetchStays() {
      setLoading(true)
      const category = searchParams.get("category")
      const type = searchParams.get("type")
      const city = searchParams.get("city")
      const district = searchParams.get("district")
      const search = searchParams.get("search")
      const minPrice = searchParams.get("minPrice")
      const maxPrice = searchParams.get("maxPrice")
      const guests = searchParams.get("guests")
      const bedrooms = searchParams.get("bedrooms")
      const checkIn = searchParams.get("checkIn")
      const checkOut = searchParams.get("checkOut")

      const result = await getStays({
        page,
        limit: 12,
        ...(category && category !== "ALL_CATEGORIES" && { category: category as StaysCategoryType }),
        ...(type && type !== "ALL_TYPES" && { type: type as StaysType }),
        ...(city && { city }),
        ...(district && { district }),
        ...(search && { search }),
        ...(minPrice && { minPrice: Number.parseInt(minPrice) }),
        ...(maxPrice && { maxPrice: Number.parseInt(maxPrice) }),
        ...(guests && { guests: Number.parseInt(guests) }),
        ...(bedrooms && { bedrooms: Number.parseInt(bedrooms) }),
        ...(checkIn && { checkIn: new Date(checkIn) }),
        ...(checkOut && { checkOut: new Date(checkOut) }),
      })

      if (result.success && result.data) {
        setStays(result.data.data)
        setTotalPages(result.data.pagination.totalPages)
        setTotalCount(result.data.pagination.total)
      }
      setLoading(false)
    }

    fetchStays()
  }, [searchParams, page])

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [searchParams])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Finding the best stays for you...</p>
      </div>
    )
  }

  if (stays.length === 0) {
    return (
      <div className="text-center py-20 bg-muted/30 rounded-2xl">
        <div className="max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <SlidersHorizontal className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No stays found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your filters or search criteria to find more properties.
          </p>
          <Button onClick={() => (window.location.href = "/stays")} variant="default">
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
            Showing <span className="font-medium text-foreground">{stays.length}</span> of{" "}
            <span className="font-medium text-foreground">{totalCount}</span> stays
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

      {/* Stays Grid/List */}
      <div
        className={cn(
          viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6" : "flex flex-col gap-4",
        )}
      >
        {stays.map((item) => (
          <StaysCard key={item.id} stays={item} variant={viewMode} />
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
