import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Zap } from "lucide-react"

export default function EventCheckoutPage({ params }: { params: { eventId: string } }) {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold mb-2">Coming Soon</h1>
            <p className="text-muted-foreground">
              Event ticket booking is coming to Trevo! We're building a seamless checkout experience for you.
            </p>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/events">Browse Events</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Back Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
