"use client"

import { useState, useEffect } from "react"
import { getVehicles } from "@/actions/vehicle/list"
import { VehicleCard } from "./vehicle-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Crown, DollarSign, Car, Palmtree, Bus, Briefcase } from "lucide-react"
import { VehicleCategory } from "@prisma/client"

const categoryInfo = [
  {
    slug: "BUDGET_DAILY",
    name: "Budget Friendly",
    description: "Affordable daily rentals",
    icon: DollarSign,
    color: "text-green-600",
    bg: "bg-green-500/10",
  },
  {
    slug: "LUXURY",
    name: "Luxury Collection",
    description: "Premium vehicles for special occasions",
    icon: Crown,
    color: "text-amber-600",
    bg: "bg-amber-500/10",
  },
  {
    slug: "MID_RANGE",
    name: "Mid Range",
    description: "Comfortable and reliable",
    icon: Car,
    color: "text-blue-600",
    bg: "bg-blue-500/10",
  },
  {
    slug: "TOURISM",
    name: "Tourism Special",
    description: "Perfect for exploring",
    icon: Palmtree,
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
  },
  {
    slug: "TRAVEL",
    name: "Long Distance Travel",
    description: "Comfortable rides",
    icon: Bus,
    color: "text-purple-600",
    bg: "bg-purple-500/10",
  },
  {
    slug: "BUSINESS",
    name: "Business Class",
    description: "Professional vehicles",
    icon: Briefcase,
    color: "text-slate-600",
    bg: "bg-slate-500/10",
  },
]

interface CategorySectionProps {
  categorySlug: string
  limit?: number
}

function CategorySection({ categorySlug, limit = 4 }: CategorySectionProps) {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const category = categoryInfo.find((c) => c.slug === categorySlug)
  if (!category) return null

  const Icon = category.icon

  useEffect(() => {
    async function fetchVehicles() {
      setLoading(true)
      const result = await getVehicles({
        category: categorySlug as VehicleCategory,
        limit,
        page: 1,
      })
      if (result.success && result.data?.data) {
        setVehicles(result.data.data)
      }
      setLoading(false)
    }

    fetchVehicles()
  }, [categorySlug, limit])

  return (
    <div className="space-y-6">
      {/* Category Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${category.bg}`}>
            <Icon className={`h-5 w-5 ${category.color}`} />
          </div>
          <div>
            <h3 className="text-xl font-semibold">{category.name}</h3>
            <p className="text-sm text-muted-foreground">{category.description}</p>
          </div>
        </div>
        <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary/80">
          <Link href={`/vehicles?category=${categorySlug}`}>
            View All
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Vehicles Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: limit }).map((_, i) => (
            <div
              key={i}
              className="h-40 bg-muted animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : vehicles.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export  function CategorizedVehicles() {
  const [availableCategories, setAvailableCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true)
      const categoriesWithVehicles = await Promise.all(
        categoryInfo.map(async (cat) => {
          const result = await getVehicles({
            category: cat.slug as VehicleCategory,
            limit: 1,
            page: 1,
          })
          return {
            ...cat,
            hasVehicles: result.success && result.data?.data?.length > 0,
          }
        }),
      )
      setAvailableCategories(categoriesWithVehicles.filter((c) => c.hasVehicles))
      setLoading(false)
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <section className="w-full px-4 md:px-8 py-12 bg-background">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-lg text-muted-foreground">Loading categories...</p>
        </div>
      </section>
    )
  }

  if (availableCategories.length === 0) return null

  return (
    <section className="w-full px-4 md:px-8 py-12 bg-background">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Browse by Category</h2>
          <p className="text-muted-foreground text-lg">
            Find the perfect vehicle for any occasion from our diverse collection
          </p>
        </div>

        {/* Category Sections - Show top 3 categories with vehicles */}
        {availableCategories.slice(0, 3).map((category) => (
          <CategorySection
            key={category.slug}
            categorySlug={category.slug}
            limit={4}
          />
        ))}

        {/* View All Categories CTA */}
        <div className="text-center pt-4">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/vehicles">
              Explore All Vehicles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
