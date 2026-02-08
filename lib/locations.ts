import provinces from "@/lib/data/provinces.json"
import districts from "@/lib/data/districts.json"
import cities from "@/lib/data/cities.json"

export interface Province {
  id: string
  name_en: string
  name_si: string
  name_ta: string
}

export interface District {
  id: string
  province_id: string
  name_en: string
  name_si: string
  name_ta: string
}

export interface City {
  id: string
  district_id: string
  name_en: string
  name_si: string
  name_ta: string
  postcode: string
  latitude: string
  longitude: string
}

export function getProvinces(): Province[] {
  return provinces
}

export function getDistricts(provinceId?: string): District[] {
  if (provinceId) {
    return districts.filter((d) => d.province_id === provinceId)
  }
  return districts
}

export function getCities(districtId?: string): City[] {
  if (districtId) {
    return cities.filter((c) => c.district_id === districtId)
  }
  return cities
}

export function getDistrictById(id: string): District | undefined {
  return districts.find((d) => d.id === id)
}

export function getProvinceById(id: string): Province | undefined {
  return provinces.find((p) => p.id === id)
}

export function getCityById(id: string): City | undefined {
  return cities.find((c) => c.id === id)
}

export function getCityByName(name: string): City | undefined {
  return cities.find((c) => c.name_en.toLowerCase() === name.toLowerCase() || c.name_si === name || c.name_ta === name)
}

export function getDistrictByName(name: string): District | undefined {
  return districts.find(
    (d) => d.name_en.toLowerCase() === name.toLowerCase() || d.name_si === name || d.name_ta === name,
  )
}

export function getProvinceByName(name: string): Province | undefined {
  return provinces.find(
    (p) => p.name_en.toLowerCase() === name.toLowerCase() || p.name_si === name || p.name_ta === name,
  )
}

export function searchLocations(query: string): {
  provinces: Province[]
  districts: District[]
  cities: City[]
} {
  const q = query.toLowerCase()
  return {
    provinces: provinces.filter(
      (p) => p.name_en.toLowerCase().includes(q) || p.name_si.includes(query) || p.name_ta.includes(query),
    ),
    districts: districts.filter(
      (d) => d.name_en.toLowerCase().includes(q) || d.name_si.includes(query) || d.name_ta.includes(query),
    ),
    cities: cities.filter(
      (c) =>
        c.name_en.toLowerCase().includes(q) ||
        c.name_si.includes(query) ||
        c.name_ta.includes(query) ||
        c.postcode.includes(query),
    ),
  }
}

// Get popular cities for quick selection
export function getPopularCities(): City[] {
  const popularCityNames = [
    "Colombo",
    "Kandy",
    "Galle",
    "Negombo",
    "Jaffna",
    "Nuwara Eliya",
    "Trincomalee",
    "Batticaloa",
    "Anuradhapura",
    "Matara",
    "Kurunegala",
    "Ratnapura",
  ]
  return cities.filter((c) => popularCityNames.includes(c.name_en))
}

// Get all cities as flat list for location dropdown
export function getAllLocationOptions(): { value: string; label: string; district: string }[] {
  return cities.map((city) => {
    const district = districts.find((d) => d.id === city.district_id)
    return {
      value: city.name_en,
      label: city.name_en,
      district: district?.name_en || "",
    }
  })
}

// Get districts with their cities
export function getDistrictsWithCities(): (District & { cities: City[] })[] {
  return districts.map((district) => ({
    ...district,
    cities: cities.filter((c) => c.district_id === district.id),
  }))
}
