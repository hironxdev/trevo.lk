"use client"

import { motion } from "framer-motion"
import { Car, Crown, Briefcase, Palmtree, Bus, DollarSign } from "lucide-react"
import Link from "next/link"

const categories = [
  {
    name: "Budget Daily",
    slug: "BUDGET_DAILY",
    description: "Affordable vehicles for daily use",
    icon: DollarSign,
  },
  {
    name: "Luxury",
    slug: "LUXURY",
    description: "Premium vehicles for special occasions",
    icon: Crown,
  },
  {
    name: "Mid Range",
    slug: "MID_RANGE",
    description: "Comfortable and reliable vehicles",
    icon: Car,
  },
  {
    name: "Tourism",
    slug: "TOURISM",
    description: "Perfect for exploring Sri Lanka",
    icon: Palmtree,
  },
  {
    name: "Travel",
    slug: "TRAVEL",
    description: "Long-distance comfortable rides",
    icon: Bus,
  },
  {
    name: "Business",
    slug: "BUSINESS",
    description: "Professional vehicles for business",
    icon: Briefcase,
  },
]

export function Categories() {
  return (
    <section className="w-full px-8 py-24 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[40px] font-medium leading-tight tracking-tight text-[#202020] mb-4"
            style={{ fontFamily: "var(--font-figtree), Figtree" }}
          >
            Browse by Category
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-[#666666]"
            style={{ fontFamily: "var(--font-figtree), Figtree" }}
          >
            Find the perfect vehicle for your needs
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={`/vehicles?category=${category.slug}`}
                  className="block bg-[#f5f5f5] rounded-3xl p-8 hover:bg-[#e9e9e9] transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-4 bg-white rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3
                        className="text-xl font-semibold mb-2 text-[#202020]"
                        style={{ fontFamily: "var(--font-figtree), Figtree" }}
                      >
                        {category.name}
                      </h3>
                      <p className="text-base text-[#666666]" style={{ fontFamily: "var(--font-figtree), Figtree" }}>
                        {category.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
