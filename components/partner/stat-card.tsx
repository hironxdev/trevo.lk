import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  href?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  iconColor?: string
  className?: string
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  href,
  trend,
  iconColor = "text-primary",
  className,
}: StatCardProps) {
  const content = (
    <Card className={cn("transition-all", href && "hover:border-primary/50 cursor-pointer hover:shadow-md", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
            {trend && (
              <p className={cn("text-xs mt-1 font-medium", trend.isPositive ? "text-green-600" : "text-red-600")}>
                {trend.isPositive ? "+" : ""}
                {trend.value}% from last month
              </p>
            )}
          </div>
          <div className={cn("h-10 w-10 rounded-lg bg-muted flex items-center justify-center", iconColor)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}
