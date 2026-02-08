"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, SlidersHorizontal } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// ✅ IMPORTANT: make sure this import path is correct in your project
import { EventsFilters } from "./_components/events-filters"


function EventsSearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")

  const onChange = (value: string) => {
    setSearch(value)

    const params = new URLSearchParams(searchParams.toString())
    if (value.trim()) params.set("search", value)
    else params.delete("search")

    router.push(`/events?${params.toString()}`)
  }

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
      <Input
        value={search}
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
      {/* Top bar */}
      <div className="flex items-center gap-2">
        <EventsSearchBar />

        {/* Mobile filter button (UI only for now) */}
        <Button variant="outline" className="h-12 px-3 md:hidden" type="button">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Desktop layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="hidden md:block md:col-span-1">
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
