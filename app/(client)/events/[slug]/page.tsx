import { getEventBySlug } from "@/actions/events/list"
import { EventDetails } from "@/app/(client)/events/_components/event-details"
import { notFound } from "next/navigation"
import { Metadata } from "next"

interface EventPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params
  const result = await getEventBySlug(slug)

  if (!result.success || !result.data) {
    return {
      title: "Event Not Found",
    }
  }

  const event = result.data
  return {
    title: event.titleEn,
    description: event.descEn || `${event.titleEn} - ${event.city}`,
    openGraph: {
      title: event.titleEn,
      description: event.descEn || undefined,
      images: event.posterUrl ? [event.posterUrl] : undefined,
      type: "website",
    },
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params
  const result = await getEventBySlug(slug)

  if (!result.success || !result.data) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12 pt-24">
        <EventDetails event={result.data} />
      </main>
    </div>
  )
}
