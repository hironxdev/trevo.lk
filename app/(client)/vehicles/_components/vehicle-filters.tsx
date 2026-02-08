"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Filter, X, MapPin, User, Car, DollarSign, CalendarDays, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { LocationSelector } from "@/components/location-selector"
import { useLocationPreference } from "@/hooks/use-location-preference"

const categories = [
  { value: "BUDGET_DAILY", label: "Budget Daily" },
  { value: "LUXURY", label: "Luxury" },
  { value: "MID_RANGE", label: "Mid Range" },
  { value: "TOURISM", label: "Tourism" },
  { value: "TRAVEL", label: "Travel" },
  { value: "BUSINESS", label: "Business" },
]

const vehicleTypes = [
  { value: "CAR", label: "Car" },
  { value: "VAN", label: "Van" },
  { value: "SUV", label: "SUV" },
  { value: "BIKE", label: "Bike" },
  { value: "BUS", label: "Bus" },
]

interface VehicleFiltersProps {
  className?: string
  onClose?: () => void
}

export function VehicleFilters({ className, onClose }: VehicleFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { location: preferredLocation } = useLocationPreference()

  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "ALL_CATEGORIES",
    type: searchParams.get("type") || "ALL_TYPES",
    location: searchParams.get("location") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    withDriver: searchParams.get("withDriver") || "ALL",
    rentalType: searchParams.get("rentalType") || "ALL",
  })

  const [priceRange, setPriceRange] = useState([
    Number.parseInt(searchParams.get("minPrice") || "0"),
    Number.parseInt(searchParams.get("maxPrice") || "50000"),
  ])

  useEffect(() => {
    if (!searchParams.get("location") && preferredLocation?.city && !filters.location) {
      setFilters((prev) => ({ ...prev, location: preferredLocation.city }))
    }
  }, [preferredLocation, searchParams, filters.location])

  // Count active filters - updated to include rental type
  const activeFiltersCount = [
    filters.category !== "ALL_CATEGORIES",
    filters.type !== "ALL_TYPES",
    filters.location !== "",
    filters.minPrice !== "" || filters.maxPrice !== "",
    filters.withDriver !== "ALL",
    filters.rentalType !== "ALL",
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

    if (filters.location) {
      params.set("location", filters.location)
    } else {
      params.delete("location")
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

    if (filters.withDriver && filters.withDriver !== "ALL") {
      params.set("withDriver", filters.withDriver)
    } else {
      params.delete("withDriver")
    }

    if (filters.rentalType && filters.rentalType !== "ALL") {
      params.set("rentalType", filters.rentalType)
    } else {
      params.delete("rentalType")
    }

    router.push(`/vehicles?${params.toString()}`)
    onClose?.()
  }

  function handleClearFilters() {
    setFilters({
      category: "ALL_CATEGORIES",
      type: "ALL_TYPES",
      minPrice: "",
      maxPrice: "",
      withDriver: "ALL",
      location: "",
      rentalType: "ALL",
    })
    setPriceRange([0, 50000])

    const params = new URLSearchParams()
    const search = searchParams.get("search")
    if (search) params.set("search", search)

    router.push(`/vehicles${params.toString() ? `?${params.toString()}` : ""}`)
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
        {/* Rental Type Filter - NEW */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            Rental Type
          </Label>
          <div className="space-y-2">
            {[
              { value: "ALL", label: "All Types", icon: null },
              { value: "SHORT_TERM", label: "Short-term (Daily)", icon: Clock },
              { value: "LONG_TERM", label: "Long-term (Monthly)", icon: CalendarDays },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilters({ ...filters, rentalType: option.value })}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-lg border transition-colors",
                  filters.rentalType === option.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50",
                )}
              >
                <span className="text-sm flex items-center gap-2">
                  {option.icon && <option.icon className="h-4 w-4" />}
                  {option.label}
                </span>
                <div
                  className={cn(
                    "h-4 w-4 rounded-full border-2 transition-colors",
                    filters.rentalType === option.value ? "border-primary bg-primary" : "border-muted-foreground",
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Car className="h-4 w-4 text-muted-foreground" />
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

        {/* Vehicle Type */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Vehicle Type</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filters.type === "ALL_TYPES" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilters({ ...filters, type: "ALL_TYPES" })}
              className={filters.type === "ALL_TYPES" ? "" : "bg-transparent"}
            >
              All
            </Button>
            {vehicleTypes.map((type) => (
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

        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            Location
          </Label>
          <LocationSelector
            value={filters.location}
            onChange={(value) => setFilters({ ...filters, location: value })}
            placeholder="Select location"
            showDistrict={false}
          />
          {preferredLocation?.city && !filters.location && (
            <button
              onClick={() => setFilters({ ...filters, location: preferredLocation.city })}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              <MapPin className="h-3 w-3" />
              Use saved location: {preferredLocation.city}
            </button>
          )}
        </div>

        {/* Price Range */}
        <div className="space-y-4">
          <Label className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            Price Range (Rs/day)
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

        {/* Driver Option */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            Driver Option
          </Label>
          <div className="space-y-2">
            {[
              { value: "ALL", label: "All Options" },
              { value: "true", label: "With Driver" },
              { value: "false", label: "Self Drive" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilters({ ...filters, withDriver: option.value })}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-lg border transition-colors",
                  filters.withDriver === option.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50",
                )}
              >
                <span className="text-sm">{option.label}</span>
                <div
                  className={cn(
                    "h-4 w-4 rounded-full border-2 transition-colors",
                    filters.withDriver === option.value ? "border-primary bg-primary" : "border-muted-foreground",
                  )}
                />
              </button>
            ))}
          </div>
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
