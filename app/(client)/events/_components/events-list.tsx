"use client"

import { useEffect, useState } from "react"
import { getEvents } from "@/actions/events/list"
import { EventCard } from "@/app/(client)/events/_components/event-card"
import { Button } from "@/components/ui/button"
import { Loader2, SlidersHorizontal } from "lucide-react"
import { useSearchParams } from "next/navigation"

interface EventsListProps {
  onOpenFilters?: () => void
}

interface EventWithPrices {
  id: string
  slug: string
  titleEn: string
  titleSi?: string
  city: string
  venueName: string
  startAt: Date
  endAt?: Date
  posterUrl?: string
  category?: string
  ticketTypes: Array<{ price: number }>
}

export function EventsList({ onOpenFilters }: EventsListProps) {
  const searchParams = useSearchParams()
  const [events, setEvents] = useState<EventWithPrices[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true)
      const city = searchParams.get("city")
      const search = searchParams.get("search")
      const category = searchParams.get("category")
      const minPrice = searchParams.get("minPrice")
      const maxPrice = searchParams.get("maxPrice")
      const startDate = searchParams.get("startDate")
      const endDate = searchParams.get("endDate")

      const result = await getEvents({
        page,
        limit: 12,
        ...(city && { city }),
        ...(search && { search }),
        ...(category && { category }),
        ...(minPrice && { minPrice: Number.parseInt(minPrice) }),
        ...(maxPrice && { maxPrice: Number.parseInt(maxPrice) }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
      })

      if (result.success && result.data) {
        setEvents(result.data.data as EventWithPrices[])
        setTotalPages(result.data.pagination.totalPages)
        setTotalCount(result.data.pagination.total)
      }
      setLoading(false)
    }

    fetchEvents()
  }, [searchParams, page])

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [searchParams])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Finding great events for you...</p>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-20 bg-muted/30 rounded-2xl">
        <div className="max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <SlidersHorizontal className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No events found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your filters or search criteria to find more events.
          </p>
          <Button onClick={() => (window.location.href = "/events")} variant="default">
            Clear All Filters
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {(page - 1) * 12 + 1} - {Math.min(page * 12, totalCount)} of {totalCount} events
        </p>
        <Button onClick={() => onOpenFilters?.()} variant="outline" size="sm" className="lg:hidden">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          const prices = event.ticketTypes.map((t) => t.price)
          const minPrice = prices.length > 0 ? Math.min(...prices) : undefined
          const maxPrice = prices.length > 0 ? Math.max(...prices) : undefined

          return (
            <EventCard
              key={event.id}
              id={event.id}
              slug={event.slug}
              titleEn={event.titleEn}
              titleSi={event.titleSi}
              city={event.city}
              venueName={event.venueName}
              startAt={event.startAt}
              endAt={event.endAt}
              posterUrl={event.posterUrl}
              category={event.category}
              minPrice={minPrice}
              maxPrice={maxPrice}
            />
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 py-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant={page === p ? "default" : "outline"}
              size="sm"
              onClick={() => setPage(p)}
            >
              {p}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
