import type React from "react"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"

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
  if (isPartner || isAdmin) {
    redirect("/partner/dashboard")
  }


  return (
    <main className="min-h-screen bg-muted/30 pt-16 pb-20 lg:pb-0">
        <div className="container mx-auto px-4 py-6">{children}</div>
    </main>
  )
}
