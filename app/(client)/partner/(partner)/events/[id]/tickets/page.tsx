import { getCurrentUser } from "@/lib/utils/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import TicketTypeForm from "../../_components/ticket-type-form"

interface TicketsPageProps {
  params: { id: string }
}

export default async function TicketsPage({ params }: TicketsPageProps) {
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

  // Get event
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: {
      organizer: true,
      ticketTypes: true,
    },
  })

  if (!event) {
    return (
      <div className="p-8">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-destructive font-medium">Event not found</p>
        </div>
      </div>
    )
  }

  // Check ownership
  if (event.organizer.id !== partner.id) {
    redirect("/partner/events")
  }

  // Check if event is in DRAFT status
  if (event.status !== "DRAFT") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Button asChild variant="ghost" size="sm" className="gap-1">
            <Link href="/partner/events">
              <ArrowLeft className="h-4 w-4" />
              Back to Events
            </Link>
          </Button>
        </div>

        <Card className="border-yellow-500/50 bg-yellow-500/10">
          <CardContent className="p-6">
            <p className="text-yellow-900 font-medium">
              Ticket types can only be managed for events in DRAFT status. Please edit the event details first.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Button asChild variant="ghost" size="sm" className="gap-1">
            <Link href="/partner/events">
              <ArrowLeft className="h-4 w-4" />
              Back to Events
            </Link>
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Manage Ticket Types</h1>
            <p className="text-muted-foreground mt-1">{event.titleEn}</p>
          </div>
          <Button asChild className="gap-2">
            <Link href={`/partner/events/${event.id}/tickets/new`}>
              <Plus className="h-4 w-4" />
              Add Ticket Type
            </Link>
          </Button>
        </div>
      </div>

      {/* Existing Ticket Types */}
      {event.ticketTypes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Current Ticket Types</h2>
          <div className="grid gap-4">
            {event.ticketTypes.map((ticket) => (
              <Card key={ticket.id} className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{ticket.name}</h3>
                      <div className="grid sm:grid-cols-3 gap-4 mt-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Price</p>
                          <p className="font-semibold">Rs {ticket.price}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Quantity</p>
                          <p className="font-semibold">
                            {ticket.soldQty} / {ticket.totalQty} sold
                          </p>
                        </div>
                        {ticket.salesStartAt && (
                          <div>
                            <p className="text-muted-foreground">Sales Period</p>
                            <p className="font-semibold">
                              {format(new Date(ticket.salesStartAt), "MMM dd")}
                              {ticket.salesEndAt && ` - ${format(new Date(ticket.salesEndAt), "MMM dd")}`}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add Ticket Type Form */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          {event.ticketTypes.length > 0 ? "Add Another Ticket Type" : "Create Your First Ticket Type"}
        </h2>
        <Card>
          <CardContent className="p-6">
            <TicketTypeForm eventId={event.id} />
          </CardContent>
        </Card>
      </div>

      {/* Continue Button */}
      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link href="/partner/events">Done</Link>
        </Button>
        <Button asChild>
          <Link href={`/partner/events/${event.id}/submit`}>Submit for Review</Link>
        </Button>
      </div>
    </div>
  )
}
