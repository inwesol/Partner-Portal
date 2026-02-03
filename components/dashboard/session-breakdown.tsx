"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DashboardStats } from "@/lib/types/dashboard"

interface SessionBreakdownProps {
  sessionBreakdown: DashboardStats["sessionBreakdown"]
}

const sessionKeys = [
  "session2",
  "session3",
  "session4",
  "session5",
  "session6",
  "session7",
  "session8",
  "session9",
] as const

const sessionLabels: Record<(typeof sessionKeys)[number], string> = {
  session2: "Session 2",
  session3: "Session 3",
  session4: "Session 4",
  session5: "Session 5",
  session6: "Session 6",
  session7: "Session 7",
  session8: "Session 8",
  session9: "Session 9",
}

const sessionDescriptions: Record<(typeof sessionKeys)[number], string> = {
  session2: "Goal setting and initial action plans.",
  session3: "Refining goals and building accountability.",
  session4: "Mid-program check-in and habit review.",
  session5: "Strengthening time management and focus.",
  session6: "Career exploration and skill mapping.",
  session7: "Confidence and communication practice.",
  session8: "Reviewing progress and next steps.",
  session9: "Final integration and completion prep.",
}

export function SessionBreakdown({ sessionBreakdown }: SessionBreakdownProps) {
  return (
    <Card className="rounded-xl border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Students in Coaching - Session Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sessionKeys.map((key) => {
            const count = sessionBreakdown[key]
            const label = sessionLabels[key]
            const description = sessionDescriptions[key]
            return (
              <div
                key={key}
                className="relative overflow-hidden rounded-lg border p-4 transition-colors hover:bg-gray-50/80 bg-gradient-to-l from-blue-50/40 via-gray-50/90 to-gray-50"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold text-gray-900">{label}</span>
                  <span className="font-mono text-2xl font-semibold text-blue-600">
                    {count}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">{description}</p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
