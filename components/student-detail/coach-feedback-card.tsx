"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { CoachFeedback } from "@/lib/types/student"
import { formatDate } from "@/lib/utils/formatters"

interface CoachFeedbackCardProps {
  feedback: CoachFeedback | null
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function CoachFeedbackCard({ feedback }: CoachFeedbackCardProps) {
  if (!feedback) {
    return (
      <Card className="rounded-xl border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Coach Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Feedback will be available after coaching completion.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-xl border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Coach Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 rounded-full">
            <AvatarFallback className="rounded-full bg-amber-100 text-amber-800">
              {getInitials(feedback.coachName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-gray-900">{feedback.coachName}</p>
            <p className="text-sm text-gray-600">
              {formatDate(feedback.submittedDate)}
            </p>
          </div>
        </div>
        <div className="mt-4 rounded-lg border-l-4 border-amber-400 bg-[#FFFBEB] p-4 text-sm leading-relaxed text-gray-800">
          {feedback.overallFeedback}
        </div>
      </CardContent>
    </Card>
  )
}
