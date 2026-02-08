import type { Metadata } from "next"
import { Shield, Car, Heart, CheckCircle, Target, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "About Us | Trevo",
  description:
    "Trevo.lk is Sri Lanka’s all-in-one booking platform for vehicles, stays, events, and local marketplaces.",
}

const stats = [
  { value: "1,000+", label: "Listings Available" },
  { value: "15,000+", label: "Happy Customers" },
  { value: "75+", label: "Cities Covered" },
  { value: "4.8/5", label: "User Rating" },
]

const values = [
  {
    icon: Shield,
    title: "Trust & Security",
    description: "Verified partners, secure payments, and transparent bookings across all services.",
  },
  {
    icon: Heart,
    title: "People First",
    description: "Built for travelers, locals, and partners with fair pricing and real support.",
  },
  {
    icon: Zap,
    title: "One Platform",
    description: "Vehicles, stays, events, and products — all booked in one place.",
  },
  {
    icon: Target,
    title: "Fair & Direct",
    description: "No unnecessary middlemen. Better value for customers and partners.",
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/5 to-background py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-6">
                About Trevo.lk
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Sri Lanka&apos;s <span className="text-primary">All-in-One Booking Platform</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Trevo.lk connects people with vehicles, stays, events, and products through one powerful and simple
                platform.
              </p>
              <p className="text-base text-muted-foreground mb-8">
                විශ්වාසයෙන් වෙන්කරගන්න – Travel • Stay • Book • Buy
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="rounded-full">
                  <Link href="/explore">Explore Trevo</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full bg-transparent">
                  <Link href="/partner/register">Become a Partner</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
                <Image
                  src="/sri-lanka-scenic-road-with-car.jpg"
                  alt="Trevo bookings"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-background rounded-xl shadow-lg p-4 border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Car className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">1,000+</p>
                    <p className="text-sm text-muted-foreground">Active Listings</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background border-y">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            One Platform. Endless Possibilities.
          </h2>
          <p className="text-primary-foreground/80 mb-8 text-lg">
            Book smarter. Sell easier. Grow faster with Trevo.lk
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="secondary" className="rounded-full">
              <Link href="/explore">Start Exploring</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Link href="/partner/register">List with Trevo</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
                  }
