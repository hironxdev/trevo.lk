"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

export function EventsFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const toggleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const current = params.getAll(key)

    if (current.includes(value)) {
      params.delete(key)
      current.filter((v) => v !== value).forEach((v) => params.append(key, v))
    } else {
      params.append(key, value)
    }

    router.push(`/events?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/events")
  }

  const categories = [
    { id: "music", label: "Music & Concerts" },
    { id: "sports", label: "Sports" },
    { id: "conference", label: "Conference" },
    { id: "theater", label: "Theater & Arts" },
    { id: "festival", label: "Festival" },
  ]

  const priceRanges = [
    { id: "free", label: "Free" },
    { id: "under-50", label: "Under $50" },
    { id: "50-100", label: "$50 - $100" },
    { id: "over-100", label: "Over $100" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Category</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={searchParams.getAll("category").includes(cat.id)}
                onCheckedChange={() => toggleFilter("category", cat.id)}
              />
              <span className="text-sm">{cat.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Price</h3>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <label key={range.id} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={searchParams.getAll("price").includes(range.id)}
                onCheckedChange={() => toggleFilter("price", range.id)}
              />
              <span className="text-sm">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Event Date</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={searchParams.get("date") === "today"}
              onCheckedChange={() => toggleFilter("date", "today")}
            />
            <span className="text-sm">Today</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={searchParams.get("date") === "this-week"}
              onCheckedChange={() => toggleFilter("date", "this-week")}
            />
            <span className="text-sm">This Week</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={searchParams.get("date") === "this-month"}
              onCheckedChange={() => toggleFilter("date", "this-month")}
            />
            <span className="text-sm">This Month</span>
          </label>
        </div>
      </div>

      {(searchParams.toString() || false) && (
        <Button
          variant="outline"
          className="w-full"
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      )}
    </div>
  )
}
