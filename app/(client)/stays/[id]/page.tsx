import { getStaysById } from "@/actions/stays/info"
import { StaysDetails } from "@/app/(client)/stays/_components/stays-details"
import { StaysGallery } from "@/app/(client)/stays/_components/stays-gallery"
import { StaysBookingCard } from "@/app/(client)/stays/_components/stays-booking-card"
import { StaysContactCard } from "@/app/(client)/stays/_components/stays-contact-card"
import { StaysReviews } from "@/app/(client)/stays/_components/stays-reviews"
import { notFound } from "next/navigation"

export default async function StaysDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const result = await getStaysById((await params).id)

  if (!result.success || !result.data) {
    notFound()
  }

  const stays = result.data

  return (
    <main className="flex-1 pt-20">
      <div className="mx-auto container px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <StaysGallery images={stays.images} />
            <StaysDetails stays={stays} />
            <StaysReviews reviews={stays.reviews} averageRating={stays.averageRating} />
          </div>
          <div className="lg:col-span-1">
            {stays.contactOnly ? <StaysContactCard stays={stays} /> : <StaysBookingCard stays={stays} />}
          </div>
        </div>
      </div>
    </main>
  )
}
