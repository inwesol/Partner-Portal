"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { StudentInsights } from "@/lib/types/student"
import { cn } from "@/lib/utils"

const TAG_COLORS = {
  personality: "bg-blue-100 text-blue-800 border-blue-200",
  interests: "bg-green-100 text-green-800 border-green-200",
  values: "bg-amber-100 text-amber-800 border-amber-200",
  strengths: "bg-violet-100 text-violet-800 border-violet-200",
} as const

interface InsightsCardProps {
  insights: StudentInsights | null
}

export function InsightsCard({ insights }: InsightsCardProps) {
  if (!insights) {
    return (
      <Card className="rounded-xl border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Student Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Insights will be available after assessment completion.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-xl border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Student Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <section>
          <h4 className="mb-2 text-sm font-medium text-gray-600">
            Personality Traits
          </h4>
          <div className="flex flex-wrap gap-2">
            {insights.personality.map((t) => (
              <span
                key={t}
                className={cn(
                  "inline-flex items-center rounded-full border px-3 py-1.5 text-[13px]",
                  TAG_COLORS.personality
                )}
              >
                {t}
              </span>
            ))}
          </div>
        </section>
        <section>
          <h4 className="mb-2 text-sm font-medium text-gray-600">Interests</h4>
          <div className="flex flex-wrap gap-2">
            {insights.interests.map((t) => (
              <span
                key={t}
                className={cn(
                  "inline-flex items-center rounded-full border px-3 py-1.5 text-[13px]",
                  TAG_COLORS.interests
                )}
              >
                {t}
              </span>
            ))}
          </div>
        </section>
        <section>
          <h4 className="mb-2 text-sm font-medium text-gray-600">Values</h4>
          <div className="flex flex-wrap gap-2">
            {insights.values.map((t) => (
              <span
                key={t}
                className={cn(
                  "inline-flex items-center rounded-full border px-3 py-1.5 text-[13px]",
                  TAG_COLORS.values
                )}
              >
                {t}
              </span>
            ))}
          </div>
        </section>
        <section>
          <h4 className="mb-2 text-sm font-medium text-gray-600">Strengths</h4>
          <div className="flex flex-wrap gap-2">
            {insights.strengths.map((t) => (
              <span
                key={t}
                className={cn(
                  "inline-flex items-center rounded-full border px-3 py-1.5 text-[13px]",
                  TAG_COLORS.strengths
                )}
              >
                {t}
              </span>
            ))}
          </div>
        </section>
        {insights.additionalInsights && (
          <section>
            <h4 className="mb-2 text-sm font-medium text-gray-600">
              Additional Insights
            </h4>
            <div className="rounded-lg bg-gray-50 p-4 text-sm leading-relaxed text-gray-700">
              {insights.additionalInsights}
            </div>
          </section>
        )}
      </CardContent>
    </Card>
  )
}
