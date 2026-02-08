import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  Briefcase,
  Car,
  Calendar,
  Settings,
  FileText,
  BarChart,
  Tag,
  PlusCircle,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

const primaryActions = [
  {
    title: "Pending Partners",
    description: "Review & verify partners",
    icon: ShieldCheck,
    href: "/admin/partners?status=PENDING",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    borderColor: "border-amber-200 dark:border-amber-900",
  },
  {
    title: "Pending Vehicles",
    description: "Approve vehicle listings",
    icon: AlertCircle,
    href: "/admin/vehicles?status=pending",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    borderColor: "border-blue-200 dark:border-blue-900",
  },
  {
    title: "Add Vehicle",
    description: "Create new vehicle listing",
    icon: PlusCircle,
    href: "/admin/vehicles/new",
    color: "bg-green-500/10 text-green-600 dark:text-green-400",
    borderColor: "border-green-200 dark:border-green-900",
  },
]

const secondaryActions = [
  {
    title: "Users",
    description: "Manage users",
    icon: Users,
    href: "/admin/users",
  },
  {
    title: "Partners",
    description: "All partners",
    icon: Briefcase,
    href: "/admin/partners",
  },
  {
    title: "Vehicles",
    description: "All vehicles",
    icon: Car,
    href: "/admin/vehicles",
  },
  {
    title: "Bookings",
    description: "View bookings",
    icon: Calendar,
    href: "/admin/bookings",
  },
  {
    title: "Categories",
    description: "Vehicle categories",
    icon: Tag,
    href: "/admin/categories",
  },
  {
    title: "Analytics",
    description: "View reports",
    icon: BarChart,
    href: "/admin/analytics",
  },
  {
    title: "Settings",
    description: "Platform settings",
    icon: Settings,
    href: "/admin/settings",
  },
  {
    title: "Logs",
    description: "Activity logs",
    icon: FileText,
    href: "/admin/logs",
  },
]

export function AdminQuickActions() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Primary Actions - Highlighted */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {primaryActions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.title}
                href={action.href}
                className={`group relative flex items-center gap-4 rounded-xl border-2 ${action.borderColor} p-4 transition-all hover:shadow-md hover:scale-[1.02]`}
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${action.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{action.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">{action.description}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            )
          })}
        </div>

        {/* Secondary Actions - Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {secondaryActions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.title}
                href={action.href}
                className="group flex flex-col items-center gap-2 rounded-lg border bg-card p-3 text-center transition-all hover:border-primary hover:bg-accent"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                  <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-tight">{action.title}</p>
                  <p className="text-xs text-muted-foreground hidden sm:block">{action.description}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
