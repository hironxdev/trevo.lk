import { getPopularStays } from "@/actions/stays/list";
import { StaysCard } from "@/app/(client)/stays/_components/stays-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";

export async function PopularStays() {
  const result = await getPopularStays();

  if (!result.success || !result.data || result.data.data.length === 0) {
    return null;
  }

  return (
    <section className="py-12 px-4 md:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Home className="h-5 w-5 text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold">Popular Stays</h2>
            </div>
            <p className="text-muted-foreground">
              Discover amazing properties for your next getaway
            </p>
          </div>
          <Button asChild variant="outline" className="bg-transparent">
            <Link href="/stays">
              View All Stays
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {result.data.data.slice(0, 4).map((stays) => (
            <StaysCard key={stays.id} stays={stays} />
          ))}
        </div>
      </div>
    </section>
  );
}
