import { getServerSession } from "next-auth"
import { redirect, notFound } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { PartnerDetailView } from "@/app/(client)/admin/_components/partner-detail-view"
import { AdminBreadcrumb } from "@/app/(client)/admin/_components/admin-breadcrumb"
import { getPartnerById } from "@/actions/partner/info"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AdminPartnerDetailPage({ params }: PageProps) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const {data: partner} = await getPartnerById(id)

  if (!partner) {
    notFound()
  }

  return (
    <main className="flex-1 bg-muted/30 py-24">
      <div className="mx-auto container px-4 py-8">
        <AdminBreadcrumb
          items={[
            { label: "Partners", href: "/admin/partners" },
            { label: partner.businessName || partner.fullName || "Partner" },
          ]}
        />
        <PartnerDetailView partner={partner} />
      </div>
    </main>
  )
}
