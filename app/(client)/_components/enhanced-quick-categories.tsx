"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Car, Users, Briefcase, Home, Mountain, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const categories = [
  {
    id: "luxury",
    name: "Luxury",
    icon: Sparkles,
    description: "Premium vehicles",
    count: 45,
    gradient: "from-amber-500 to-orange-500",
    href: "/vehicles?category=LUXURY",
  },
  {
    id: "budget",
    name: "Budget",
    icon: Car,
    description: "Affordable options",
    count: 120,
    gradient: "from-green-500 to-emerald-500",
    href: "/vehicles?category=BUDGET_DAILY",
  },
  {
    id: "family",
    name: "Family",
    icon: Users,
    description: "Spacious vans",
    count: 65,
    gradient: "from-blue-500 to-cyan-500",
    href: "/vehicles?type=VAN",
  },
  {
    id: "business",
    name: "Business",
    icon: Briefcase,
    description: "Professional rides",
    count: 80,
    gradient: "from-slate-600 to-slate-800",
    href: "/vehicles?category=BUSINESS",
  },
  {
    id: "tourism",
    name: "Tourism",
    icon: Mountain,
    description: "Explore Sri Lanka",
    count: 95,
    gradient: "from-purple-500 to-pink-500",
    href: "/vehicles?category=TOURISM",
  },
  {
    id: "stays",
    name: "Stays",
    icon: Home,
    description: "Accommodations",
    count: 200,
    gradient: "from-rose-500 to-red-500",
    href: "/stays",
  },
]

export function EnhancedQuickCategories() {
  return (
    <section className="w-full px-4 md:px-8 py-12 md:py-16 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Browse by Category</h2>
          <p className="text-muted-foreground">Find exactly what you're looking for</p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Link
                  href={category.href}
                  className="group block"
                  data-testid={`category-${category.id}`}
                >
                  <div className="relative bg-white rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-xl hover:border-primary/30 transition-all duration-300 overflow-hidden">
                    {/* Gradient Background on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    
                    <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                      {/* Icon */}
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${category.gradient} group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      
                      {/* Content */}
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                          {category.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-2">{category.description}</p>
                        <p className="text-xs font-medium text-primary">{category.count} available</p>
                      </div>
                      
                      {/* Arrow Icon */}
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8"
        >
          <Button asChild variant="outline" size="lg" className="bg-transparent hover:bg-primary hover:text-primary-foreground">
            <Link href="/vehicles">
              View All Listings
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
