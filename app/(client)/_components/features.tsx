"use client"

import { motion } from "framer-motion"
import { Shield, Clock, DollarSign, HeadphonesIcon, CheckCircle, Users, Sparkles, MapPin } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Verified Partners",
    description: "All vehicle owners and property hosts are verified through our KYC process",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: CheckCircle,
    title: "Quality Assured",
    description: "Every listing is inspected and approved by our quality team",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: DollarSign,
    title: "Best Prices",
    description: "Competitive rates with transparent pricing, no hidden fees",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Book vehicles and stays anytime, anywhere across Sri Lanka",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: HeadphonesIcon,
    title: "Dedicated Support",
    description: "Our customer support team is always ready to assist you",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    icon: Users,
    title: "Trusted Community",
    description: "Join thousands of satisfied customers and partners",
    color: "text-pink-600",
    bg: "bg-pink-50",
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function Features() {
  return (
    <section className="w-full px-4 md:px-8 py-16 md:py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Why Trevo?
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the best in vehicle and property rentals with our commitment to quality and service
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                variants={item}
                className="group relative"
              >
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-border/50 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 h-full">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${feature.bg} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-7 w-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
