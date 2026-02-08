"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getRecentActivity } from "@/actions/admin/stats"
import { format } from "date-fns"
import { User, Car, Calendar, Briefcase, CheckCircle, XCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface ActivityItem {
  id: string
  type:
    | "user_registered"
    | "partner_registered"
    | "vehicle_added"
    | "booking_created"
    | "partner_approved"
    | "partner_rejected"
  message: string
  createdAt: string
}

const activityIcons = {
  user_registered: User,
  partner_registered: Briefcase,
  vehicle_added: Car,
  booking_created: Calendar,
  partner_approved: CheckCircle,
  partner_rejected: XCircle,
}

const activityColors = {
  user_registered: "text-blue-500",
  partner_registered: "text-purple-500",
  vehicle_added: "text-green-500",
  booking_created: "text-primary",
  partner_approved: "text-green-600",
  partner_rejected: "text-red-500",
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchActivity() {
      try {
        const result = await getRecentActivity()
        if (result.success && result.data) {
          setActivities(result.data)
        }
      } catch (err) {
        // Silent fail - activity is not critical
      } finally {
        setLoading(false)
      }
    }
    fetchActivity()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = activityIcons[activity.type] || User
              const color = activityColors[activity.type] || "text-muted-foreground"

              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`p-2 rounded-full bg-muted ${color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(activity.createdAt), "MMM d, h:mm a")}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
