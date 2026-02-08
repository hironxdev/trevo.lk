import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Car, Calendar, TrendingUp, Settings, Plus, BarChart, Home, CalendarCheck } from "lucide-react"
import Link from "next/link"
import type { KYCStatus } from "@prisma/client"

interface PartnerQuickActionsProps {
  kycStatus: KYCStatus
}

export function PartnerQuickActions({ kycStatus }: PartnerQuickActionsProps) {
  const isVerified = kycStatus === "VERIFIED"

  const actions = [
    {
      title: "Add Vehicle",
      description: "List a new vehicle",
      icon: Plus,
      href: "/partner/vehicles/new",
      disabled: !isVerified,
      primary: true,
    },
    {
      title: "Add Property",
      description: "List a new stay",
      icon: Home,
      href: "/partner/stays/new",
      disabled: !isVerified,
      primary: true,
    },
    {
      title: "My Vehicles",
      description: "Manage your fleet",
      icon: Car,
      href: "/partner/vehicles",
      disabled: false,
    },
    {
      title: "My Properties",
      description: "Manage your stays",
      icon: Home,
      href: "/partner/stays",
      disabled: false,
    },
    {
      title: "Vehicle Bookings",
      description: "View vehicle bookings",
      icon: Calendar,
      href: "/partner/bookings",
      disabled: false,
    },
    {
      title: "Stays Bookings",
      description: "View property bookings",
      icon: CalendarCheck,
      href: "/partner/stays-bookings",
      disabled: false,
    },
    {
      title: "Earnings",
      description: "Track your income",
      icon: TrendingUp,
      href: "/partner/earnings",
      disabled: false,
    },
    {
      title: "Analytics",
      description: "View insights",
      icon: BarChart,
      href: "/partner/analytics",
      disabled: false,
    },
    {
      title: "Settings",
      description: "Account settings",
      icon: Settings,
      href: "/partner/settings",
      disabled: false,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {actions.map((action) => {
            const Icon = action.icon
            const content = (
              <>
                <Icon className={`h-6 w-6 ${action.primary ? "text-primary" : ""}`} />
                <div className="text-center">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </>
            )

            if (action.disabled) {
              return (
                <Button
                  key={action.title}
                  variant="outline"
                  className="h-auto flex-col gap-2 p-4 bg-transparent opacity-50 cursor-not-allowed"
                  disabled
                >
                  {content}
                </Button>
              )
            }

            return (
              <Button
                key={action.title}
                asChild
                variant={action.primary ? "default" : "outline"}
                className="h-auto flex-col gap-2 p-4 bg-transparent"
              >
                <Link href={action.href}>{content}</Link>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
