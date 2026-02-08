"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Building2, ArrowRight, Check, Car, Home, ArrowLeft, Calendar } from "lucide-react"
import { IndividualPartnerForm } from "./individual-partner-form"
import { BusinessPartnerForm } from "./business-partner-form"

type PartnerType = "INDIVIDUAL" | "BUSINESS" | null

export function PartnerTypeSelector() {
  const [selectedType, setSelectedType] = useState<PartnerType>(null)
  const [step, setStep] = useState<"partner" | "form">("partner")

  // Step 1: Partner Type Selection (Individual or Business)
  if (step === "partner") {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Choose your partner type</h2>
          <p className="text-muted-foreground">Are you registering as an individual or a business?</p>
        </div>

        {/* Info Banner about services */}
        <div className="bg-muted/50 border rounded-lg p-4 mb-6">
          <p className="text-sm text-muted-foreground text-center">
            Once registered, you can list any combination of services: vehicles, properties, or events from your dashboard.
          </p>
          <div className="flex justify-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Car className="w-4 h-4" />
              <span>Vehicles</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Home className="w-4 h-4" />
              <span>Properties</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Events</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card
            className="cursor-pointer transition-all hover:border-primary hover:shadow-lg"
            onClick={() => {
              setSelectedType("INDIVIDUAL")
              setStep("form")
            }}
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <User className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Individual Partner</CardTitle>
              <CardDescription>
                Perfect for private owners looking to rent out their vehicles, properties, or host events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Simple registration process</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Flexible availability settings</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>List any service type after signup</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Earn extra income</span>
                </li>
              </ul>
              <Button className="w-full group">
                Register as Individual
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer transition-all hover:border-primary hover:shadow-lg"
            onClick={() => {
              setSelectedType("BUSINESS")
              setStep("form")
            }}
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Business Partner</CardTitle>
              <CardDescription>
                Ideal for companies managing fleets, properties, or event venues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Manage multiple listings</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Business dashboard & analytics</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>List any service type after signup</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Button className="w-full group">
                Register as Business
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Step 2: Registration Form
  if (step === "form") {
    if (selectedType === "INDIVIDUAL") {
      return (
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => setStep("partner")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to selection
          </Button>
          <IndividualPartnerForm />
        </div>
      )
    }

    if (selectedType === "BUSINESS") {
      return (
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => setStep("partner")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to selection
          </Button>
          <BusinessPartnerForm />
        </div>
      )
    }
  }

  return null
}
