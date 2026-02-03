import { getStudentDetailsById } from "@/lib/data/mock-students"
import { notFound } from "next/navigation"
import { StudentDetailClient } from "@/app/students/[id]/student-detail-client"

interface StudentDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function StudentDetailPage({ params }: StudentDetailPageProps) {
  const { id } = await params
  const student = getStudentDetailsById(id)

  if (!student) {
    notFound()
  }

  return <StudentDetailClient student={student} />
}
