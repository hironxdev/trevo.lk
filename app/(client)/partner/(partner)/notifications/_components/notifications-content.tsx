"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/actions/notification"
import { format } from "date-fns"
import Link from "next/link"
import { Bell, Calendar, Car, CheckCircle, User, Check, Loader2 } from "lucide-react"
import { ErrorState } from "@/components/partner/error-state"
import { EmptyState } from "@/components/partner/empty-state"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  link: string | null
  isRead: boolean
  createdAt: Date
}

const typeIcons: Record<string, typeof Bell> = {
  BOOKING_CREATED: Calendar,
  BOOKING_CONFIRMED: CheckCircle,
  BOOKING_CANCELLED: Calendar,
  PARTNER_REGISTRATION: User,
  VEHICLE_APPROVED: Car,
  DEFAULT: Bell,
}

export function NotificationsContent() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [markingRead, setMarkingRead] = useState(false)

  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getNotifications()
      if (result.success && result.data) {
        setNotifications(result.data as Notification[])
      } else {
        setError(result.error || "Failed to load notifications")
      }
    } catch (err) {
      setError("An error occurred while loading notifications")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const handleMarkAsRead = async (id: string) => {
    try {
      const result = await markNotificationAsRead(id)
      if (result.success) {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
      }
    } catch (err) {
      toast.error("Failed to mark as read")
    }
  }

  const handleMarkAllAsRead = async () => {
    setMarkingRead(true)
    try {
      const result = await markAllNotificationsAsRead()
      if (result.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
        toast.success("All notifications marked as read")
      } else {
        toast.error("Failed to mark all as read")
      }
    } catch (err) {
      toast.error("An error occurred")
    } finally {
      setMarkingRead(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse flex gap-4">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-muted rounded" />
                  <div className="h-3 w-1/2 bg-muted rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchNotifications} />
  }

  if (notifications.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        title="No notifications"
        description="You're all caught up! New notifications will appear here."
      />
    )
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="space-y-4">
      {unreadCount > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={markingRead}
            className="bg-transparent"
          >
            {markingRead ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
            Mark all as read
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {notifications.map((notification) => {
          const Icon = typeIcons[notification.type] || typeIcons.DEFAULT
          const content = (
            <Card
              className={cn(
                "transition-colors",
                !notification.isRead && "border-primary/30 bg-primary/5",
                notification.link && "cursor-pointer hover:bg-muted/50",
              )}
              onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0",
                      notification.isRead ? "bg-muted" : "bg-primary/10",
                    )}
                  >
                    <Icon className={cn("h-5 w-5", notification.isRead ? "text-muted-foreground" : "text-primary")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className={cn("font-medium", !notification.isRead && "text-primary")}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
                      </div>
                      {!notification.isRead && (
                        <Badge variant="default" className="flex-shrink-0 h-2 w-2 p-0 rounded-full" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {format(new Date(notification.createdAt), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )

          if (notification.link) {
            return (
              <Link key={notification.id} href={notification.link}>
                {content}
              </Link>
            )
          }

          return <div key={notification.id}>{content}</div>
        })}
      </div>
    </div>
  )
}
