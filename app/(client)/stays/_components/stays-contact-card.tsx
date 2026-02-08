import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, MessageCircle, Mail, Building2, User, MapPin } from "lucide-react"
import type { getStaysById } from "@/actions/stays/info"

interface StaysContactCardProps {
  stays: Awaited<ReturnType<typeof getStaysById>>["data"]
}

export function StaysContactCard({ stays }: StaysContactCardProps) {
  const isExternalPartner = !stays?.partnerId && stays?.externalPartnerName
  const partner = stays?.partner

  const partnerName = isExternalPartner ? stays?.externalPartnerName : partner?.businessName || partner?.fullName

  const partnerPhone = isExternalPartner ? stays?.externalPartnerPhone : partner?.businessHotline

  const partnerWhatsApp = isExternalPartner ? stays?.externalPartnerWhatsApp : partner?.whatsappNumber

  const partnerEmail = isExternalPartner ? stays?.externalPartnerEmail : partner?.businessEmail

  const partnerAddress = isExternalPartner ? stays?.externalPartnerAddress : null

  const partnerType = isExternalPartner ? stays?.externalPartnerType : partner?.businessName ? "business" : "individual"

  const getWhatsAppLink = (number: string) => {
    const cleaned = number.replace(/\D/g, "")
    return `https://wa.me/${cleaned}`
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Contact Property</CardTitle>
          <Badge variant="secondary">
            <Phone className="h-3 w-3 mr-1" />
            Contact Only
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Price Display */}
        {stays?.pricePerNight && (
          <div className="p-4 bg-primary/10 rounded-lg">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">Rs {stays.pricePerNight?.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">/night</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Contact the property owner to book</p>
          </div>
        )}

        {/* Partner Info */}
        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
          {partnerType === "business" ? (
            <Building2 className="h-6 w-6 text-primary" />
          ) : (
            <User className="h-6 w-6 text-primary" />
          )}
          <div>
            <p className="font-semibold">{partnerName}</p>
            <p className="text-sm text-muted-foreground capitalize">{partnerType}</p>
          </div>
        </div>

        {partnerAddress && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{partnerAddress}</span>
          </div>
        )}

        {/* Contact Buttons */}
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

          {!partnerWhatsApp && !partnerPhone && !partnerEmail && (
            <p className="text-sm text-center text-muted-foreground py-4">
              Contact information not available. Please check back later.
            </p>
          )}
        </div>

        <p className="text-xs text-center text-muted-foreground">
          This property requires direct contact with the owner for booking
        </p>
      </CardContent>
    </Card>
  )
}
