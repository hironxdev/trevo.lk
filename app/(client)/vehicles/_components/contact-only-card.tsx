"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Phone,
  MessageCircle,
  Mail,
  Info,
  Building2,
  User,
  MapPin,
} from "lucide-react"
import type { getVehicleById } from "@/actions/vehicle/info"

type VehicleType = Awaited<ReturnType<typeof getVehicleById>>["data"]
type VehicleSuccessType = Extract<VehicleType, { id: string }>

interface ContactOnlyCardProps {
  vehicle: VehicleSuccessType
}

export function ContactOnlyCard({ vehicle }: ContactOnlyCardProps) {
  const partner = vehicle.partner
  const isExternalPartner = !vehicle.partnerId && !!vehicle.externalPartnerName

  /* ---------------- Partner Details ---------------- */
  const partnerName =
    (isExternalPartner
      ? vehicle.externalPartnerName
      : partner?.businessName || partner?.fullName || partner?.user?.name) ??
    "Rental Partner"

  const partnerPhone = isExternalPartner
    ? vehicle.externalPartnerPhone
    : partner?.businessHotline || partner?.user?.phone

  const partnerWhatsApp = isExternalPartner
    ? vehicle.externalPartnerWhatsApp
    : partner?.whatsappNumber

  const partnerEmail = isExternalPartner
    ? vehicle.externalPartnerEmail
    : partner?.businessEmail || partner?.user?.email

  const partnerType: "business" | "individual" = isExternalPartner
    ? vehicle.externalPartnerType ?? "individual"
    : partner?.businessName
      ? "business"
      : "individual"

  /* ---------------- Vehicle ---------------- */
  const vehicleName =
    vehicle.displayName ||
    `${vehicle.make || ""} ${vehicle.model || ""}`.trim() ||
    "this vehicle"

  /* ---------------- Helpers ---------------- */
  const formatPhone = (num?: string) =>
    num ? num.replace(/\s+/g, " ").trim() : ""

  const getWhatsAppLink = (number: string) => {
    const cleaned = number.replace(/\D/g, "")
    const licensePart = vehicle.licensePlate
      ? ` (${vehicle.licensePlate})`
      : ""
    const message = encodeURIComponent(
      `Hi, I'm interested in renting your ${vehicleName}${licensePart} listed on Trevo.`,
    )
    return `https://wa.me/${cleaned}?text=${message}`
  }

  /* ---------------- Pricing ---------------- */
  const isLongTerm = vehicle.rentalType === "LONG_TERM"
  const displayPrice =
    isLongTerm && vehicle.monthlyPrice
      ? vehicle.monthlyPrice
      : vehicle.pricePerDay

  const priceLabel =
    isLongTerm && vehicle.monthlyPrice ? "/month" : "/day"

  const isValidWhatsApp =
    !!partnerWhatsApp &&
    partnerWhatsApp.replace(/\D/g, "").length >= 9

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Contact to Rent</CardTitle>
          <Badge variant="secondary">
            <Phone className="h-3 w-3 mr-1" />
            Contact Only
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* ---------------- Price ---------------- */}
        {displayPrice ? (
          <div className="p-4 bg-primary/10 rounded-lg">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">
                Rs {displayPrice.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">
                {priceLabel}
              </span>
            </div>

            {vehicle.depositRequired && vehicle.depositRequired > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Deposit: Rs {vehicle.depositRequired.toLocaleString()}
              </p>
            )}
          </div>
        ) : (
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              Contact for pricing details
            </p>
          </div>
        )}

        {/* ---------------- Info ---------------- */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            This vehicle is available for inquiry only. Please contact the
            rental partner directly.
            <span className="block mt-1 text-xs text-muted-foreground">
              මෙම වාහනය විමසීම සඳහා පමණක් ලබා ගත හැකිය.
            </span>
          </AlertDescription>
        </Alert>

        {/* ---------------- Partner Info ---------------- */}
        <div className="p-4 border rounded-lg space-y-3">
          <div className="flex items-center gap-2">
            {partnerType === "business" ? (
              <Building2 className="h-5 w-5 text-primary" />
            ) : (
              <User className="h-5 w-5 text-primary" />
            )}

            <div>
              <p className="font-semibold">{partnerName}</p>

              {isExternalPartner ? (
                <Badge variant="outline" className="text-xs mt-1">
                  {partnerType === "business" ? "Business" : "Individual"}
                </Badge>
              ) : (
                <Badge
                  variant={
                    partner?.kycStatus === "VERIFIED"
                      ? "default"
                      : "secondary"
                  }
                  className="text-xs mt-1"
                >
                  {partner?.kycStatus === "VERIFIED"
                    ? "Verified Partner"
                    : "Partner"}
                </Badge>
              )}
            </div>
          </div>

          {isExternalPartner && vehicle.externalPartnerAddress && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{vehicle.externalPartnerAddress}</span>
            </div>
          )}
        </div>

        {/* ---------------- Contact Buttons ---------------- */}
        <div className="space-y-3">
          {isValidWhatsApp && (
            <Button
              asChild
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <a
                href={getWhatsAppLink(partnerWhatsApp!)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp: {formatPhone(partnerWhatsApp)}
              </a>
            </Button>
          )}

          {partnerPhone && (
            <Button asChild variant="outline" className="w-full" size="lg">
              <a href={`tel:${partnerPhone}`}>
                <Phone className="mr-2 h-5 w-5" />
                Call: {formatPhone(partnerPhone)}
              </a>
            </Button>
          )}

          {partnerEmail && (
            <Button asChild variant="outline" className="w-full" size="lg">
              <a href={`mailto:${partnerEmail}`}>
                <Mail className="mr-2 h-5 w-5" />
                Email
              </a>
            </Button>
          )}

          {!partnerPhone && !partnerEmail && !isValidWhatsApp && (
            <p className="text-sm text-center text-muted-foreground py-4">
              Contact information not available.
            </p>
          )}
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Contact the partner to discuss rental terms and availability
          <span className="block">
            කුලී නියමයන් සහ ලබා ගැනීමේ හැකියාව සාකච්ඡා කිරීමට හවුල්කරු අමතන්න
          </span>
        </p>
      </CardContent>
    </Card>
  )
  }
