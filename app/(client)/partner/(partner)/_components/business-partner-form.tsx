"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { businessPartnerSchema, type BusinessPartnerInput } from "@/lib/validations/partner.schema"
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

export function BusinessPartnerForm() {
  const router = useRouter()
  const { update } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<BusinessPartnerInput>({
    resolver: zodResolver(businessPartnerSchema),
    defaultValues: {
      partnerType: "BUSINESS",
      businessName: "",
      businessRegNumber: "",
      businessRegDate: "",
      businessType: undefined,
      vatNumber: "",
      authorizedPersonName: "",
      authorizedPersonNic: "",
      authorizedPersonDesignation: "",
      authorizedPersonPhone: "",
      businessAddress: "",
      businessHotline: "",
      businessWhatsapp: "",
      businessEmail: "",
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

  async function onSubmit(data: BusinessPartnerInput) {
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
        <CardTitle>Business Partner Registration</CardTitle>
        <CardDescription>Complete the form below to register your business as a partner. Once approved, you can list vehicles, properties, or events from your dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Business Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Business Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your company name" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="businessType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select business type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Sole Proprietor">Sole Proprietor</SelectItem>
                          <SelectItem value="Partnership">Partnership</SelectItem>
                          <SelectItem value="Pvt Ltd">Private Limited (Pvt Ltd)</SelectItem>
                          <SelectItem value="PLC">Public Limited Company (PLC)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="businessRegNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Registration Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., PV12345" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="businessRegDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registration Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vatNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>VAT Number (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="VAT registration number" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Authorized Person */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Authorized Person Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="authorizedPersonName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Authorized person's name" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="authorizedPersonNic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NIC Number</FormLabel>
                      <FormControl>
                        <Input placeholder="NIC/Passport number" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="authorizedPersonDesignation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Designation</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Managing Director" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="authorizedPersonPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+94 77 123 4567" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Business Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Business Contact Details</h3>
              <FormField
                control={form.control}
                name="businessAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Full business address" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="businessHotline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hotline / Office Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+94 11 234 5678" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="businessWhatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="+94 77 123 4567" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="businessEmail"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Business Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="info@yourbusiness.com" {...field} disabled={isLoading} />
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
                Upload business registration certificate, VAT certificate (if applicable), and authorized person's ID. Additional documents may be required when listing specific services.
              </p>
              <DocumentUpload
                value={form.getValues("documents")}
                onChange={(docs) => form.setValue("documents", docs, { shouldValidate: true })}
                folder="partners/business"
                disabled={isLoading}
                documentTypes={[
                  { value: "business_reg", label: "Business Registration Certificate" },
                  { value: "vat_cert", label: "VAT Certificate (Optional)" },
                  { value: "authorized_id", label: "Authorized Person NIC" },
                  { value: "bank_statement", label: "Bank Statement" },
                  { value: "company_profile", label: "Company Profile (Optional)" },
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
                      By registering, you agree to our Business Partner Agreement, Terms of Service, and Privacy Policy.
                    </p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Business Application
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
