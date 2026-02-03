"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { AssessmentScore, AssessmentType } from "@/lib/types/student"
import { cn } from "@/lib/utils"
import { formatPercent } from "@/lib/utils/formatters"

interface AssessmentCardProps {
  assessments: AssessmentScore[]
}

const assessmentDescriptions: Record<AssessmentType, string> = {
  "Personality Assessment":
    "Measures behavioral traits and work style preferences.",
  "Career Maturity Assessment":
    "Evaluates readiness and clarity for career decisions.",
  "Psychological Wellbeing Assessment":
    "Assesses emotional health and stress indicators.",
  "Strengths & Difficulties Assessment":
    "Identifies strengths and areas for development.",
}

function AssessmentItem({ a }: { a: AssessmentScore }) {
  const post = a.postInterventionScore
  const change =
    post != null ? post - a.preInterventionScore : null
  const changePct =
    change != null && a.preInterventionScore > 0
      ? (change / a.preInterventionScore) * 100
      : null
  const description = assessmentDescriptions[a.assessmentType]

  return (
    <div className="relative overflow-hidden rounded-lg border p-4 space-y-4 bg-gradient-to-l from-blue-50/40 via-gray-50/90 to-gray-50">
      <div>
        <p className="font-medium text-gray-900">{a.assessmentType}</p>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-gray-600">Pre-Intervention</p>
          <p className="mt-1 font-mono text-lg font-semibold text-gray-900">
            {a.preInterventionScore}
            <span className="ml-1 text-sm font-normal text-gray-500">/ 100</span>
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Post-Intervention</p>
          {post != null ? (
            <p className="mt-1 font-mono text-lg font-semibold text-gray-900">
              {post}
              <span className="ml-1 text-sm font-normal text-gray-500">/ 100</span>
            </p>
          ) : (
            <div className="mt-1">
              <Badge variant="secondary">Pending</Badge>
            </div>
          )}
        </div>
      </div>
      {change != null && (
        <p
          className={cn(
            "text-sm font-medium pt-1 border-t border-gray-200",
            change > 0 && "text-green-600",
            change < 0 && "text-red-600",
            change === 0 && "text-gray-600"
          )}
        >
          {change > 0 && "↑ "}
          {change < 0 && "↓ "}
          {change === 0 && "→ "}
          {change > 0 ? "+" : ""}
          {change} points
          {changePct != null && ` (${formatPercent(changePct)})`}
        </p>
      )}
    </div>
  )
}

export function AssessmentCard({ assessments }: AssessmentCardProps) {
  return (
    <Card className="rounded-xl border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Assessment Reports</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {assessments.map((a) => (
          <AssessmentItem key={a.assessmentType} a={a} />
        ))}
      </CardContent>
    </Card>
  )
}
