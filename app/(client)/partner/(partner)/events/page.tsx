import { getCurrentUser } from "@/lib/utils/auth"
import { redirect } from "next/navigation"
import { getPartnerEvents } from "@/actions/events/list"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Plus, Edit, Trash2, Send } from "lucide-react"
import { format } from "date-fns"
import { prisma } from "@/lib/prisma"

export default async function PartnerEventsPage() {
  const user = await getCurrentUser()

  if (!user?.id) {
    redirect("/auth/sign-in")
  }

  // Get partner profile
  const partner = await prisma.partner.findUnique({
    where: { userId: user.id },
  })

  if (!partner) {
    redirect("/partner/register")
  }

  // Get partner events
  const result = await getPartnerEvents(partner.id)

  if (!result.success) {
    return (
      <div className="p-8">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-destructive font-medium">{result.message || "Failed to load events"}</p>
        </div>
      </div>
    )
  }

  const events = result.data || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Events</h1>
          <p className="text-muted-foreground mt-1">Manage your events and ticket types</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/partner/events/new">
            <Plus className="h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>

      {/* Empty State */}
      {events.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent className="space-y-4">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No events yet</h3>
            <p className="text-muted-foreground">Create your first event to start selling tickets</p>
            <Button asChild>
              <Link href="/partner/events/new">Create Event</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Events Grid */
        <div className="grid gap-4">
          {events.map((event) => (
            <Card key={event.id} className="relative overflow-hidden hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  {/* Event Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">{event.titleEn}</h3>
                        {event.titleSi && <p className="text-sm text-muted-foreground truncate">{event.titleSi}</p>}
                      </div>
                      <Badge
                        className={`flex-shrink-0 ${
                          event.status === "DRAFT"
                            ? "bg-slate-500/10 text-slate-700"
                            : event.status === "PENDING_REVIEW"
                              ? "bg-yellow-500/10 text-yellow-700"
                              : event.status === "APPROVED"
                                ? "bg-green-500/10 text-green-700"
                                : event.status === "REJECTED"
                                  ? "bg-red-500/10 text-red-700"
                                  : "bg-gray-500/10 text-gray-700"
                        }`}
                      >
                        {event.status}
                      </Badge>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>
                        <span className="font-medium text-foreground">{event.city}</span> • {event.venueName}
                      </p>
                      <p>
                        {format(new Date(event.startAt), "MMM dd, yyyy HH:mm")}
                        {event.endAt && ` - ${format(new Date(event.endAt), "MMM dd, yyyy HH:mm")}`}
                      </p>
                      {event.category && <p>Category: {event.category}</p>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    {event.status === "DRAFT" || event.status === "REJECTED" ? (
                      <>
                        <Button asChild variant="outline" size="sm" className="gap-1">
                          <Link href={`/partner/events/${event.id}/edit`}>
                            <Edit className="h-4 w-4" />
                            Edit
                          </Link>
                        </Button>
                        {event.status === "DRAFT" && (
                          <Button asChild variant="outline" size="sm" className="gap-1">
                            <Link href={`/partner/events/${event.id}/tickets`}>
                              Tickets
                            </Link>
                          </Button>
                        )}
                      </>
                    ) : null}

                    {event.status === "DRAFT" && (
                      <Button asChild variant="default" size="sm" className="gap-1">
                        <Link href={`/partner/events/${event.id}/submit`}>
                          <Send className="h-4 w-4" />
                          Submit
                        </Link>
                      </Button>
                    )}
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
