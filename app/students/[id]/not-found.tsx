import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function StudentNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-semibold">Student not found</h1>
      <p className="text-muted-foreground">
        The student you&apos;re looking for doesn&apos;t exist or may have been removed.
      </p>
      <Button asChild>
        <Link href="/students">Back to Students</Link>
      </Button>
    </div>
  )
}
