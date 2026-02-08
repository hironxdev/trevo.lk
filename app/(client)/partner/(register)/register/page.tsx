import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { authOptions } from "@/lib/auth"
import { PartnerTypeSelector } from "@/app/(client)/partner/(partner)/_components/partner-type-selector"
import { MessageCircle, CheckCircle } from "lucide-react"

export default async function PartnerRegisterPage() {
  const session = await getServerSession(authOptions)

  // Check if already a partner
  if (session?.user?.id) {
    try {
      const existingPartner = await prisma.partner.findUnique({
        where: { userId: session.user.id },
      })

      if (existingPartner) {
        redirect("/partner/dashboard")
      }
    } catch (error) {
      console.error("Error checking existing partner:", error)
    }
  }

  return (
    <main className="flex-1 bg-muted/30 py-24">
      <div className="mx-auto container px-4 py-8">
        <div className="max-w-4xl mx-auto">
          

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Benefits of Joining Trevo</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">ආරක්ෂිතව</h3>
                  <p className="text-sm text-muted-foreground">Safe and secure rental process</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">පහසුවෙන්</h3>
                  <p className="text-sm text-muted-foreground">Easy vehicle management</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">කොමිස් රහිත</h3>
                  <p className="text-sm text-muted-foreground">Commission-free platform</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {session?.user ? (
            <PartnerTypeSelector />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Sign In Required</CardTitle>
                <CardDescription>
                  You need to sign in or create an account before registering as a partner.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Please sign in to your existing account or create a new one to continue with partner registration.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button asChild className="flex-1">
                      <a href={`/auth/sign-in?callbackUrl=${encodeURIComponent("/partner/register")}`}>Sign In</a>
                    </Button>
                    <Button asChild variant="outline" className="flex-1 bg-transparent">
                      <a href={`/auth/sign-up?callbackUrl=${encodeURIComponent("/partner/register")}`}>
                        Create Account
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground mb-2">Join our community</p>
            <a
              href="https://www.facebook.com/groups/877222538582597/?ref=share&mibextid=NSMWBT"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm"
            >
              Facebook Group - Trevo Rental Partners
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
