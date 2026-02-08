"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const featuredVehicles = [
  {
    name: "Toyota Corolla",
    category: "Mid Range",
    image: "/toyota-corolla.jpg",
    price: "Rs 8,500",
    slug: "toyota-corolla",
  },
  {
    name: "Honda Civic",
    category: "Luxury",
    image: "/honda-civic.jpg",
    price: "Rs 12,000",
    slug: "honda-civic",
  },
  {
    name: "Budget Sedan",
    category: "Budget Daily",
    image: "/car-side-view.png",
    price: "Rs 5,500",
    slug: "budget-sedan",
  },
]

export function VehiclesShowcase() {
  return (
    <section className="w-full px-8 py-24 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-[40px] font-medium leading-tight tracking-tight text-[#202020] mb-4"
              style={{ fontFamily: "var(--font-figtree), Figtree" }}
            >
              Featured Vehicles
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-[#666666]"
              style={{ fontFamily: "var(--font-figtree), Figtree" }}
            >
              Popular rentals from verified partners
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Button asChild variant="ghost" className="group">
              <Link href="/vehicles">
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredVehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <Link href={`/vehicles/${vehicle.slug}`} className="group block">
                <div className="bg-[#f5f5f5] rounded-3xl overflow-hidden mb-4 aspect-[4/3] relative">
                  <Image
                    src={vehicle.image || "/placeholder.svg"}
                    alt={vehicle.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="px-2">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3
                        className="text-xl font-semibold text-[#202020] group-hover:text-primary transition-colors"
                        style={{ fontFamily: "var(--font-figtree), Figtree" }}
                      >
                        {vehicle.name}
                      </h3>
                      <p className="text-sm text-[#666666]" style={{ fontFamily: "var(--font-figtree), Figtree" }}>
                        {vehicle.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className="text-lg font-semibold text-primary"
                        style={{ fontFamily: "var(--font-figtree), Figtree" }}
                      >
                        {vehicle.price}
                      </p>
                      <p className="text-xs text-[#666666]" style={{ fontFamily: "var(--font-figtree), Figtree" }}>
                        per day
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
