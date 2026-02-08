// app/admin/vehicles/create/admin-vehicle-create-form.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { adminCreateVehicle } from "@/actions/admin/create-vehicle"
import { getCategories } from "@/actions/category/list"
import { Form } from "@/components/ui/form"
import { toast } from "sonner"
import { VehicleType, RentalType } from "@prisma/client"

// Import new components
import { ProgressIndicator } from "./vehicle-create/progress-indicator"
import { CreatedVehiclesSummary } from "./vehicle-create/created-vehicles-summary"
import { StepNavigation } from "./vehicle-create/step-navigation"
import { PartnerStep } from "./vehicle-create/partner-step"
import { VehicleStep } from "./vehicle-create/vehicle-step"
import { PricingStep } from "./vehicle-create/pricing-step"

const adminVehicleFormSchema = z.object({
  partnerMode: z.enum(["existing", "external"]),
  partnerId: z.string().optional(),
  externalPartnerName: z.string().optional(),
  externalPartnerPhone: z.string().optional(),
  externalPartnerEmail: z.string().optional(),
  externalPartnerWhatsApp: z.string().optional(),
  externalPartnerAddress: z.string().optional(),
  externalPartnerType: z.enum(["individual", "business"]).optional(),
  categoryId: z.string().optional(),
  displayName: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.coerce
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1)
    .optional()
    .or(z.literal("")),
  color: z.string().optional(),
  licensePlate: z.string().optional(),
  vehicleType: z.nativeEnum(VehicleType).optional(),
  pricePerDay: z.coerce.number().positive().optional().or(z.literal("")),
  pricePerKm: z.coerce.number().positive().optional().or(z.literal("")),
  monthlyPrice: z.coerce.number().positive().optional().or(z.literal("")),
  depositRequired: z.coerce.number().min(0).optional().or(z.literal("")),
  unlimitedMileage: z.boolean().default(false),
  withDriver: z.boolean().default(false),
  location: z.string().optional(),
  images: z.array(z.string()).optional().default([]),
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
  contactOnly: z.boolean().default(true),
  adminNotes: z.string().optional(),
})

type AdminVehicleFormValues = z.infer<typeof adminVehicleFormSchema>

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

type CreatedVehicle = {
  id: string
  displayName?: string
  make?: string
  model?: string
  partnerName: string
}

const STEPS = [
  { id: 1, title: "Partner", description: "Select or add partner" },
  { id: 2, title: "Vehicle", description: "Enter vehicle info" },
  { id: 3, title: "Pricing", description: "Set pricing options" },
]

export function AdminVehicleCreateForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [createdVehicles, setCreatedVehicles] = useState<CreatedVehicle[]>([])
  const [currentVehicleId, setCurrentVehicleId] = useState<string | null>(null) // Track current vehicle being edited

  const form = useForm<AdminVehicleFormValues>({
    resolver: zodResolver(adminVehicleFormSchema),
    defaultValues: {
      partnerMode: "existing",
      partnerId: "",
      externalPartnerName: "",
      externalPartnerPhone: "",
      externalPartnerEmail: "",
      externalPartnerWhatsApp: "",
      externalPartnerAddress: "",
      externalPartnerType: "individual",
      categoryId: "",
      displayName: "",
      make: "",
      model: "",
      year: new Date().getFullYear(),
      color: "",
      licensePlate: "",
      vehicleType: undefined,
      pricePerDay: "",
      pricePerKm: "",
      monthlyPrice: "",
      depositRequired: "",
      unlimitedMileage: false,
      withDriver: false,
      location: "",
      images: [],
      features: [],
      specifications: {
        fuelType: "",
        transmission: "",
        seatingCapacity: undefined,
        mileage: undefined,
        engineCapacity: "",
      },
      rentalType: RentalType.SHORT_TERM,
      driverPricePerDay: "",
      driverPricePerKm: "",
      driverPricePerMonth: "",
      includedKmPerDay: "",
      includedKmPerMonth: "",
      contactOnly: true,
      adminNotes: "",
    },
  })

  const watchPartnerMode = form.watch("partnerMode")
  const externalPartnerName = form.watch("externalPartnerName")
  const externalPartnerPhone = form.watch("externalPartnerPhone")
  const externalPartnerEmail = form.watch("externalPartnerEmail")

  useEffect(() => {
    async function fetchCategories() {
      const result = await getCategories()
      if (result.success && result.data) {
        setCategories(result.data)
      }
    }
    fetchCategories()
  }, [])

  function handlePartnerSelect(partner: Partner) {
    setSelectedPartner(partner)
    form.setValue("partnerId", partner.id)
    form.setValue("partnerMode", "existing")
  }

  function handlePartnerClear() {
    setSelectedPartner(null)
    form.setValue("partnerId", "")
  }

  function canProceedToStep(step: number): boolean {
    if (step === 2) {
      if (watchPartnerMode === "existing") {
        return !!selectedPartner
      }
      return !!externalPartnerName && (!!externalPartnerPhone || !!externalPartnerEmail)
    }
    return true
  }

  const getCurrentPartnerName = useCallback(() => {
    if (watchPartnerMode === "existing" && selectedPartner) {
      return selectedPartner.businessName || selectedPartner.fullName || selectedPartner.user.name || "Unknown"
    }
    return form.getValues("externalPartnerName") || "External Partner"
  }, [watchPartnerMode, selectedPartner, form])

  // Create vehicle when moving from Step 2 to Step 3
  async function handleNextFromStep2() {
    if (loading) return
    
    const data = form.getValues()
    setLoading(true)

    try {
      // Create basic vehicle with partner and vehicle info
      const transformedData = {
        partnerId: data.partnerMode === "existing" ? data.partnerId : undefined,
        externalPartnerName: data.partnerMode === "external" ? data.externalPartnerName : undefined,
        externalPartnerPhone: data.partnerMode === "external" ? data.externalPartnerPhone : undefined,
        externalPartnerEmail:
          data.partnerMode === "external" && data.externalPartnerEmail ? data.externalPartnerEmail : undefined,
        externalPartnerWhatsApp: data.partnerMode === "external" ? data.externalPartnerWhatsApp : undefined,
        externalPartnerAddress: data.partnerMode === "external" ? data.externalPartnerAddress : undefined,
        externalPartnerType: data.partnerMode === "external" ? data.externalPartnerType : undefined,
        categoryId: data.categoryId || undefined,
        displayName: data.displayName || undefined,
        make: data.make || undefined,
        model: data.model || undefined,
        year: data.year === "" ? undefined : Number(data.year) || undefined,
        color: data.color || undefined,
        licensePlate: data.licensePlate || undefined,
        vehicleType: data.vehicleType,
        location: data.location || undefined,
        images: data.images || [],
        rentalType: data.rentalType,
        contactOnly: true, // Always start as contact only
        adminNotes: data.adminNotes || undefined,
        specifications: data.specifications
          ? {
              ...data.specifications,
              seatingCapacity: data.specifications.seatingCapacity || undefined,
              mileage: data.specifications.mileage || undefined,
            }
          : undefined,
      }

      console.log("Creating vehicle from Step 2:", transformedData)

      const result = await adminCreateVehicle(transformedData as any)

      if (result.success && result.data?.vehicle?.id) {
        const vehicleId = result.data.vehicle.id
        setCurrentVehicleId(vehicleId)
        
        const vehicleName = data.displayName || `${data.make || ""} ${data.model || ""}`.trim() || "New Vehicle"
        toast.success(`Vehicle "${vehicleName}" created! Now set pricing...`)
        
        // Move to step 3
        setCurrentStep(3)
      } else {
        toast.error(result.error || "Failed to create vehicle")
      }
    } catch (error) {
      console.error("Vehicle creation error:", error)
      toast.error("Something went wrong creating vehicle")
    } finally {
      setLoading(false)
    }
  }

  // Update vehicle with pricing when submitting Step 3
  async function handleSubmitStep3() {
    if (loading || !currentVehicleId) return

    const data = form.getValues()
    setLoading(true)

    try {
      // Update vehicle with pricing information
      const updateData = {
        pricePerDay: data.pricePerDay === "" ? undefined : Number(data.pricePerDay) || undefined,
        pricePerKm: data.pricePerKm === "" ? undefined : Number(data.pricePerKm) || undefined,
        monthlyPrice: data.monthlyPrice === "" ? undefined : Number(data.monthlyPrice) || undefined,
        depositRequired: data.depositRequired === "" ? undefined : Number(data.depositRequired) || undefined,
        unlimitedMileage: data.unlimitedMileage,
        withDriver: data.withDriver,
        driverPricePerDay: data.driverPricePerDay === "" ? undefined : Number(data.driverPricePerDay) || undefined,
        driverPricePerKm: data.driverPricePerKm === "" ? undefined : Number(data.driverPricePerKm) || undefined,
        driverPricePerMonth:
          data.driverPricePerMonth === "" ? undefined : Number(data.driverPricePerMonth) || undefined,
        includedKmPerDay: data.includedKmPerDay === "" ? undefined : Number(data.includedKmPerDay) || undefined,
        includedKmPerMonth: data.includedKmPerMonth === "" ? undefined : Number(data.includedKmPerMonth) || undefined,
        contactOnly: data.contactOnly,
        adminNotes: data.adminNotes || undefined,
      }

      console.log("Updating vehicle with pricing:", updateData)

      const result = await updateVehicle(currentVehicleId, updateData)

      if (result.success) {
        const vehicleName = data.displayName || `${data.make || ""} ${data.model || ""}`.trim() || "New Vehicle"
        toast.success(`Vehicle "${vehicleName}" completed successfully!`)

        // Add to completed vehicles list
        setCreatedVehicles((prev) => [
          ...prev,
          {
            id: currentVehicleId,
            displayName: data.displayName || undefined,
            make: data.make || undefined,
            model: data.model || undefined,
            partnerName: getCurrentPartnerName(),
          },
        ])

        // Reset for next vehicle
        resetForNextVehicle()
      } else {
        toast.error(result.error || "Failed to update vehicle pricing")
      }
    } catch (error) {
      console.error("Vehicle update error:", error)
      toast.error("Something went wrong updating pricing")
    } finally {
      setLoading(false)
    }
  }

  function resetForNextVehicle() {
    // Clear vehicle-specific fields but keep partner info
    form.setValue("categoryId", "")
    form.setValue("displayName", "")
    form.setValue("make", "")
    form.setValue("model", "")
    form.setValue("year", new Date().getFullYear())
    form.setValue("color", "")
    form.setValue("licensePlate", "")
    form.setValue("vehicleType", undefined)
    form.setValue("pricePerDay", "")
    form.setValue("pricePerKm", "")
    form.setValue("monthlyPrice", "")
    form.setValue("depositRequired", "")
    form.setValue("location", "")
    form.setValue("images", [])
    form.setValue("adminNotes", "")
    form.setValue("unlimitedMileage", false)
    form.setValue("withDriver", false)
    form.setValue("specifications", {
      fuelType: "",
      transmission: "",
      seatingCapacity: undefined,
      mileage: undefined,
      engineCapacity: "",
    })
    
    setCurrentVehicleId(null)
    setCurrentStep(2) // Go back to step 2 to add another vehicle
  }

  function handleNext() {
    if (loading) return

    if (currentStep === 1) {
      setCurrentStep(2)
    } else if (currentStep === 2) {
      // Create vehicle when moving to pricing
      handleNextFromStep2()
    }
  }

  function handleBack() {
    if (loading) return
    
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  function handleSubmit() {
    if (currentStep === 3) {
      handleSubmitStep3()
    }
  }

  return (
    <div className="space-y-6">
      <CreatedVehiclesSummary vehicles={createdVehicles} onAddAnother={resetForNextVehicle} />

      <ProgressIndicator
        steps={STEPS}
        currentStep={currentStep}
        canProceedToStep={canProceedToStep}
        onStepClick={(step) => {
          if (!loading && step < currentStep) {
            setCurrentStep(step)
          }
        }}
      />

      <Form {...form}>
        <div>
          {currentStep === 1 && (
            <PartnerStep
              form={form}
              selectedPartner={selectedPartner}
              onPartnerSelect={handlePartnerSelect}
              onPartnerClear={handlePartnerClear}
            />
          )}

          {currentStep === 2 && (
            <VehicleStep
              form={form}
              categories={categories}
              partnerName={getCurrentPartnerName()}
              partnerMode={watchPartnerMode}
              onChangePartner={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && (
            <PricingStep
              form={form}
              vehicleName={
                form.getValues("displayName") ||
                `${form.getValues("make") || ""} ${form.getValues("model") || ""}`.trim() ||
                "New Vehicle"
              }
              partnerName={getCurrentPartnerName()}
              onEditVehicle={() => setCurrentStep(2)}
            />
          )}

          <StepNavigation
            currentStep={currentStep}
            totalSteps={3}
            canProceed={canProceedToStep(currentStep + 1)}
            isSubmitting={loading}
            onNext={handleNext}
            onBack={handleBack}
            onSubmit={handleSubmit}
          />
        </div>
      </Form>
    </div>
  )
}
