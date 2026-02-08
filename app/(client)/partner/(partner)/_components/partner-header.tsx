"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"

const pathNameMap: Record<string, string> = {
  dashboard: "Dashboard",
  vehicles: "Vehicles",
  bookings: "Bookings",
  earnings: "Earnings",
  analytics: "Analytics",
  settings: "Settings",
  notifications: "Notifications",
  new: "Add Vehicle",
  edit: "Edit Vehicle",
}

export function PartnerHeader() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  // Build breadcrumb items
  const breadcrumbs = segments
    .map((segment, index) => {
      const path = "/" + segments.slice(0, index + 1).join("/")
      const label = pathNameMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
      const isLast = index === segments.length - 1

      // Skip numeric IDs in breadcrumbs display but keep in path
      if (/^[a-f0-9-]{36}$/i.test(segment)) {
        return null
      }

      return { path, label, isLast }
    })
    .filter(Boolean)

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
      <Link href="/" className="hover:text-foreground transition-colors">
        <Home className="h-4 w-4" />
      </Link>
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb!.path} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4" />
          {crumb!.isLast ? (
            <span className="text-foreground font-medium">{crumb!.label}</span>
          ) : (
            <Link href={crumb!.path} className="hover:text-foreground transition-colors">
              {crumb!.label}
            </Link>
          )}
        </div>
      ))}
    </div>
  )
}
