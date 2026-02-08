"use client"

import { useState, useMemo } from "react"
import { Check, ChevronsUpDown, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getDistrictsWithCities, getPopularCities } from "@/lib/locations"

interface LocationSelectorProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  showDistrict?: boolean
}

export function LocationSelector({
  value,
  onChange,
  placeholder = "Select location",
  className,
  showDistrict = true,
}: LocationSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const districtsWithCities = useMemo(() => getDistrictsWithCities(), [])
  const popularCities = useMemo(() => getPopularCities(), [])

  const filteredDistricts = useMemo(() => {
    if (!search) return districtsWithCities
    const q = search.toLowerCase()
    return districtsWithCities
      .map((district) => ({
        ...district,
        cities: district.cities.filter(
          (city) =>
            city.name_en.toLowerCase().includes(q) ||
            city.name_si.includes(search) ||
            city.name_ta.includes(search) ||
            district.name_en.toLowerCase().includes(q),
        ),
      }))
      .filter((d) => d.cities.length > 0 || d.name_en.toLowerCase().includes(q))
  }, [districtsWithCities, search])

  const selectedCity = useMemo(() => {
    for (const district of districtsWithCities) {
      const city = district.cities.find((c) => c.name_en === value)
      if (city) return { city, district }
    }
    return null
  }, [districtsWithCities, value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between bg-muted/50 border-0", className)}
        >
          <div className="flex items-center gap-2 truncate">
            <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
            {selectedCity ? (
              <span className="truncate">
                {selectedCity.city.name_en}
                {showDistrict && <span className="text-muted-foreground ml-1">({selectedCity.district.name_en})</span>}
              </span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Search city or district..." value={search} onValueChange={setSearch} />
          <CommandList className="max-h-[300px]">
            <CommandEmpty>No location found.</CommandEmpty>

            {!search && (
              <CommandGroup heading="Popular Cities">
                {popularCities.map((city) => {
                  const district = districtsWithCities.find((d) => d.id === city.district_id)
                  return (
                    <CommandItem
                      key={city.id}
                      value={city.name_en}
                      onSelect={() => {
                        onChange(city.name_en)
                        setOpen(false)
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", value === city.name_en ? "opacity-100" : "opacity-0")} />
                      <span>{city.name_en}</span>
                      {showDistrict && district && (
                        <span className="ml-auto text-xs text-muted-foreground">{district.name_en}</span>
                      )}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )}

            {filteredDistricts.map((district) => (
              <CommandGroup key={district.id} heading={district.name_en}>
                {district.cities.map((city) => (
                  <CommandItem
                    key={city.id}
                    value={city.name_en}
                    onSelect={() => {
                      onChange(city.name_en)
                      setOpen(false)
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === city.name_en ? "opacity-100" : "opacity-0")} />
                    <span>{city.name_en}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
