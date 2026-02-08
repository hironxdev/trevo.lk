import { getCurrentUser } from "@/lib/utils/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ArrowRight, AlertCircle, CheckCircle } from "lucide-react"
import { EventStatus } from "@prisma/client"

export default async function AdminEventsPage() {
  const user = await getCurrentUser()

  if (!user?.id || user.role !== "ADMIN") {
    redirect("/")
  }

  // Get all events with status
  const events = await prisma.event.findMany({
    include: {
      organizer: {
        include: {
          user: true,
        },
      },
      ticketTypes: true,
      _count: {
        select: {
          bookings: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const pendingCount = events.filter((e) => e.status === "PENDING_REVIEW").length
  const approvedCount = events.filter((e) => e.status === "APPROVED").length
  const rejectedCount = events.filter((e) => e.status === "REJECTED").length

  const getStatusBadge = (status: EventStatus) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-green-500/20 text-green-600 border-green-500/30">Approved</Badge>
      case "PENDING_REVIEW":
        return <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">Pending</Badge>
      case "REJECTED":
        return <Badge className="bg-red-500/20 text-red-600 border-red-500/30">Rejected</Badge>
      case "CANCELLED":
        return <Badge className="bg-gray-500/20 text-gray-600 border-gray-500/30">Cancelled</Badge>
      case "DRAFT":
        return <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30">Draft</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Event Management</h1>
        <p className="text-muted-foreground mt-1">Review and manage all events on the platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Events</p>
            <p className="text-3xl font-bold mt-2">{events.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Pending Review</p>
            <p className="text-3xl font-bold mt-2 text-yellow-600">{pendingCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Approved</p>
            <p className="text-3xl font-bold mt-2 text-green-600">{approvedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Rejected</p>
            <p className="text-3xl font-bold mt-2 text-red-600">{rejectedCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action */}
      {pendingCount > 0 && (
        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardContent className="p-6 flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-yellow-900">Pending Event Approvals</p>
                <p className="text-sm text-yellow-800 mt-1">
                  {pendingCount} event{pendingCount !== 1 ? "s" : ""} await{pendingCount !== 1 ? "" : "s"} your review
                </p>
              </div>
            </div>
            <Button asChild size="sm">
              <Link href="/admin/events/pending">Review Now</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No events yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <Link
                  key={event.id}
                  href={`/admin/events/${event.id}`}
                  className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold truncate">{event.titleEn}</h3>
                        {getStatusBadge(event.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{event.venueName} • {event.city}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <span>Organizer: {event.organizer.user.name || event.organizer.user.email}</span>
                        <span>{event.ticketTypes.length} ticket type{event.ticketTypes.length !== 1 ? "s" : ""}</span>
                        <span>{event._count.bookings} booking{event._count.bookings !== 1 ? "s" : ""}</span>
                        <span>{format(new Date(event.startAt), "MMM d, yyyy")}</span>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
