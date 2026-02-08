import { Suspense } from "react"
import { BookingDetails } from "./_components/booking-details"
import { Skeleton } from "@/components/ui/skeleton"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function BookingDetailsPage({ params }: PageProps) {
  const { id } = await params

  if (!id) {
    notFound()
  }

  return (
    <div className="container px-4 py-8">
      <Suspense fallback={<BookingDetailsSkeleton />}>
        <BookingDetails bookingId={id} />
      </Suspense>
    </div>
  )
}

function BookingDetailsSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-64 rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  )
}
