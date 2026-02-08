import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Calendar, Search, MapPin, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"

const actions = [
  {
    title: "Browse Vehicles",
    description: "Find your next ride",
    icon: Car,
    href: "/vehicles",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    title: "My Bookings",
    description: "View all bookings",
    icon: Calendar,
    href: "/bookings",
    color: "bg-green-500/10 text-green-600",
  },
  {
    title: "Search",
    description: "Find specific vehicles",
    icon: Search,
    href: "/vehicles?search=",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    title: "Nearby",
    description: "Vehicles near you",
    icon: MapPin,
    href: "/vehicles?location=",
    color: "bg-orange-500/10 text-orange-600",
  },
]

const promoActions = [
  {
    title: "Become a Partner",
    description: "List your vehicle and earn",
    icon: Sparkles,
    href: "/partner/register",
    gradient: "from-primary to-primary/80",
  },
]

export function QuickActions() {
  return (
    <div className="space-y-6">
      {/* Main Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {actions.map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group flex flex-col items-center gap-3 p-4 rounded-xl border hover:border-primary/50 hover:bg-muted/50 transition-all"
                >
                  <div className={`p-3 rounded-xl ${action.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Promo Banner */}
      {promoActions.map((promo) => {
        const Icon = promo.icon
        return (
          <Link
            key={promo.title}
            href={promo.href}
            className={`block relative overflow-hidden rounded-xl bg-gradient-to-r ${promo.gradient} p-6 text-primary-foreground group`}
          >
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{promo.title}</h3>
                  <p className="text-sm text-primary-foreground/80">{promo.description}</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </div>
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          </Link>
        )
      })}
    </div>
  )
}
