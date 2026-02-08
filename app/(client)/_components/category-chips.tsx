"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Car, Crown, Briefcase, Palmtree, Bus, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRef, useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const categories = [
  {
    name: "Budget Daily",
    slug: "BUDGET_DAILY",
    description: "Affordable vehicles for daily use",
    icon: DollarSign,
  },
  {
    name: "Luxury",
    slug: "LUXURY",
    description: "Premium vehicles for special occasions",
    icon: Crown,
  },
  {
    name: "Mid Range",
    slug: "MID_RANGE",
    description: "Comfortable and reliable vehicles",
    icon: Car,
  },
  {
    name: "Tourism",
    slug: "TOURISM",
    description: "Perfect for exploring Sri Lanka",
    icon: Palmtree,
  },
  {
    name: "Travel",
    slug: "TRAVEL",
    description: "Long-distance comfortable rides",
    icon: Bus,
  },
  {
    name: "Business",
    slug: "BUSINESS",
    description: "Professional vehicles for business",
    icon: Briefcase,
  },
]

export function CategoryChips() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedCategory = searchParams.get("category")
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener("resize", checkScroll)
    return () => window.removeEventListener("resize", checkScroll)
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const handleCategoryClick = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (selectedCategory === slug) {
      params.delete("category")
    } else {
      params.set("category", slug)
    }
    router.push(`/?${params.toString()}`)
  }

  return (
    <section className="w-full px-4 md:px-8 py-4 bg-background">
      <div className="max-w-7xl mx-auto relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm shadow-md rounded-full hidden md:flex"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        {/* Scrollable Container */}
        <div ref={scrollRef} className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 px-1" onScroll={checkScroll}>
          {categories.map((category) => {
            const Icon = category.icon
            const isSelected = selectedCategory === category.slug

            return (
              <button
                key={category.slug}
                onClick={() => handleCategoryClick(category.slug)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl border transition-all shrink-0",
                  "hover:border-primary/50 hover:bg-accent/50",
                  isSelected ? "border-primary bg-primary/5 text-primary" : "border-border bg-card",
                )}
              >
                <div className={cn("p-2 rounded-lg", isSelected ? "bg-primary/10" : "bg-muted")}>
                  <Icon className={cn("h-5 w-5", isSelected ? "text-primary" : "text-muted-foreground")} />
                </div>
                <div className="text-left">
                  <p className={cn("font-medium text-sm", isSelected ? "text-primary" : "text-foreground")}>
                    {category.name}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{category.description}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm shadow-md rounded-full hidden md:flex"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </section>
  )
}
