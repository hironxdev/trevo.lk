"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerPartnerSchema, type RegisterPartnerInput } from "@/lib/validations/partner.schema"
import { registerPartner } from "@/actions/partner/register"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { DocumentUpload } from "@/components/upload/document-upload"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"

export function PartnerRegistrationForm() {
  const router = useRouter()
  const { update } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [documents, setDocuments] = useState<Array<{ type: string; url: string; name?: string }>>([])

  const form = useForm<RegisterPartnerInput>({
    resolver: zodResolver(registerPartnerSchema),
    defaultValues: {
      businessName: "",
      businessType: "Pvt Ltd",
      licenseNumber: "",
      taxId: "",
      bankDetails: {
        accountName: "",
        accountNumber: "",
        bankName: "",
        branchCode: "",
      },
      documents: [],
    },
  })

  console.log(form.watch())
  console.log(form.getFieldState("documents"))
  console.log(documents)

  async function onSubmit(data: RegisterPartnerInput) {
    setIsLoading(true)

    const result = await registerPartner({
      ...data,
    })

    if (result.success) {
      toast.success("Partner registration submitted successfully! Redirecting to dashboard...")
      await update()
      setTimeout(() => {
        router.push("/partner/dashboard")
        router.refresh()
      }, 1000)
    } else {
      toast.error(result.error || "Failed to register")
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            Fill in your business details below. Your application will be reviewed by our team, and you'll be notified
            once approved.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Business Information</h3>

          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} />
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
                <FormControl>
                  <Input placeholder="e.g., Car Rental, Tour Company" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="licenseNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business License Number</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="taxId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax ID (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* <div className="space-y-4">
          <h3 className="font-semibold">Bank Details</h3>

          <FormField
            control={form.control}
            name="bankDetails.accountName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bankDetails.accountNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Number</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bankDetails.bankName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bankDetails.branchCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch Code (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div> */}

        <div className="space-y-4">
          <h3 className="font-semibold">Required Documents</h3>
          <p className="text-sm text-muted-foreground">
            Upload business license, tax documents, ID proof, and any other relevant documents
          </p>

          <DocumentUpload
            value={form.getValues("documents")}
            onChange={(data) => form.setValue("documents", data)}
            folder="partners/documents"
            disabled={isLoading}
            documentTypes={[
              { value: "license", label: "Business License" },
              { value: "tax", label: "Tax Document" },
              { value: "id", label: "ID Proof" },
              { value: "bank", label: "Bank Statement" },
              { value: "other", label: "Other" },
            ]}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Application
        </Button>
      </form>
    </Form>
  )
}
