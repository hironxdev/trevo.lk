"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { Users, Car, Home, Shield, Star, Award, CheckCircle, TrendingUp } from "lucide-react"

const stats = [
  {
    icon: Car,
    value: 500,
    suffix: "+",
    label: "Vehicles Available",
    color: "text-blue-600",
    bg: "bg-blue-50",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Home,
    value: 200,
    suffix: "+",
    label: "Properties Listed",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Users,
    value: 50000,
    suffix: "+",
    label: "Happy Customers",
    color: "text-purple-600",
    bg: "bg-purple-50",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Shield,
    value: 100,
    suffix: "%",
    label: "Verified Partners",
    color: "text-amber-600",
    bg: "bg-amber-50",
    gradient: "from-amber-500 to-orange-500",
  },
]

const trustBadges = [
  { icon: Shield, text: "Secure Payments", description: "SSL encrypted" },
  { icon: CheckCircle, text: "Verified Partners", description: "100% checked" },
  { icon: Star, text: "4.8 Rating", description: "From 2K+ reviews" },
  { icon: Award, text: "Best Price", description: "Guaranteed" },
]

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const duration = 2000
      const steps = 60
      const increment = value / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }
  }, [isInView, value])

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  )
}

export function EnhancedTrustIndicators() {
  return (
    <section className="w-full px-4 md:px-8 py-16 md:py-20 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(var(--primary) / 0.15) 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Trusted by Thousands
            <span className="block text-primary mt-2">Across Sri Lanka</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join our growing community of satisfied customers and verified partners
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="relative group"
              >
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-border/50 hover:shadow-xl hover:border-primary/30 transition-all duration-300 relative overflow-hidden">
                  {/* Hover Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  <div className="relative z-10">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${stat.bg} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-7 w-7 ${stat.color}`} />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-sm md:text-base text-muted-foreground font-medium">
                      {stat.label}
                    </div>
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
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-border/50"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Why Choose Trevo?</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {trustBadges.map((badge, index) => {
              const Icon = badge.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="flex flex-col items-center text-center gap-3 p-4 rounded-xl hover:bg-muted/50 transition-colors duration-200"
                >
                  <div className="p-3 rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">{badge.text}</p>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
