import type React from "react"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getPartnerProfile } from "@/actions/partner/info"
import { getPartnerBookings } from "@/actions/partner/bookings"
import { PartnerSidebar } from "./_components/partner-sidebar"
import { PartnerMobileNav } from "./_components/partner-mobile-nav"

export default async function PartnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/sign-in")
  }

  const isPartner = session.user.role === "BUSINESS_PARTNER" || session.user.role === "INDIVIDUAL_PARTNER" || session.user.role === "INDIVIDUAL_PARTNER"
  const isAdmin = session.user.role === "ADMIN"

  // Allow access for partners and admins only
  if (!isPartner && !isAdmin) {
    redirect("/partner/register")
  }

  // Get partner profile for sidebar
  const profileResult = await getPartnerProfile()

  // If no partner profile (non-admin), redirect to registration
  if (!profileResult.success || !profileResult.data) {
    if (!isAdmin) {
      redirect("/partner/register")
    }
    // For admin without partner profile, show basic layout
    return (
      <main className="min-h-screen bg-muted/30 pt-16 pb-20 lg:pb-0">
        <div className="lg:pl-64">
          <div className="container mx-auto px-4 py-6">{children}</div>
        </div>
      </main>
    )
  }

  const partner = profileResult.data

  // Get pending bookings count for notification badge
  const bookingsResult = await getPartnerBookings()
  const pendingBookings =
    bookingsResult.success && bookingsResult.data ? bookingsResult.data.filter((b) => b.status === "PENDING").length : 0

  const partnerName =
    partner.partnerType === "BUSINESS"
      ? partner.businessName || "Business Partner"
      : partner.fullName || session.user.name || "Partner"

  // Partners can now manage all service types - always show all navigation options
  const serviceType = "BOTH" as const

  return (
    <main className="min-h-screen bg-muted/30 pt-16 pb-20 lg:pb-0">
      <PartnerSidebar
        kycStatus={partner.kycStatus}
        partnerName={partnerName}
        pendingBookings={pendingBookings}
        serviceType={serviceType}
      />
      <PartnerMobileNav pendingBookings={pendingBookings} serviceType={serviceType} />
      <div className="lg:pl-64">
        <div className="container mx-auto px-4 py-6">{children}</div>
      </div>
    </main>
  )
}
