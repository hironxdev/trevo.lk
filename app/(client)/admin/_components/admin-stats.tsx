"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAdminStats } from "@/actions/admin/stats"
import { Users, Briefcase, Car, Calendar, DollarSign, AlertCircle, TrendingUp } from "lucide-react"
import { StatsGridSkeleton } from "@/components/ui/skeletons"

interface Stats {
  totalUsers: number
  totalPartners: number
  totalVehicles: number
  totalBookings: number
  pendingPartners: number
  pendingVehicles: number
  totalRevenue: number
  monthlyRevenue: number
}

export function AdminStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        const result = await getAdminStats()
        if (result.success && result.data) {
          setStats(result.data)
        } else {
          setError(result.error || "Failed to load stats")
        }
      } catch (err) {
        setError("An error occurred while loading stats")
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return <StatsGridSkeleton count={8} />
  }

  if (error) {
    return (
      <Card className="p-6">
        <p className="text-destructive text-center">{error}</p>
      </Card>
    )
  }

  if (!stats) return null

  const statCards = [
    { title: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-500" },
    { title: "Partners", value: stats.totalPartners, icon: Briefcase, color: "text-primary" },
    { title: "Vehicles", value: stats.totalVehicles, icon: Car, color: "text-green-500" },
    { title: "Total Bookings", value: stats.totalBookings, icon: Calendar, color: "text-purple-500" },
    {
      title: "Pending Partners",
      value: stats.pendingPartners,
      icon: AlertCircle,
      color: stats.pendingPartners > 0 ? "text-yellow-500" : "text-muted-foreground",
      highlight: stats.pendingPartners > 0,
    },
    {
      title: "Pending Vehicles",
      value: stats.pendingVehicles,
      icon: AlertCircle,
      color: stats.pendingVehicles > 0 ? "text-orange-500" : "text-muted-foreground",
      highlight: stats.pendingVehicles > 0,
    },
    {
      title: "This Month",
      value: `Rs ${stats.monthlyRevenue?.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Total Revenue",
      value: `Rs ${stats.totalRevenue?.toLocaleString()}`,
      icon: DollarSign,
      color: "text-primary",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className={stat.highlight ? "border-yellow-500/50" : ""}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
