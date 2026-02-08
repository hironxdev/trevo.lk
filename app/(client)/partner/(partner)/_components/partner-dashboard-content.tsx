"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getPartnerStats } from "@/actions/partner/stats"
import { getPartnerBookings } from "@/actions/partner/bookings"
import { getPartnerVehicles } from "@/actions/partner/vehicles"
import { format } from "date-fns"
import Link from "next/link"
import Image from "next/image"
import {
  Car,
  Calendar,
  CheckCircle,
  TrendingUp,
  Clock,
  DollarSign,
  User,
  ArrowRight,
  AlertTriangle,
  Plus,
  Eye,
} from "lucide-react"
import { StatCard } from "@/components/partner/stat-card"
import { ErrorState } from "@/components/partner/error-state"
import { EmptyState } from "@/components/partner/empty-state"
import { LoadingCard } from "@/components/partner/loading-card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  CONFIRMED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  ACTIVE: "bg-green-500/10 text-green-600 border-green-500/20",
  COMPLETED: "bg-muted text-muted-foreground",
  CANCELLED: "bg-red-500/10 text-red-600 border-red-500/20",
  REJECTED: "bg-red-500/10 text-red-600 border-red-500/20",
}

interface Stats {
  totalVehicles: number
  activeVehicles: number
  pendingVehicles: number
  activeBookings: number
  completedBookings: number
  totalEarnings: number
  monthlyEarnings: number
}

interface Booking {
  id: string
  status: string
  startDate: Date
  endDate: Date
  vehicle: { make: string; model: string; images: string[] }
  user: { name: string | null; email: string | null }
  pricing: { total?: number }
}

interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  pricePerDay: number
  isApproved: boolean
  status: string
  images: string[]
}

export function PartnerDashboardContent() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [statsResult, bookingsResult, vehiclesResult] = await Promise.all([
        getPartnerStats(),
        getPartnerBookings(),
        getPartnerVehicles(),
      ])

      if (statsResult.success && statsResult.data) {
        setStats({
          totalVehicles: statsResult.data.totalVehicles,
          activeVehicles: statsResult.data.activeVehicles ?? 0,
          pendingVehicles: statsResult.data.pendingVehicles,
          activeBookings: statsResult.data.activeBookings,
          completedBookings: statsResult.data.completedBookings ?? 0,
          totalEarnings: statsResult.data.totalEarnings,
          monthlyEarnings: statsResult.data.monthlyEarnings ?? 0,
        })
      }

      if (bookingsResult.success && bookingsResult.data) {
        setBookings(bookingsResult.data.slice(0, 5) as Booking[])
      }

      if (vehiclesResult.success && vehiclesResult.data) {
        setVehicles(vehiclesResult.data.slice(0, 4) as Vehicle[])
      }
    } catch (err) {
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (error) {
    return <ErrorState message={error} onRetry={fetchData} />
  }

  const pendingBookings = bookings.filter((b) => b.status === "PENDING")

  return (
    <div className="space-y-6">
      {/* Pending Actions Alert */}
      {pendingBookings.length > 0 && (
        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium">
                You have {pendingBookings.length} pending booking{pendingBookings.length > 1 ? "s" : ""} requiring
                action
              </p>
              <p className="text-sm text-muted-foreground">
                Review and confirm or reject these requests to keep customers informed.
              </p>
            </div>
            <Button asChild size="sm">
              <Link href="/partner/bookings?status=PENDING">Review Now</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            title="Total Vehicles"
            value={stats.totalVehicles}
            icon={Car}
            href="/partner/vehicles"
            iconColor="text-primary"
          />
          <StatCard
            title="Active Vehicles"
            value={stats.activeVehicles}
            icon={CheckCircle}
            href="/partner/vehicles"
            iconColor="text-green-500"
          />
          <StatCard
            title="Pending Approval"
            value={stats.pendingVehicles}
            icon={Clock}
            href="/partner/vehicles"
            iconColor="text-yellow-500"
          />
          <StatCard
            title="Active Bookings"
            value={stats.activeBookings}
            icon={Calendar}
            href="/partner/bookings"
            iconColor="text-blue-500"
          />
          <StatCard
            title="This Month"
            value={`Rs ${stats.monthlyEarnings?.toLocaleString()}`}
            icon={TrendingUp}
            href="/partner/earnings"
            iconColor="text-green-600"
          />
          <StatCard
            title="Total Earnings"
            value={`Rs ${stats.totalEarnings?.toLocaleString()}`}
            icon={DollarSign}
            href="/partner/earnings"
            iconColor="text-primary"
          />
        </div>
      ) : null}

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2">
          {loading ? (
            <LoadingCard rows={4} />
          ) : bookings.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No bookings yet"
              description="When customers book your vehicles, they'll appear here. Share your listings to get started!"
              actionLabel="View Vehicles"
              actionHref="/partner/vehicles"
            />
          ) : (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg">Recent Bookings</CardTitle>
                <Button asChild variant="ghost" size="sm" className="gap-1">
                  <Link href="/partner/bookings">
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {bookings.map((booking) => (
                  <Link
                    key={booking.id}
                    href={`/partner/bookings/${booking.id}`}
                    className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="relative h-12 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      {booking.vehicle.images[0] ? (
                        <Image
                          src={booking.vehicle.images[0] || "/placeholder.svg"}
                          alt={`${booking.vehicle.make} ${booking.vehicle.model}`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Car className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-medium truncate">
                            {booking.vehicle.make} {booking.vehicle.model}
                          </p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span className="truncate">{booking.user.name || "Customer"}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className={cn("flex-shrink-0", statusColors[booking.status])}>
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-1 text-sm">
                        <span className="text-muted-foreground">
                          {format(new Date(booking.startDate), "MMM d")} - {format(new Date(booking.endDate), "MMM d")}
                        </span>
                        <span className="font-medium">Rs {(booking.pricing?.total || 0)?.toLocaleString()}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Vehicles List */}
        <div>
          {loading ? (
            <LoadingCard rows={3} />
          ) : vehicles.length === 0 ? (
            <EmptyState
              icon={Car}
              title="No vehicles listed"
              description="Add your first vehicle to start receiving booking requests."
              actionLabel="Add Vehicle"
              actionHref="/partner/vehicles/new"
            />
          ) : (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg">My Vehicles</CardTitle>
                <Button asChild size="sm" variant="outline" className="gap-1 bg-transparent">
                  <Link href="/partner/vehicles/new">
                    <Plus className="h-4 w-4" />
                    Add
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {vehicles.map((vehicle) => (
                  <Link
                    key={vehicle.id}
                    href={`/partner/vehicles/${vehicle.id}/edit`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className="relative h-12 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      {vehicle.images[0] ? (
                        <Image
                          src={vehicle.images[0] || "/placeholder.svg"}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Car className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate group-hover:text-primary transition-colors">
                        {vehicle.make} {vehicle.model}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          Rs {vehicle.pricePerDay?.toLocaleString()}/day
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            !vehicle.isApproved && "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
                            vehicle.isApproved &&
                              vehicle.status === "AVAILABLE" &&
                              "bg-green-500/10 text-green-600 border-green-500/20",
                            vehicle.isApproved && vehicle.status !== "AVAILABLE" && "bg-muted text-muted-foreground",
                          )}
                        >
                          {!vehicle.isApproved ? "Pending" : vehicle.status}
                        </Badge>
                      </div>
                    </div>
                    <Eye className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>
                ))}
                <Button asChild variant="ghost" className="w-full mt-2">
                  <Link href="/partner/vehicles">View All Vehicles</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
