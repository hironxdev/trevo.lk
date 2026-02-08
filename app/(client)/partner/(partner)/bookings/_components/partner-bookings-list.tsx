import { getPartnerBookings } from "@/actions/partner/bookings"
import { PartnerBookingCard } from "./partner-booking-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarX } from "lucide-react"

export async function PartnerBookingsList() {
  const result = await getPartnerBookings()

  if (!result.success) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{result.error || "Failed to load bookings"}</p>
      </div>
    )
  }

  const bookings = result.data || []

  if (bookings.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <CalendarX className="h-16 w-16 mx-auto text-muted-foreground" />
        <h3 className="text-xl font-semibold">No bookings yet</h3>
        <p className="text-muted-foreground">You haven&apos;t received any booking requests yet.</p>
      </div>
    )
  }

  const pendingBookings = bookings.filter((b) => b.status === "PENDING")
  const confirmedBookings = bookings.filter((b) => ["CONFIRMED", "ACTIVE"].includes(b.status))
  const completedBookings = bookings.filter((b) => b.status === "COMPLETED")
  const cancelledBookings = bookings.filter((b) => ["CANCELLED", "REJECTED"].includes(b.status))

  return (
    <Tabs defaultValue="pending" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-6">
        <TabsTrigger value="pending" className="relative">
          Pending
          {pendingBookings.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {pendingBookings.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="confirmed">Active ({confirmedBookings.length})</TabsTrigger>
        <TabsTrigger value="completed">Completed ({completedBookings.length})</TabsTrigger>
        <TabsTrigger value="cancelled">Cancelled ({cancelledBookings.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="pending" className="space-y-4">
        {pendingBookings.length === 0 ? (
          <EmptyState message="No pending bookings" />
        ) : (
          pendingBookings.map((booking) => <PartnerBookingCard key={booking.id} booking={booking} />)
        )}
      </TabsContent>

      <TabsContent value="confirmed" className="space-y-4">
        {confirmedBookings.length === 0 ? (
          <EmptyState message="No active bookings" />
        ) : (
          confirmedBookings.map((booking) => <PartnerBookingCard key={booking.id} booking={booking} />)
        )}
      </TabsContent>

      <TabsContent value="completed" className="space-y-4">
        {completedBookings.length === 0 ? (
          <EmptyState message="No completed bookings" />
        ) : (
          completedBookings.map((booking) => <PartnerBookingCard key={booking.id} booking={booking} />)
        )}
      </TabsContent>

      <TabsContent value="cancelled" className="space-y-4">
        {cancelledBookings.length === 0 ? (
          <EmptyState message="No cancelled bookings" />
        ) : (
          cancelledBookings.map((booking) => <PartnerBookingCard key={booking.id} booking={booking} />)
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
