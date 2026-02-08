"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Star, UserRound, Calendar, Clock, CalendarDays, Heart, Sparkles, TrendingUp, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { getVehicles } from "@/actions/vehicle/list"
import { RentalType } from "@prisma/client"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

type VehicleWithRelations = Awaited<ReturnType<typeof getVehicles>>["data"]

export type VehicleSuccessType = Extract<VehicleWithRelations, { data: unknown }>

interface EnhancedVehicleCardProps {
  vehicle: VehicleSuccessType["data"][number]
  variant?: "grid" | "list"
  index?: number
}

const categoryGradients: Record<string, string> = {
  LUXURY: "from-amber-500 to-orange-500",
  BUDGET_DAILY: "from-green-500 to-emerald-500",
  MID_RANGE: "from-blue-500 to-indigo-500",
  TOURISM: "from-purple-500 to-violet-500",
  TRAVEL: "from-cyan-500 to-blue-500",
  BUSINESS: "from-slate-600 to-slate-800",
}

export function EnhancedVehicleCard({ vehicle, variant = "grid", index = 0 }: EnhancedVehicleCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const isLongTerm = vehicle?.rentalType === RentalType.LONG_TERM
  const displayPrice = isLongTerm && vehicle?.monthlyPrice ? vehicle.monthlyPrice : vehicle?.pricePerDay
  const priceLabel = isLongTerm && vehicle?.monthlyPrice ? "/mo" : "/day"
  const categoryGradient = categoryGradients[vehicle?.category?.category || ""] || "from-primary to-primary/80"

  const isNewListing = vehicle?._count?.bookings === 0
  const isPopular = (vehicle?._count?.bookings || 0) > 5

  // Grid view layout (default)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/vehicles/${vehicle?.id}`} className="group block" data-testid={`vehicle-card-${vehicle?.id}`}>
        <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 p-0 border-border/50 hover:border-primary/40 bg-white">
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            {/* Skeleton loader */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse" />
            )}
            
            <Image
              src={vehicle?.images[0] || "/placeholder.svg?height=200&width=300&query=car"}
              alt={`${vehicle?.make} ${vehicle?.model}`}
              fill
              className={cn(
                "object-cover transition-all duration-700",
                imageLoaded ? "opacity-100 group-hover:scale-110 group-hover:rotate-1" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
            />
            
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Top Badges Row */}
            <div className="absolute top-2 left-2 right-2 flex items-start justify-between z-10">
              <div className="flex flex-col gap-1.5">
                {/* Category Badge */}
                <Badge className={cn(
                  "text-[10px] sm:text-xs px-2 py-1 font-semibold bg-gradient-to-r text-white border-0 shadow-lg",
                  categoryGradient
                )}>
                  <Sparkles className="h-3 w-3 mr-1" />
                  {vehicle?.category?.name || "Vehicle"}
                </Badge>
                
                {/* Rental Type Badge */}
                <Badge
                  variant={isLongTerm ? "default" : "secondary"}
                  className="text-[10px] sm:text-xs px-2 py-1 bg-white/90 backdrop-blur-sm"
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
              </div>

              {/* Favorite Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setIsLiked(!isLiked)
                }}
                className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all"
              >
                <Heart className={cn(
                  "h-4 w-4 transition-all",
                  isLiked ? "fill-red-500 text-red-500 scale-110" : "text-gray-600"
                )} />
              </motion.button>
            </div>

            {/* Left Side Badges */}
            <div className="absolute top-16 left-2 flex flex-col gap-1.5 z-10">
              {vehicle?.withDriver && (
                <Badge className="bg-blue-600 text-white text-[10px] sm:text-xs px-2 py-1 shadow-lg">
                  <UserRound className="h-3 w-3 mr-1" />
                  Driver
                </Badge>
              )}
              
              {isNewListing && (
                <Badge className="bg-green-600 text-white text-[10px] sm:text-xs px-2 py-1 shadow-lg">
                  New
                </Badge>
              )}
              
              {isPopular && (
                <Badge className="bg-orange-600 text-white text-[10px] sm:text-xs px-2 py-1 shadow-lg">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Popular
                </Badge>
              )}
            </div>

            {/* Bottom Status Badge */}
            {vehicle?.isCurrentlyBooked && (
              <Badge className="absolute bottom-2 left-2 bg-orange-500 text-white text-[10px] sm:text-xs px-2 py-1 shadow-lg">
                <Calendar className="h-3 w-3 mr-1" />
                Booked
              </Badge>
            )}

            {/* Hover Action - View Details */}
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              <div className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-full text-xs font-semibold shadow-lg">
                <Eye className="h-3.5 w-3.5" />
                <span>View Details</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 sm:p-4 space-y-3">
            {/* Location */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span className="truncate">{vehicle?.location}</span>
            </div>

            {/* Title and Rating */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base sm:text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1 mb-1">
                  {vehicle?.make} {vehicle?.model}
                </h3>
                <p className="text-xs text-muted-foreground">{vehicle?.year}</p>
              </div>
              
              {vehicle?.averageRating > 0 && (
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg shrink-0">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-foreground">{vehicle?.averageRating.toFixed(1)}</span>
                </div>
              )}
            </div>

            {/* Price and Stats Row */}
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-bold text-primary">
                    Rs {displayPrice?.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">{priceLabel}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {vehicle?._count?.bookings || 0} bookings
                </span>
              </div>
              
          
            </div>
          </div>

          {/* Hover Shine Effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:animate-shine" />
          </div>
        </Card>
      </Link>

      <style jsx global>{`
        @keyframes shine {
          to {
            left: 200%;
          }
        }
        .animate-shine {
          animation: shine 1s ease-in-out;
        }
      `}</style>
    </motion.div>
  )
}
