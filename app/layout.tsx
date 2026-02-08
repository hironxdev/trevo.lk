import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Figtree, Inter } from "next/font/google"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  weight: ["400", "500", "600", "800"],
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://trevo.lk"),

  title: "Trevo.lk – Sri Lanka’s Trusted All-in-One Booking Platform | Vehicles, Stays & Services",
  description:
    "Trevo.lk is Sri Lanka’s trusted all-in-one booking platform. Book vehicles, stays, services, and experiences from verified partners. Commission-free, safe, and easy bookings across Sri Lanka.",

  applicationName: "Trevo",
  authors: [{ name: "Trevo", url: "https://trevo.lk" }],
  creator: "Crysolabs",
  publisher: "Trevo.lk",

  icons: {
    icon: [
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    apple: "/apple-touch-icon.png",
  },

  manifest: "/site.webmanifest",

  openGraph: {
    type: "website",
    url: "https://trevo.lk",
    title: "Trevo.lk – Sri Lanka’s Trusted All-in-One Booking Platform",
    description:
      "Book vehicles, stays, services, and experiences from trusted partners across Sri Lanka.",
    siteName: "Trevo.lk",
    locale: "en_LK",
  },

  twitter: {
    card: "summary_large_image",
    title: "Trevo.lk – All-in-One Booking Platform",
    description:
      "Sri Lanka’s trusted platform to book vehicles, stays, services & experiences.",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${figtree.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-sans antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
