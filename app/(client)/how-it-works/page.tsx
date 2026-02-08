import type { Metadata } from "next"
import Script from "next/script"
import {
  Search,
  Calendar,
  CreditCard,
  Car,
  Shield,
  CheckCircle,
  Users,
  Clock,
  MapPin,
  Star,
  ArrowRight,
  Phone,
  Home,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "How It Works | Trevo.lk",
  description:
    "Learn how Trevo.lk works — book vehicles, stays, and experiences in Sri Lanka. Simple steps for customers and partners.",
  alternates: {
    canonical: "https://trevo.lk/how-it-works",
  },
  openGraph: {
    title: "How It Works | Trevo.lk",
    description:
      "Book vehicles, stays, and experiences in Sri Lanka. See how Trevo.lk works for customers and partners.",
    url: "https://trevo.lk/how-it-works",
    siteName: "Trevo.lk",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How It Works | Trevo.lk",
    description:
      "Book vehicles, stays, and experiences in Sri Lanka. Simple steps for customers and partners.",
  },
}

const customerSteps = [
  {
    step: 1,
    icon: Search,
    title: "Search & Browse",
    description: "Choose what you need (vehicles, stays, or experiences), then filter by location, dates, and budget.",
  },
  {
    step: 2,
    icon: Calendar,
    title: "Send a Booking Request",
    description: "Pick your dates and options (like with/without driver for vehicles) and submit your request.",
  },
  {
    step: 3,
    icon: CreditCard,
    title: "Confirm & Pay Securely",
    description: "After confirmation, complete payment securely through the platform (as per the provider’s terms).",
  },
  {
    step: 4,
    icon: Sparkles,
    title: "Enjoy & Review",
    description: "Use the service, then leave a review to help the community choose confidently.",
  },
]

const partnerSteps = [
  {
    step: 1,
    icon: Users,
    title: "Register as Individual or Business",
    description:
      "Click Become a Partner and register as an Individual or Business partner. Complete the verification details.",
  },
  {
    step: 2,
    icon: Car,
    title: "Add Your Services",
    description:
      "List what you offer — vehicles, stays, and/or experiences. Add photos, pricing, availability, and key details.",
  },
  {
    step: 3,
    icon: Clock,
    title: "Receive & Manage Bookings",
    description: "Get booking requests, respond quickly, and confirm only the bookings that work for you.",
  },
  {
    step: 4,
    icon: CreditCard,
    title: "Get Paid",
    description:
      "Receive payments based on the agreed terms and booking policy. Track everything from your partner dashboard.",
  },
]

const features = [
  {
    icon: Shield,
    title: "Verified Users",
    description: "Customer and partner verification helps keep the marketplace safer",
  },
  {
    icon: Star,
    title: "Ratings & Reviews",
    description: "Transparent feedback helps everyone make better choices",
  },
  {
    icon: Phone,
    title: "Support",
    description: "Need help? Our team is here to assist",
  },
  {
    icon: MapPin,
    title: "Island-wide Coverage",
    description: "Find vehicles, stays, and experiences across Sri Lanka",
  },
]

const faqs = [
  {
    question: "What do I need to book a vehicle?",
    answer:
      "Typically you’ll need a valid driving license (Sri Lankan or International), a government-issued ID, and a payment method. Requirements may vary by vehicle/provider.",
  },
  {
    question: "Can I book with a driver?",
    answer:
      "Yes. Many vehicle listings support a ‘With Driver’ option. You can select it during booking if available.",
  },
  {
    question: "How do payments work?",
    answer:
      "Payments are processed securely through the platform. Payment terms (deposit/remaining amount) can vary by provider — check the listing or booking details.",
  },
  {
    question: "Do you offer stays and experiences too?",
    answer:
      "Yes. Trevo.lk supports booking vehicles, stays, and experiences — you can browse by category and book in a similar flow.",
  },
  {
    question: "What if I need to cancel?",
    answer:
      "Cancellation policies can vary by provider. Always review the policy shown on the listing/booking before confirming.",
  },
]

export default function HowItWorksPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  }

  return (
    <main className="min-h-screen pt-20">
      <Script id="faq-schema" type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </Script>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/5 to-background py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-6">
            How It Works
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight max-w-4xl mx-auto">
            Book in <span className="text-primary">4 Simple Steps</span> — Vehicles, Stays & Experiences
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Whether you&apos;re booking your next trip or becoming a partner, Trevo.lk keeps it simple, secure, and
            hassle-free.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/vehicles">
                Start Browsing <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full bg-transparent">
              <Link href="/partner/register">Become a Partner</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* For Customers Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">For Customers</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find and book vehicles, stays, and experiences in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {customerSteps.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-muted/30 rounded-2xl p-6 h-full border hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                      {item.step}
                    </div>
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>

                {index < customerSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/vehicles">
                Browse Now <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* For Partners Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">For Partners</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Register as an Individual or Business partner and list vehicles, stays, and experiences
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {partnerSteps.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-background rounded-2xl p-6 h-full border hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                      {item.step}
                    </div>
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>

                {index < partnerSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/partner/register">
                Register as Partner <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Trevo.lk?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built for safety, trust, and smooth bookings across Sri Lanka
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Quick category links */}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button asChild variant="outline" className="rounded-full bg-transparent">
                          <Link href="/contact">Contact Our Support Team</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Ready to Hit the Road?</h2>
          <p className="text-primary-foreground/80 mb-8 text-lg">
            Join Trevo today and experience hassle-free vehicle rental in Sri Lanka.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="secondary" className="rounded-full">
              <Link href="/vehicles">Browse Vehicles</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Link href="/auth/sign-up">Create Account</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}

