"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"

type DataPoint = {
  id: number
  left: number
  top: number
  height: number
  direction: "up" | "down"
  delay: number
}

const generateDataPoints = (): DataPoint[] => {
  const points: DataPoint[] = []
  const baseLeft = 1
  const spacing = 32
  for (let i = 0; i < 50; i++) {
    const direction = i % 2 === 0 ? "down" : "up"
    const height = Math.floor(Math.random() * 120) + 88
    const top = direction === "down" ? Math.random() * 150 + 250 : Math.random() * 100 - 80
    points.push({
      id: i,
      left: baseLeft + i * spacing,
      top,
      height,
      direction,
      delay: i * 0.035,
    })
  }
  return points
}

export function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  const [dataPoints] = useState<DataPoint[]>(generateDataPoints())
  const [typingComplete, setTypingComplete] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const timer = setTimeout(() => setTypingComplete(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="w-full overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-8 py-24 pt-16">
        <div className="grid grid-cols-12 gap-5 gap-y-16">
          <div className="col-span-12 md:col-span-6 relative z-10">
            <div
              className="relative h-6 inline-flex items-center font-mono uppercase text-xs text-primary mb-12 px-2"
              style={{
                fontFamily: "var(--font-geist-mono), 'Geist Mono', ui-monospace, monospace",
              }}
            >
              <div className="flex items-center gap-0.5 overflow-hidden">
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: "auto" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="block whitespace-nowrap overflow-hidden text-primary relative z-10"
                >
                  Commission-free Platform
                </motion.span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: typingComplete ? [1, 0, 1, 0] : 0 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="block w-1.5 h-3 bg-primary ml-0.5 relative z-10 rounded-sm"
                />
              </div>
            </div>

            <h2
              className="text-[40px] font-normal leading-tight tracking-tight text-[#111A4A] mb-6"
              style={{
                fontFamily: "var(--font-figtree), Figtree",
                fontSize: "40px",
                fontWeight: "400",
              }}
            >
              විශ්වසනීය ගමනකට{" "}
              <span className="opacity-40" style={{ fontWeight: "400", fontSize: "40px" }}>
                Find your perfect ride across Sri Lanka with trusted partners.
              </span>
            </h2>

            <p
              className="text-lg leading-6 text-[#111A4A] opacity-60 mt-0 mb-6"
              style={{ fontFamily: "var(--font-figtree), Figtree" }}
            >
              verified partners. Safe, affordable, and convenient
               rental platform for all your travel needs in Sri Lanka.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mt-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input type="search" placeholder="Search by location, make, or model..." className="pl-10 h-12" />
              </div>
              <Button asChild size="lg" className="h-12 bg-primary hover:bg-primary/90">
                <Link href="/vehicles">Browse Vehicles</Link>
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden"
              >
                <Image src="/toyota-corolla-front.jpg" alt="Toyota Corolla" fill className="object-cover" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden"
              >
                <Image src="/car-front.png" alt="Rental Vehicle" fill className="object-cover" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden"
              >
                <Image src="/honda-civic.jpg" alt="Honda Civic" fill className="object-cover" />
              </motion.div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6">
            <div className="relative w-full h-[416px] -ml-[200px]">
              <div className="absolute top-0 left-[302px] w-[680px] h-[416px] pointer-events-none">
                <div className="relative w-full h-full">
                  {dataPoints.map((point) => (
                    <motion.div
                      key={point.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={
                        isVisible
                          ? {
                              opacity: [0, 1, 1],
                              height: [0, point.height, point.height],
                            }
                          : {}
                      }
                      transition={{
                        duration: 2,
                        delay: point.delay,
                        ease: [0.5, 0, 0.01, 1],
                      }}
                      className="absolute w-1.5 rounded-[3px]"
                      style={{
                        left: `${point.left}px`,
                        top: `${point.top}px`,
                        background:
                          point.direction === "down"
                            ? "linear-gradient(rgb(21, 109, 149) 0%, rgb(21, 109, 149) 10%, rgba(21, 109, 149, 0.1) 40%, rgba(21, 109, 149, 0) 75%)"
                            : "linear-gradient(to top, rgb(21, 109, 149) 0%, rgb(21, 109, 149) 10%, rgba(21, 109, 149, 0.1) 40%, rgba(21, 109, 149, 0) 75%)",
                      }}
                    >
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={isVisible ? { opacity: [0, 1] } : {}}
                        transition={{ duration: 0.3, delay: point.delay + 1.7 }}
                        className="absolute -left-[1px] w-2 h-2 bg-primary rounded-full"
                        style={{
                          top: point.direction === "down" ? "0px" : `${point.height - 8}px`,
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
