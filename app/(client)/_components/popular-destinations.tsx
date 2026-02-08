"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
<<<<<<< HEAD
import { destinations } from "./destinations"
=======

const destinations = [
  {
    name: "Colombo",
    image: "https://unsplash.com/photos/green-tower-in-city-Dw2QYtzSNn0",
    vehicles: 150,
    stays: 45,
    description: "Capital city with modern amenities",
  },
  {
    name: "Kandy",
    image: "https://unsplash.com/photos/temple-of-the-tooth-with-a-bridge-over-water-isdvqf04MDk",
    vehicles: 80,
    stays: 35,
    description: "Cultural heart of Sri Lanka",
  },
  {
    name: "Galle",
    image: "https://unsplash.com/photos/lighthouse-tower-under-cloudy-sky-drGdvwyhmoc",
    vehicles: 65,
    stays: 50,
    description: "Historic fort and beaches",
  },
  {
    name: "Ella",
    image: "/ella.jpg",
    vehicles: 40,
    stays: 30,
    description: "Scenic hill country retreat",
  },
  {
    name: "Negombo",
    image: "https://unsplash.com/photos/a-sandy-beach-with-a-boat-on-the-shore-Q6l8QUhCw-I",
    vehicles: 55,
    stays: 40,
    description: "Beach paradise near airport",
  },
  {
    name: "Nuwara Eliya",
    image: "https://unsplash.com/photos/blue-train-travelling-near-houses-TPtaNsBOW9Q",
    vehicles: 35,
    stays: 25,
    description: "Little England of Sri Lanka",
  },
    {
    name: "Sigiriya",
    image: "https://unsplash.com/photos/an-aerial-view-of-a-rock-formation-in-the-middle-of-a-forest-bfdshIHD5Y4",
    vehicles: 55,
    stays: 40,
    description: "Kingdom of King kashayapa",
  },
]
>>>>>>> 482c744890032a21515722c0f4894a2b553149f7

export function PopularDestinations() {
  return (
    <section className="w-full px-4 md:px-8 py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Popular Destinations</h2>
            <p className="text-muted-foreground mt-1">Explore Sri Lanka's most visited locations</p>
          </motion.div>
          <Button asChild variant="outline" className="hidden md:flex bg-transparent">
            <Link href="/vehicles">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {destinations.map((destination, index) => (
            <motion.div
              key={destination.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={`/vehicles?location=${destination.name}`}
                className="group block relative overflow-hidden rounded-2xl aspect-[3/4]"
              >
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-1 text-white/80 text-xs mb-1">
                    <MapPin className="h-3 w-3" />
                    Sri Lanka
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-1">{destination.name}</h3>
                  <p className="text-white/70 text-xs line-clamp-1 mb-2">{destination.description}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-white/20 text-white">
                      {destination.vehicles} vehicles
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white/20 text-white">
                      {destination.stays} stays
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="flex justify-center mt-8 md:hidden">
          <Button asChild variant="outline" className="bg-transparent">
            <Link href="/stays">
              Explore All Destinations
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
