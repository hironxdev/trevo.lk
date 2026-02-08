"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { individualPartnerSchema, type IndividualPartnerInput } from "@/lib/validations/partner.schema"
import { registerPartner } from "@/actions/partner/register"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DocumentUpload } from "@/components/upload/document-upload"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"

export function IndividualPartnerForm() {
  const router = useRouter()
  const { update } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<IndividualPartnerInput>({
    resolver: zodResolver(individualPartnerSchema),
    defaultValues: {
      partnerType: "INDIVIDUAL",
      fullName: "",
      nicNumber: "",
      dateOfBirth: "",
      gender: undefined,
      phone: "",
      whatsappNumber: "",
      residentialAddress: "",
      drivingLicenseNumber: "",
      drivingLicenseExpiry: "",
      bankDetails: {
        bankName: "",
        accountName: "",
        accountNumber: "",
        branch: "",
      },
      documents: [],
      termsAccepted: false,
    },
  })

  async function onSubmit(data: IndividualPartnerInput) {
    setIsLoading(true)

    try {
      const result = await registerPartner(data)

      if (result.success) {
        toast.success(result.data?.message || "Registration submitted successfully!")
        await update()
        await new Promise((resolve) => setTimeout(resolve, 500))
        router.push("/partner/dashboard")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to register")
      }
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Individual Partner Registration</CardTitle>
        <CardDescription>Complete the form below to register as an individual partner. Once approved, you can list vehicles, properties, or events from your dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name (as per NIC)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nicNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NIC / Passport Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 199012345678" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Contact Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+94 77 123 4567" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="whatsappNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp Number (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="+94 77 123 4567" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="residentialAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Residential Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full address" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Driving License - Optional, can be added later when listing vehicles */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Driving License Details (Optional)</h3>
              <p className="text-sm text-muted-foreground mb-4">
                If you plan to list vehicles with driver services, please provide your license details. You can also add this later.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="drivingLicenseNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Driving License Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., B1234567" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="drivingLicenseExpiry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License Expiry Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Documents */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Required Documents</h3>
              <p className="text-sm text-muted-foreground">
                Upload your identification documents. Additional documents may be required when listing specific services.
              </p>
              <DocumentUpload
                value={form.getValues("documents")}
                onChange={(docs) => form.setValue("documents", docs, { shouldValidate: true })}
                folder="partners/individual"
                disabled={isLoading}
                documentTypes={[
                  { value: "nic_front", label: "NIC Front" },
                  { value: "nic_back", label: "NIC Back" },
                  { value: "driving_license", label: "Driving License (Optional)" },
                  { value: "address_proof", label: "Address Proof" },
                ]}
              />
              {form.formState.errors.documents && (
                <p className="text-sm text-destructive">{form.formState.errors.documents.message}</p>
              )}
            </div>

            {/* Terms */}
            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>I accept the terms and conditions</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      By registering, you agree to our Terms of Service and Privacy Policy.
                    </p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Application
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
