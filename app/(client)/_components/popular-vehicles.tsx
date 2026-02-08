"use client"

import { useState, useEffect } from "react"
import { getVehicles } from "@/actions/vehicle/list"
import { EnhancedVehicleCard } from "./enhanced-vehicle-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, TrendingUp, Sparkles } from "lucide-react"
import { VehicleGridSkeleton } from "./vehicle-grid-skeleton"
import { motion } from "framer-motion"

export function PopularVehicles() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchVehicles() {
      setLoading(true)
      const result = await getVehicles({ limit: 8, page: 1 })
      if (result.success && result.data?.data?.length) {
        setVehicles(result.data.data)
      }
      setLoading(false)
    }

    fetchVehicles()
  }, [])

  if (loading) {
    return <VehicleGridSkeleton />
  }

  if (!vehicles.length) {
    return null
  }

  return (
    <section className="w-full px-4 md:px-8 py-12 md:py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-foreground">Popular Vehicles</h2>
              <p className="text-sm md:text-base text-muted-foreground">Most booked vehicles this month</p>
            </div>
          </motion.div>
          <Button asChild variant="outline" size="lg" className="hidden sm:flex bg-white hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm">
            <Link href="/vehicles" data-testid="view-all-vehicles">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {vehicles.map((vehicle, index) => (
            <EnhancedVehicleCard key={vehicle.id} vehicle={vehicle} index={index} />
          ))}
        </div>

        {/* Mobile View All */}
        <div className="flex justify-center mt-8 sm:hidden">
          <Button asChild variant="outline" size="lg" className="bg-white shadow-sm">
            <Link href="/vehicles" data-testid="view-all-vehicles-mobile">
              View All Vehicles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
