"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Student } from "@/lib/types/student"
import { formatDate } from "@/lib/utils/formatters"

interface ProfileCardProps {
  student: Student
}

function Row({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span className="text-base text-gray-900">{value || "—"}</span>
    </div>
  )
}

export function ProfileCard({ student }: ProfileCardProps) {
  return (
    <Card className="rounded-xl border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Student Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-4">
          <h4 className="text-sm font-medium text-gray-500">Personal Information</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <Row label="Name" value={student.name} />
            <Row label="Registration Number" value={student.registrationNumber} />
            <Row label="Date of Birth" value={formatDate(student.dateOfBirth)} />
            <Row label="Gender" value={student.gender} />
            <Row label="Class" value={student.class} />
            <Row label="School Name" value={student.schoolName} />
            <Row label="Date of Registration" value={formatDate(student.dateOfRegistration)} />
          </div>
        </section>
        <Separator />
        <section className="space-y-4">
          <h4 className="text-sm font-medium text-gray-500">Contact Information</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <Row label="Email" value={student.email} />
            <Row label="Phone Number" value={student.phone} />
          </div>
        </section>
        <Separator />
        <section className="space-y-4">
          <h4 className="text-sm font-medium text-gray-500">Guardian Information</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <Row label="Parent Name" value={student.parentName} />
            <Row label="Parent Phone" value={student.parentPhone} />
            <Row label="Parent Email" value={student.parentEmail} />
          </div>
        </section>
        <Separator />
        <section className="space-y-4">
          <h4 className="text-sm font-medium text-gray-500">Address</h4>
          <div className="space-y-2">
            <Row label="Address" value={student.address} />
            <p className="text-base text-gray-900">
              {[student.city, student.state].filter(Boolean).join(", ")}
              {student.pincode ? ` - ${student.pincode}` : ""}
            </p>
          </div>
        </section>
      </CardContent>
    </Card>
  )
}
