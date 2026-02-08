import { Suspense } from "react"
import { BookingsList } from "./_components/bookings-list"
import { BookingsListSkeleton } from "./_components/bookings-list-skeleton"

export const metadata = {
  title: "My Bookings | Trevo",
  description: "View and manage your vehicle bookings",
}

export default function BookingsPage() {
  return (
    <div className="container px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
        <p className="text-muted-foreground">View and manage your vehicle rental bookings</p>
      </div>

      <Suspense fallback={<BookingsListSkeleton />}>
        <BookingsList />
      </Suspense>
    </div>
  )
}
