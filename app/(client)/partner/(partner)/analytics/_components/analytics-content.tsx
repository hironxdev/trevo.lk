"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getPartnerAnalytics } from "@/actions/partner/earnings"
import { Car, Star, Clock, TrendingUp, BarChart3 } from "lucide-react"
import { StatCard } from "@/components/partner/stat-card"
import { ErrorState } from "@/components/partner/error-state"
import { EmptyState } from "@/components/partner/empty-state"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Legend } from "recharts"
import { cn } from "@/lib/utils"

interface AnalyticsData {
  statusCounts: Record<string, number>
  vehiclePerformance: {
    id: string
    name: string
    image: string | null
    category: string
    totalBookings: number
    completedBookings: number
    revenue: number
    rating: number
    reviewCount: number
    status: string
    isApproved: boolean
  }[]
  categoryStats: Record<string, { count: number; bookings: number; revenue: number }>
  monthlyBookings: { month: string; total: number; completed: number; cancelled: number }[]
  metrics: {
    totalVehicles: number
    activeVehicles: number
    totalBookings: number
    completedBookings: number
    avgDuration: number
    conversionRate: number
    avgRating: number
    totalReviews: number
  }
}

export function AnalyticsContent() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getPartnerAnalytics()
      if (result.success && result.data) {
        setData(result.data as AnalyticsData)
      } else {
        setError(result.error || "Failed to load analytics")
      }
    } catch (err) {
      setError("An error occurred while loading analytics")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchData} />
  }

  if (!data || data.metrics.totalVehicles === 0) {
    return (
      <EmptyState
        icon={BarChart3}
        title="No analytics data yet"
        description="Add vehicles and complete rentals to see performance insights and metrics."
        actionLabel="Add Vehicle"
        actionHref="/partner/vehicles/new"
      />
    )
  }

  const chartConfig = {
    completed: {
      label: "Completed",
      color: "hsl(var(--primary))",
    },
    cancelled: {
      label: "Cancelled",
      color: "hsl(var(--destructive))",
    },
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Conversion Rate"
          value={`${data.metrics.conversionRate}%`}
          icon={TrendingUp}
          iconColor="text-green-500"
          description="Completed vs total bookings"
        />
        <StatCard
          title="Average Duration"
          value={`${data.metrics.avgDuration} days`}
          icon={Clock}
          iconColor="text-blue-500"
          description="Per rental"
        />
        <StatCard
          title="Average Rating"
          value={data.metrics.avgRating > 0 ? data.metrics.avgRating.toFixed(1) : "N/A"}
          icon={Star}
          iconColor="text-yellow-500"
          description={`From ${data.metrics.totalReviews} reviews`}
        />
        <StatCard
          title="Active Vehicles"
          value={`${data.metrics.activeVehicles}/${data.metrics.totalVehicles}`}
          icon={Car}
          iconColor="text-primary"
          description="Available for rent"
        />
      </div>

      {/* Booking Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Trends (Last 6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyBookings}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="completed" fill="var(--color-completed)" name="Completed" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cancelled" fill="var(--color-cancelled)" name="Cancelled" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Booking Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(data.statusCounts).map(([status, count]) => {
              const total = data.metrics.totalBookings
              const percentage = total > 0 ? (count / total) * 100 : 0
              const statusColors: Record<string, string> = {
                PENDING: "bg-yellow-500",
                CONFIRMED: "bg-blue-500",
                ACTIVE: "bg-green-500",
                COMPLETED: "bg-primary",
                CANCELLED: "bg-red-500",
                REJECTED: "bg-red-500",
              }

              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{status}</span>
                    <span className="text-sm text-muted-foreground">
                      {count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <Progress value={percentage} className={cn("h-2", statusColors[status])} />
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(data.categoryStats).map(([category, stats]) => (
              <div key={category} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">{category}</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.count} vehicle{stats.count > 1 ? "s" : ""} • {stats.bookings} bookings
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">Rs {stats.revenue?.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total revenue</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.vehiclePerformance.map((vehicle, index) => (
              <div
                key={vehicle.id}
                className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-sm font-semibold">
                  {index + 1}
                </div>
                <div className="relative h-12 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                  {vehicle.image ? (
                    <Image src={vehicle.image || "/placeholder.svg"} alt={vehicle.name} fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Car className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{vehicle.name}</p>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        !vehicle.isApproved && "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
                        vehicle.isApproved &&
                          vehicle.status === "AVAILABLE" &&
                          "bg-green-500/10 text-green-600 border-green-500/20",
                      )}
                    >
                      {!vehicle.isApproved ? "Pending" : vehicle.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{vehicle.category}</span>
                    <span>{vehicle.totalBookings} bookings</span>
                    {vehicle.rating > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        {vehicle.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">Rs {vehicle.revenue?.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
