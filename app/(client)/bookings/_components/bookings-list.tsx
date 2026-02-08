import { getMyBookings } from "@/actions/booking/list"
import { BookingCard } from "./booking-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarX } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export async function BookingsList() {
  const result = await getMyBookings({ limit: 50 })

  if (!result.success) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{result.error || "Failed to load bookings"}</p>
      </div>
    )
  }

  const bookings = result.data?.data || []

  if (bookings.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <CalendarX className="h-16 w-16 mx-auto text-muted-foreground" />
        <h3 className="text-xl font-semibold">No bookings yet</h3>
        <p className="text-muted-foreground">You haven&apos;t made any vehicle bookings yet.</p>
        <Button asChild>
          <Link href="/vehicles">Browse Vehicles</Link>
        </Button>
      </div>
    )
  }

  const activeBookings = bookings.filter((b) => ["PENDING", "CONFIRMED", "ACTIVE"].includes(b.status))
  const completedBookings = bookings.filter((b) => b.status === "COMPLETED")
  const cancelledBookings = bookings.filter((b) => ["CANCELLED", "REJECTED"].includes(b.status))

  return (
    <Tabs defaultValue="active" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="active">Active ({activeBookings.length})</TabsTrigger>
        <TabsTrigger value="completed">Completed ({completedBookings.length})</TabsTrigger>
        <TabsTrigger value="cancelled">Cancelled ({cancelledBookings.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="active" className="space-y-4">
        {activeBookings.length === 0 ? (
          <EmptyState message="No active bookings" />
        ) : (
          activeBookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)
        )}
      </TabsContent>

      <TabsContent value="completed" className="space-y-4">
        {completedBookings.length === 0 ? (
          <EmptyState message="No completed bookings" />
        ) : (
          completedBookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)
        )}
      </TabsContent>

      <TabsContent value="cancelled" className="space-y-4">
        {cancelledBookings.length === 0 ? (
          <EmptyState message="No cancelled bookings" />
        ) : (
          cancelledBookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)
        )}
      </TabsContent>
    </Tabs>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <p>{message}</p>
    </div>
  )
}
