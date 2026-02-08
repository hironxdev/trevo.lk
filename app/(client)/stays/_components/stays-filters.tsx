"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Filter, X, MapPin, Users, Bed, DollarSign, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { LocationSelector } from "@/components/location-selector"

const categories = [
  { value: "BUDGET", label: "Budget" },
  { value: "STANDARD", label: "Standard" },
  { value: "LUXURY", label: "Luxury" },
  { value: "PREMIUM", label: "Premium" },
  { value: "BEACHFRONT", label: "Beachfront" },
  { value: "HILL_COUNTRY", label: "Hill Country" },
  { value: "CITY_CENTER", label: "City Center" },
  { value: "RURAL", label: "Rural" },
]

const staysTypes = [
  { value: "HOUSE", label: "House" },
  { value: "APARTMENT", label: "Apartment" },
  { value: "VILLA", label: "Villa" },
  { value: "HOTEL", label: "Hotel" },
  { value: "GUEST_HOUSE", label: "Guest House" },
  { value: "BUNGALOW", label: "Bungalow" },
  { value: "ROOM", label: "Room" },
]

interface StaysFiltersProps {
  className?: string
  onClose?: () => void
}

export function StaysFilters({ className, onClose }: StaysFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "ALL_CATEGORIES",
    type: searchParams.get("type") || "ALL_TYPES",
    city: searchParams.get("city") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    guests: searchParams.get("guests") || "",
    bedrooms: searchParams.get("bedrooms") || "",
  })

  const [priceRange, setPriceRange] = useState([
    Number.parseInt(searchParams.get("minPrice") || "0"),
    Number.parseInt(searchParams.get("maxPrice") || "50000"),
  ])

  // Count active filters
  const activeFiltersCount = [
    filters.category !== "ALL_CATEGORIES",
    filters.type !== "ALL_TYPES",
    filters.city !== "",
    filters.minPrice !== "" || filters.maxPrice !== "",
    filters.guests !== "",
    filters.bedrooms !== "",
  ].filter(Boolean).length

  function handleApplyFilters() {
    const params = new URLSearchParams(searchParams.toString())

    // Keep search term if exists
    const search = searchParams.get("search")
    if (search) params.set("search", search)

    if (filters.category && filters.category !== "ALL_CATEGORIES") {
      params.set("category", filters.category)
    } else {
      params.delete("category")
    }

    if (filters.type && filters.type !== "ALL_TYPES") {
      params.set("type", filters.type)
    } else {
      params.delete("type")
    }

    if (filters.city) {
      params.set("city", filters.city)
    } else {
      params.delete("city")
    }

    if (priceRange[0] > 0) {
      params.set("minPrice", priceRange[0].toString())
    } else {
      params.delete("minPrice")
    }

    if (priceRange[1] < 50000) {
      params.set("maxPrice", priceRange[1].toString())
    } else {
      params.delete("maxPrice")
    }

    if (filters.guests) {
      params.set("guests", filters.guests)
    } else {
      params.delete("guests")
    }

    if (filters.bedrooms) {
      params.set("bedrooms", filters.bedrooms)
    } else {
      params.delete("bedrooms")
    }

    router.push(`/stays?${params.toString()}`)
    onClose?.()
  }

  function handleClearFilters() {
    setFilters({
      category: "ALL_CATEGORIES",
      type: "ALL_TYPES",
      city: "",
      minPrice: "",
      maxPrice: "",
      guests: "",
      bedrooms: "",
    })
    setPriceRange([0, 50000])

    const params = new URLSearchParams()
    const search = searchParams.get("search")
    if (search) params.set("search", search)

    router.push(`/stays${params.toString() ? `?${params.toString()}` : ""}`)
    onClose?.()
  }

  return (
    <Card className={cn("border-border", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Filters</CardTitle>
            {activeFiltersCount > 0 && (
              <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Home className="h-4 w-4 text-muted-foreground" />
            Category
          </Label>
          <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
            <SelectTrigger className="bg-muted/50">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL_CATEGORIES">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Property Type */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Property Type</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filters.type === "ALL_TYPES" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilters({ ...filters, type: "ALL_TYPES" })}
              className={filters.type === "ALL_TYPES" ? "" : "bg-transparent"}
            >
              All
            </Button>
            {staysTypes.map((type) => (
              <Button
                key={type.value}
                variant={filters.type === type.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFilters({ ...filters, type: type.value })}
                className={filters.type === type.value ? "" : "bg-transparent"}
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            Location
          </Label>
          <LocationSelector
            value={filters.city}
            onChange={(value) => setFilters({ ...filters, city: value })}
            placeholder="Select location"
            showDistrict={false}
          />
        </div>

        {/* Price Range */}
        <div className="space-y-4">
          <Label className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            Price Range (Rs/night)
          </Label>
          <Slider value={priceRange} onValueChange={setPriceRange} min={0} max={50000} step={500} className="w-full" />
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                type="number"
                placeholder="Min"
                value={priceRange[0] || ""}
                onChange={(e) => setPriceRange([Number.parseInt(e.target.value) || 0, priceRange[1]])}
                className="bg-muted/50 text-sm"
              />
            </div>
            <span className="text-muted-foreground">-</span>
            <div className="flex-1">
              <Input
                type="number"
                placeholder="Max"
                value={priceRange[1] || ""}
                onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value) || 50000])}
                className="bg-muted/50 text-sm"
              />
            </div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Rs {priceRange[0]?.toLocaleString()}</span>
            <span>Rs {priceRange[1]?.toLocaleString()}</span>
          </div>
        </div>

        {/* Guests */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            Guests
          </Label>
          <Select value={filters.guests} onValueChange={(value) => setFilters({ ...filters, guests: value })}>
            <SelectTrigger className="bg-muted/50">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Any</SelectItem>
              {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}+ guests
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bedrooms */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Bed className="h-4 w-4 text-muted-foreground" />
            Bedrooms
          </Label>
          <Select value={filters.bedrooms} onValueChange={(value) => setFilters({ ...filters, bedrooms: value })}>
            <SelectTrigger className="bg-muted/50">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Any</SelectItem>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}+ bedrooms
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <Button onClick={handleApplyFilters} className="w-full">
            Apply Filters
          </Button>
          <Button onClick={handleClearFilters} variant="outline" className="w-full bg-transparent">
            Clear All
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
