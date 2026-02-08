import { PartnerHeader } from "../../../_components/partner-header"
import { StaysForm } from "../../../_components/stays-form"
import { getServerSession } from "next-auth"
import { redirect, notFound } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getStaysById } from "@/actions/stays/info"

export const metadata = {
  title: "Edit Property | Partner Dashboard",
  description: "Edit your property listing",
}

interface EditStaysPageProps {
  params: Promise<{ id: string }>
}

export default async function EditStaysPage({ params }: EditStaysPageProps) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/auth/sign-in")
  }

  const result = await getStaysById(id)
  if (!result.success || !result.data) {
    notFound()
  }

  // Verify ownership
  if (result.data.partner?.userId !== session.user.id && session.user.role !== "ADMIN") {
    redirect("/partner/stays")
  }

  return (
    <div>
      <PartnerHeader />
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Edit Property</h1>
        <p className="text-muted-foreground mt-1">Update your property listing details</p>
      </div>
      <StaysForm stays={result.data} />
    </div>
  )
}
