import type { DashboardStats, MonthlyProgress } from "@/lib/types/dashboard"

export const dashboardStats: DashboardStats = {
  totalRegistered: 156,
  preliminaryCallCompleted: 142,
  inCoaching: 98,
  completedCoaching: 44,
  sessionBreakdown: {
    session2: 18,
    session3: 16,
    session4: 14,
    session5: 12,
    session6: 11,
    session7: 10,
    session8: 9,
    session9: 8,
  },
}

export const monthlyProgressData: MonthlyProgress[] = [
  { month: "Sep 2024", avgPersonalityScore: 62, avgCareerMaturityScore: 58, avgPsychologicalWellbeingScore: 61, avgStrengthsDifficultiesScore: 65 },
  { month: "Oct 2024", avgPersonalityScore: 65, avgCareerMaturityScore: 62, avgPsychologicalWellbeingScore: 64, avgStrengthsDifficultiesScore: 68 },
  { month: "Nov 2024", avgPersonalityScore: 68, avgCareerMaturityScore: 66, avgPsychologicalWellbeingScore: 67, avgStrengthsDifficultiesScore: 71 },
  { month: "Dec 2024", avgPersonalityScore: 71, avgCareerMaturityScore: 70, avgPsychologicalWellbeingScore: 70, avgStrengthsDifficultiesScore: 74 },
  { month: "Jan 2025", avgPersonalityScore: 74, avgCareerMaturityScore: 73, avgPsychologicalWellbeingScore: 73, avgStrengthsDifficultiesScore: 77 },
  { month: "Feb 2025", avgPersonalityScore: 77, avgCareerMaturityScore: 76, avgPsychologicalWellbeingScore: 76, avgStrengthsDifficultiesScore: 80 },
]
