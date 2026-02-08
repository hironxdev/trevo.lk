import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, Users, ExternalLink, Heart, Share2 } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import type { getEventBySlug } from "@/actions/events/list"

interface EventDetailsProps {
  event: Awaited<ReturnType<typeof getEventBySlug>>["data"]
}

export function EventDetails({ event }: EventDetailsProps) {
  if (!event) return null

  const formattedStartDate = format(new Date(event.startAt), "EEEE, MMMM dd, yyyy")
  const formattedStartTime = format(new Date(event.startAt), "h:mm a")
  const formattedEndDate = event.endAt ? format(new Date(event.endAt), "EEEE, MMMM dd, yyyy") : null

  const minPrice = event.ticketTypes.length > 0 ? Math.min(...event.ticketTypes.map((t) => t.price)) : 0
  const maxPrice = event.ticketTypes.length > 0 ? Math.max(...event.ticketTypes.map((t) => t.price)) : 0

  return (
    <div className="space-y-8">
      {/* Poster */}
      {event.posterUrl && (
        <div className="w-full h-96 rounded-lg overflow-hidden">
          <img src={event.posterUrl} alt={event.titleEn} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Category */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">{event.titleEn}</h1>
                {event.titleSi && <p className="text-xl text-muted-foreground">{event.titleSi}</p>}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
            {event.category && (
              <Badge className="bg-blue-600 hover:bg-blue-700">{event.category}</Badge>
            )}
          </div>

          <Separator />

          {/* Date & Location Info */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">{formattedStartDate}</p>
                <p className="text-muted-foreground text-sm">{formattedStartTime}</p>
                {formattedEndDate && (
                  <p className="text-muted-foreground text-sm">to {formattedEndDate}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">{event.venueName}</p>
                <p className="text-muted-foreground text-sm">{event.city}, Sri Lanka</p>
                {event.mapUrl && (
                  <Link href={event.mapUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                    View on Map <ExternalLink className="inline h-3 w-3" />
                  </Link>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          {event.descEn && (
            <div>
              <h2 className="text-xl font-semibold mb-3">About this Event</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">{event.descEn}</p>
            </div>
          )}

          {event.descSi && (
            <div>
              <h2 className="text-xl font-semibold mb-3">විස්තර</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">{event.descSi}</p>
            </div>
          )}

          <Separator />

          {/* Organizer Info */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Organized By</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">
                      {event.organizer.businessName || event.organizer.fullName || event.organizer.user?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {event.organizer.partnerType === "BUSINESS" ? "Business Partner" : "Individual Partner"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Promo Codes */}
          {event.promoCodes.length > 0 && (
            <>
              <Separator />
              <div>
                <h2 className="text-xl font-semibold mb-3">Available Discounts</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {event.promoCodes.map((promo) => (
                    <Card key={promo.id}>
                      <CardContent className="pt-4">
                        <p className="font-mono font-semibold text-blue-600">{promo.code}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {promo.type === "PERCENT"
                            ? `${promo.value}% off`
                            : `Rs. ${Math.floor(promo.value).toLocaleString()} off`}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sidebar - Ticket Selection */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-2xl">
                Rs. {Math.floor(minPrice).toLocaleString()}
                {minPrice !== maxPrice && ` - ${Math.floor(maxPrice).toLocaleString()}`}
              </CardTitle>
              <p className="text-sm text-muted-foreground">per ticket</p>
            </CardHeader>

            <CardContent className="space-y-4">
              {event.ticketTypes.length === 0 ? (
                <p className="text-muted-foreground text-sm">No tickets available for this event</p>
              ) : (
                <>
                  {event.ticketTypes.map((ticketType) => {
                    const remaining = ticketType.totalQty - ticketType.soldQty

                    return (
                      <div key={ticketType.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{ticketType.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Rs. {Math.floor(ticketType.price).toLocaleString()}
                            </p>
                          </div>
                          <Badge variant={remaining > 10 ? "default" : remaining > 0 ? "secondary" : "destructive"}>
                            {remaining > 0 ? `${remaining} left` : "Sold out"}
                          </Badge>
                        </div>
                        <Button
                          className="w-full"
                          disabled={remaining === 0}
                          asChild={remaining > 0}
                        >
                          {remaining > 0 ? (
                            <Link href={`/checkout?eventId=${event.id}&ticketTypeId=${ticketType.id}`}>
                              Book Now
                            </Link>
                          ) : (
                            "Sold Out"
                          )}
                        </Button>
                      </div>
                    )
                  })}
                </>
              )}

              {/* Trevo Integration CTAs */}
              <div className="pt-4 border-t space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={`/vehicles?city=${encodeURIComponent(event.city)}&startDate=${format(new Date(event.startAt), "yyyy-MM-dd")}`}>
                    🚗 Book a Vehicle
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={`/stays?city=${encodeURIComponent(event.city)}`}>
                    🏠 Find a Stay
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
