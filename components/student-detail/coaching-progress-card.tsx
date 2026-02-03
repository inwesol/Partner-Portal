"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Stage } from "@/lib/types/student"
import { Check, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

const STEPS: { label: string; stage: Stage | null }[] = [
  { label: "Preliminary Call (Free)", stage: "Preliminary Call" },
  { label: "Session 2", stage: "In Coaching - Session 2" },
  { label: "Session 3", stage: "In Coaching - Session 3" },
  { label: "Session 4", stage: "In Coaching - Session 4" },
  { label: "Session 5", stage: "In Coaching - Session 5" },
  { label: "Session 6", stage: "In Coaching - Session 6" },
  { label: "Session 7", stage: "In Coaching - Session 7" },
  { label: "Session 8", stage: "In Coaching - Session 8" },
  { label: "Session 9", stage: "In Coaching - Session 9" },
  { label: "Completed", stage: "Completed" },
]

const stageOrder: Stage[] = [
  "Registered",
  "Preliminary Call",
  "In Coaching - Session 2",
  "In Coaching - Session 3",
  "In Coaching - Session 4",
  "In Coaching - Session 5",
  "In Coaching - Session 6",
  "In Coaching - Session 7",
  "In Coaching - Session 8",
  "In Coaching - Session 9",
  "Completed",
]

function getStageIndex(s: Stage): number {
  const i = stageOrder.indexOf(s)
  return i >= 0 ? i : 0
}

interface CoachingProgressCardProps {
  currentStage: Stage
}

export function CoachingProgressCard({ currentStage }: CoachingProgressCardProps) {
  const currentIndex = getStageIndex(currentStage)

  return (
    <Card className="rounded-xl border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Coaching Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-0 md:flex-row md:flex-wrap md:gap-4">
          {STEPS.map((step, i) => {
            const stepStageIndex = step.stage
              ? getStageIndex(step.stage)
              : -1
            const isCompleted =
              step.stage !== null &&
              (currentStage === "Completed" || currentIndex > stepStageIndex)
            const isCurrent =
              step.stage === currentStage && !isCompleted
            return (
              <div
                key={step.label}
                className={cn(
                  "flex items-center gap-2 py-1",
                  i < STEPS.length - 1 && "md:border-r md:border-dashed md:border-gray-300 md:pr-4"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm",
                    isCompleted &&
                      "border-green-500 bg-green-500 text-white",
                    isCurrent &&
                      !isCompleted &&
                      "border-blue-500 bg-blue-50 text-blue-600 animate-pulse",
                    !isCompleted &&
                      !isCurrent &&
                      "border-gray-300 bg-gray-50 text-gray-400"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Circle className="h-4 w-4" strokeWidth={2} />
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm",
                    isCurrent && "font-medium text-blue-600",
                    isCompleted && "text-gray-600",
                    !isCompleted && !isCurrent && "text-gray-400"
                  )}
                >
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
