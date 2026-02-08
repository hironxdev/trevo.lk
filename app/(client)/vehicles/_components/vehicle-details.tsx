import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Calendar,
  Fuel,
  Gauge,
  Users,
  Settings,
  Phone,
  MessageCircle,
  Mail,
  UserRound,
  Clock,
  CalendarDays,
  Car,
  Building2,
  User,
} from "lucide-react"
import type { getVehicleById } from "@/actions/vehicle/info"
import { RentalType } from "@prisma/client"

interface VehicleDetailsProps {
  vehicle: Awaited<ReturnType<typeof getVehicleById>>["data"]
}

export function VehicleDetails({ vehicle }: VehicleDetailsProps) {
  const specifications = vehicle?.specifications || {}
  const partner = vehicle?.partner

  const isExternalPartner = !vehicle?.partnerId && vehicle?.externalPartnerName

  const partnerName = isExternalPartner
    ? vehicle?.externalPartnerName
    : partner?.businessName || partner?.fullName || partner?.user?.name

  const partnerPhone = isExternalPartner
    ? vehicle?.externalPartnerPhone
    : partner?.businessHotline || partner?.user?.phone

  const partnerWhatsApp = isExternalPartner ? vehicle?.externalPartnerWhatsApp : partner?.whatsappNumber

  const partnerEmail = isExternalPartner
    ? vehicle?.externalPartnerEmail
    : partner?.businessEmail || partner?.user?.email

  const partnerType = isExternalPartner
    ? vehicle?.externalPartnerType
    : partner?.businessName
      ? "business"
      : "individual"

  const getWhatsAppLink = (number: string) => {
    const cleaned = number.replace(/\D/g, "")
    return `https://wa.me/${cleaned}`
  }

  const vehicleTypeLabel = {
    CAR: "Car",
    VAN: "Van",
    SUV: "SUV",
    BIKE: "Bike",
    BUS: "Bus",
    TRUCK: "Truck",
    OTHER: "Other",
  }

  const isLongTerm = vehicle?.rentalType === RentalType.LONG_TERM

  const displayTitle =
    vehicle?.displayName || `${vehicle?.make || ""} ${vehicle?.model || ""} ${vehicle?.year || ""}`.trim() || "Vehicle"

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">{displayTitle}</CardTitle>
              {vehicle?.displayName && (vehicle?.make || vehicle?.model) && (
                <p className="text-muted-foreground mb-1">
                  {vehicle?.make} {vehicle?.model} {vehicle?.year}
                </p>
              )}
              {vehicle?.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{vehicle?.location}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 items-end">
              {vehicle?.category && <Badge className="text-sm">{vehicle?.category.name}</Badge>}
              <Badge variant={isLongTerm ? "default" : "secondary"} className="text-sm">
                {isLongTerm ? (
                  <>
                    <CalendarDays className="h-3 w-3 mr-1" />
                    Long-term
                  </>
                ) : (
                  <>
                    <Clock className="h-3 w-3 mr-1" />
                    Short-term
                  </>
                )}
              </Badge>
              {vehicle?.vehicleType && (
                <Badge variant="outline" className="text-sm">
                  {vehicleTypeLabel[vehicle.vehicleType]}
                </Badge>
              )}
              {vehicle?.withDriver && (
                <Badge className="text-sm bg-blue-600 text-white">
                  <UserRound className="h-3 w-3 mr-1" />
                  With Driver
                </Badge>
              )}
              {vehicle?.contactOnly && (
                <Badge variant="secondary" className="text-sm">
                  <Phone className="h-3 w-3 mr-1" />
                  Contact Only
                </Badge>
              )}
              {vehicle?.isAdminCreated && (
                <Badge variant="outline" className="text-sm text-blue-600 border-blue-200">
                  Admin Listed
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {specifications.fuelType && (
              <div className="flex items-center gap-2">
                <Fuel className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Fuel Type</p>
                  <p className="font-medium">{specifications.fuelType}</p>
                </div>
              </div>
            )}
            {specifications.transmission && (
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Transmission</p>
                  <p className="font-medium">{specifications.transmission}</p>
                </div>
              </div>
            )}
            {specifications.seatingCapacity && (
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Seats</p>
                  <p className="font-medium">{specifications.seatingCapacity}</p>
                </div>
              </div>
            )}
            {specifications.mileage && (
              <div className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Mileage</p>
                  <p className="font-medium">{specifications.mileage} km</p>
                </div>
              </div>
            )}
            {vehicle?.year && (
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Year</p>
                  <p className="font-medium">{vehicle?.year}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <UserRound className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Driver</p>
                <p className="font-medium">{vehicle?.withDriver ? "Available" : "Self-Drive"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {(vehicle?.pricePerDay || vehicle?.monthlyPrice || vehicle?.depositRequired) && (
        <Card>
          <CardHeader>
            <CardTitle>Pricing Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLongTerm && vehicle?.monthlyPrice ? (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Rate</span>
                <span className="font-bold text-lg text-primary">Rs {vehicle.monthlyPrice?.toLocaleString()}/month</span>
              </div>
            ) : vehicle?.pricePerDay ? (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Daily Rate</span>
                <span className="font-bold text-lg text-primary">Rs {vehicle?.pricePerDay?.toLocaleString()}/day</span>
              </div>
            ) : null}

            {!isLongTerm && vehicle?.monthlyPrice && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Rate</span>
                <span className="font-medium">Rs {vehicle.monthlyPrice?.toLocaleString()}</span>
              </div>
            )}

            {isLongTerm && vehicle?.pricePerDay && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Daily Rate (reference)</span>
                <span className="font-medium">Rs {vehicle?.pricePerDay?.toLocaleString()}</span>
              </div>
            )}

            {vehicle?.pricePerKm && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Extra KM Rate</span>
                <span className="font-medium">Rs {vehicle.pricePerKm?.toLocaleString()}/km</span>
              </div>
            )}

            {vehicle?.depositRequired && (
              <>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Security Deposit</span>
                  <span className="font-medium">Rs {vehicle?.depositRequired?.toLocaleString()}</span>
                </div>
              </>
            )}

            {!vehicle?.unlimitedMileage && (vehicle?.includedKmPerDay || vehicle?.includedKmPerMonth) && (
              <>
                <Separator />
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Included Kilometers:</span>
                </div>
                {vehicle?.includedKmPerDay && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Per Day</span>
                    <span>{vehicle.includedKmPerDay} km</span>
                  </div>
                )}
                {vehicle?.includedKmPerMonth && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Per Month</span>
                    <span>{vehicle.includedKmPerMonth} km</span>
                  </div>
                )}
              </>
            )}

            {vehicle?.unlimitedMileage && (
              <>
                <Separator />
                <div className="flex items-center gap-2 text-green-600">
                  <Car className="h-4 w-4" />
                  <span className="font-medium">Unlimited Mileage Included</span>
                </div>
              </>
            )}

            {vehicle?.withDriver && (vehicle?.driverPricePerDay || vehicle?.driverPricePerMonth) && (
              <>
                <Separator />
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground flex items-center gap-2">
                    <UserRound className="h-4 w-4" />
                    Driver Pricing:
                  </span>
                </div>
                {vehicle?.driverPricePerDay && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Driver Per Day</span>
                    <span>+ Rs {vehicle.driverPricePerDay?.toLocaleString()}</span>
                  </div>
                )}
                {vehicle?.driverPricePerMonth && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Driver Per Month</span>
                    <span>+ Rs {vehicle.driverPricePerMonth?.toLocaleString()}</span>
                  </div>
                )}
                {vehicle?.driverPricePerKm && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Driver Extra KM</span>
                    <span>+ Rs {vehicle.driverPricePerKm?.toLocaleString()}/km</span>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {vehicle?.features && vehicle?.features.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {vehicle?.features.map((feature: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {feature}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Contact Rental Partner</CardTitle>
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
              {isExternalPartner ? (
                <Badge variant="outline" className="text-xs">
                  {partnerType === "business" ? "Business" : "Individual"}
                </Badge>
              ) : (
                <Badge variant={partner?.kycStatus === "VERIFIED" ? "default" : "secondary"}>
                  {partner?.kycStatus === "VERIFIED" ? "Verified Partner" : "Partner"}
                </Badge>
              )}
            </div>
          </div>

          {isExternalPartner && vehicle?.externalPartnerAddress && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground p-3 bg-muted rounded-lg">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{vehicle.externalPartnerAddress}</span>
            </div>
          )}

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
        </CardContent>
      </Card>
    </div>
  )
}
