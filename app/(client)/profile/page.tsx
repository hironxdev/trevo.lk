import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Navigation } from "@/app/(client)/_components/layout/navigation"
import { Footer } from "@/app/(client)/_components/layout/footer"
import { ProfileForm } from "@/app/(client)/profile/_components/profile/profile-form"
import { PasswordForm } from "@/app/(client)/profile/_components/profile/password-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { authOptions } from "@/lib/auth"

export default async function ProfilePage() {
      const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/sign-in")
  }

  return (
      <main className="flex-1 bg-muted/30 py-24">
        <div className="mx-auto container px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProfileForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent>
                  <PasswordForm />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
  )
}
