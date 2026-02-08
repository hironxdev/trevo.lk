"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Calendar,
  Car,
  Heart,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Home,
  CalendarCheck,
} from "lucide-react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

const menuItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Vehicle Bookings",
    href: "/bookings",
    icon: Calendar,
  },
  {
    title: "Stays Bookings",
    href: "/stays-bookings",
    icon: CalendarCheck,
  },
  {
    title: "Browse Vehicles",
    href: "/vehicles",
    icon: Car,
  },
  {
    title: "Browse Stays",
    href: "/stays",
    icon: Home,
  },
  {
    title: "Browse Events",
    href: "/events",
    icon: Calendar,
  },
  {
    title: "Favorites",
    href: "/dashboard/favorites",
    icon: Heart,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

const supportItems = [
  {
    title: "Help & Support",
    href: "/contact",
    icon: HelpCircle,
  },
]

interface DashboardSidebarProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r bg-card min-h-[calc(100vh-5rem)]">
      {/* User Info */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            {user.image ? (
              <img
                src={user.image || "/placeholder.svg"}
                alt={user.name || ""}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <User className="h-5 w-5 text-primary" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user.name || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
      </div>
{/* Navigation */}
<nav className="flex-1 p-4 space-y-4">
  {/* Menu */}
  <div className="space-y-1">
    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">
      Menu
    </p>

    {menuItems.map((item) => {
      const Icon = item.icon
      const isActive = pathname === item.href

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
          <Icon className="h-4 w-4" />
          {item.title}
          {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
        </Link>
      )
    })}
  </div>

  {/* Partner Panel Button - Only show for partners */}

  {/* Support */}
  <div className="pt-2 space-y-1">
    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">
      Support
    </p>

    {supportItems.map((item) => {
      const Icon = item.icon
      const isActive = pathname === item.href

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
          <Icon className="h-4 w-4" />
          {item.title}
        </Link>
      )
    })}
  </div>
</nav>


      {/* Sign Out */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
