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
  Home,
  BarChart3,
  Zap,
  MapPin,
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
  const hasNoListings = vehicles.length === 0 && !loading

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

      {/* Premium Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="relative overflow-hidden">
              <CardContent className="p-6">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Monthly Earnings - Primary Card */}
          <Link href="/partner/earnings">
            <Card className="relative overflow-hidden hover:border-primary/50 transition-colors h-full cursor-pointer group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-6 relative">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">This Month</p>
                    <p className="text-2xl font-bold">Rs {stats.monthlyEarnings?.toLocaleString()}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeBookings} active booking{stats.activeBookings !== 1 ? "s" : ""}
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Total Earnings */}
          <Link href="/partner/earnings">
            <Card className="relative overflow-hidden hover:border-primary/50 transition-colors h-full cursor-pointer group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-6 relative">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Total Earnings</p>
                    <p className="text-2xl font-bold">Rs {stats.totalEarnings?.toLocaleString()}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">All-time revenue</p>
              </CardContent>
            </Card>
          </Link>

          {/* Active Bookings */}
          <Link href="/partner/bookings">
            <Card className="relative overflow-hidden hover:border-primary/50 transition-colors h-full cursor-pointer group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-6 relative">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Active Bookings</p>
                    <p className="text-2xl font-bold">{stats.activeBookings}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">In progress</p>
              </CardContent>
            </Card>
          </Link>

          {/* Active Listings */}
          <Link href="/partner/vehicles">
            <Card className="relative overflow-hidden hover:border-primary/50 transition-colors h-full cursor-pointer group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-6 relative">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Active Listings</p>
                    <p className="text-2xl font-bold">{stats.activeVehicles}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-cyan-600" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Of {stats.totalVehicles} total</p>
              </CardContent>
            </Card>
          </Link>

          {/* Pending Approval */}
          <Link href="/partner/vehicles">
            <Card className="relative overflow-hidden hover:border-primary/50 transition-colors h-full cursor-pointer group">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-6 relative">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Pending Approval</p>
                    <p className="text-2xl font-bold">{stats.pendingVehicles}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Awaiting review</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      ) : null}

      {/* Getting Started Section */}
      {hasNoListings && (
        <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-primary/2 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
          <CardContent className="p-8 relative">
            <div className="flex items-start gap-6">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Getting Started</h3>
                <p className="text-muted-foreground mb-6">
                  Start earning by listing your vehicles and properties. Follow these simple steps to get your first booking.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-background/50 border border-primary/10 hover:border-primary/30 transition-colors">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Add Your First Listing</p>
                      <p className="text-sm text-muted-foreground">Create a vehicle or property listing with photos and pricing</p>
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <Link href="/partner/vehicles/new">Add Vehicle</Link>
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-background/50 border border-primary/10 hover:border-primary/30 transition-colors">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Upload Documents</p>
                      <p className="text-sm text-muted-foreground">Complete identity verification for full account approval</p>
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <Link href="/partner/settings">Verify Now</Link>
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-background/50 border border-primary/10 hover:border-primary/30 transition-colors">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Get Your First Booking</p>
                      <p className="text-sm text-muted-foreground">Start receiving bookings and earning income from your listings</p>
                    </div>
                    <Button size="sm" disabled>Learn More</Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-lg">Recent Bookings</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">{bookings.length} recent transactions</p>
                </div>
                <Button asChild variant="ghost" size="sm" className="gap-1">
                  <Link href="/partner/bookings">
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {bookings.map((booking) => (
                  <Link
                    key={booking.id}
                    href={`/partner/bookings/${booking.id}`}
                    className="flex items-center gap-4 p-3 rounded-lg border border-transparent hover:border-primary/30 hover:bg-muted/50 transition-all"
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
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-lg">My Listings</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">{vehicles.length} active listing{vehicles.length !== 1 ? "s" : ""}</p>
                </div>
                <Button asChild size="sm" variant="outline" className="gap-1 bg-transparent">
                  <Link href="/partner/vehicles/new">
                    <Plus className="h-4 w-4" />
                    Add
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {vehicles.map((vehicle) => (
                  <Link
                    key={vehicle.id}
                    href={`/partner/vehicles/${vehicle.id}/edit`}
                    className="flex items-center gap-3 p-3 rounded-lg border border-transparent hover:border-primary/30 hover:bg-muted/50 transition-all group"
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
