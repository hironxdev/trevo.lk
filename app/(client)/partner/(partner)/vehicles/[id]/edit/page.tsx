import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getVehicleById } from "@/actions/vehicle/info"
import { VehicleForm } from "../../../_components/vehicle-form"
import { notFound } from "next/navigation"
import { getPartnerProfile } from "@/actions/partner/info"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "Edit Vehicle | Partner Dashboard",
  description: "Update your vehicle listing",
}

export default async function EditVehiclePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  const vehicleId = (await params).id

  if (!session?.user) {
    redirect("/auth/sign-in")
  }

  if (
    session.user.role !== "BUSINESS_PARTNER" &&
    session.user.role !== "INDIVIDUAL_PARTNER" &&
    session.user.role !== "ADMIN"
  ) {
    redirect("/dashboard")
  }

  if (session.user.role !== "ADMIN") {
    const result = await getPartnerProfile()

    if (!result.success || !result.data) {
      redirect("/partner/register")
    }

    const partner = result.data

    if (partner.kycStatus === "REJECTED") {
      return (
        <main className="flex-1 bg-muted/30 py-24">
          <div className="mx-auto container px-4 py-8">
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-2xl">Account Rejected</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Your partner application was not approved. You cannot edit vehicles at this time.
                </p>
                {partner.rejectionReason && (
                  <Alert variant="destructive" className="text-left">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Reason for Rejection</AlertTitle>
                    <AlertDescription>{partner.rejectionReason}</AlertDescription>
                  </Alert>
                )}
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
        </main>
      )
    }
  }

  const result = await getVehicleById(vehicleId)

  if (!result.success || !result.data) {
    notFound()
  }

  return (
    <div className="container px-4 mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Edit Vehicle</h1>
        <p className="text-muted-foreground">Update your vehicle listing details</p>
      </div>

      <VehicleForm vehicle={result.data} />
    </div>
  )
}
