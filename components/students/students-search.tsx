"use client"

import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface StudentsSearchProps {
  onSearch: (query: string) => void
  placeholder?: string
}

const DEBOUNCE_MS = 300

export function StudentsSearch({
  onSearch,
  placeholder = "Search by name, email, or registration number...",
}: StudentsSearchProps) {
  const [value, setValue] = useState("")

  useEffect(() => {
    const t = setTimeout(() => {
      onSearch(value)
    }, DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [value, onSearch])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }, [])

  const handleClear = useCallback(() => {
    setValue("")
    onSearch("")
  }, [onSearch])

  return (
    <div className="relative w-full max-w-[500px]">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="h-10 rounded-lg pl-10 pr-10"
        aria-label="Search students"
      />
      {value ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  )
}
