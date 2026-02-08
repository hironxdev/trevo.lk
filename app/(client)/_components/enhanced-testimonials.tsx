"use client"

import { motion } from "framer-motion"
import { Star, Quote, ThumbsUp, Heart } from "lucide-react"
// import Image from "next/image"  // no profile pics now
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const testimonials = [
  {
    id: 1,
    name: "Kamal Perera",
    role: "Business Traveler",
    location: "Colombo",
    rating: 5,
    text: "මගේ ව්‍යාපාරික ගමනට Trevo එකෙන් ලගත් සේවාව සාර්ථකමයි! Driver ද ඉතාම වෘත්තීයමයයි. ඔන්න Trevo එක මගෙන් ගොඩාක් නිර්දේශයි!",
    verified: true,

  },
  {
    id: 2,
    name: "Sarah Fernando",
    role: "Family Vacation",
    location: "Kandy",
    rating: 5,
    text: "Perfect for our family vacation! Rented a comfortable van for a week. Great value for money and the booking process was seamless.",
    verified: true,
 
  },
  {
    id: 3,
    name: "Nimal Silva",
    role: "Tourist Guide",
    location: "Galle",
    rating: 5,
    text: "මම travel guide කෙනෙක් විදියට Trevo එක අතිගරු වසරක අත්දැකීමක් තියෙනවා. විශ්වසනීය සහකරුන්, වාහන සෑමදාම හොඳින් නඩත්තු කරන ලද්දක්, මිල ගණන් පැහැදිලියි. හරිම අගයක්!",
    verified: true,

  },
  {
    id: 4,
    name: "Amanda De Silva",
    role: "Weekend Getaway",
    location: "Ella",
    rating: 5,
    text: "Booked a villa in Ella for the weekend. Stunning property, great amenities, and the host was incredibly helpful. Will definitely book again!",
    verified: true,

  },
  {
    id: 5,
    name: "Rajitha Kumar",
    role: "Long-term Rental",
    location: "Negombo",
    rating: 5,
    text: "Rented a car for 6 months. The monthly rates are unbeatable and the vehicle is in excellent condition. Customer service is top-notch!",
    verified: true,
  
  },
  {
    id: 6,
    name: "Priya Wickramasinghe",
    role: "Wedding Event",
    location: "Colombo",
    rating: 5,
    text: "අපේ wedding එකට Trevo එකෙන් සුපිරි car රථයක් වෙන්කර ගත්තෙමු. වෙන්කිරීමේදීවත්, රථ ලබාදීලා යද්දීවත්. මේක අපේ දිනය තවමත් මතක ඇතුව තියෙනවා!",
    verified: true,
 
  },
]

export function EnhancedTestimonials() {
  return (
    <section className="w-full px-4 md:px-8 py-16 md:py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-primary to-accent text-white border-0 mb-4">
            <Heart className="h-4 w-4 mr-2" />
            Customer Love
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Trevo for their rental needs
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 bg-white relative overflow-hidden group">
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Quote className="h-16 w-16 text-primary" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-foreground mb-6 leading-relaxed relative z-10">
                  "{testimonial.text}"
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  {/* Removed Avatar */}
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-[10px] px-2 py-0">
                        {testimonial.location}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {testimonial.bookings} {testimonial.bookings === 1 ? 'booking' : 'bookings'}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg border border-border/50">
            {/* Removed Avatars from Stats Footer */}
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">1000+ Happy Customers</p>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="text-xs text-muted-foreground">4.8 average rating from 500+ reviews</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
