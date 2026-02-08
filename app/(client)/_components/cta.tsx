"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Car, Home, Sparkles, CheckCircle } from "lucide-react"

const benefits = [
  "No booking fees",
  "24/7 customer support",
  "Verified partners only",
  "Best price guarantee",
]

export function CTA() {
  return (
    <section className="w-full px-4 md:px-8 py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/80">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="relative z-10 px-6 py-12 md:px-16 md:py-20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium mb-6">
                  <Sparkles className="h-4 w-4" />
                  Start Your Journey Today
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                  Ready to Explore Sri Lanka?
                </h2>
                <p className="text-white/80 text-lg mb-6 max-w-lg">
                  Whether you need a vehicle for your adventure or a cozy place to stay, 
                  Trevo connects you with verified partners for the best experience.
                </p>

                {/* Benefits */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 text-white/90">
                      <CheckCircle className="h-5 w-5 text-white/80" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 shadow-xl shadow-black/20 h-12 px-8"
                  >
                    <Link href="/vehicles">
                      <Car className="h-5 w-5 mr-2" />
                      Browse Vehicles
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-white/30 text-white hover:bg-white/10 h-12 px-8"
                  >
                    <Link href="/stays">
                      <Home className="h-5 w-5 mr-2" />
                      Find Stays
                    </Link>
                  </Button>
                </div>
              </motion.div>

              {/* Right Content - Partner CTA */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="hidden md:block"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Own a Vehicle or Property?
                  </h3>
                  <p className="text-white/80 mb-6">
                    Join our growing network of partners and start earning. 
                    List your vehicles or properties with Sri Lanka's most trusted rental platform.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-3 text-white/90">
                      <CheckCircle className="h-5 w-5 text-emerald-300" />
                      Free to register
                    </li>
                    <li className="flex items-center gap-3 text-white/90">
                      <CheckCircle className="h-5 w-5 text-emerald-300" />
                      Set your own prices
                    </li>
                    <li className="flex items-center gap-3 text-white/90">
                      <CheckCircle className="h-5 w-5 text-emerald-300" />
                      Access to verified customers
                    </li>
                  </ul>
                  <Button
                    asChild
                    size="lg"
                    className="w-full bg-white text-primary hover:bg-white/90 h-12"
                  >
                    <Link href="/partner/register">
                      Become a Partner
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Mobile Partner CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 md:hidden"
        >
          <div className="bg-muted/50 rounded-2xl p-6 text-center">
            <h3 className="text-xl font-bold text-foreground mb-2">
              Become a Partner
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              List your vehicles or properties and start earning
            </p>
            <Button asChild className="w-full">
              <Link href="/partner/register">
                Register Now
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
