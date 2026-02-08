"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { createStays } from "@/actions/stays/create"
import { updateStays } from "@/actions/stays/update"
import { getStaysCategories } from "@/actions/stays-category/list"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ImageUpload } from "@/components/upload/image-upload"
import { LocationSelector } from "@/components/location-selector"
import { toast } from "sonner"
import { Loader2, Home, Wifi, Car, UtensilsCrossed, Waves, Wind, Tv, Lock, Shield, X } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

const staysFormSchema = z.object({
  categoryId: z.string().optional(),
  name: z.string().min(3, "Property name must be at least 3 characters"),
  description: z.string().min(20, "Description must be at least 20 characters").optional(),
  staysType: z.enum(["HOUSE", "APARTMENT", "VILLA", "HOTEL", "GUEST_HOUSE", "BUNGALOW", "ROOM", "OTHER"]),

  // Location
  city: z.string().min(2, "City is required"),
  district: z.string().optional(),
  address: z.string().min(5, "Address is required"),
  location: z.string().optional(),

  // Capacity
  maxGuests: z.coerce.number().int().min(1, "At least 1 guest required"),
  bedrooms: z.coerce.number().int().min(0),
  beds: z.coerce.number().int().min(1, "At least 1 bed required").optional(),
  bathrooms: z.coerce.number().int().min(1, "At least 1 bathroom required"),

  // Pricing
  pricePerNight: z.coerce.number().positive("Price per night is required"),
  pricePerWeek: z.coerce.number().positive().optional().or(z.literal("")),
  pricePerMonth: z.coerce.number().positive().optional().or(z.literal("")),
  cleaningFee: z.coerce.number().min(0).optional().or(z.literal("")),
  depositRequired: z.coerce.number().min(0).default(0),

  // Rules
  minNights: z.coerce.number().int().min(1).default(1),
  maxNights: z.coerce.number().int().min(1).optional(),

  // Media
  images: z.array(z.string()).min(1, "At least 1 image is required"),

  // Amenities
  amenities: z.array(z.string()).default([]),

  // House rules
  houseRules: z.array(z.string()).default([]),
})

type StaysFormValues = z.infer<typeof staysFormSchema>

const AMENITIES_LIST = [
  { id: "WiFi", label: "WiFi", icon: Wifi },
  { id: "Parking", label: "Free Parking", icon: Car },
  { id: "Kitchen", label: "Kitchen", icon: UtensilsCrossed },
  { id: "Pool", label: "Swimming Pool", icon: Waves },
  { id: "Air Conditioning", label: "Air Conditioning", icon: Wind },
  { id: "TV", label: "TV", icon: Tv },
  { id: "Washing Machine", label: "Washer", icon: Home },
  { id: "Hot Water", label: "Hot Water", icon: Home },
  { id: "Garden", label: "Garden", icon: Home },
  { id: "Balcony", label: "Balcony", icon: Home },
  { id: "Beach Access", label: "Beach Access", icon: Waves },
  { id: "Mountain View", label: "Mountain View", icon: Home },
  { id: "BBQ", label: "BBQ Grill", icon: UtensilsCrossed },
  { id: "Gym", label: "Gym", icon: Home },
  { id: "Security", label: "Security", icon: Shield },
  { id: "CCTV", label: "CCTV", icon: Lock },
]

const PROPERTY_TYPES = [
  { value: "APARTMENT", label: "Apartment" },
  { value: "HOUSE", label: "House" },
  { value: "VILLA", label: "Villa" },
  { value: "HOTEL", label: "Hotel" },
  { value: "GUEST_HOUSE", label: "Guest House" },
  { value: "BUNGALOW", label: "Bungalow" },
  { value: "ROOM", label: "Private Room" },
  { value: "OTHER", label: "Other" },
]

interface StaysFormProps {
  stays?: any
}

export function StaysForm({ stays }: StaysFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [customRule, setCustomRule] = useState("")

  const isEditing = !!stays

  const form = useForm<StaysFormValues>({
    resolver: zodResolver(staysFormSchema),
    defaultValues: {
      categoryId: stays?.categoryId || "",
      name: stays?.name || "",
      description: stays?.description || "",
      staysType: stays?.staysType || "APARTMENT",
      city: stays?.city || "",
      district: stays?.district || "",
      address: stays?.address || "",
      location: stays?.location || "",
      maxGuests: stays?.maxGuests || 2,
      bedrooms: stays?.bedrooms || 1,
      beds: stays?.beds || 1,
      bathrooms: stays?.bathrooms || 1,
      pricePerNight: stays?.pricePerNight || 0,
      pricePerWeek: stays?.pricePerWeek || "",
      pricePerMonth: stays?.pricePerMonth || "",
      cleaningFee: stays?.cleaningFee || "",
      depositRequired: stays?.depositRequired || 0,
      minNights: stays?.minNights || 1,
      maxNights: stays?.maxNights || undefined,
      images: stays?.images || [],
      amenities: stays?.amenities || [],
      houseRules: stays?.houseRules || [],
    },
  })

  useEffect(() => {
    async function fetchCategories() {
      const result = await getStaysCategories()
      if (result.success && result.data) {
        setCategories(result.data)
      }
    }
    fetchCategories()
  }, [])

  async function onSubmit(data: StaysFormValues) {
    setLoading(true)
    try {
      const transformedData = {
        ...data,
        pricePerWeek: data.pricePerWeek === "" ? undefined : Number(data.pricePerWeek) || undefined,
        pricePerMonth: data.pricePerMonth === "" ? undefined : Number(data.pricePerMonth) || undefined,
        cleaningFee: data.cleaningFee === "" ? undefined : Number(data.cleaningFee) || undefined,
      }

      const result = isEditing
        ? await updateStays(stays.id, transformedData as any)
        : await createStays(transformedData as any)

      if (result.success) {
        toast.success(result.data?.message || `Property ${isEditing ? "updated" : "created"} successfully`)
        router.push("/partner/stays")
      } else {
        toast.error(result.error || `Failed to ${isEditing ? "update" : "create"} property`)
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  function addCustomRule() {
    if (customRule.trim()) {
      const currentRules = form.getValues("houseRules")
      form.setValue("houseRules", [...currentRules, customRule.trim()])
      setCustomRule("")
    }
  }

  function removeRule(index: number) {
    const currentRules = form.getValues("houseRules")
    form.setValue(
      "houseRules",
      currentRules.filter((_, i) => i !== index),
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>Provide the basic details about your property</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Beautiful Beach Villa with Ocean View" {...field} />
                  </FormControl>
                  <FormDescription>A catchy title that describes your property</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your property in detail. What makes it special? What can guests expect?"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-4">
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
                name="staysType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PROPERTY_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
            <CardDescription>Where is your property located?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <LocationSelector value={field.value} onChange={field.onChange} placeholder="Select city" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>District (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Colombo District" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Beach Road, Colombo 03" {...field} />
                  </FormControl>
                  <FormDescription>Exact address (shown to guests after booking confirmation)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Description (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Near Galle Face Green, 5 min walk to beach" {...field} />
                  </FormControl>
                  <FormDescription>General area description shown publicly</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
            <CardDescription>Specify the capacity and rooms of your property</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="maxGuests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Guests</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bedrooms</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="beds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Beds</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathrooms</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
            <CardDescription>Set your rental prices (in LKR)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="pricePerNight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Per Night (Rs) *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="5000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pricePerWeek"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weekly Price (Rs)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="30000" {...field} />
                    </FormControl>
                    <FormDescription>Optional discount for weekly stays</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pricePerMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Price (Rs)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="100000" {...field} />
                    </FormControl>
                    <FormDescription>Optional discount for monthly stays</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cleaningFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cleaning Fee (Rs)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="2000" {...field} />
                    </FormControl>
                    <FormDescription>One-time fee per booking</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="depositRequired"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Security Deposit (Rs)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="10000" {...field} />
                    </FormControl>
                    <FormDescription>Refundable after checkout</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Booking Rules */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Rules</CardTitle>
            <CardDescription>Set minimum and maximum stay requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="minNights"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Nights</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxNights"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Nights (Optional)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" placeholder="No limit" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
            <CardDescription>Select all amenities available at your property</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="amenities"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {AMENITIES_LIST.map((amenity) => {
                      const Icon = amenity.icon
                      return (
                        <div
                          key={amenity.id}
                          className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                          onClick={() => {
                            const current = field.value || []
                            if (current.includes(amenity.id)) {
                              field.onChange(current.filter((id) => id !== amenity.id))
                            } else {
                              field.onChange([...current, amenity.id])
                            }
                          }}
                        >
                          <Checkbox checked={field.value?.includes(amenity.id)} />
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{amenity.label}</span>
                        </div>
                      )
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* House Rules */}
        <Card>
          <CardHeader>
            <CardTitle>House Rules</CardTitle>
            <CardDescription>Add rules for your guests to follow</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="houseRules"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {field.value?.map((rule, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {rule}
                        <button type="button" onClick={() => removeRule(index)} className="ml-1 hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a house rule..."
                      value={customRule}
                      onChange={(e) => setCustomRule(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addCustomRule()
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={addCustomRule}>
                      Add
                    </Button>
                  </div>
                  <FormDescription>Common rules: No smoking, No parties, Quiet hours 10pm-8am, No pets</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Property Images</CardTitle>
            <CardDescription>Upload high-quality photos of your property (minimum 1 image)</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUpload value={field.value} onChange={field.onChange} maxImages={10} folder="stays" />
                  </FormControl>
                  <FormDescription>First image will be used as the cover photo</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Update Property" : "Create Property"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
