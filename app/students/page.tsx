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
import { useCallback, useMemo, useState } from "react"
import { StudentsSearch } from "@/components/students/students-search"
import { StudentsTable } from "@/components/students/students-table"
import { mockStudentsList } from "@/lib/data/mock-students"

function filterStudents(
  list: typeof mockStudentsList,
  query: string
): typeof mockStudentsList {
  const q = query.trim().toLowerCase()
  if (!q) return list
  return list.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.registrationNumber.toLowerCase().includes(q)
  )
}

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const onSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const filtered = useMemo(
    () => filterStudents(mockStudentsList, searchQuery),
    [searchQuery]
  )

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Students</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <main className="flex-1 space-y-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Students</h1>
          <StudentsSearch onSearch={onSearch} />
        </div>
        <StudentsTable students={filtered} pageSize={10} />
      </main>
    </SidebarInset>
  )
}
