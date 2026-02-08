"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Star, UserRound, Calendar, Clock, CalendarDays, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { getVehicles } from "@/actions/vehicle/list"
import { RentalType } from "@prisma/client"
import { cn } from "@/lib/utils"

type VehicleWithRelations = Awaited<ReturnType<typeof getVehicles>>["data"]

export type VehicleSuccessType = Extract<VehicleWithRelations, { data: unknown }>

interface VehicleCardProps {
  vehicle: VehicleSuccessType["data"][number]
  variant?: "grid" | "list"
}

const categoryGradients: Record<string, string> = {
  LUXURY: "from-amber-500 to-orange-500",
  BUDGET_DAILY: "from-green-500 to-emerald-500",
  MID_RANGE: "from-blue-500 to-indigo-500",
  TOURISM: "from-purple-500 to-violet-500",
  TRAVEL: "from-cyan-500 to-blue-500",
  BUSINESS: "from-slate-600 to-slate-800",
}

export function VehicleCard({ vehicle, variant = "grid" }: VehicleCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const isLongTerm = vehicle?.rentalType === RentalType.LONG_TERM
  const displayPrice = isLongTerm && vehicle?.monthlyPrice ? vehicle.monthlyPrice : vehicle?.pricePerDay
  const priceLabel = isLongTerm && vehicle?.monthlyPrice ? "/mo" : "/day"
  const categoryGradient = categoryGradients[vehicle?.category?.category || ""] || "from-primary to-primary/80"

  // List view layout
  if (variant === "list") {
    return (
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 p-0 border-border/50 hover:border-primary/30 group">
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative w-full sm:w-64 aspect-[16/10] sm:aspect-auto sm:h-44 shrink-0 overflow-hidden">
            <Image
              src={vehicle?.images[0] || "/placeholder.svg?height=200&width=300&query=car"}
              alt={`${vehicle?.make} ${vehicle?.model}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            
            <Badge className={cn("absolute top-2.5 right-2.5 text-[11px] px-2 py-0.5 font-medium bg-gradient-to-r text-white", categoryGradient)}>
              {vehicle?.category?.name || "Vehicle"}
            </Badge>
            
            <Badge
              variant={isLongTerm ? "default" : "secondary"}
              className="absolute top-10 right-2.5 text-[11px] px-2 py-0.5"
            >
              {isLongTerm ? (
                <>
                  <CalendarDays className="h-3 w-3 mr-1" />
                  Long-term
                </>
              ) : (
                <>
                  <Clock className="h-3 w-3 mr-1" />
                  Short-term
                </>
              )}
            </Badge>
            
            {vehicle?.withDriver && (
              <Badge className="absolute top-2.5 left-2.5 bg-blue-600 text-white text-[11px] px-2 py-0.5">
                <UserRound className="h-3 w-3 mr-1" />
                With Driver
              </Badge>
            )}
            
            {vehicle?.isCurrentlyBooked && (
              <Badge className="absolute bottom-2.5 left-2.5 bg-orange-500 text-white text-[11px] px-2 py-0.5">
                <Calendar className="h-3 w-3 mr-1" />
                Currently Booked
              </Badge>
            )}

            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.preventDefault()
                setIsLiked(!isLiked)
              }}
              className="absolute bottom-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:scale-110 transition-transform"
            >
              <Heart className={cn("h-4 w-4", isLiked ? "fill-red-500 text-red-500" : "text-gray-600")} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col p-4 sm:p-5">
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                    {vehicle?.make} {vehicle?.model}
                  </h3>
                  <p className="text-sm text-muted-foreground">{vehicle?.year}</p>
                </div>
                {vehicle?.averageRating > 0 && (
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold">{vehicle?.averageRating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{vehicle?.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/50">
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-primary">Rs {displayPrice?.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">{priceLabel}</span>
              </div>
              <Button asChild size="default" className="shadow-md shadow-primary/20">
                <Link href={`/vehicles/${vehicle?.id}`}>View Details</Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // Grid view layout (default)
  return (
    <Link href={`/vehicles/${vehicle?.id}`} className="group block">
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 p-0 border-border/50 hover:border-primary/30">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={vehicle?.images[0] || "/placeholder.svg?height=200&width=300&query=car"}
            alt={`${vehicle?.make} ${vehicle?.model}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <Badge className={cn("absolute top-2 right-2 text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 font-medium bg-gradient-to-r text-white", categoryGradient)}>
            {vehicle?.category?.name || "Vehicle"}
          </Badge>
          
          <Badge
            variant={isLongTerm ? "default" : "secondary"}
            className="absolute top-8 sm:top-9 right-2 text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5"
          >
            {isLongTerm ? "Long" : "Short"}
          </Badge>

          {vehicle?.withDriver && (
            <Badge className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5">
              <UserRound className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5" />
              Driver
            </Badge>
          )}

          {vehicle?.isCurrentlyBooked && (
            <Badge className="absolute bottom-2 left-2 bg-orange-500 text-white text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5">
              Booked
            </Badge>
          )}

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsLiked(!isLiked)
            }}
            className="absolute top-2 right-2 p-1.5 sm:p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:scale-110 transition-transform opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300"
            style={{ marginTop: "32px" }}
          >
            <Heart className={cn("h-3.5 w-3.5 sm:h-4 sm:w-4", isLiked ? "fill-red-500 text-red-500" : "text-gray-600")} />
          </button>

          {/* Price overlay on image for mobile */}
          <div className="absolute bottom-2 right-2 md:hidden">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1 shadow-lg">
              <span className="text-sm font-bold text-primary">Rs {displayPrice?.toLocaleString()}</span>
              <span className="text-[10px] text-muted-foreground">{priceLabel}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-2.5 sm:p-3 md:p-4">
          {/* Location */}
          <div className="flex items-center gap-1 text-[11px] sm:text-xs text-muted-foreground mb-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{vehicle?.location}</span>
          </div>

          {/* Title row */}
          <div className="flex items-start justify-between gap-1 mb-1">
            <h3 className="font-semibold text-sm sm:text-base leading-tight group-hover:text-primary transition-colors line-clamp-1">
              {vehicle?.make} {vehicle?.model}
            </h3>
          </div>

          {/* Year */}
          <p className="text-xs text-muted-foreground mb-2">{vehicle?.year}</p>

          {/* Price - desktop only */}
          <div className="hidden md:flex items-baseline gap-1 mb-3">
            <span className="text-lg font-bold text-primary">Rs {displayPrice?.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">{priceLabel}</span>
          </div>

          {/* Rating & Stats */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            {vehicle?.averageRating > 0 ? (
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-medium">{vehicle?.averageRating.toFixed(1)}</span>
                <span className="text-[10px] text-muted-foreground">({vehicle?._count?.bookings || 0})</span>
              </div>
            ) : (
              <Badge variant="secondary" className="text-[10px] font-normal">New</Badge>
            )}
            <span className="text-[10px] sm:text-xs text-muted-foreground">
              {vehicle?._count?.bookings || 0} booked
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
