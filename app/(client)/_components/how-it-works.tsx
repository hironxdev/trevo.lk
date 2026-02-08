import { Card } from "@/components/ui/card"
import { Search, Calendar, Key, ThumbsUp } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Browse Vehicles",
    description: "Search through our extensive collection of verified vehicles",
  },
  {
    icon: Calendar,
    title: "Book Your Ride",
    description: "Select your dates and confirm your booking instantly",
  },
  {
    icon: Key,
    title: "Pick Up",
    description: "Meet the owner and collect your vehicle at the agreed location",
  },
  {
    icon: ThumbsUp,
    title: "Enjoy Your Journey",
    description: "Hit the road and enjoy your safe and comfortable ride",
  },
]

export function HowItWorks() {
  return (
    <section className="py-16">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground">Get on the road in just 4 simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <Card key={index} className="p-6 text-center relative">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
