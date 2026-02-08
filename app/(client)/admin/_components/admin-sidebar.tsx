"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Car,
  Users,
  CalendarClock,
  Settings,
  FolderOpen,
  Shield,
  MessageSquare,
  TrendingUp,
  Home,
  Building,
  CalendarCheck,
  Ticket,
} from "lucide-react"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/vehicles", label: "Vehicles", icon: Car },
  { href: "/admin/stays", label: "Stays", icon: Home },
  { href: "/admin/events", label: "Events", icon: Ticket },
  { href: "/admin/partners", label: "Partners", icon: Shield },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/bookings", label: "Vehicle Bookings", icon: CalendarClock },
  { href: "/admin/stays-bookings", label: "Stays Bookings", icon: CalendarCheck },
  { href: "/admin/stays-categories", label: "Stays Categories", icon: Building },
  { href: "/admin/categories", label: "Vehicle Categories", icon: FolderOpen },
  { href: "/admin/analytics", label: "Analytics", icon: TrendingUp },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(`${item.href}`))
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
