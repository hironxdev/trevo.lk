import { getCurrentUser } from "@/lib/utils/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { submitEventForReview } from "@/actions/events/create"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

interface SubmitPageProps {
  params: { id: string }
}

export default async function SubmitEventPage({ params }: SubmitPageProps) {
  const user = await getCurrentUser()

  if (!user?.id) {
    redirect("/auth/sign-in")
  }

  // Get partner
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

  // Check if in DRAFT status
  if (event.status !== "DRAFT") {
    return (
      <div className="space-y-6">
        <Button asChild variant="ghost" size="sm" className="gap-1">
          <Link href="/partner/events">
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Link>
        </Button>

        <Card className="border-blue-500/50 bg-blue-500/10">
          <CardContent className="p-6 flex gap-4">
            <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Event Already Submitted</h3>
              <p className="text-sm text-blue-800">
                This event has already been submitted for review. Current status: <strong>{event.status}</strong>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check if event has at least one ticket type
  if (event.ticketTypes.length === 0) {
    return (
      <div className="space-y-6">
        <Button asChild variant="ghost" size="sm" className="gap-1">
          <Link href="/partner/events">
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Link>
        </Button>

        <Card className="border-yellow-500/50 bg-yellow-500/10">
          <CardContent className="p-6 flex gap-4">
            <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">Add Ticket Types First</h3>
              <p className="text-sm text-yellow-800 mb-4">
                Your event must have at least one ticket type before submitting for review.
              </p>
              <Button asChild size="sm">
                <Link href={`/partner/events/${event.id}/tickets`}>
                  Add Ticket Types
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm" className="gap-1">
          <Link href="/partner/events">
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Submit Event for Review</h1>
        <p className="text-muted-foreground mt-1">Review your event details before submitting to our admin team</p>
      </div>

      {/* Event Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Title</p>
            <p className="text-lg font-semibold">{event.titleEn}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">City</p>
              <p className="font-medium">{event.city}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Venue</p>
              <p className="font-medium">{event.venueName}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Start Date</p>
              <p className="font-medium">{format(new Date(event.startAt), "MMM dd, yyyy HH:mm")}</p>
            </div>
            {event.endAt && (
              <div>
                <p className="text-sm text-muted-foreground">End Date</p>
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
        </CardContent>
      </Card>

      {/* Ticket Types Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Ticket Types ({event.ticketTypes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {event.ticketTypes.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">{ticket.name}</p>
                  <p className="text-sm text-muted-foreground">Rs {ticket.price.toLocaleString()} × {ticket.totalQty} tickets</p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submission Info */}
      <Card className="border-blue-500/30 bg-blue-500/5">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2">What Happens Next?</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-blue-600">•</span>
              <span>Our admin team will review your event within 24-48 hours</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600">•</span>
              <span>You'll receive an email notification once approved or rejected</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600">•</span>
              <span>After approval, your event will be publicly visible</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Submit Form */}
      <form
        action={async () => {
          "use server"
          const result = await submitEventForReview(event.id)
          if (result.success) {
            redirect("/partner/events?submitted=true")
          }
        }}
      >
        <div className="flex gap-3">
          <Button type="submit" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Submit for Review
          </Button>
          <Button asChild variant="outline">
            <Link href="/partner/events">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
