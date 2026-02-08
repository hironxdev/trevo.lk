import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Ticket } from "lucide-react"

export default function TicketPage({ params }: { params: { bookingId: string } }) {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Ticket className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold mb-2">Your Ticket</h1>
            <p className="text-muted-foreground">
              Your event ticket details will appear here. Check your email for your booking confirmation.
            </p>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/events">Browse More Events</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard">My Bookings</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
