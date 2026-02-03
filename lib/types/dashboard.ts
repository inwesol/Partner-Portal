export interface DashboardStats {
  totalRegistered: number
  preliminaryCallCompleted: number
  inCoaching: number
  completedCoaching: number
  sessionBreakdown: {
    session2: number
    session3: number
    session4: number
    session5: number
    session6: number
    session7: number
    session8: number
    session9: number
  }
}

export interface MonthlyProgress {
  month: string
  avgPersonalityScore: number
  avgCareerMaturityScore: number
  avgPsychologicalWellbeingScore: number
  avgStrengthsDifficultiesScore: number
}
