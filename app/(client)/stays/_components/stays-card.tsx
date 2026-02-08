"use client"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Bed, Bath, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import type { getStays } from "@/actions/stays/list"

type StaysListReturnType = Awaited<ReturnType<typeof getStays>>["data"]
type StaysWithRelations = Extract<StaysListReturnType, { data: unknown }>

export type StaysSuccessType = StaysWithRelations

interface StaysCardProps {
  stays: StaysSuccessType["data"][number]
  variant?: "grid" | "list"
}

const categoryColors: Record<string, string> = {
  LUXURY: "bg-amber-500 text-white",
  BUDGET: "bg-green-500 text-white",
  STANDARD: "bg-blue-500 text-white",
  PREMIUM: "bg-purple-500 text-white",
  BEACHFRONT: "bg-cyan-500 text-white",
  HILL_COUNTRY: "bg-emerald-500 text-white",
  CITY_CENTER: "bg-slate-700 text-white",
  RURAL: "bg-orange-500 text-white",
}

const staysTypeLabels: Record<string, string> = {
  HOUSE: "House",
  APARTMENT: "Apartment",
  VILLA: "Villa",
  HOTEL: "Hotel",
  GUEST_HOUSE: "Guest House",
  BUNGALOW: "Bungalow",
  ROOM: "Room",
  OTHER: "Other",
}

export function StaysCard({ stays, variant = "grid" }: StaysCardProps) {
  const categoryColor = categoryColors[stays?.staysCategory?.category || ""] || "bg-primary text-primary-foreground"

  if (variant === "list") {
    return (
      <Link href={`/stays/${stays.id}`} className="group block">
        <div className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all hover:shadow-lg flex">
          {/* Image */}
          <div className="relative w-48 md:w-64 shrink-0 bg-muted">
            <Image
              src={stays.images?.[0] || "/placeholder.svg?height=200&width=300&query=property"}
              alt={stays.name}
              fill
              className="object-cover"
            />
            {stays?.staysCategory && (
              <Badge className={cn("absolute top-2 right-2", categoryColor)}>{stays.staysCategory.name}</Badge>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Badge variant="outline" className="text-xs">
                  {staysTypeLabels[stays.staysType] || stays.staysType}
                </Badge>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {stays.city}
                </span>
              </div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {stays.name}
              </h3>
              <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Bed className="h-4 w-4" />
                  {stays.bedrooms}
                </span>
                <span className="flex items-center gap-1">
                  <Bath className="h-4 w-4" />
                  {stays.bathrooms}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {stays.maxGuests}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-primary">Rs.{stays.pricePerNight?.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground">/night</span>
              </div>
              {stays.averageRating && stays.averageRating > 0 ? (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-medium">{stays.averageRating.toFixed(1)}</span>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">New</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/stays/${stays.id}`} className="group block">
      <div className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all hover:shadow-lg">
        {/* Image Container */}
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          <Image
            src={stays.images?.[0] || "/placeholder.svg?height=300&width=400&query=property"}
            alt={stays.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Category Badge */}
          {stays?.staysCategory && (
            <Badge className={cn("absolute top-2 right-2", categoryColor)}>{stays.staysCategory.name}</Badge>
          )}
          {/* Type Badge */}
          <Badge variant="secondary" className="absolute top-2 left-2">
            {staysTypeLabels[stays.staysType] || stays.staysType}
          </Badge>
        </div>

        {/* Content */}
        <div className="p-3 md:p-4">
          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
            <MapPin className="h-3 w-3" />
            <span>
              {stays.city}
              {stays.district && `, ${stays.district}`}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {stays.name}
          </h3>

          {/* Capacity */}
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Bed className="h-3 w-3" />
              {stays.bedrooms} bed{stays.bedrooms !== 1 && "s"}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="h-3 w-3" />
              {stays.bathrooms} bath
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {stays.maxGuests}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-lg font-bold text-primary">Rs.{stays.pricePerNight?.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">/night</span>
          </div>

          {/* Rating & Bookings */}
          <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
            {stays.averageRating && stays.averageRating > 0 ? (
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{stays.averageRating.toFixed(1)}</span>
              </div>
            ) : (
              <span className="text-xs">New</span>
            )}
            <span className="text-xs">{stays._count?.bookings || 0} bookings</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
