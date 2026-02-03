/**
 * Format ISO date string to "DD MMM YYYY" (e.g. "15 Jan 2025")
 */
export function formatDate(isoDate: string): string {
  const d = new Date(isoDate)
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

/**
 * Format number as percentage
 */
export function formatPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`
}
