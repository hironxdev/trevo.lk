import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Bed,
  Bath,
  Users,
  Phone,
  MessageCircle,
  Mail,
  Building2,
  User,
  Wifi,
  Car,
  Waves,
  Utensils,
  Tv,
  Wind,
  Shield,
  Check,
} from "lucide-react"
import type { getStaysById } from "@/actions/stays/info"

interface StaysDetailsProps {
  stays: Awaited<ReturnType<typeof getStaysById>>["data"]
}

const amenityIcons: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="h-4 w-4" />,
  "Air Conditioning": <Wind className="h-4 w-4" />,
  Parking: <Car className="h-4 w-4" />,
  Pool: <Waves className="h-4 w-4" />,
  Kitchen: <Utensils className="h-4 w-4" />,
  TV: <Tv className="h-4 w-4" />,
  Security: <Shield className="h-4 w-4" />,
}

const staysTypeLabels: Record<string, string> = {
  HOUSE: "House",
  APARTMENT: "Apartment",
  VILLA: "Villa",
  HOTEL: "Hotel",
  GUEST_HOUSE: "Guest House",
  BUNGALOW: "Bungalow",
  ROOM: "Room",
  OTHER: "Other",
}

export function StaysDetails({ stays }: StaysDetailsProps) {
  const partner = stays?.partner
  const isExternalPartner = !stays?.partnerId && stays?.externalPartnerName

  const partnerName = isExternalPartner ? stays?.externalPartnerName : partner?.businessName || partner?.fullName

  const partnerPhone = isExternalPartner ? stays?.externalPartnerPhone : partner?.businessHotline

  const partnerWhatsApp = isExternalPartner ? stays?.externalPartnerWhatsApp : partner?.whatsappNumber

  const partnerEmail = isExternalPartner ? stays?.externalPartnerEmail : partner?.businessEmail

  const partnerType = isExternalPartner ? stays?.externalPartnerType : partner?.businessName ? "business" : "individual"

  const getWhatsAppLink = (number: string) => {
    const cleaned = number.replace(/\D/g, "")
    return `https://wa.me/${cleaned}`
  }

  return (
    <div className="space-y-6">
      {/* Main Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">{stays?.name}</CardTitle>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>
                  {stays?.address}, {stays?.city}
                  {stays?.district && `, ${stays.district}`}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <Badge>{staysTypeLabels[stays?.staysType || ""] || stays?.staysType}</Badge>
              {stays?.staysCategory && <Badge variant="secondary">{stays.staysCategory.name}</Badge>}
              {stays?.contactOnly && (
                <Badge variant="outline">
                  <Phone className="h-3 w-3 mr-1" />
                  Contact Only
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Capacity Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <Bed className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Bedrooms</p>
                <p className="font-semibold">{stays?.bedrooms}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <Bath className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Bathrooms</p>
                <p className="font-semibold">{stays?.bathrooms}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Max Guests</p>
                <p className="font-semibold">{stays?.maxGuests}</p>
              </div>
            </div>
            {stays?.beds && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Bed className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Beds</p>
                  <p className="font-semibold">{stays.beds}</p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {stays?.description && (
            <div>
              <h3 className="font-semibold mb-2">About this property</h3>
              <p className="text-muted-foreground whitespace-pre-line">{stays.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pricing Details */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {stays?.pricePerNight && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price Per Night</span>
              <span className="font-bold text-lg text-primary">Rs {stays.pricePerNight?.toLocaleString()}</span>
            </div>
          )}

          {stays?.pricePerWeek && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Weekly Rate</span>
              <span className="font-medium">Rs {stays.pricePerWeek?.toLocaleString()}</span>
            </div>
          )}

          {stays?.pricePerMonth && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Monthly Rate</span>
              <span className="font-medium">Rs {stays.pricePerMonth?.toLocaleString()}</span>
            </div>
          )}

          {stays?.cleaningFee && (
            <>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cleaning Fee (one-time)</span>
                <span className="font-medium">Rs {stays.cleaningFee?.toLocaleString()}</span>
              </div>
            </>
          )}

          {stays?.depositRequired && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Security Deposit (refundable)</span>
              <span className="font-medium">Rs {stays.depositRequired?.toLocaleString()}</span>
            </div>
          )}

          {(stays?.minNights || stays?.maxNights) && (
            <>
              <Separator />
              <div className="text-sm text-muted-foreground">
                {stays.minNights && (
                  <span>
                    Minimum stay: {stays.minNights} night{stays.minNights > 1 && "s"}
                  </span>
                )}
                {stays.minNights && stays.maxNights && <span className="mx-2">|</span>}
                {stays.maxNights && <span>Maximum stay: {stays.maxNights} nights</span>}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Amenities */}
      {stays?.amenities && stays.amenities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {stays.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                  {amenityIcons[amenity] || <Check className="h-4 w-4 text-primary" />}
                  <span className="text-sm">{amenity}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* House Rules */}
      {stays?.houseRules && stays.houseRules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>House Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {stays.houseRules.map((rule, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-1">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Contact Partner */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Property Owner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            {partnerType === "business" ? (
              <Building2 className="h-6 w-6 text-primary" />
            ) : (
              <User className="h-6 w-6 text-primary" />
            )}
            <div>
              <p className="font-semibold text-lg">{partnerName}</p>
              {!isExternalPartner && partner?.kycStatus && (
                <Badge variant={partner.kycStatus === "VERIFIED" ? "default" : "secondary"}>
                  {partner.kycStatus === "VERIFIED" ? "Verified Host" : "Host"}
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {partnerWhatsApp && (
              <Button asChild className="w-full bg-green-600 hover:bg-green-700" size="lg">
                <a href={getWhatsAppLink(partnerWhatsApp)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  WhatsApp: {partnerWhatsApp}
                </a>
              </Button>
            )}

            {partnerPhone && (
              <Button asChild variant="outline" className="w-full bg-transparent" size="lg">
                <a href={`tel:${partnerPhone}`}>
                  <Phone className="mr-2 h-5 w-5" />
                  Call: {partnerPhone}
                </a>
              </Button>
            )}

            {partnerEmail && (
              <Button asChild variant="outline" className="w-full bg-transparent" size="lg">
                <a href={`mailto:${partnerEmail}`}>
                  <Mail className="mr-2 h-5 w-5" />
                  Email: {partnerEmail}
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
