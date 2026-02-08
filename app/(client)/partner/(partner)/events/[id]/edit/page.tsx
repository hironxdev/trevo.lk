import { getCurrentUser } from "@/lib/utils/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertCircle } from "lucide-react"
import Link from "next/link"
import EventForm from "../../_components/event-form"

interface EditEventPageProps {
  params: { id: string }
}

export default async function EditEventPage({ params }: EditEventPageProps) {
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
    include: { organizer: true },
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

  // Check if editable (only DRAFT or REJECTED)
  if (event.status !== "DRAFT" && event.status !== "REJECTED") {
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
          <CardContent className="p-6 flex gap-4">
            <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">Event Cannot Be Edited</h3>
              <p className="text-sm text-yellow-800">
                Only events in DRAFT or REJECTED status can be edited. Current status: <strong>{event.status}</strong>
              </p>
            </div>
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
        <h1 className="text-3xl font-bold">Edit Event</h1>
        <p className="text-muted-foreground mt-1">Update your event details</p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Event Information</CardTitle>
        </CardHeader>
        <CardContent>
          <EventForm
            partnerId={partner.id}
            eventId={event.id}
            mode="edit"
            initialData={{
              id: event.id,
              titleEn: event.titleEn,
              titleSi: event.titleSi || "",
              descEn: event.descEn || "",
              descSi: event.descSi || "",
              category: event.category || "",
              city: event.city,
              venueName: event.venueName,
              mapUrl: event.mapUrl || "",
              posterUrl: event.posterUrl || "",
              startAt: event.startAt.toISOString().slice(0, 16),
              endAt: event.endAt ? event.endAt.toISOString().slice(0, 16) : "",
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
