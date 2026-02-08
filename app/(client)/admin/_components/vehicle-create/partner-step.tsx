// components/admin/vehicle-create/partner-step.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PartnerSearch } from "../partner-search"
import { User, Plus, Info, Phone, MessageCircle, Mail, MapPin, Building2 } from "lucide-react"
import { UseFormReturn } from "react-hook-form"

type Partner = {
  id: string
  partnerType: "INDIVIDUAL" | "BUSINESS"
  fullName: string | null
  businessName: string | null
  kycStatus: "PENDING" | "VERIFIED" | "REJECTED"
  user: {
    name: string | null
    email: string
    phone: string | null
    image: string | null
  }
  _count: {
    vehicles: number
    bookings: number
  }
}

interface PartnerStepProps {
  form: UseFormReturn<any>
  selectedPartner: Partner | null
  onPartnerSelect: (partner: Partner) => void
  onPartnerClear: () => void
}

export function PartnerStep({ form, selectedPartner, onPartnerSelect, onPartnerClear }: PartnerStepProps) {
  const watchPartnerMode = form.watch("partnerMode")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Partner Information</CardTitle>
        <CardDescription>
          Select an existing partner or add external partner details for this vehicle.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs
          value={watchPartnerMode}
          onValueChange={(v) => {
            form.setValue("partnerMode", v as "existing" | "external")
            if (v === "external") {
              onPartnerClear()
            }
          }}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Existing Partner
            </TabsTrigger>
            <TabsTrigger value="external" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              External Partner
            </TabsTrigger>
          </TabsList>

          <TabsContent value="existing" className="mt-6">
            <PartnerSearch
              onSelect={onPartnerSelect}
              selectedPartner={selectedPartner}
              onClear={onPartnerClear}
            />

            {selectedPartner && selectedPartner.kycStatus !== "VERIFIED" && (
              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  This partner is not verified yet. The vehicle will still be created and auto-approved.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="external" className="mt-6 space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Add a vehicle for a partner who is not registered in the system. Their contact details will be
                shown to customers.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="externalPartnerType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partner Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="individual">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Individual
                          </div>
                        </SelectItem>
                        <SelectItem value="business">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Business
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="externalPartnerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partner / Business Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John's Rentals" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="externalPartnerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5" />
                        Phone Number *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="+94 77 123 4567" {...field} />
                      </FormControl>
                      <FormDescription>Primary contact number</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="externalPartnerWhatsApp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <MessageCircle className="h-3.5 w-3.5" />
                        WhatsApp (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="+94 77 123 4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="externalPartnerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" />
                      Email (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="partner@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="externalPartnerAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      Address (Optional)
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder="123 Main Street, Colombo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
