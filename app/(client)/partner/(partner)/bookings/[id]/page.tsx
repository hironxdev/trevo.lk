import { getServerSession } from "next-auth"
import { redirect, notFound } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { PartnerHeader } from "../../_components/partner-header"
import { BookingDetailContent } from "./_components/booking-detail-content"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  return {
    title: `Booking ${id.slice(0, 8)}... | Partner Dashboard`,
    description: "View and manage booking details",
  }
}

export default async function PartnerBookingDetailPage({ params }: PageProps) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/sign-in")
  }

  const isPartner = session.user.role === "BUSINESS_PARTNER" || session.user.role === "INDIVIDUAL_PARTNER"
  const isAdmin = session.user.role === "ADMIN"

  if (!isPartner && !isAdmin) {
    redirect("/dashboard")
  }

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      vehicle: {
        include: {
          category: true,
        },
      },
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
          image: true,
        },
      },
      partner: {
        select: {
          id: true,
          businessName: true,
          fullName: true,
          userId: true,
        },
      },
      payments: true,
    },
  })

  if (!booking) {
    notFound()
  }

  // Verify this booking belongs to the partner
  if (isPartner) {
    const partner = await prisma.partner.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    })

    if (!partner || booking.partnerId !== partner.id) {
      redirect("/partner/bookings")
    }
  }

  return (
    <div>
      <PartnerHeader />
      <BookingDetailContent booking={booking as any} />
    </div>
  )
}
