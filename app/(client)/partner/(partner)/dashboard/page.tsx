import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { getPartnerProfile } from "@/actions/partner/info"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Clock, XCircle, CheckCircle, ArrowRight } from "lucide-react"
import { authOptions } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PartnerHeader } from "../_components/partner-header"
import { PartnerDashboardContent } from "../_components/partner-dashboard-content"

export const metadata = {
  title: "Partner Dashboard | Trevo",
  description: "Manage your vehicles, bookings, and earnings",
}

export default async function PartnerDashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/auth/sign-in")
  }

  const isPartner = session.user.role === "BUSINESS_PARTNER" || session.user.role === "INDIVIDUAL_PARTNER"
  const isAdmin = session.user.role === "ADMIN"

  if (!isPartner && !isAdmin) {
    redirect("/dashboard")
  }

  const result = await getPartnerProfile()

  if (!result.success || !result.data) {
    if (isAdmin) {
      redirect("/admin")
    }
    redirect("/partner/register")
  }

  const partner = result.data

  // KYC Pending State
  if (partner.kycStatus === "PENDING") {
    return (
      <div className="max-w-2xl mx-auto">
        <PartnerHeader />
        <Card>
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl">Application Under Review</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Thank you for registering as a {partner.partnerType === "INDIVIDUAL" ? "Individual" : "Business"} Partner!
              Your application is currently being reviewed by our team.
            </p>
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-2">What happens next?</h4>
              <ul className="text-sm text-muted-foreground space-y-2 text-left">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                  <span>Our team will review your submitted documents</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                  <span>Verification typically takes 1-2 business days</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                  <span>You'll receive an email notification once approved</span>
                </li>
              </ul>
            </div>
            <div className="flex justify-center gap-4 pt-4">
              <Button asChild variant="outline">
                <Link href="/">Return to Home</Link>
              </Button>
              <Button asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // KYC Rejected State
  if (partner.kycStatus === "REJECTED") {
    return (
      <div className="max-w-2xl mx-auto">
        <PartnerHeader />
        <Card>
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Application Not Approved</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">Unfortunately, your partner application was not approved.</p>
            {partner.rejectionReason && (
              <Alert variant="destructive" className="text-left">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Reason for Rejection</AlertTitle>
                <AlertDescription>{partner.rejectionReason}</AlertDescription>
              </Alert>
            )}
            <p className="text-muted-foreground">
              You can update your information and reapply, or contact our support team for assistance.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <Button asChild variant="outline">
                <Link href="/partner/register">Reapply</Link>
              </Button>
              <Button asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Verified Partner Dashboard
  const partnerName = partner.partnerType === "BUSINESS" ? partner.businessName : partner.fullName || session.user.name

  return (
    <div className="space-y-8">
      <PartnerHeader />

      {/* Modern Welcome Section */}
      <div>
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold">Welcome back, {partnerName || "Partner"}!</h1>
          <p className="text-lg text-muted-foreground">
            Track your bookings, earnings, and performance metrics all in one place
          </p>
        </div>
      </div>

      <PartnerDashboardContent />
    </div>
  )
}
