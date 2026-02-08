"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { getMyBookings } from "@/actions/booking/list"
import { Calendar, CheckCircle, Clock, Car } from "lucide-react"
import { StatsGridSkeleton } from "@/components/ui/skeletons"
import { cn } from "@/lib/utils"

interface Stats {
  total: number
  active: number
  completed: number
  upcoming: number
}

export function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        const result = await getMyBookings({ limit: 100 })
        if (result.success && result.data) {
          const bookings = result.data.data
          setStats({
            total: bookings.length,
            active: bookings.filter((b: { status: string }) => b.status === "ACTIVE").length,
            completed: bookings.filter((b: { status: string }) => b.status === "COMPLETED").length,
            upcoming: bookings.filter((b: { status: string }) => ["PENDING", "CONFIRMED"].includes(b.status)).length,
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
    return <StatsGridSkeleton count={4} />
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
    {
      title: "Total Bookings",
      value: stats.total,
      icon: Calendar,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Active Rentals",
      value: stats.active,
      icon: Car,
      color: "text-green-600",
      bg: "bg-green-500/10",
    },
    {
      title: "Upcoming",
      value: stats.upcoming,
      icon: Clock,
      color: "text-blue-600",
      bg: "bg-blue-500/10",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      color: "text-muted-foreground",
      bg: "bg-muted",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={cn("p-2 md:p-3 rounded-xl", stat.bg)}>
                  <Icon className={cn("h-5 w-5 md:h-6 md:w-6", stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
