"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, X, CalendarDays, Clock } from "lucide-react"
import Link from "next/link"
import { updateVehicle } from "@/actions/vehicle/update"
import { toast } from "sonner"
import type { getCategories } from "@/actions/category/list"
import type { getVehicleByIdAdmin } from "@/actions/vehicle/info"
import { type VehicleStatus, type VehicleType, RentalType } from "@prisma/client"

interface AdminVehicleEditFormProps {
  vehicle: Awaited<ReturnType<typeof getVehicleByIdAdmin>>["data"]
  categories: Awaited<ReturnType<typeof getCategories>>["data"]
}

export function AdminVehicleEditForm({ vehicle, categories }: AdminVehicleEditFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<string[]>(vehicle?.images || [])
  const [formData, setFormData] = useState({
    make: vehicle?.make || "",
    model: vehicle?.model || "",
    year: vehicle?.year?.toString() || "",
    color: vehicle?.color || "",
    licensePlate: vehicle?.licensePlate || "",
    categoryId: vehicle?.categoryId || "DEFAULT_CATEGORY_ID",
    vehicleType: vehicle?.vehicleType || undefined,
    location: vehicle?.location || "",
    pricePerDay: vehicle?.pricePerDay?.toString() || "",
    pricePerKm: vehicle?.pricePerKm?.toString() || "",
    monthlyPrice: vehicle?.monthlyPrice?.toString() || "",
    depositRequired: vehicle?.depositRequired?.toString() || "",
    unlimitedMileage: vehicle?.unlimitedMileage || false,
    withDriver: vehicle?.withDriver || false,
    status: vehicle?.status || "AVAILABLE",
    features: Array.isArray(vehicle?.features) ? vehicle.features.join(", ") : "",
    rentalType: vehicle?.rentalType || RentalType.SHORT_TERM,
    driverPricePerDay: vehicle?.driverPricePerDay?.toString() || "",
    driverPricePerKm: vehicle?.driverPricePerKm?.toString() || "",
    driverPricePerMonth: vehicle?.driverPricePerMonth?.toString() || "",
    includedKmPerDay: vehicle?.includedKmPerDay?.toString() || "",
    includedKmPerMonth: vehicle?.includedKmPerMonth?.toString() || "",
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    if (!vehicle) {
      toast.error("Vehicle data is missing")
      setLoading(false)
      return
    }
    try {
      const result = await updateVehicle(vehicle.id, {
        make: formData.make,
        model: formData.model,
        year: Number.parseInt(formData.year),
        color: formData.color,
        licensePlate: formData.licensePlate,
        categoryId: formData.categoryId,
        vehicleType: (formData.vehicleType as VehicleType) || undefined,
        location: formData.location,
        pricePerDay: Number.parseFloat(formData.pricePerDay),
        pricePerKm: formData.pricePerKm ? Number.parseFloat(formData.pricePerKm) : undefined,
        monthlyPrice: formData.monthlyPrice ? Number.parseFloat(formData.monthlyPrice) : undefined,
        depositRequired: Number.parseFloat(formData.depositRequired),
        unlimitedMileage: formData.unlimitedMileage,
        withDriver: formData.withDriver,
        status: formData.status as VehicleStatus,
        features: formData.features
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
        images,
        rentalType: formData.rentalType as RentalType,
        driverPricePerDay: formData.driverPricePerDay ? Number.parseFloat(formData.driverPricePerDay) : undefined,
        driverPricePerKm: formData.driverPricePerKm ? Number.parseFloat(formData.driverPricePerKm) : undefined,
        driverPricePerMonth: formData.driverPricePerMonth ? Number.parseFloat(formData.driverPricePerMonth) : undefined,
        includedKmPerDay: formData.includedKmPerDay ? Number.parseInt(formData.includedKmPerDay) : undefined,
        includedKmPerMonth: formData.includedKmPerMonth ? Number.parseInt(formData.includedKmPerMonth) : undefined,
      })

      if (result.success) {
        toast.success("Vehicle updated successfully")
        router.push(`/admin/vehicles/${vehicle.id}`)
        router.refresh()
      } else {
        toast.error(result.error || "Failed to update vehicle")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" asChild type="button">
          <Link href={`/admin/vehicles/${vehicle?.id}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <span className="text-muted-foreground">Back to vehicle details</span>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="make">Make</Label>
            <Input id="make" name="make" value={formData.make} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input id="model" name="model" value={formData.model} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input id="year" name="year" type="number" value={formData.year} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Input id="color" name="color" value={formData.color} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="licensePlate">License Plate</Label>
            <Input
              id="licensePlate"
              name="licensePlate"
              value={formData.licensePlate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, categoryId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehicleType">Vehicle Type (Optional)</Label>
            <Select
              value={formData.vehicleType || "UNSET"}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, vehicleType: value === "UNSET" ? undefined : value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UNSET">Not Set</SelectItem>
                <SelectItem value="CAR">Car</SelectItem>
                <SelectItem value="VAN">Van</SelectItem>
                <SelectItem value="SUV">SUV</SelectItem>
                <SelectItem value="BIKE">Bike</SelectItem>
                <SelectItem value="BUS">Bus</SelectItem>
                <SelectItem value="TRUCK">Truck</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as VehicleStatus }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AVAILABLE">Available</SelectItem>
                <SelectItem value="RENTED">Rented</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Rental Type
          </CardTitle>
          <CardDescription>Configure rental type settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Rental Type</Label>
            <Select
              value={formData.rentalType}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, rentalType: value as RentalType }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
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
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pricePerDay">Price Per Day (Rs)</Label>
            <Input
              id="pricePerDay"
              name="pricePerDay"
              type="number"
              value={formData.pricePerDay}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pricePerKm">Price Per KM (Rs)</Label>
            <Input
              id="pricePerKm"
              name="pricePerKm"
              type="number"
              value={formData.pricePerKm}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="monthlyPrice">Monthly Price (Rs)</Label>
            <Input
              id="monthlyPrice"
              name="monthlyPrice"
              type="number"
              value={formData.monthlyPrice}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="depositRequired">Deposit Required (Rs)</Label>
            <Input
              id="depositRequired"
              name="depositRequired"
              type="number"
              value={formData.depositRequired}
              onChange={handleChange}
              required
            />
          </div>
          {!formData.unlimitedMileage && (
            <>
              <div className="space-y-2">
                <Label htmlFor="includedKmPerDay">Included KM Per Day</Label>
                <Input
                  id="includedKmPerDay"
                  name="includedKmPerDay"
                  type="number"
                  value={formData.includedKmPerDay}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="includedKmPerMonth">Included KM Per Month</Label>
                <Input
                  id="includedKmPerMonth"
                  name="includedKmPerMonth"
                  type="number"
                  value={formData.includedKmPerMonth}
                  onChange={handleChange}
                />
              </div>
            </>
          )}
          <div className="flex items-center gap-3 md:col-span-2">
            <Switch
              id="unlimitedMileage"
              checked={formData.unlimitedMileage}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, unlimitedMileage: checked }))}
            />
            <Label htmlFor="unlimitedMileage">Unlimited Mileage</Label>
          </div>
          <div className="flex items-center gap-3 md:col-span-2">
            <Switch
              id="withDriver"
              checked={formData.withDriver}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, withDriver: checked }))}
            />
            <Label htmlFor="withDriver">With Driver Available</Label>
          </div>
        </CardContent>
      </Card>

      {formData.withDriver && (
        <Card>
          <CardHeader>
            <CardTitle>Driver Pricing</CardTitle>
            <CardDescription>Additional charges when renting with a driver</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="driverPricePerDay">Driver Cost Per Day (Rs)</Label>
              <Input
                id="driverPricePerDay"
                name="driverPricePerDay"
                type="number"
                value={formData.driverPricePerDay}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="driverPricePerMonth">Driver Cost Per Month (Rs)</Label>
              <Input
                id="driverPricePerMonth"
                name="driverPricePerMonth"
                type="number"
                value={formData.driverPricePerMonth}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="driverPricePerKm">Driver Extra KM Rate (Rs)</Label>
              <Input
                id="driverPricePerKm"
                name="driverPricePerKm"
                type="number"
                value={formData.driverPricePerKm}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative aspect-video rounded-lg overflow-hidden group">
                <Image src={image || "/placeholder.svg"} alt={`Vehicle ${index + 1}`} fill className="object-cover" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          {images.length === 0 && <p className="text-center text-muted-foreground py-8">No images uploaded</p>}
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="features">Features (comma separated)</Label>
            <Textarea
              id="features"
              name="features"
              value={formData.features}
              onChange={handleChange}
              placeholder="Air Conditioning, Bluetooth, GPS Navigation..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" asChild>
          <Link href={`/admin/vehicles/${vehicle?.id}`}>Cancel</Link>
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </form>
  )
}
