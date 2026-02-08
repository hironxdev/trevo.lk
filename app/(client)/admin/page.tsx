import type { Metadata } from "next"
import { Suspense } from "react"
import dynamic from "next/dynamic"

import { EnhancedQuickCategories } from "@/app/(client)/_components/enhanced-quick-categories"
import { PopularVehicles } from "@/app/(client)/_components/popular-vehicles"
import { PopularStays } from "@/app/(client)/_components/popular-stays"
import { Features } from "@/app/(client)/_components/features"
import { EnhancedTestimonials } from "@/app/(client)/_components/enhanced-testimonials"
import { VehicleGridSkeleton } from "@/app/(client)/_components/vehicle-grid-skeleton"

// ✅ Client-only to avoid Radix hydration mismatch (Tabs/Popover/Select IDs)
const HeroSearch = dynamic(
  () => import("@/app/(client)/_components/hero-search").then((m) => m.HeroSearch),
  {
    ssr: false,
    loading: () => (
      <section className="relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="relative px-4 md:px-8 pt-8 pb-12 md:pt-12 md:pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="h-[260px] rounded-2xl bg-muted/40 animate-pulse" />
          </div>
        </div>
      </section>
    ),
  }
)

export const metadata: Metadata = {
  title: {
    default: "Trevo.lk | Book Vehicles, Stays & Experiences in Sri Lanka",
    template: "%s | Trevo.lk",
  },
  description:
    "Trevo.lk is an all-in-one booking platform in Sri Lanka. Compare and book vehicles, stays, and experiences with trusted local partners.",
  alternates: {
    canonical: "https://trevo.lk/",
  },
  openGraph: {
    type: "website",
    url: "https://trevo.lk/",
    title: "Trevo.lk | Book Vehicles, Stays & Experiences in Sri Lanka",
    description:
      "Compare and book vehicles, stays, and experiences in Sri Lanka with trusted local partners.",
    siteName: "Trevo.lk",
    images: [
      {
        url: "https://trevo.lk/og/home.jpg",
        width: 1200,
        height: 630,
        alt: "Trevo.lk booking platform",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Trevo.lk",
    url: "https://trevo.lk/",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://trevo.lk/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <main className="pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HeroSearch />
      <EnhancedQuickCategories />

      <section aria-label="Popular vehicles" className="mt-10">
        <Suspense fallback={<VehicleGridSkeleton />}>
          <PopularVehicles />
        </Suspense>
      </section>

      <section aria-label="Popular stays" className="mt-10">
        <Suspense fallback={<VehicleGridSkeleton />}>
          <PopularStays />
        </Suspense>
      </section>

      <section aria-label="Platform features" className="mt-10">
        <Features />
      </section>

      <section aria-label="Customer testimonials" className="mt-10">
        <EnhancedTestimonials />
      </section>
    </main>
  )
}
