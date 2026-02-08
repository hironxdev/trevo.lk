"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getPartnerStats } from "@/actions/partner/stats"
import { Car, Calendar, CheckCircle, DollarSign, Clock, TrendingUp } from "lucide-react"
import { StatsGridSkeleton } from "@/components/ui/skeletons"
import Link from "next/link"

interface Stats {
  totalVehicles: number
  activeVehicles: number
  pendingVehicles: number
  activeBookings: number
  completedBookings: number
  totalEarnings: number
  monthlyEarnings: number
}

export function PartnerStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        const result = await getPartnerStats()
        if (result.success && result.data) {
          setStats({
            totalVehicles: result.data.totalVehicles,
            activeVehicles: result.data.activeVehicles ?? 0,
            pendingVehicles: result.data.pendingVehicles,
            activeBookings: result.data.activeBookings,
            completedBookings: result.data.completedBookings ?? 0,
            totalEarnings: result.data.totalEarnings,
            monthlyEarnings: result.data.monthlyEarnings ?? 0,
          })
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
    return <StatsGridSkeleton count={6} />
  }

  if (error) {
    return (
      <Card className="p-6">
        <p className="text-destructive text-center">{error}</p>
      </Card>
    )
  }

  if (!stats) return <></>

  const statCards = [
    {
      title: "Total Vehicles",
      value: stats.totalVehicles,
      icon: Car,
      color: "text-primary",
      link: "/partner/vehicles",
    },
    {
      title: "Active Vehicles",
      value: stats.activeVehicles,
      icon: CheckCircle,
      color: "text-green-500",
      link: "/partner/vehicles",
    },
    {
      title: "Pending Approval",
      value: stats.pendingVehicles,
      icon: Clock,
      color: "text-yellow-500",
      link: "/partner/vehicles",
    },
    {
      title: "Active Bookings",
      value: stats.activeBookings,
      icon: Calendar,
      color: "text-blue-500",
      link: "/partner/bookings",
    },
    {
      title: "This Month",
      value: `Rs ${stats.monthlyEarnings?.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-green-600",
      link: "/partner/bookings",
    },
    {
      title: "Total Earnings",
      value: `Rs ${stats.totalEarnings?.toLocaleString()}`,
      icon: DollarSign,
      color: "text-primary",
      link: "/partner/bookings",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon
        const CardWrapper = stat.link ? Link : "div"
        return (
          <CardWrapper
            key={stat.title}
            href={stat.link || ""}
            className={stat.link ? "block transition-transform hover:scale-105" : ""}
          >
            <Card className={stat.link ? "cursor-pointer hover:border-primary/50" : ""}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </CardWrapper>
        )
      })}
    </div>
  )
}
