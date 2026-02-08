"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Car, Crown, DollarSign, Palmtree, Bus, Briefcase, User, Sparkles, Bike, Truck } from "lucide-react"
import { cn } from "@/lib/utils"

const quickLinks = [
  {
    name: "Budget",
    slug: "BUDGET_DAILY",
    icon: DollarSign,
    gradient: "from-green-400 to-emerald-600",
    shadowColor: "shadow-green-500/25",
  },
  {
    name: "Luxury",
    slug: "LUXURY",
    icon: Crown,
    gradient: "from-amber-400 to-orange-600",
    shadowColor: "shadow-amber-500/25",
  },
  {
    name: "Mid Range",
    slug: "MID_RANGE",
    icon: Car,
    gradient: "from-blue-400 to-indigo-600",
    shadowColor: "shadow-blue-500/25",
  },
  {
    name: "Tourism",
    slug: "TOURISM",
    icon: Palmtree,
    gradient: "from-emerald-400 to-teal-600",
    shadowColor: "shadow-emerald-500/25",
  },
  {
    name: "Travel",
    slug: "TRAVEL",
    icon: Bus,
    gradient: "from-purple-400 to-violet-600",
    shadowColor: "shadow-purple-500/25",
  },
  {
    name: "Business",
    slug: "BUSINESS",
    icon: Briefcase,
    gradient: "from-slate-400 to-slate-700",
    shadowColor: "shadow-slate-500/25",
  },
  {
    name: "With Driver",
    slug: "WITH_DRIVER",
    icon: User,
    gradient: "from-cyan-400 to-blue-600",
    shadowColor: "shadow-cyan-500/25",
    special: true,
  },
  {
    name: "Self Drive",
    slug: "SELF_DRIVE",
    icon: Sparkles,
    gradient: "from-pink-400 to-rose-600",
    shadowColor: "shadow-pink-500/25",
    special: true,
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function QuickCategoryLinks() {
  return (
    <section className="w-full px-4 md:px-8 py-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h2 className="text-lg md:text-xl font-semibold text-foreground">Browse by Category</h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4"
        >
          {quickLinks.map((link) => {
            const Icon = link.icon
            const href = link.special
              ? `/vehicles?withDriver=${link.slug === "WITH_DRIVER" ? "true" : "false"}`
              : `/vehicles?category=${link.slug}`

            return (
              <motion.div key={link.slug} variants={item}>
                <Link
                  href={href}
                  className="group flex flex-col items-center justify-center gap-2 p-3 md:p-4 rounded-2xl transition-all duration-300 hover:bg-muted/50"
                >
                  <div
                    className={cn(
                      "w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center",
                      "bg-gradient-to-br shadow-lg transform transition-all duration-300",
                      "group-hover:scale-110 group-hover:shadow-xl",
                      link.gradient,
                      link.shadowColor,
                    )}
                  >
                    <Icon className="h-6 w-6 md:h-7 md:w-7 text-white" />
                  </div>
                  <span className="text-xs md:text-sm font-medium text-center text-muted-foreground group-hover:text-foreground transition-colors">
                    {link.name}
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
