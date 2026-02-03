"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Stage } from "@/lib/types/student"

const stageStyles: Record<Stage, string> = {
  Registered: "bg-gray-100 text-gray-700 border-gray-200",
  "Preliminary Call": "bg-blue-100 text-blue-800 border-blue-200",
  "In Coaching - Session 2": "bg-violet-100 text-violet-800 border-violet-200",
  "In Coaching - Session 3": "bg-violet-100 text-violet-800 border-violet-200",
  "In Coaching - Session 4": "bg-violet-100 text-violet-800 border-violet-200",
  "In Coaching - Session 5": "bg-violet-100 text-violet-800 border-violet-200",
  "In Coaching - Session 6": "bg-violet-100 text-violet-800 border-violet-200",
  "In Coaching - Session 7": "bg-violet-100 text-violet-800 border-violet-200",
  "In Coaching - Session 8": "bg-violet-100 text-violet-800 border-violet-200",
  "In Coaching - Session 9": "bg-violet-100 text-violet-800 border-violet-200",
  Completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
}

interface StageBadgeProps {
  stage: Stage
  className?: string
}

export function StageBadge({ stage, className }: StageBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border",
        stageStyles[stage],
        className
      )}
    >
      {stage}
    </Badge>
  )
}
