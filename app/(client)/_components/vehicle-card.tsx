"use client"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Star, UserRound, Heart, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { VehicleSuccessType } from "../vehicles/_components/vehicle-card"
import { useState } from "react"

interface VehicleCardProps {
  vehicle: VehicleSuccessType["data"][number]
}

const categoryColors: Record<string, string> = {
  LUXURY: "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
  BUDGET_DAILY: "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
  MID_RANGE: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white",
  TOURISM: "bg-gradient-to-r from-purple-500 to-violet-500 text-white",
  TRAVEL: "bg-gradient-to-r from-cyan-500 to-blue-500 text-white",
  BUSINESS: "bg-gradient-to-r from-slate-600 to-slate-800 text-white",
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const categoryColor = categoryColors[vehicle?.category?.category || ""] || "bg-primary text-primary-foreground"

  return (
    <Link href={`/vehicles/${vehicle.id}`} className="group block">
      <div className="bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
        {/* Image Container */}
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          <Image
            src={vehicle.images?.[0] || "/placeholder.svg?height=300&width=400&query=car"}
            alt={`${vehicle.make} ${vehicle.model}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Category Badge */}
          <Badge className={cn("absolute top-2.5 right-2.5 font-medium", categoryColor)}>
            {vehicle?.category?.name}
          </Badge>
          
          {/* With Driver Badge */}
          {vehicle.withDriver && (
            <Badge className="absolute top-2.5 left-2.5 bg-blue-600 text-white">
              <UserRound className="h-3 w-3 mr-1" />
              With Driver
            </Badge>
          )}

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsLiked(!isLiked)
            }}
            className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-full group-hover:translate-x-0"
            style={{ marginTop: "32px" }}
          >
            <div className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:scale-110 transition-transform">
              <Heart className={cn("h-4 w-4 transition-colors", isLiked ? "fill-red-500 text-red-500" : "text-gray-600")} />
            </div>
          </button>

          {/* Price Tag on Image (Mobile) */}
          <div className="absolute bottom-2.5 left-2.5 md:hidden">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg px-2.5 py-1.5 shadow-lg">
              <span className="text-sm font-bold text-primary">Rs.{vehicle.pricePerDay?.toLocaleString()}</span>
              <span className="text-[10px] text-muted-foreground">/day</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3.5 md:p-4">
          {/* Location */}
          {vehicle.location && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1.5">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{vehicle.location}</span>
            </div>
          )}

          {/* Title */}
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {vehicle.make} {vehicle.model} {vehicle.year}
          </h3>

          {/* Price - Desktop */}
          <div className="hidden md:flex items-baseline gap-1 mt-2">
            <span className="text-xl font-bold text-primary">Rs.{vehicle.pricePerDay?.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">/day</span>
          </div>

          {/* Rating & Rentals */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
            {vehicle.averageRating && vehicle.averageRating > 0 ? (
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-sm">{vehicle.averageRating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  ({vehicle._count?.bookings || 0} rentals)
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Badge variant="secondary" className="text-xs font-normal">New</Badge>
              </div>
            )}
            <span className="text-xs text-muted-foreground">
              {vehicle._count?.bookings || 0} booked
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
