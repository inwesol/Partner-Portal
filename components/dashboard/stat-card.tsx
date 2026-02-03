"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: number
  icon: LucideIcon
  iconClassName?: string
  className?: string
}

export function StatCard({
  title,
  value,
  icon: Icon,
  iconClassName,
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-xl border shadow-sm transition-colors hover:shadow-md bg-gradient-to-l from-white/30 to-transparent",
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
          </div>
          <div className={cn("rounded-lg p-2", iconClassName)}>
            <Icon className="h-10 w-10" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
