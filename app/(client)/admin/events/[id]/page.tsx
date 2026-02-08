import { getCurrentUser } from "@/lib/utils/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import EventApprovalForm from "../_components/event-approval-form"

interface EventDetailPageProps {
  params: { id: string }
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const user = await getCurrentUser()

  if (!user?.id || user.role !== "ADMIN") {
    redirect("/")
  }

  // Get event
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: {
      organizer: {
        include: {
          user: true,
        },
      },
      ticketTypes: true,
      adminReviews: {
        include: {
          admin: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  })

  if (!event) {
    return (
      <div className="space-y-6">
        <Button asChild variant="ghost" size="sm" className="gap-1">
          <Link href="/admin/events/pending">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>

        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="p-6">
            <p className="text-destructive font-medium">Event not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const organizer = event.organizer
  const organizerUser = organizer.user

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="gap-1">
        <Link href="/admin/events/pending">
          <ArrowLeft className="h-4 w-4" />
          Back to Queue
        </Link>
      </Button>

      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">{event.titleEn}</h1>
        <Badge
          className={`${
            event.status === "PENDING_REVIEW"
              ? "bg-yellow-500/10 text-yellow-700"
              : event.status === "APPROVED"
                ? "bg-green-500/10 text-green-700"
                : "bg-red-500/10 text-red-700"
          }`}
        >
          {event.status}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle>Event Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">City</p>
                  <p className="font-medium text-lg">{event.city}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Venue</p>
                  <p className="font-medium text-lg">{event.venueName}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Start Date & Time</p>
                  <p className="font-medium">{format(new Date(event.startAt), "MMM dd, yyyy HH:mm")}</p>
                </div>
                {event.endAt && (
                  <div>
                    <p className="text-sm text-muted-foreground">End Date & Time</p>
                    <p className="font-medium">{format(new Date(event.endAt), "MMM dd, yyyy HH:mm")}</p>
                  </div>
                )}
              </div>

              {event.category && (
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{event.category}</p>
                </div>
              )}

              {event.descEn && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Description (English)</p>
                  <p className="text-sm">{event.descEn}</p>
                </div>
              )}

              {event.descSi && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Description (Sinhala)</p>
                  <p className="text-sm">{event.descSi}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ticket Types */}
          <Card>
            <CardHeader>
              <CardTitle>Ticket Types ({event.ticketTypes.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {event.ticketTypes.length > 0 ? (
                <div className="space-y-3">
                  {event.ticketTypes.map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex-1">
                        <p className="font-medium">{ticket.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Rs {ticket.price.toLocaleString()} × {ticket.totalQty} tickets
                        </p>
                      </div>
                      <Badge variant="outline">
                        {ticket.soldQty} / {ticket.totalQty}
                      </Badge>
                    </div>
                  ))}
                  <div className="mt-4 p-4 rounded-lg bg-muted/50">
                    <p className="text-sm">
                      <strong>Total Capacity:</strong> {event.ticketTypes.reduce((sum, t) => sum + t.totalQty, 0)} tickets
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No ticket types defined</p>
              )}
            </CardContent>
          </Card>

          {/* Review History */}
          {event.adminReviews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Review History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {event.adminReviews.map((review) => (
                    <div key={review.id} className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{review.admin.name || "Admin"}</p>
                        <Badge
                          variant="outline"
                          className={
                            review.decision === "APPROVED"
                              ? "bg-green-500/10 text-green-700"
                              : "bg-red-500/10 text-red-700"
                          }
                        >
                          {review.decision}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {format(new Date(review.createdAt), "MMM dd, yyyy HH:mm")}
                      </p>
                      {review.note && <p className="text-sm">{review.note}</p>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Organizer & Actions */}
        <div className="space-y-6">
          {/* Organizer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Organizer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Name</p>
                <p className="font-medium">{organizerUser.name || "Unknown"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Email</p>
                <p className="text-sm break-all">{organizerUser.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Phone</p>
                <p className="text-sm">{organizerUser.phone || "Not provided"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Partner Type</p>
                <Badge variant="outline">{organizer.partnerType}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Verification Status</p>
                <Badge
                  className={
                    organizer.kycStatus === "VERIFIED"
                      ? "bg-green-500/10 text-green-700"
                      : "bg-yellow-500/10 text-yellow-700"
                  }
                >
                  {organizer.kycStatus}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Approval Form */}
          {event.status === "PENDING_REVIEW" && <EventApprovalForm eventId={event.id} />}
        </div>
      </div>
    </div>
  )
}
