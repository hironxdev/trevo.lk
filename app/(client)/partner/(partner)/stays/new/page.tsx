import { PartnerHeader } from "../../_components/partner-header"
import { StaysForm } from "../../_components/stays-form"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getPartnerProfile } from "@/actions/partner/info"

export const metadata = {
  title: "Add New Property | Partner Dashboard",
  description: "List a new property for rental",
}

export default async function NewStaysPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/auth/sign-in")
  }

  const result = await getPartnerProfile()
  if (!result.success || !result.data) {
    redirect("/partner/register")
  }

  if (result.data.kycStatus !== "VERIFIED") {
    redirect("/partner/dashboard")
  }

  return (
    <div>
      <PartnerHeader />
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Add New Property</h1>
        <p className="text-muted-foreground mt-1">List your property for short-term or long-term rental</p>
      </div>
      <StaysForm />
    </div>
  )
}
