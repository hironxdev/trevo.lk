"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"

// ✅ Make sure this path is correct for YOUR project
import { EventsFilters } from "./_components/events-filters"

function EventsSearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // ✅ hydration-safe: start empty, sync after mount
  const [value, setValue] = useState("")

  useEffect(() => {
    setValue(searchParams.get("search") || "")
  }, [searchParams])

  const onChange = (next: string) => {
    setValue(next)

    const params = new URLSearchParams(searchParams.toString())
    const trimmed = next.trim()

    if (trimmed) params.set("search", trimmed)
    else params.delete("search")

    router.push(`/events?${params.toString()}`)
  }

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search events, venues..."
        className="pl-10 h-12 rounded-xl"
      />
    </div>
  )
}

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Top search */}
      <div className="flex items-center gap-2">
        <EventsSearchBar />
      </div>

      {/* ✅ IMPORTANT:
          - On mobile: EventsFilters shows its OWN “Filters” button + drawer
          - On desktop: it shows the sidebar card
      */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Mobile: show filter trigger button here + Desktop: sidebar */}
        <aside className="md:col-span-1">
          <EventsFilters />
        </aside>

        <main className="md:col-span-3">
          <div className="rounded-xl border p-6 text-muted-foreground">
            {/* Replace this with your event cards list */}
            Events list will render here…
          </div>
        </main>
      </div>
    </div>
  )
}
