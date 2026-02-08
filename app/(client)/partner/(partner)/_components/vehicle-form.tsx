"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { createVehicle } from "@/actions/vehicle/create"
import { updateVehicle } from "@/actions/vehicle/update"
import { getCategories } from "@/actions/category/list"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ImageUpload } from "@/components/upload/image-upload"
import { LocationSelector } from "@/components/location-selector"
import { toast } from "sonner"
import { Loader2, Info, Clock, CalendarDays } from "lucide-react"
import { VehicleType, RentalType } from "@prisma/client"
import { Alert, AlertDescription } from "@/components/ui/alert"

const vehicleFormSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce
    .number({ invalid_type_error: "Year is required" })
    .int("Year must be a whole number")
    .min(1900, "Year must be at least 1900")
    .max(new Date().getFullYear() + 1, `Year cannot exceed ${new Date().getFullYear() + 1}`),
  color: z.string().min(1, "Color is required"),
  licensePlate: z.string().min(1, "License plate is required"),
  vehicleType: z.nativeEnum(VehicleType).optional(),
  pricePerDay: z.coerce
    .number({ invalid_type_error: "Price per day is required" })
    .positive("Price per day must be positive"),
  pricePerKm: z.coerce.number().positive().optional().or(z.literal("")),
  monthlyPrice: z.coerce.number().positive().optional().or(z.literal("")),
  depositRequired: z.coerce.number({ invalid_type_error: "Deposit is required" }).min(0, "Deposit cannot be negative"),
  unlimitedMileage: z.boolean().default(false),
  withDriver: z.boolean().default(false),
  location: z.string().min(1, "Location is required"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  features: z.array(z.string()).optional(),
  specifications: z
    .object({
      fuelType: z.string().optional(),
      transmission: z.string().optional(),
      seatingCapacity: z.coerce.number().optional(),
      mileage: z.coerce.number().optional(),
      engineCapacity: z.string().optional(),
    })
    .optional(),
  rentalType: z.nativeEnum(RentalType).default(RentalType.SHORT_TERM),
  driverPricePerDay: z.coerce.number().positive().optional().or(z.literal("")),
  driverPricePerKm: z.coerce.number().positive().optional().or(z.literal("")),
  driverPricePerMonth: z.coerce.number().positive().optional().or(z.literal("")),
  includedKmPerDay: z.coerce.number().int().positive().optional().or(z.literal("")),
  includedKmPerMonth: z.coerce.number().int().positive().optional().or(z.literal("")),
})

type VehicleFormValues = z.infer<typeof vehicleFormSchema>

interface VehicleFormProps {
  vehicle?: any
}

export function VehicleForm({ vehicle }: VehicleFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])

  const isEditing = !!vehicle

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      categoryId: vehicle?.categoryId || "",
      make: vehicle?.make || "",
      model: vehicle?.model || "",
      year: vehicle?.year || new Date().getFullYear(),
      color: vehicle?.color || "",
      licensePlate: vehicle?.licensePlate || "",
      vehicleType: vehicle?.vehicleType || undefined,
      pricePerDay: vehicle?.pricePerDay || 0,
      pricePerKm: vehicle?.pricePerKm || "",
      monthlyPrice: vehicle?.monthlyPrice || "",
      depositRequired: vehicle?.depositRequired || 0,
      unlimitedMileage: vehicle?.unlimitedMileage || false,
      withDriver: vehicle?.withDriver || false,
      location: vehicle?.location || "",
      images: vehicle?.images || [],
      features: vehicle?.features || [],
      specifications: vehicle?.specifications || {
        fuelType: "",
        transmission: "",
        seatingCapacity: undefined,
        mileage: undefined,
        engineCapacity: "",
      },
      rentalType: vehicle?.rentalType || RentalType.SHORT_TERM,
      driverPricePerDay: vehicle?.driverPricePerDay || "",
      driverPricePerKm: vehicle?.driverPricePerKm || "",
      driverPricePerMonth: vehicle?.driverPricePerMonth || "",
      includedKmPerDay: vehicle?.includedKmPerDay || "",
      includedKmPerMonth: vehicle?.includedKmPerMonth || "",
    },
  })

  const watchRentalType = form.watch("rentalType")
  const watchWithDriver = form.watch("withDriver")
  const watchUnlimitedMileage = form.watch("unlimitedMileage")

  useEffect(() => {
    async function fetchCategories() {
      const result = await getCategories()
      if (result.success && result.data) {
        setCategories(result.data)
      }
    }
    fetchCategories()
  }, [])

  async function onSubmit(data: VehicleFormValues) {
    setLoading(true)
    try {
      const transformedData = {
        ...data,
        pricePerKm: data.pricePerKm === "" ? undefined : Number(data.pricePerKm) || undefined,
        monthlyPrice: data.monthlyPrice === "" ? undefined : Number(data.monthlyPrice) || undefined,
        driverPricePerDay: data.driverPricePerDay === "" ? undefined : Number(data.driverPricePerDay) || undefined,
        driverPricePerKm: data.driverPricePerKm === "" ? undefined : Number(data.driverPricePerKm) || undefined,
        driverPricePerMonth:
          data.driverPricePerMonth === "" ? undefined : Number(data.driverPricePerMonth) || undefined,
        includedKmPerDay: data.includedKmPerDay === "" ? undefined : Number(data.includedKmPerDay) || undefined,
        includedKmPerMonth: data.includedKmPerMonth === "" ? undefined : Number(data.includedKmPerMonth) || undefined,
        specifications: data.specifications
          ? {
              ...data.specifications,
              seatingCapacity: data.specifications.seatingCapacity || undefined,
              mileage: data.specifications.mileage || undefined,
            }
          : undefined,
      }

      const result = isEditing
        ? await updateVehicle(vehicle.id, transformedData as any)
        : await createVehicle(transformedData as any)

      if (result.success) {
        toast.success(result.data?.message || `Vehicle ${isEditing ? "updated" : "created"} successfully`)
        router.push("/partner/vehicles")
      } else {
        toast.error(result.error || `Failed to ${isEditing ? "update" : "create"} vehicle`)
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vehicleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Type (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CAR">Car</SelectItem>
                      <SelectItem value="VAN">Van</SelectItem>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="BIKE">Bike</SelectItem>
                      <SelectItem value="BUS">Bus</SelectItem>
                      <SelectItem value="TRUCK">Truck</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Select the type of vehicle</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="make"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Make</FormLabel>
                    <FormControl>
                      <Input placeholder="Toyota" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="Corolla" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input placeholder="White" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="licensePlate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Plate</FormLabel>
                    <FormControl>
                      <Input placeholder="ABC-1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <LocationSelector
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select vehicle location"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Rental Type
            </CardTitle>
            <CardDescription>
              Choose how you want to rent out your vehicle
              {/* Sinhala helper text */}
              <span className="block text-xs mt-1 text-muted-foreground">
                ඔබේ වාහනය කුලියට දෙන ආකාරය තෝරන්න - කෙටි කාලීන (දිනකට) හෝ දිගු කාලීන (මාසිකව)
              </span>
            </CardDescription>
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
                  <FormDescription>
                    {watchRentalType === RentalType.LONG_TERM
                      ? "Long-term rentals require minimum 30 days (1 month)"
                      : "Short-term rentals are charged per day"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchRentalType === RentalType.LONG_TERM && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Long-term Rental:</strong> Customers must book for at least 30 days. Pricing will be shown as
                  monthly rate.
                  <span className="block text-xs mt-1">
                    දිගු කාලීන කුලිය: ගනුදෙනුකරුවන් අවම වශයෙන් දින 30 ක් වෙන් කළ යුතුය. මිල මාසික අනුපාතය ලෙස පෙන්වනු ඇත.
                  </span>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
            <CardDescription>
              Set your rental prices
              <span className="block text-xs mt-1 text-muted-foreground">ඔබේ කුලී මිල ගණන් සකසන්න</span>
            </CardDescription>
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
                    <FormDescription>
                      {watchRentalType === RentalType.SHORT_TERM
                        ? "Main pricing for short-term"
                        : "Used for daily calculations"}
                    </FormDescription>
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
                    <FormDescription>
                      Security deposit (refundable)
                      <span className="block text-xs">ආරක්ෂක තැන්පතුව (ආපසු ගෙවිය හැක)</span>
                    </FormDescription>
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
                    <FormLabel>Price Per Km (Rs) - Optional</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="50" {...field} />
                    </FormControl>
                    <FormDescription>Extra charge per km over limit</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="monthlyPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Price (Rs){watchRentalType === RentalType.LONG_TERM && " *"}</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="100000" {...field} />
                    </FormControl>
                    <FormDescription>
                      {watchRentalType === RentalType.LONG_TERM
                        ? "Main pricing for long-term rentals"
                        : "Optional monthly rate"}
                    </FormDescription>
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
                      <FormDescription>
                        Free KM per day for short-term
                        <span className="block text-xs">කෙටි කාලීන සඳහා දිනකට නොමිලේ KM</span>
                      </FormDescription>
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
                      <FormDescription>
                        Free KM per month for long-term
                        <span className="block text-xs">දිගු කාලීන සඳහා මාසයකට නොමිලේ KM</span>
                      </FormDescription>
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
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Unlimited Mileage</FormLabel>
                    <FormDescription>
                      This vehicle offers unlimited mileage
                      <span className="block text-xs">මෙම වාහනය අසීමිත කිලෝමීටර් ලබා දෙයි</span>
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="withDriver"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>With Driver Available</FormLabel>
                    <FormDescription>
                      This vehicle is available for rental with a driver
                      <span className="block text-xs">මෙම වාහනය රියදුරු සමඟ කුලියට ලබා ගත හැක</span>
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {watchWithDriver && (
              <Card className="border-dashed">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Driver Pricing</CardTitle>
                  <CardDescription>
                    Set additional charges when renting with a driver
                    <span className="block text-xs">රියදුරු සමඟ කුලියට ගැනීමේදී අමතර ගාස්තු සකසන්න</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="driverPricePerDay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Driver Cost Per Day (Rs)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="2000" {...field} />
                          </FormControl>
                          <FormDescription>Daily driver charge</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="driverPricePerMonth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Driver Cost Per Month (Rs)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="50000" {...field} />
                          </FormControl>
                          <FormDescription>Monthly driver charge</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="driverPricePerKm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Driver Extra KM Rate (Rs)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="30" {...field} />
                        </FormControl>
                        <FormDescription>Extra per km charge when with driver (over included limit)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Images</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      maxFiles={10}
                      folder="vehicles"
                      multiple
                    />
                  </FormControl>
                  <FormDescription>Upload up to 10 images of your vehicle</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Update Vehicle" : "Add Vehicle"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
