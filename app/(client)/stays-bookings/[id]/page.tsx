import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { getStaysBookingById } from "@/actions/stays-booking/info"
import { StaysBookingDetails } from "./_components/stays-booking-details"

export const metadata = {
  title: "Booking Details | Trevo",
  description: "View your stays booking details",
}

interface StaysBookingPageProps {
  params: Promise<{ id: string }>
}

export default async function StaysBookingPage({ params }: StaysBookingPageProps) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/sign-in")
  }

  const result = await getStaysBookingById(id)

  if (!result.success || !result.data) {
    notFound()
  }

  // Verify the booking belongs to the user
  if (result.data.userId !== session.user.id && session.user.role !== "ADMIN") {
    redirect("/stays-bookings")
  }

  return (
    <main className="min-h-screen pt-20 pb-12 bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <StaysBookingDetails booking={result.data} />
      </div>
    </main>
  )
}
