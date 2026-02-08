"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, CalendarDays, User, Plus, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"

export function MobileBottomNav() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const getNavItems = () => {
    const isPartner = session?.user?.role === "BUSINESS_PARTNER" || session?.user?.role === "INDIVIDUAL_PARTNER"
    const isAdmin = session?.user?.role === "ADMIN"

    if (isAdmin) {
      return [
        { href: "/", icon: Home, label: "Home" },
        { href: "/admin", icon: User, label: "Admin" },
        { href: "/admin/vehicles", icon: Search, label: "Vehicles" },
        { href: "/admin/partners", icon: CalendarDays, label: "Partners" },
      ]
    }

    if (isPartner) {
      return [
        { href: "/", icon: Home, label: "Home" },
        { href: "/vehicles", icon: Search, label: "Search" },
        { href: "/partner/vehicles/new", icon: Plus, label: "Add", isCenter: true },
        { href: "/partner/bookings", icon: CalendarDays, label: "Bookings" },
        { href: "/partner/dashboard", icon: User, label: "Account" },
      ]
    }

    return [
      { href: "/", icon: Home, label: "Home" },
      { href: "/vehicles", icon: Search, label: "Vehicles" },
      { href: "/stays", icon: Building2, label: "Stays" },
      { href: "/bookings", icon: CalendarDays, label: "Bookings" },
      { href: "/dashboard", icon: User, label: "Account" },
    ]
  }

  const navItems = getNavItems()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Gradient border top */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="bg-white/95 backdrop-blur-lg border-t border-border/30">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

            // Center button (Add) with special styling
            if (item.isCenter) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative -top-3"
                >
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30"
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </motion.div>
                </Link>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-200 relative",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="relative"
                >
                  <Icon className={cn(
                    "h-5 w-5 transition-colors",
                    isActive && "text-primary"
                  )} />
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.div>
                <span className={cn(
                  "text-[10px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
        {/* Safe area for devices with home indicator */}
        <div className="h-safe-area-inset-bottom bg-white/95" />
      </div>
    </nav>
  )
}
