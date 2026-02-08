"use client"
import type React from "react"
import { SessionProvider } from "next-auth/react"
import { Navigation } from "@/app/(client)/_components/layout/navigation"
import { Footer } from "@/app/(client)/_components/layout/footer"
import { MobileBottomNav } from "@/app/(client)/_components/mobile-bottom-nav"
import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SessionProvider>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="pb-16 md:pb-0">{children}</div>
        <Footer />
        <MobileBottomNav />
        <Toaster position="top-center" richColors />
      </div>
    </SessionProvider>
  )
}
