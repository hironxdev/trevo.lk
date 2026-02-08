"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, Calendar, Sparkles, TrendingUp, Award, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

const features = [
  { icon: Shield, text: "100% Verified" },
  { icon: Award, text: "Best Prices" },
  { icon: TrendingUp, text: "50K+ Bookings" },
]

const searchSuggestions = [
  { text: "SUV in Colombo", icon: MapPin, link: "/vehicles?location=Colombo&type=SUV" },
  { text: "Budget Cars", icon: Search, link: "/vehicles?category=BUDGET_DAILY" },
  { text: "Beach Villas in Galle", icon: MapPin, link: "/stays?location=Galle" },
  { text: "Long-term Rentals", icon: Calendar, link: "/vehicles?rentalType=LONG_TERM" },
]

const backgroundImages = [
  "/toyota-corolla-front.jpg",
  "/car-front.png",
  "/honda-civic.jpg",
]

export function ModernHeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 min-h-[calc(100vh-5rem)]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex"
            >
              <Badge className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-primary to-accent text-white border-0">
                <Sparkles className="h-4 w-4 mr-2" />
                Sri Lanka's #1 Rental Platform
              </Badge>
            </motion.div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-border/50 shadow-sm"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{feature.text}</span>
                  </motion.div>
                )
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="text-base h-14 px-8 shadow-xl shadow-primary/25 bg-primary hover:bg-primary/90">
                <Link href="/vehicles" data-testid="browse-vehicles-btn">
                  <Search className="h-5 w-5 mr-2" />
                  Browse Vehicles
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base h-14 px-8 bg-white/80 backdrop-blur-sm hover:bg-white">
                <Link href="/stays" data-testid="browse-stays-btn">
                  Browse Stays
                </Link>
              </Button>
            </div>

            {/* Quick Search Suggestions */}
            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-3 font-medium">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {searchSuggestions.map((suggestion, index) => {
                  const Icon = suggestion.icon
                  return (
                    <Link
                      key={index}
                      href={suggestion.link}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-white/60 hover:bg-white border border-border/50 rounded-full transition-all hover:shadow-md hover:scale-105 hover:text-primary"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {suggestion.text}
                    </Link>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Right Content - Image Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full h-[600px]">
              {/* Main Image Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl border-8 border-white/50 backdrop-blur-sm">
                    <Image
                      src={backgroundImages[currentImageIndex]}
                      alt="Featured Vehicle"
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Floating Stats Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute top-8 -left-4 bg-white rounded-2xl p-4 shadow-xl border border-border/50"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-50 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">50K+</p>
                    <p className="text-xs text-muted-foreground">Bookings</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="absolute bottom-8 -right-4 bg-white rounded-2xl p-4 shadow-xl border border-border/50"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">100%</p>
                    <p className="text-xs text-muted-foreground">Verified</p>
                  </div>
                </div>
              </motion.div>

              {/* Image Navigation Dots */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2">
                {backgroundImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentImageIndex ? 'w-8 bg-primary' : 'w-2 bg-primary/30'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  )
}
