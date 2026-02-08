"use client"

import { useState } from "react"
import { EventsList } from "@/app/(client)/events/_components/events-list"
import { EventsFilters } from "@/app/(client)/events/_components/events-filters"
import { Sheet, SheetContent } from "@/components/ui/sheet"

export default function EventsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold mb-2">Discover Events</h1>
            <p className="text-blue-100">Find and book tickets to amazing events happening in Sri Lanka</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto container px-4 py-8">
          <div className="flex gap-8">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden lg:block w-80 shrink-0">
              <div className="sticky top-24">
                <EventsFilters />
              </div>
            </aside>

            {/* Events List */}
            <div className="flex-1 min-w-0">
              <EventsList onOpenFilters={() => setIsFilterOpen(true)} />
            </div>
          </div>
        </div>

        {/* Mobile Filter Sheet */}
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetContent
            side="left"
            className="w-full sm:max-w-md p-0 overflow-y-auto"
          >
            <EventsFilters
              onClose={() => setIsFilterOpen(false)}
              className="border-0 shadow-none"
            />
          </SheetContent>
        </Sheet>
      </main>
    </div>
  )
}
