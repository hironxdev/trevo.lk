import { getCurrentUser } from "@/lib/utils/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ArrowRight, AlertCircle } from "lucide-react"

export default async function PendingEventsPage() {
  const user = await getCurrentUser()

  if (!user?.id || user.role !== "ADMIN") {
    redirect("/")
  }

  // Get pending events
  const pendingEvents = await prisma.event.findMany({
    where: {
      status: "PENDING_REVIEW",
    },
    include: {
      organizer: {
        include: {
          user: true,
        },
      },
      ticketTypes: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Event Approval Queue</h1>
        <p className="text-muted-foreground mt-1">
          {pendingEvents.length} event{pendingEvents.length !== 1 ? "s" : ""} awaiting approval
        </p>
      </div>

      {/* Empty State */}
      {pendingEvents.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent className="space-y-4">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-semibold">No Pending Events</h3>
            <p className="text-muted-foreground">All events have been reviewed</p>
          </CardContent>
        </Card>
      ) : (
        /* Events List */
        <div className="grid gap-4">
          {pendingEvents.map((event) => (
            <Card key={event.id} className="relative overflow-hidden hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  {/* Event Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg">{event.titleEn}</h3>
                        <p className="text-sm text-muted-foreground">
                          Organizer: <strong>{event.organizer.user.name || event.organizer.businessName || "Unknown"}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <p>
                        <span className="font-medium text-foreground">{event.city}</span> • {event.venueName}
                      </p>
                      <p>
                        {format(new Date(event.startAt), "MMM dd, yyyy HH:mm")}
                        {event.endAt && ` - ${format(new Date(event.endAt), "MMM dd, yyyy HH:mm")}`}
                      </p>
                      {event.category && <p>Category: {event.category}</p>}
                      <p className="text-xs">
                        Ticket Types: <strong>{event.ticketTypes.length}</strong> •
                        Total Capacity: <strong>{event.ticketTypes.reduce((sum, t) => sum + t.totalQty, 0)}</strong>
                      </p>
                    </div>

                    {/* Description Preview */}
                    {event.descEn && (
                      <p className="text-sm bg-muted/50 p-3 rounded-lg line-clamp-2">
                        {event.descEn}
                      </p>
                    )}
                  </div>

                  {/* Action */}
                  <div className="flex-shrink-0">
                    <Button asChild className="gap-2 w-full sm:w-auto">
                      <Link href={`/admin/events/${event.id}`}>
                        Review
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
