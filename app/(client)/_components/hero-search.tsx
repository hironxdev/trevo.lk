"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Calendar,
  Car,
  Search,
  User,
  Home,
  Users,
  MapPin,
  Sparkles,
  ShoppingCart,
  Clock,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, addDays, startOfDay } from "date-fns"
import { LocationSelector } from "@/components/location-selector"
import { useLocationPreference } from "@/hooks/use-location-preference"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"

const vehicleTypes = [
  { value: "ALL", label: "All Vehicles" },
  { value: "BIKE", label: "Bike" },
  { value: "THREE_WHEEL", label: "Three Wheeler" },
  { value: "CAR", label: "Car" },
  { value: "SEDAN", label: "Sedan" },
  { value: "HATCHBACK", label: "Hatchback" },
  { value: "SUV", label: "SUV" },
  { value: "VAN", label: "Van" },
  { value: "BUS", label: "Bus" },
  { value: "TRUCK", label: "Truck / Lorry" },
  { value: "HELICOPTER", label: "Helicopter" },
  { value: "DRONE", label: "Drone" },
  { value: "BOAT", label: "Boat" },
  { value: "JET_SKI", label: "Jet Ski" },
]

const propertyTypes = [
  { value: "ALL", label: "All Properties" },
  { value: "APARTMENT", label: "Apartment" },
  { value: "HOUSE", label: "House" },
  { value: "VILLA", label: "Villa" },
  { value: "COTTAGE", label: "Cottage" },
  { value: "ROOM", label: "Private Room" },
  { value: "GUESTHOUSE", label: "Guesthouse" },
  { value: "RESORT", label: "Resort" },
  { value: "STUDIO", label: "Studio" },
]

const eventTypes = [
  { value: "ALL", label: "All types" },
  { value: "CONCERT", label: "Concert" },
  { value: "FESTIVAL", label: "Festival" },
  { value: "SPORTS", label: "Sports" },
  { value: "WORKSHOP", label: "Workshop" },
  { value: "EXHIBITION", label: "Exhibition" },
]

const eventTimes = [
  { value: "ALL", label: "Any time" },
  { value: "MORNING", label: "Morning" },
  { value: "AFTERNOON", label: "Afternoon" },
  { value: "EVENING", label: "Evening" },
  { value: "NIGHT", label: "Night" },
]

const popularDestinations = ["Colombo", "Kandy", "Galle", "Negombo", "Ella"]

type TabValue = "vehicles" | "stays" | "events" | "marketplace"

export function HeroSearch() {
  const router = useRouter()
  const { location: preferredLocation, isLoaded } = useLocationPreference()

  // ✅ All hooks must run every render
  const today = useMemo(() => startOfDay(new Date()), [])
  const minDate = today

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const [activeTab, setActiveTab] = useState<TabValue>("vehicles")

  // Vehicles
  const [vehicleLocation, setVehicleLocation] = useState("")
  const [pickupDate, setPickupDate] = useState<Date | undefined>(today)
  const [dropoffDate, setDropoffDate] = useState<Date | undefined>(addDays(today, 3))
  const [vehicleType, setVehicleType] = useState("ALL")
  const [withDriver, setWithDriver] = useState("ALL")

  // Stays
  const [staysLocation, setStaysLocation] = useState("")
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(today)
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(addDays(today, 2))
  const [guests, setGuests] = useState(2)
  const [propertyType, setPropertyType] = useState("ALL")

  // Events
  const [eventLocation, setEventLocation] = useState("")
  const [eventDate, setEventDate] = useState<Date | undefined>(today)
  const [eventTime, setEventTime] = useState("ALL")
  const [eventType, setEventType] = useState("ALL")

  useEffect(() => {
    if (!isLoaded) return
    const city = preferredLocation?.city
    if (!city) return

    setVehicleLocation((prev) => (prev ? prev : city))
    setStaysLocation((prev) => (prev ? prev : city))
    setEventLocation((prev) => (prev ? prev : city))
  }, [isLoaded, preferredLocation?.city])

  const handleVehicleSearch = () => {
    const params = new URLSearchParams()
    if (vehicleLocation) params.set("location", vehicleLocation)
    if (pickupDate) params.set("startDate", pickupDate.toISOString())
    if (dropoffDate) params.set("endDate", dropoffDate.toISOString())
    if (vehicleType !== "ALL") params.set("type", vehicleType)
    if (withDriver !== "ALL") params.set("withDriver", withDriver)
    router.push(`/vehicles?${params.toString()}`)
  }

  const handleStaysSearch = () => {
    const params = new URLSearchParams()
    if (staysLocation) params.set("location", staysLocation)
    if (checkInDate) params.set("checkIn", checkInDate.toISOString())
    if (checkOutDate) params.set("checkOut", checkOutDate.toISOString())
    params.set("guests", String(Math.max(1, guests || 1)))
    if (propertyType !== "ALL") params.set("type", propertyType)
    router.push(`/stays?${params.toString()}`)
  }

  const handleEventSearch = () => {
    const params = new URLSearchParams()
    if (eventLocation) params.set("location", eventLocation)
    if (eventDate) params.set("date", eventDate.toISOString())
    if (eventTime !== "ALL") params.set("time", eventTime)
    if (eventType !== "ALL") params.set("type", eventType)
    router.push(`/events?${params.toString()}`)
  }

  // ✅ Avoid hydration mismatch: don’t render Tabs until mounted
  if (!mounted) {
    return <section className="relative w-full overflow-hidden" />
  }

  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

      <div className="relative px-4 md:px-8 pt-8 pb-12 md:pt-12 md:pb-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 md:mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              <span>Sri Lanka&apos;s Trusted Booking Platform</span>
            </div>
          </motion.div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-4 mb-6 h-12 p-1 bg-muted/80">
              <TabsTrigger value="vehicles" className="gap-2 h-10 data-[state=active]:bg-white">
                <Car className="h-4 w-4" />
                Vehicles
              </TabsTrigger>
              <TabsTrigger value="stays" className="gap-2 h-10 data-[state=active]:bg-white">
                <Home className="h-4 w-4" />
                Stays
              </TabsTrigger>
              <TabsTrigger value="events" className="gap-2 h-10 data-[state=active]:bg-white">
                <Calendar className="h-4 w-4" />
                Events
              </TabsTrigger>
              <TabsTrigger value="marketplace" className="gap-2 h-10 data-[state=active]:bg-white">
                <ShoppingCart className="h-4 w-4" />
                Market
              </TabsTrigger>
            </TabsList>

            {/* Vehicles */}
            <TabsContent value="vehicles">
              <div className="bg-white/80 border border-border/50 rounded-2xl shadow-xl p-5">
                <div className="grid md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-4">
                    <label className="text-xs font-semibold mb-2 block flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      Location
                    </label>
                    <LocationSelector value={vehicleLocation} onChange={setVehicleLocation} placeholder="Where do you need?" showDistrict={false} className="h-12" />
                  </div>

                  <div className="md:col-span-3">
                    <label className="text-xs font-semibold mb-2 block flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      Pick-up
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full h-12 justify-start">
                          {pickupDate ? format(pickupDate, "MMM d, yyyy") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={pickupDate}
                          onSelect={(d) => {
                            setPickupDate(d)
                            if (d && dropoffDate && d > dropoffDate) setDropoffDate(addDays(d, 1))
                          }}
                          disabled={(d) => d < minDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="md:col-span-3">
                    <label className="text-xs font-semibold mb-2 block flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      Drop-off
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full h-12 justify-start">
                          {dropoffDate ? format(dropoffDate, "MMM d, yyyy") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={dropoffDate}
                          onSelect={setDropoffDate}
                          disabled={(d) => d < (pickupDate || minDate)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold mb-2 block flex items-center gap-1.5">
                      <Car className="h-3.5 w-3.5 text-primary" />
                      Vehicle
                    </label>
                    <Select value={vehicleType} onValueChange={setVehicleType}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleTypes.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold mb-2 block flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-primary" />
                      Driver
                    </label>
                    <Select value={withDriver} onValueChange={setWithDriver}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">Any</SelectItem>
                        <SelectItem value="true">With Driver</SelectItem>
                        <SelectItem value="false">Self Drive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-1">
                    <Button onClick={handleVehicleSearch} className="w-full h-12">
                      <Search className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">Popular:</span>
                {popularDestinations.map((dest) => (
                  <button
                    key={dest}
                    onClick={() => setVehicleLocation(dest)}
                    className="text-sm px-3 py-1.5 rounded-full bg-white/60 hover:bg-white border"
                  >
                    {dest}
                  </button>
                ))}
              </div>
            </TabsContent>

            {/* Stays */}
            <TabsContent value="stays">
              <div className="bg-white/80 border border-border/50 rounded-2xl shadow-xl p-5">
                <div className="grid md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-4">
                    <label className="text-xs font-semibold mb-2 block flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      Destination
                    </label>
                    <LocationSelector value={staysLocation} onChange={setStaysLocation} placeholder="Where are you going?" showDistrict={false} className="h-12" />
                  </div>

                  <div className="md:col-span-3">
                    <label className="text-xs font-semibold mb-2 block flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      Check-in
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full h-12 justify-start">
                          {checkInDate ? format(checkInDate, "MMM d, yyyy") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={checkInDate}
                          onSelect={(d) => {
                            setCheckInDate(d)
                            if (d && checkOutDate && d >= checkOutDate) setCheckOutDate(addDays(d, 1))
                          }}
                          disabled={(d) => d < minDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="md:col-span-3">
                    <label className="text-xs font-semibold mb-2 block flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      Check-out
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full h-12 justify-start">
                          {checkOutDate ? format(checkOutDate, "MMM d, yyyy") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={checkOutDate}
                          onSelect={setCheckOutDate}
                          disabled={(d) => d <= (checkInDate || minDate)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="md:col-span-1">
                    <label className="text-xs font-semibold mb-2 block flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-primary" />
                      Guests
                    </label>
                    <Input type="number" min={1} max={20} value={guests} onChange={(e) => setGuests(Number(e.target.value) || 1)} className="h-12" />
                  </div>

                  <div className="md:col-span-1">
                    <Button onClick={handleStaysSearch} className="w-full h-12">
                      <Search className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4 md:max-w-sm">
                  <label className="text-xs font-semibold mb-2 block flex items-center gap-1.5">
                    <Home className="h-3.5 w-3.5 text-primary" />
                    Property Type
                  </label>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="All properties" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* Events */}
            <TabsContent value="events">
              <div className="bg-white/80 border border-border/50 rounded-2xl shadow-xl shadow-primary/5 p-6 md:p-8">
                

                <div className="grid gap-4 md:grid-cols-12 items-end">
                  <div className="md:col-span-4">
                    <label className="text-xs font-semibold mb-2 block flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      Location
                    </label>
                    <LocationSelector value={eventLocation} onChange={setEventLocation} placeholder="Colombo, Kandy, Galle..." showDistrict={false} className="h-12" />
                  </div>

                  <div className="md:col-span-3">
                    <label className="text-xs font-semibold mb-2 block flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full h-12 justify-start">
                          {eventDate ? format(eventDate, "MMM d, yyyy") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent mode="single" selected={eventDate} onSelect={setEventDate} disabled={(d) => d < minDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold mb-2 block flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      Time
                    </label>
                    <Select value={eventTime} onValueChange={setEventTime}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Any time" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTimes.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold mb-2 block flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      Event Type
                    </label>
                    <Select value={eventType} onValueChange={setEventType}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-1">
                    <Button onClick={handleEventSearch} className="w-full h-12 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                      <Search className="h-5 w-5" /> 
                      <h1>search</h1>
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Marketplace */}
            <TabsContent value="marketplace">
              <div className="bg-white/80 border border-border/50 rounded-2xl shadow-xl p-8 text-center">
                <ShoppingCart className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Marketplace</h3>
                <p className="text-muted-foreground mb-6">You are being redirected to marketplace.</p>
                <Button onClick={() => (window.location.href = "https://oysiumone.store/")}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Go to Marketplace
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}
