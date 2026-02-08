// components/admin/vehicle-create/pricing-step.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Car, CalendarDays, Clock, Phone, Info } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import { RentalType } from "@prisma/client"

interface PricingStepProps {
  form: UseFormReturn<any>
  vehicleName: string
  partnerName: string
  onEditVehicle: () => void
}

export function PricingStep({ form, vehicleName, partnerName, onEditVehicle }: PricingStepProps) {
  const watchWithDriver = form.watch("withDriver")
  const watchUnlimitedMileage = form.watch("unlimitedMileage")
  const watchContactOnly = form.watch("contactOnly")

  return (
    <div className="space-y-6">
      {/* Vehicle Summary */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Car className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{vehicleName}</p>
                <p className="text-sm text-muted-foreground">For {partnerName}</p>
              </div>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={onEditVehicle}>
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Rental Type */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Rental Type
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="rentalType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rental Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rental type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={RentalType.SHORT_TERM}>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Short-term (Daily)
                      </div>
                    </SelectItem>
                    <SelectItem value={RentalType.LONG_TERM}>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        Long-term (Monthly)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
          <CardDescription>All pricing fields are optional for contact-only vehicles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="pricePerDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price Per Day (Rs)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="5000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="depositRequired"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deposit Required (Rs)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="10000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="pricePerKm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price Per Km (Rs)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="monthlyPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Price (Rs)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="100000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {!watchUnlimitedMileage && (
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="includedKmPerDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Included KM Per Day</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="includedKmPerMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Included KM Per Month</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="2500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <FormField
            control={form.control}
            name="unlimitedMileage"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-3 space-y-0 rounded-lg border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Unlimited Mileage</FormLabel>
                  <FormDescription>No kilometer limits for this vehicle</FormDescription>
                </div>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Driver Options */}
      <Card>
        <CardHeader>
          <CardTitle>Driver Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="withDriver"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-3 space-y-0 rounded-lg border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>With Driver Available</FormLabel>
                  <FormDescription>Vehicle can be rented with a driver</FormDescription>
                </div>
              </FormItem>
            )}
          />

          {watchWithDriver && (
            <div className="grid md:grid-cols-3 gap-4 pl-4 border-l-2 border-primary/20">
              <FormField
                control={form.control}
                name="driverPricePerDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Driver Price/Day (Rs)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="2000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="driverPricePerMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Driver Price/Month (Rs)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="50000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="driverPricePerKm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Driver Extra KM (Rs)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="20" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Only Mode */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Contact Only Mode
          </CardTitle>
          <CardDescription>
            When enabled, customers cannot book this vehicle online - they must contact the partner directly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="contactOnly"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-3 space-y-0 rounded-lg border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Contact Only</FormLabel>
                  <FormDescription>
                    Disable online booking - customers will contact the partner directly
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {watchContactOnly && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                The booking form will be hidden. Customers will see contact information to reach the partner
                directly.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Admin Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Notes (Internal)</CardTitle>
          <CardDescription>These notes are only visible to admins</CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="adminNotes"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Add any internal notes about this vehicle or the arrangement with the partner..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  )
}
