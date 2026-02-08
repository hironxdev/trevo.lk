import { getCurrentUser } from "@/lib/utils/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import EventForm from "../_components/event-form"

export default async function CreateEventPage() {
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

  // Check if verified
  const partnerUser = await prisma.user.findUnique({
    where: { id: user.id },
  })

  if (partnerUser?.partner?.kycStatus !== "VERIFIED") {
    redirect("/partner/dashboard?error=not_verified")
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
        <h1 className="text-3xl font-bold">Create Event</h1>
        <p className="text-muted-foreground mt-1">Start by adding your event details</p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Event Information</CardTitle>
        </CardHeader>
        <CardContent>
          <EventForm partnerId={partner.id} mode="create" />
        </CardContent>
      </Card>
    </div>
  )
}
