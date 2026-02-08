import { getVehicleById } from "@/actions/vehicle/info"
import { VehicleDetails } from "@/app/(client)/vehicles/_components/vehicle-details"
import { VehicleGallery } from "@/app/(client)/vehicles/_components/vehicle-gallery"
import { BookingCard } from "@/app/(client)/vehicles/_components/booking-card"
import { ContactOnlyCard } from "@/app/(client)/vehicles/_components/contact-only-card"
import { VehicleReviews } from "@/app/(client)/vehicles/_components/vehicle-reviews"
import { CustomerBookingNotice } from "@/components/customer-booking-notice"
import { notFound } from "next/navigation"

export default async function VehicleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const result = await getVehicleById((await params).id)

  if (!result.success || !result.data) {
    notFound()
  }

  const vehicle = result.data

  return (
    <main className="flex-1">
      <div className="mx-auto container px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <VehicleGallery images={vehicle.images} />
            <CustomerBookingNotice />
            <VehicleDetails vehicle={vehicle} />
            <VehicleReviews reviews={vehicle.reviews} averageRating={vehicle.averageRating} />
          </div>
          <div className="lg:col-span-1">
            {vehicle.contactOnly ? <ContactOnlyCard vehicle={vehicle} /> : <BookingCard vehicle={vehicle} />}
          </div>
        </div>
      </div>
    </main>
  )
}
