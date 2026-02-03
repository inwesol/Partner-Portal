"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import type { StudentDetails } from "@/lib/types/student"
import { ProfileCard } from "@/components/student-detail/profile-card"
import { CoachingProgressCard } from "@/components/student-detail/coaching-progress-card"
import { AssessmentCard } from "@/components/student-detail/assessment-card"
import { InsightsCard } from "@/components/student-detail/insights-card"
import { CoachFeedbackCard } from "@/components/student-detail/coach-feedback-card"

interface StudentDetailClientProps {
  student: StudentDetails
}

export function StudentDetailClient({ student }: StudentDetailClientProps) {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/students" asChild>
                <Link href="/students">Students</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{student.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <main className="flex-1 space-y-6 p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          <div className="space-y-6">
            <ProfileCard student={student} />
            <AssessmentCard assessments={student.assessments} />
            <InsightsCard insights={student.insights} />
          </div>
          <div className="space-y-6">
            <CoachingProgressCard currentStage={student.stage} />
            <CoachFeedbackCard feedback={student.coachFeedback} />
          </div>
        </div>
      </main>
    </SidebarInset>
  )
}
