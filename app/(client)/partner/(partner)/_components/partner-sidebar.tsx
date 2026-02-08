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
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Bell,
  Home,
  CalendarCheck,
  Ticket,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react"
import type { KYCStatus } from "@prisma/client"

interface PartnerSidebarProps {
  kycStatus: KYCStatus
  partnerName: string
  pendingBookings?: number
  serviceType?: "VEHICLE_RENTAL" | "STAYS" | "BOTH"
}

export function PartnerSidebar({
  kycStatus,
  partnerName,
  pendingBookings = 0,
  serviceType = "VEHICLE_RENTAL",
}: PartnerSidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const isVerified = kycStatus === "VERIFIED"

  // Show all services by default - partner can use any service once verified
  const showVehicles = true
  const showStays = true
  const showEvents = true

  const navItems = [
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
      disabled: !isVerified,
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
      disabled: !isVerified,
      show: showStays,
    },
    {
      title: "My Events",
      href: "/partner/events",
      icon: Ticket,
      badge: null,
      show: showEvents,
    },
    {
      title: "Add Event",
      href: "/partner/events/new",
      icon: Plus,
      badge: null,
      disabled: !isVerified,
      show: showEvents,
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
  ].filter((item) => item.show)

  const bottomNavItems = [
    {
      title: "Notifications",
      href: "/partner/notifications",
      icon: Bell,
      badge: null,
    },
    {
      title: "Settings",
      href: "/partner/settings",
      icon: Settings,
      badge: null,
    },
    {
      title: "Help & Support",
      href: "/contact",
      icon: HelpCircle,
      badge: null,
    },
  ]

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] border-r bg-card transition-all duration-300 hidden lg:flex flex-col",
          collapsed ? "w-16" : "w-64",
        )}
      >
        {/* Partner Info */}
        {!collapsed && (
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-semibold text-primary">{partnerName.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{partnerName}</p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      kycStatus === "VERIFIED" && "bg-green-500/10 text-green-600 border-green-500/20",
                      kycStatus === "PENDING" && "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
                      kycStatus === "REJECTED" && "bg-red-500/10 text-red-600 border-red-500/20",
                    )}
                  >
                    {kycStatus === "VERIFIED" ? "Approved" : kycStatus}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            const isDisabled = item.disabled

            const linkContent = (
              <Link
                href={isDisabled ? "#" : item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground",
                  isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",
                )}
                onClick={(e) => isDisabled && e.preventDefault()}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <Badge variant="destructive" className="h-5 min-w-5 px-1.5 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
                {collapsed && item.badge && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px]">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            )

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.title}</p>
                    {isDisabled && <p className="text-xs text-muted-foreground">Requires admin approval</p>}
                  </TooltipContent>
                </Tooltip>
              )
            }

            return <div key={item.href}>{linkContent}</div>
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="p-2 border-t space-y-1">
          {bottomNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            const linkContent = (
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            )

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right">{item.title}</TooltipContent>
                </Tooltip>
              )
            }

            return <div key={item.href}>{linkContent}</div>
          })}
        </div>

        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-background shadow-sm"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>
      </aside>
    </TooltipProvider>
  )
}
