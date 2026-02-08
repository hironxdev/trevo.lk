"use client";

import { useState } from "react";
import { VehicleList } from "@/app/(client)/vehicles/_components/vehicle-list";
import { VehicleFilters } from "@/app/(client)/vehicles/_components/vehicle-filters";
import { VehicleSearchBar } from "@/app/(client)/vehicles/_components/vehicle-search-bar";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export default function VehiclesPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <main className="flex-1 pt-20">
        <VehicleSearchBar />
        {/* Main Content */}
        <div className="mx-auto container px-4 py-8">
          <div className="flex gap-8">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden lg:block w-80 shrink-0">
              <div className="sticky top-24">
                <VehicleFilters />
              </div>
            </aside>

            {/* Vehicle List */}
            <div className="flex-1 min-w-0">
              <VehicleList onOpenFilters={() => setIsFilterOpen(true)} />
            </div>
          </div>
        </div>

        {/* Mobile Filter Sheet */}
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetContent
            side="left"
            className="w-full sm:max-w-md p-0 overflow-y-auto"
          >
            <VehicleFilters
              onClose={() => setIsFilterOpen(false)}
              className="border-0 shadow-none"
            />
          </SheetContent>
        </Sheet>
      </main>
    </div>
  );
}
