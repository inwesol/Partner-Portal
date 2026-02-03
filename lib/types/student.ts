// Coaching stages
export type Stage =
  | "Registered"
  | "Preliminary Call"
  | "In Coaching - Session 2"
  | "In Coaching - Session 3"
  | "In Coaching - Session 4"
  | "In Coaching - Session 5"
  | "In Coaching - Session 6"
  | "In Coaching - Session 7"
  | "In Coaching - Session 8"
  | "In Coaching - Session 9"
  | "Completed"

// Assessment types
export type AssessmentType =
  | "Personality Assessment"
  | "Career Maturity Assessment"
  | "Psychological Wellbeing Assessment"
  | "Strengths & Difficulties Assessment"

export interface Student {
  id: string
  name: string
  class: string
  registrationNumber: string
  email: string
  phone: string
  stage: Stage
  dateOfRegistration: string
  dateOfBirth: string
  gender: "Male" | "Female" | "Other"
  parentName: string
  parentPhone: string
  parentEmail: string
  schoolName: string
  address: string
  city: string
  state: string
  pincode: string
}

export interface AssessmentScore {
  assessmentType: AssessmentType
  preInterventionScore: number
  postInterventionScore: number | null
  completedDate: string | null
}

export interface StudentInsights {
  personality: string[]
  interests: string[]
  values: string[]
  strengths: string[]
  additionalInsights: string
}

export interface CoachFeedback {
  overallFeedback: string
  coachName: string
  submittedDate: string
}

export interface StudentDetails extends Student {
  assessments: AssessmentScore[]
  insights: StudentInsights | null
  coachFeedback: CoachFeedback | null
}
