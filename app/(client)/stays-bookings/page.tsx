import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { StaysBookingsList } from "./_components/stays-bookings-list"

export const metadata = {
  title: "My Stays | Trevo",
  description: "View and manage your stays bookings",
}

export default async function StaysBookingsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/sign-in")
  }

  return (
    <main className="min-h-screen pt-20 pb-12 bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">My Stays</h1>
          <p className="text-muted-foreground">View and manage your property bookings</p>
        </div>
        <StaysBookingsList />
      </div>
    </main>
  )
}
