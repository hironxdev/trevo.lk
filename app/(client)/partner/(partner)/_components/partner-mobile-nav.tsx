"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Car,
  Calendar,
  TrendingUp,
  BarChart3,
  Settings,
  Plus,
  HelpCircle,
  Bell,
  Home,
  CalendarCheck,
  Menu,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from "react"

interface PartnerMobileNavProps {
  pendingBookings?: number
  serviceType?: "VEHICLE_RENTAL" | "STAYS" | "BOTH"
}

export function PartnerMobileNav({ pendingBookings = 0, serviceType = "VEHICLE_RENTAL" }: PartnerMobileNavProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const showVehicles = serviceType === "VEHICLE_RENTAL" || serviceType === "BOTH"
  const showStays = serviceType === "STAYS" || serviceType === "BOTH"

  const allNavItems = [
    {
      title: "Dashboard",
      href: "/partner/dashboard",
      icon: LayoutDashboard,
      badge: null,
      show: true,
    },
    {
      title: "Vehicle Bookings",
      href: "/partner/bookings",
      icon: Calendar,
      badge: showVehicles && pendingBookings > 0 ? pendingBookings : null,
      show: showVehicles,
    },
    {
      title: "Stays Bookings",
      href: "/partner/stays-bookings",
      icon: CalendarCheck,
      badge: null,
      show: showStays,
    },
    {
      title: "My Vehicles",
      href: "/partner/vehicles",
      icon: Car,
      badge: null,
      show: showVehicles,
    },
    {
      title: "Add Vehicle",
      href: "/partner/vehicles/new",
      icon: Plus,
      badge: null,
      show: showVehicles,
    },
    {
      title: "My Properties",
      href: "/partner/stays",
      icon: Home,
      badge: null,
      show: showStays,
    },
    {
      title: "Add Property",
      href: "/partner/stays/new",
      icon: Plus,
      badge: null,
      show: showStays,
    },
    {
      title: "Earnings",
      href: "/partner/earnings",
      icon: TrendingUp,
      badge: null,
      show: true,
    },
    {
      title: "Analytics",
      href: "/partner/analytics",
      icon: BarChart3,
      badge: null,
      show: true,
    },
    {
      title: "Notifications",
      href: "/partner/notifications",
      icon: Bell,
      badge: null,
      show: true,
    },
    {
      title: "Settings",
      href: "/partner/settings",
      icon: Settings,
      badge: null,
      show: true,
    },
    {
      title: "Help & Support",
      href: "/contact",
      icon: HelpCircle,
      badge: null,
      show: true,
    },
  ].filter((item) => item.show)

  // Bottom nav items (limited to 4-5 for mobile)
  const bottomNavItems = [
    { title: "Dashboard", href: "/partner/dashboard", icon: LayoutDashboard, show: true },
    {
      title: "Bookings",
      href: showVehicles ? "/partner/bookings" : "/partner/stays-bookings",
      icon: showVehicles ? Calendar : CalendarCheck,
      badge: showVehicles && pendingBookings > 0 ? pendingBookings : null,
      show: true,
    },
    {
      title: showVehicles ? "Vehicles" : "Properties",
      href: showVehicles ? "/partner/vehicles" : "/partner/stays",
      icon: showVehicles ? Car : Home,
      show: true,
    },
    { title: "Earnings", href: "/partner/earnings", icon: TrendingUp, show: true },
  ].filter((item) => item.show)

  return (
    <>
      {/* Mobile Drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 lg:hidden bg-background border shadow-sm"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Partner Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
            {allNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <Badge variant="destructive" className="h-5 min-w-5 px-1.5 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              )
            })}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t lg:hidden">
        <div className="flex items-center justify-around">
          {bottomNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 px-3 relative",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {item.badge && (
                    <Badge variant="destructive" className="absolute -top-2 -right-2 h-4 min-w-4 px-1 text-[10px]">
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.title}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
