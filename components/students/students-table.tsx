"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StageBadge } from "@/components/students/stage-badge"
import type { Student, Stage } from "@/lib/types/student"
import { formatDate } from "@/lib/utils/formatters"
import { Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"

type SortKey = "name" | "class" | "stage" | "dateOfRegistration"
type SortDir = "asc" | "desc"

function compare(a: string | number, b: string | number, dir: SortDir): number {
  const order = dir === "asc" ? 1 : -1
  if (typeof a === "string" && typeof b === "string") {
    return order * a.localeCompare(b)
  }
  return order * (Number(a) - Number(b))
}

interface StudentsTableProps {
  students: Student[]
  pageSize?: number
}

export function StudentsTable({ students, pageSize = 10 }: StudentsTableProps) {
  const router = useRouter()
  const [sortKey, setSortKey] = useState<SortKey>("name")
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [page, setPage] = useState(0)

  const sorted = useMemo(() => {
    const arr = [...students]
    arr.sort((a, b) => {
      const aVal =
        sortKey === "dateOfRegistration"
          ? new Date(a.dateOfRegistration).getTime()
          : (a[sortKey] as string)
      const bVal =
        sortKey === "dateOfRegistration"
          ? new Date(b.dateOfRegistration).getTime()
          : (b[sortKey] as string)
      return compare(aVal, bVal, sortDir)
    })
    return arr
  }, [students, sortKey, sortDir])

  const totalPages = Math.ceil(sorted.length / pageSize) || 1
  const start = page * pageSize
  const paginated = sorted.slice(start, start + pageSize)

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
    setPage(0)
  }

  const SortHeader = ({
    colKey,
    label,
    className,
  }: {
    colKey: SortKey
    label: string
    className?: string
  }) => (
    <TableHead
      className={cn(
        "cursor-pointer select-none hover:bg-muted/50",
        className
      )}
      onClick={() => toggleSort(colKey)}
    >
      <span className="flex items-center gap-1">
        {label}
        {sortKey === colKey && (
          <span className="text-muted-foreground" aria-hidden>
            {sortDir === "asc" ? "↑" : "↓"}
          </span>
        )}
      </span>
    </TableHead>
  )

  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-16 text-center">
        <Users className="h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-lg font-medium">No students found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your search or filters.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <SortHeader colKey="name" label="Name" className="w-[180px] min-w-[180px]" />
              <SortHeader colKey="class" label="Class" className="w-[100px] min-w-[100px]" />
              <TableHead className="w-[140px] min-w-[140px]">Registration No.</TableHead>
              <TableHead className="w-[220px] min-w-[220px]">Email</TableHead>
              <TableHead className="w-[140px] min-w-[140px]">Phone</TableHead>
              <SortHeader colKey="stage" label="Stage" className="w-[180px] min-w-[180px]" />
              <SortHeader
                colKey="dateOfRegistration"
                label="Date of Registration"
                className="w-[140px] min-w-[140px]"
              />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((student, idx) => (
              <TableRow
                key={student.id}
                className={cn(
                  "cursor-pointer transition-colors duration-150",
                  idx % 2 === 1 && "bg-gray-50/50"
                )}
                onClick={() => router.push(`/students/${student.id}`)}
              >
                <TableCell className="w-[180px] font-semibold">
                  {student.name}
                </TableCell>
                <TableCell className="w-[100px]">{student.class}</TableCell>
                <TableCell className="w-[140px] font-mono text-sm">
                  {student.registrationNumber}
                </TableCell>
                <TableCell className="w-[220px] text-sm text-gray-600">
                  {student.email}
                </TableCell>
                <TableCell className="w-[140px]">{student.phone}</TableCell>
                <TableCell className="w-[180px]">
                  <StageBadge stage={student.stage as Stage} />
                </TableCell>
                <TableCell className="w-[140px] text-sm">
                  {formatDate(student.dateOfRegistration)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Showing {start + 1}-{Math.min(start + pageSize, sorted.length)} of{" "}
          {sorted.length} students
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium disabled:opacity-50 hover:bg-muted"
          >
            Previous
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum: number
            if (totalPages <= 5) {
              pageNum = i
            } else if (page < 2) {
              pageNum = i
            } else if (page >= totalPages - 2) {
              pageNum = totalPages - 5 + i
            } else {
              pageNum = page - 2 + i
            }
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => setPage(pageNum)}
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors",
                  page === pageNum
                    ? "bg-primary text-primary-foreground"
                    : "border hover:bg-muted"
                )}
              >
                {pageNum + 1}
              </button>
            )
          })}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium disabled:opacity-50 hover:bg-muted"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
