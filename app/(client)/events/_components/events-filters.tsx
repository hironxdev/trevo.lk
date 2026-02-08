"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { X } from "lucide-react"

interface EventsFiltersProps {
  onClose?: () => void
  className?: string
}

const CATEGORIES = ["MUSIC", "SPORTS", "CONFERENCE", "WORKSHOP", "FESTIVAL", "CONCERT"]
const SRI_LANKAN_CITIES = ["Colombo", "Kandy", "Galle", "Matara", "Jaffna", "Anuradhapura", "Negombo"]

export function EventsFilters({ onClose, className }: EventsFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("category")?.split(",").filter(Boolean) || []
  )
  const [selectedCities, setSelectedCities] = useState<string[]>(
    searchParams.get("city")?.split(",").filter(Boolean) || []
  )
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "")
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "")
  const [search, setSearch] = useState(searchParams.get("search") || "")

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (search) params.set("search", search)
    if (selectedCategories.length > 0) params.set("category", selectedCategories.join(","))
    if (selectedCities.length > 0) params.set("city", selectedCities.join(","))
    if (minPrice) params.set("minPrice", minPrice)
    if (maxPrice) params.set("maxPrice", maxPrice)

    router.push(`/events?${params.toString()}`)
    onClose?.()
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedCities([])
    setMinPrice("")
    setMaxPrice("")
    setSearch("")
    router.push("/events")
    onClose?.()
  }

  return (
    <Card className={`border-0 shadow-none ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filters</CardTitle>
          {onClose && <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search */}
        <div>
          <Label htmlFor="search" className="text-sm font-medium">
            Search Events
          </Label>
          <Input
            id="search"
            placeholder="Event name, venue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-2"
          />
        </div>

        <Separator />

        {/* Categories */}
        <div>
          <h3 className="font-semibold text-sm mb-3">Category</h3>
          <div className="space-y-2">
            {CATEGORIES.map((cat) => (
              <div key={cat} className="flex items-center">
                <Checkbox
                  id={`cat-${cat}`}
                  checked={selectedCategories.includes(cat)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCategories([...selectedCategories, cat])
                    } else {
                      setSelectedCategories(selectedCategories.filter((c) => c !== cat))
                    }
                  }}
                />
                <Label htmlFor={`cat-${cat}`} className="ml-2 cursor-pointer text-sm">
                  {cat}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Cities */}
        <div>
          <h3 className="font-semibold text-sm mb-3">City</h3>
          <div className="space-y-2">
            {SRI_LANKAN_CITIES.map((city) => (
              <div key={city} className="flex items-center">
                <Checkbox
                  id={`city-${city}`}
                  checked={selectedCities.includes(city)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCities([...selectedCities, city])
                    } else {
                      setSelectedCities(selectedCities.filter((c) => c !== city))
                    }
                  }}
                />
                <Label htmlFor={`city-${city}`} className="ml-2 cursor-pointer text-sm">
                  {city}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Price Range */}
        <div>
          <h3 className="font-semibold text-sm mb-3">Price Range (Rs.)</h3>
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button onClick={applyFilters} className="w-full">
            Apply Filters
          </Button>
          <Button onClick={clearFilters} variant="outline" className="w-full">
            Clear All
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
