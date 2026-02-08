import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Car,
  Calendar,
  TrendingUp,
  Settings,
  Plus,
  BarChart,
  Home,
  CalendarCheck,
  ChevronDown,
} from "lucide-react"
import Link from "next/link"
import type { KYCStatus } from "@prisma/client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface PartnerQuickActionsProps {
  kycStatus: KYCStatus
}

export function PartnerQuickActions({ kycStatus }: PartnerQuickActionsProps) {
  const isVerified = kycStatus === "VERIFIED"

  return (
    <div className="space-y-6">
      {/* Quick Add Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Quick Actions</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage your business in one place</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="lg"
              className="gap-2"
              disabled={!isVerified}
              title={!isVerified ? "Complete verification to add listings" : ""}
            >
              <Plus className="h-5 w-5" />
              Add New
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/partner/vehicles/new" className="flex items-center gap-3 cursor-pointer">
                <Car className="h-4 w-4" />
                <div>
                  <div className="font-medium">Add Vehicle</div>
                  <div className="text-xs text-muted-foreground">List a rental vehicle</div>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/partner/stays/new" className="flex items-center gap-3 cursor-pointer">
                <Home className="h-4 w-4" />
                <div>
                  <div className="font-medium">Add Property</div>
                  <div className="text-xs text-muted-foreground">List a stay property</div>
                </div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Bookings */}
        <Link href="/partner/bookings">
          <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">Bookings</h3>
              <p className="text-sm text-muted-foreground">Manage all your booking requests</p>
            </CardContent>
          </Card>
        </Link>

        {/* Vehicles */}
        <Link href="/partner/vehicles">
          <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-lg bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                  <Car className="h-6 w-6 text-cyan-600" />
                </div>
              </div>
              <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">My Vehicles</h3>
              <p className="text-sm text-muted-foreground">Manage your vehicle listings</p>
            </CardContent>
          </Card>
        </Link>

        {/* Earnings */}
        <Link href="/partner/earnings">
          <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">Earnings</h3>
              <p className="text-sm text-muted-foreground">Track your income and payments</p>
            </CardContent>
          </Card>
        </Link>

        {/* Analytics */}
        <Link href="/partner/analytics">
          <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                  <BarChart className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">Analytics</h3>
              <p className="text-sm text-muted-foreground">View detailed performance insights</p>
            </CardContent>
          </Card>
        </Link>

        {/* Stays Bookings */}
        <Link href="/partner/stays-bookings">
          <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-lg bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                  <CalendarCheck className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">Stay Bookings</h3>
              <p className="text-sm text-muted-foreground">Manage property reservations</p>
            </CardContent>
          </Card>
        </Link>

        {/* Properties */}
        <Link href="/partner/stays">
          <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                  <Home className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">My Properties</h3>
              <p className="text-sm text-muted-foreground">Manage your property listings</p>
            </CardContent>
          </Card>
        </Link>

        {/* Settings */}
        <Link href="/partner/settings">
          <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-lg bg-slate-500/10 flex items-center justify-center group-hover:bg-slate-500/20 transition-colors">
                  <Settings className="h-6 w-6 text-slate-600" />
                </div>
              </div>
              <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">Settings</h3>
              <p className="text-sm text-muted-foreground">Configure your account</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
