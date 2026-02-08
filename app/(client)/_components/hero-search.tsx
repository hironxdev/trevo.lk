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

// rentalTypes and propertyTypes removed: not used by the UI currently

const popularDestinations = ["Colombo", "Kandy", "Galle", "Negombo", "Ella"]

export function HeroSearch() {
  const router = useRouter()
  const { location: preferredLocation, isLoaded } = useLocationPreference()

  // ✅ hydration-safe: render placeholder until mounted
  const [mounted, setMounted] = useState(false)

  const [activeTab, setActiveTab] = useState<"vehicles" | "stays" | "events" | "marketplace">("vehicles")

  // Vehicle search state
  const [location, setLocation] = useState("")
  const [pickupDate, setPickupDate] = useState<Date | undefined>(undefined)
  const [dropoffDate, setDropoffDate] = useState<Date | undefined>(undefined)
  const [vehicleType, setVehicleType] = useState("ALL")
  const [withDriver, setWithDriver] = useState<string>("ALL")
  const [rentalType] = useState<string>("ALL")

  // Stays search state
  const [staysLocation, setStaysLocation] = useState("")
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined)
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined)
  const [guests, setGuests] = useState(2)
  const [propertyType] = useState("ALL")

  // ✅ stable min date (no new Date() on every render)
  const minDate = useMemo(() => startOfDay(new Date()), [])

  // ✅ set defaults on client after mount
  useEffect(() => {
    // schedule state updates asynchronously to avoid synchronous cascading renders
    Promise.resolve().then(() => {
      setMounted(true)

      const today = startOfDay(new Date())
      setPickupDate(today)
      setDropoffDate(addDays(today, 3))

      setCheckInDate(today)
      setCheckOutDate(addDays(today, 2))
    })
  }, [])

  // Preferred location fill
  useEffect(() => {
    if (isLoaded && preferredLocation?.city) {
      Promise.resolve().then(() => {
        if (!location) setLocation(preferredLocation.city)
        if (!staysLocation) setStaysLocation(preferredLocation.city)
      })
    }
  }, [isLoaded, preferredLocation, location, staysLocation])

  const handleVehicleSearch = () => {
    const params = new URLSearchParams()
    if (location) params.set("location", location)
    if (pickupDate) params.set("startDate", pickupDate.toISOString())
    if (dropoffDate) params.set("endDate", dropoffDate.toISOString())
    if (vehicleType !== "ALL") params.set("type", vehicleType)
    if (withDriver !== "ALL") params.set("withDriver", withDriver)
    if (rentalType !== "ALL") params.set("rentalType", rentalType)
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

  // ✅ avoids Radix SSR hydration mismatch if this component still SSRs somewhere
  if (!mounted) {
    return (
      <section className="relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="relative px-4 md:px-8 pt-8 pb-12 md:pt-12 md:pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="h-[260px] rounded-2xl bg-muted/40 animate-pulse" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative w-full overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative px-4 md:px-8 pt-8 pb-12 md:pt-12 md:pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              <span>Sri Lanka&apos;s Trusted Booking Platform</span>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as "vehicles" | "stays" | "events" | "marketplace")}
              className="w-full"
            >
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-4 mb-6 h-12 p-1 bg-muted/80 backdrop-blur-sm">
                <TabsTrigger value="vehicles" className="gap-2 h-10 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Car className="h-4 w-4" />
                  Vehicles
                </TabsTrigger>
                <TabsTrigger value="stays" className="gap-2 h-10 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Home className="h-4 w-4" />
                  Stays
                </TabsTrigger>
                <TabsTrigger value="events" className="gap-2 h-10 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Calendar className="h-4 w-4" />
                  Events
                </TabsTrigger>
                <TabsTrigger value="marketplace" className="gap-2 h-10 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <ShoppingCart className="h-4 w-4" />
                  Market
                </TabsTrigger>
              </TabsList>

              {/* VEHICLES */}
              <TabsContent value="vehicles">
                {/* Desktop */}
                <div className="hidden md:block">
                  <div className="bg-white/80 backdrop-blur-md border border-border/50 rounded-2xl shadow-xl shadow-primary/5 p-5">
                    <div className="grid grid-cols-12 gap-4 items-end">
                      <div className="col-span-3">
                        <label className="text-xs font-semibold text-foreground mb-2 block flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          Location
                        </label>
                        <LocationSelector
                          value={location}
                          onChange={setLocation}
                          placeholder="Where do you need?"
                          showDistrict={false}
                          className="h-12 bg-muted/50 border-0 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="text-xs font-semibold text-foreground mb-2 block flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                          Pick-up
                        </label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full h-12 px-4 justify-start bg-muted/50 border-0 hover:bg-muted font-medium">
                              <span className="text-sm">{pickupDate ? format(pickupDate, "MMM d, yyyy") : "Select date"}</span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={pickupDate}
                              onSelect={(date) => {
                                setPickupDate(date)
                                if (date && dropoffDate && date > dropoffDate) {
                                  setDropoffDate(addDays(date, 1))
                                }
                              }}
                              disabled={(date) => date < minDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="col-span-2">
                        <label className="text-xs font-semibold text-foreground mb-2 block flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                          Drop-off
                        </label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full h-12 px-4 justify-start bg-muted/50 border-0 hover:bg-muted font-medium">
                              <span className="text-sm">{dropoffDate ? format(dropoffDate, "MMM d, yyyy") : "Select date"}</span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={dropoffDate}
                              onSelect={setDropoffDate}
                              disabled={(date) => date < (pickupDate || minDate)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="col-span-2">
                        <label className="text-xs font-semibold text-foreground mb-2 block flex items-center gap-1.5">
                          <Car className="h-3.5 w-3.5 text-primary" />
                          Vehicle Type
                        </label>
                        <Select value={vehicleType} onValueChange={setVehicleType}>
                          <SelectTrigger className="h-12 bg-muted/50 border-0 focus:ring-2 focus:ring-primary/20">
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

                      <div className="col-span-2">
                        <label className="text-xs font-semibold text-foreground mb-2 block flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-primary" />
                          Driver
                        </label>
                        <Select value={withDriver} onValueChange={setWithDriver}>
                          <SelectTrigger className="h-12 bg-muted/50 border-0 focus:ring-2 focus:ring-primary/20">
                            <SelectValue placeholder="Any" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ALL">Any</SelectItem>
                            <SelectItem value="true">With Driver</SelectItem>
                            <SelectItem value="false">Self Drive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="col-span-1">
                        <Button
                          onClick={handleVehicleSearch}
                          className="w-full h-12 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
                          size="lg"
                        >
                          <Search className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile */}
                <div className="md:hidden">
                  <div className="bg-white/90 backdrop-blur-md border border-border/50 rounded-2xl shadow-xl shadow-primary/5 p-4 space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-foreground mb-2 block">Where do you need a vehicle?</label>
                      <LocationSelector value={location} onChange={setLocation} placeholder="Enter city or area" showDistrict={false} className="h-12" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-foreground mb-2 block">Pick-up</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full h-12 px-3 justify-start bg-muted/50 border-0 font-medium">
                              <Calendar className="h-4 w-4 text-primary mr-2 shrink-0" />
                              <span className="text-sm truncate">{pickupDate ? format(pickupDate, "MMM d") : "Select"}</span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={pickupDate}
                              onSelect={(date) => {
                                setPickupDate(date)
                                if (date && dropoffDate && date > dropoffDate) setDropoffDate(addDays(date, 1))
                              }}
                              disabled={(date) => date < minDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-foreground mb-2 block">Drop-off</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full h-12 px-3 justify-start bg-muted/50 border-0 font-medium">
                              <Calendar className="h-4 w-4 text-primary mr-2 shrink-0" />
                              <span className="text-sm truncate">{dropoffDate ? format(dropoffDate, "MMM d") : "Select"}</span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={dropoffDate}
                              onSelect={setDropoffDate}
                              disabled={(date) => date < (pickupDate || minDate)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-foreground mb-2 block">Vehicle</label>
                        <Select value={vehicleType} onValueChange={setVehicleType}>
                          <SelectTrigger className="h-12 bg-muted/50 border-0">
                            <SelectValue placeholder="Type" />
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

                      <div>
                        <label className="text-xs font-semibold text-foreground mb-2 block">Driver</label>
                        <Select value={withDriver} onValueChange={setWithDriver}>
                          <SelectTrigger className="h-12 bg-muted/50 border-0">
                            <SelectValue placeholder="Any" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ALL">Any</SelectItem>
                            <SelectItem value="true">With Driver</SelectItem>
                            <SelectItem value="false">Self Drive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button onClick={handleVehicleSearch} className="w-full h-12 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 text-base font-semibold">
                      <Search className="h-5 w-5 mr-2" />
                      Search Vehicles
                    </Button>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
                  <span className="text-sm text-muted-foreground">Popular:</span>
                  {popularDestinations.map((dest) => (
                    <button
                      key={dest}
                      onClick={() => setLocation(dest)}
                      className="text-sm px-3 py-1.5 rounded-full bg-white/60 hover:bg-white border border-border/50 text-foreground hover:text-primary transition-colors"
                    >
                      {dest}
                    </button>
                  ))}
                </div>
              </TabsContent>

              {/* STAYS */}
              <TabsContent value="stays">
                <div className="bg-white/80 backdrop-blur-md border border-border/50 rounded-2xl shadow-xl shadow-primary/5 p-5">
                  <div className="grid grid-cols-12 gap-4 items-end">
                    <div className="col-span-12 md:col-span-4">
                      <label className="text-xs font-semibold text-foreground mb-2 block flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        Destination
                      </label>
                      <LocationSelector
                        value={staysLocation}
                        onChange={setStaysLocation}
                        placeholder="Where are you going?"
                        showDistrict={false}
                        className="h-12 bg-muted/50 border-0 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20"
                      />
                    </div>

                    <div className="col-span-6 md:col-span-2">
                      <label className="text-xs font-semibold text-foreground mb-2 block flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        Check-in
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full h-12 px-4 justify-start bg-muted/50 border-0 hover:bg-muted font-medium">
                            <span className="text-sm">{checkInDate ? format(checkInDate, "MMM d, yyyy") : "Select date"}</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={checkInDate}
                            onSelect={(date) => {
                              setCheckInDate(date)
                              if (date && checkOutDate && date >= checkOutDate) setCheckOutDate(addDays(date, 1))
                            }}
                            disabled={(date) => date < minDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="col-span-6 md:col-span-2">
                      <label className="text-xs font-semibold text-foreground mb-2 block flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        Check-out
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full h-12 px-4 justify-start bg-muted/50 border-0 hover:bg-muted font-medium">
                            <span className="text-sm">{checkOutDate ? format(checkOutDate, "MMM d, yyyy") : "Select date"}</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={checkOutDate}
                            onSelect={setCheckOutDate}
                            disabled={(date) => date <= (checkInDate || minDate)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="col-span-6 md:col-span-2">
                      <label className="text-xs font-semibold text-foreground mb-2 block flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-primary" />
                        Guests
                      </label>
                      <Input
                        type="number"
                        min={1}
                        max={20}
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value) || 1)}
                        className="h-12 pl-4 bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary/20"
                      />
                    </div>

                    <div className="col-span-6 md:col-span-1">
                      <Button onClick={handleStaysSearch} className="w-full h-12 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25" size="lg">
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
                      onClick={() => setStaysLocation(dest)}
                      className="text-sm px-3 py-1.5 rounded-full bg-white/60 hover:bg-white border border-border/50 text-foreground hover:text-primary transition-colors"
                    >
                      {dest}
                    </button>
                  ))}
                </div>
              </TabsContent>

              {/* EVENTS */}
              <TabsContent value="events">
                <div className="bg-white/80 backdrop-blur-md border border-border/50 rounded-2xl shadow-xl shadow-primary/5 p-8 text-center">
                  <div className="max-w-md mx-auto">
                    <Calendar className="h-16 w-16 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Explore Events</h3>
                    <p className="text-muted-foreground mb-6">
                      Book tickets for concerts, festivals, sports events, workshops, and more across Sri Lanka.
                    </p>
                    <Button onClick={() => router.push("/events")} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                      <Calendar className="h-4 w-4 mr-2" />
                      Explore Events
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* MARKETPLACE */}
              <TabsContent value="marketplace">
                <div className="bg-white/80 backdrop-blur-md border border-border/50 rounded-2xl shadow-xl shadow-primary/5 p-8 text-center">
                  <div className="max-w-md mx-auto">
                    <ShoppingCart className="h-16 w-16 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Marketplace</h3>
                    <p className="text-muted-foreground mb-6">You are being redirected to our marketplace.</p>
                    <Button
                      onClick={() => (window.location.href = "https://oysiumone.store/")}
                      className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Go to Marketplace
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
