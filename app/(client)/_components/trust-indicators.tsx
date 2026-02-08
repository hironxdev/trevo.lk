"use client"

import { motion } from "framer-motion"
import { Users, Car, Home, Shield, Star, Award } from "lucide-react"

const stats = [
  {
    icon: Car,
    value: "500+",
    label: "Vehicles Listed",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Home,
    value: "200+",
    label: "Properties",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Users,
    value: "50,000+",
    label: "Happy Customers",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: Shield,
    value: "100%",
    label: "Verified Partners",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
]

const trustBadges = [
  { icon: Shield, text: "Secure Payments" },
  { icon: Star, text: "4.8 Average Rating" },
  { icon: Award, text: "Best Price Guarantee" },
]

export function TrustIndicators() {
  return (
    <section className="w-full px-4 md:px-8 py-12 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-border/50 hover:shadow-md hover:border-primary/20 transition-all duration-300">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${stat.bg} mb-4`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 md:gap-8"
        >
          {trustBadges.map((badge, index) => {
            const Icon = badge.icon
            return (
              <div
                key={index}
                className="flex items-center gap-2 text-muted-foreground"
              >
                <div className="p-1.5 rounded-full bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium">{badge.text}</span>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
