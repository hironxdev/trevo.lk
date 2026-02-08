"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getPartnerEarnings } from "@/actions/partner/earnings"
import { format } from "date-fns"
import { DollarSign, TrendingUp, TrendingDown, Calendar, Car } from "lucide-react"
import { StatCard } from "@/components/partner/stat-card"
import { ErrorState } from "@/components/partner/error-state"
import { EmptyState } from "@/components/partner/empty-state"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts"

interface EarningsData {
  totalEarnings: number
  thisMonthEarnings: number
  lastMonthEarnings: number
  yearEarnings: number
  thisMonthBookings: number
  totalBookings: number
  monthlyData: { month: string; earnings: number; bookings: number }[]
  recentTransactions: {
    id: string
    date: Date
    vehicle: string
    vehicleImage: string | null
    customer: string
    amount: number
    startDate: Date
    endDate: Date
  }[]
  growth: number
}

export function EarningsContent() {
  const [data, setData] = useState<EarningsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getPartnerEarnings()
      if (result.success && result.data) {
        setData(result.data as EarningsData)
      } else {
        setError(result.error || "Failed to load earnings")
      }
    } catch (err) {
      setError("An error occurred while loading earnings")
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

  if (!data || data.totalBookings === 0) {
    return (
      <EmptyState
        icon={DollarSign}
        title="No earnings yet"
        description="Complete your first rental to start earning. Add vehicles and share your listings to attract customers."
        actionLabel="Add Vehicle"
        actionHref="/partner/vehicles/new"
      />
    )
  }

  const chartConfig = {
    earnings: {
      label: "Earnings",
      color: "hsl(var(--primary))",
    },
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="This Month"
          value={`Rs ${data.thisMonthEarnings?.toLocaleString()}`}
          icon={data.growth >= 0 ? TrendingUp : TrendingDown}
          iconColor={data.growth >= 0 ? "text-green-500" : "text-red-500"}
          trend={data.lastMonthEarnings > 0 ? { value: data.growth, isPositive: data.growth >= 0 } : undefined}
        />
        <StatCard
          title="Last Month"
          value={`Rs ${data.lastMonthEarnings?.toLocaleString()}`}
          icon={DollarSign}
          iconColor="text-muted-foreground"
        />
        <StatCard
          title="Year to Date"
          value={`Rs ${data.yearEarnings?.toLocaleString()}`}
          icon={Calendar}
          iconColor="text-blue-500"
        />
        <StatCard
          title="Total Earnings"
          value={`Rs ${data.totalEarnings?.toLocaleString()}`}
          icon={DollarSign}
          iconColor="text-primary"
          description={`From ${data.totalBookings} completed rentals`}
        />
      </div>

      {/* Earnings Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => value.split(" ")[0]}
                />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent formatter={(value) => [`Rs ${Number(value)?.toLocaleString()}`, "Earnings"]} />
                  }
                />
                <Bar dataKey="earnings" fill="var(--color-earnings)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recentTransactions.map((transaction) => {
              const days = Math.ceil(
                (new Date(transaction.endDate).getTime() - new Date(transaction.startDate).getTime()) /
                  (1000 * 60 * 60 * 24),
              )

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      {transaction.vehicleImage ? (
                        <Image
                          src={transaction.vehicleImage || "/placeholder.svg"}
                          alt={transaction.vehicle}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Car className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.vehicle}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.customer} • {days} day{days > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">+Rs {transaction.amount?.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{format(new Date(transaction.date), "MMM d, yyyy")}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
