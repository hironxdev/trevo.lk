"use client"

import type React from "react"

import { useState } from "react"
import { MapPin, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LocationSelector } from "@/components/location-selector"
import { useLocationPreference } from "@/hooks/use-location-preference"
import { getDistrictByName, getCityByName, getProvinceById } from "@/lib/locations"

interface LocationPreferenceModalProps {
  trigger?: React.ReactNode
}

export function LocationPreferenceModal({ trigger }: LocationPreferenceModalProps) {
  const { location, setLocation, clearLocation, isLoaded } = useLocationPreference()
  const [open, setOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState(location?.city || "")

  const handleSave = () => {
    if (selectedCity) {
      const city = getCityByName(selectedCity)
      if (city) {
        const district = getDistrictByName(city.district_id)
        const districtData = district ? { district: district.name_en } : {}
        const province = district ? getProvinceById(district.province_id) : undefined
        const provinceData = province ? { province: province.name_en } : {}

        setLocation({
          city: city.name_en,
          ...districtData,
          ...provinceData,
        })
      } else {
        setLocation({ city: selectedCity })
      }
    }
    setOpen(false)
  }

  const handleClear = () => {
    clearLocation()
    setSelectedCity("")
    setOpen(false)
  }

  if (!isLoaded) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
            <MapPin className="h-4 w-4" />
            {location?.city || "Set Location"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Set Your Location
          </DialogTitle>
          <DialogDescription>
            Set your preferred location to see vehicles available near you. This will be saved for your next visit.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <LocationSelector
            value={selectedCity}
            onChange={setSelectedCity}
            placeholder="Search your city..."
            className="h-12"
          />

          {location && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">{location.city}</p>
                  {location.district && <p className="text-xs text-muted-foreground">{location.district}</p>}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClear}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSave} disabled={!selectedCity}>
              Save Location
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
