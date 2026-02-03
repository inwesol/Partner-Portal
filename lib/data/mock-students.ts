import type { Student, StudentDetails, Stage } from "@/lib/types/student"

const stages: Stage[] = [
  "Registered",
  "Preliminary Call",
  "In Coaching - Session 2",
  "In Coaching - Session 3",
  "In Coaching - Session 4",
  "In Coaching - Session 5",
  "In Coaching - Session 6",
  "In Coaching - Session 7",
  "In Coaching - Session 8",
  "In Coaching - Session 9",
  "Completed",
]

const indianNames = [
  "Aarav Sharma", "Priya Patel", "Rohan Singh", "Ananya Reddy", "Vikram Kumar",
  "Sneha Nair", "Arjun Mehta", "Kavya Iyer", "Aditya Joshi", "Diya Gupta",
  "Rahul Verma", "Ishita Desai", "Karan Malhotra", "Neha Kapoor", "Siddharth Rao",
  "Pooja Shah", "Rishabh Agarwal", "Aisha Khan", "Varun Choudhury", "Meera Krishnan",
  "Akash Pillai", "Shreya Menon", "Nikhil Bhat", "Tanvi Saxena", "Manish Dubey",
  "Kriti Trivedi", "Arnav Sinha", "Riya Banerjee", "Vivek Ghosh", "Anjali Mukherjee",
  "Rohan Das", "Sakshi Chatterjee", "Kunal Bose", "Preeti Roy", "Abhishek Dutta",
  "Nidhi Sengupta", "Rajat Mishra", "Swati Jha", "Harsh Tiwari", "Pallavi Pandey",
]

const classes = ["9th Grade", "10th Grade", "11th Grade", "12th Grade"]
const cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad"]
const states = ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "West Bengal", "Telangana", "Gujarat"]
const schools = ["Delhi Public School", "Kendriya Vidyalaya", "Ryan International", "DPS Bangalore", "St. Xavier's", "DAV Public School"]

function pad(n: number): string {
  return n.toString().padStart(5, "0")
}

/** Deterministic pick by index so server and client always get the same list (avoids hydration mismatch). */
function at<T>(arr: readonly T[] | T[], i: number): T {
  return arr[i % arr.length]!
}

/** Deterministic date in range based on seed i. */
function dateFromIndex(start: Date, end: Date, i: number): string {
  const range = end.getTime() - start.getTime()
  const d = new Date(start.getTime() + ((i * 7919) % 1000) * (range / 1000))
  return d.toISOString().split("T")[0]!
}

export function generateMockStudents(count: number): Student[] {
  const start = new Date("2024-08-01")
  const end = new Date("2025-02-01")
  const dobStart = new Date("2006-01-01")
  const dobEnd = new Date("2009-12-31")
  const genders = ["Male", "Female", "Other"] as const
  const students: Student[] = []

  for (let i = 0; i < count; i++) {
    const name = at(indianNames, i)
    const [first, last] = name.toLowerCase().split(" ")
    const regNum = `REG2024-${pad(1001 + i)}`
    const email = `${first}.${last}${i > 0 ? i : ""}@email.com`
    const phone = String(1000000000 + (i * 123456) % 9000000000)
    const stage = at(stages, i)
    students.push({
      id: `student-${i + 1}`,
      name,
      class: at(classes, i),
      registrationNumber: regNum,
      email,
      phone,
      stage,
      dateOfRegistration: dateFromIndex(start, end, i),
      dateOfBirth: dateFromIndex(dobStart, dobEnd, i + 100),
      gender: at(genders, i),
      parentName: `Parent of ${name}`,
      parentPhone: String(1000000000 + (i * 654321) % 9000000000),
      parentEmail: `parent.${last}${i}@email.com`,
      schoolName: at(schools, i),
      address: `${(1 + (i * 17) % 200)} Main Street`,
      city: at(cities, i),
      state: at(states, i),
      pincode: `${400000 + (i * 101) % 400000}`,
    })
  }
  return students
}

const rawList = generateMockStudents(45)
// Ensure at least 2 of first 5 are Completed for coach feedback demo
rawList[0] = { ...rawList[0], stage: "Completed" }
rawList[1] = { ...rawList[1], stage: "Completed" }
export const mockStudentsList: Student[] = rawList

// Detailed data for first 5 students (full assessments, insights, coach feedback)
import type { AssessmentScore, StudentInsights, CoachFeedback } from "@/lib/types/student"

const detailedIds = new Set(mockStudentsList.slice(0, 5).map((s) => s.id))

// Deterministic score from id for consistent mock data
function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

function getDetailsForStudent(student: Student): StudentDetails {
  const hasFullData = detailedIds.has(student.id)
  const seed = hash(student.id)
  const assessments: AssessmentScore[] = [
    {
      assessmentType: "Personality Assessment",
      preInterventionScore: 65 + (seed % 25),
      postInterventionScore: hasFullData ? 78 + (seed % 20) : null,
      completedDate: hasFullData ? "2025-01-15" : null,
    },
    {
      assessmentType: "Career Maturity Assessment",
      preInterventionScore: 58 + ((seed >> 2) % 30),
      postInterventionScore: hasFullData ? 72 + ((seed >> 4) % 25) : null,
      completedDate: hasFullData ? "2025-01-16" : null,
    },
    {
      assessmentType: "Psychological Wellbeing Assessment",
      preInterventionScore: 60 + ((seed >> 6) % 28),
      postInterventionScore: hasFullData ? 76 + ((seed >> 8) % 22) : null,
      completedDate: hasFullData ? "2025-01-17" : null,
    },
    {
      assessmentType: "Strengths & Difficulties Assessment",
      preInterventionScore: 62 + ((seed >> 10) % 26),
      postInterventionScore: hasFullData ? 80 + ((seed >> 12) % 18) : null,
      completedDate: hasFullData ? "2025-01-18" : null,
    },
  ]

  const insights: StudentInsights | null = hasFullData
    ? {
      personality: ["Analytical", "Creative", "Organized", "Empathetic"],
      interests: ["Science", "Technology", "Music", "Reading"],
      values: ["Integrity", "Achievement", "Helping Others", "Growth"],
      strengths: ["Problem Solving", "Communication", "Leadership", "Adaptability"],
      additionalInsights:
        "Student shows strong aptitude for analytical thinking and enjoys collaborative projects. Demonstrates good emotional awareness and responds well to structured feedback. Recommended focus on time management and public speaking in upcoming sessions.",
    }
    : null

  const coachFeedback: CoachFeedback | null =
    hasFullData && student.stage === "Completed"
      ? {
        overallFeedback: `It has been a pleasure coaching ${student.name} through the program. They showed consistent improvement across all assessment areas and actively engaged in every session. Their willingness to reflect on feedback and apply new strategies was notable. I am confident they are well-prepared for their next steps. We discussed career options aligned with their strengths in analysis and communication.`,
        coachName: "Dr. Anjali Krishnan",
        submittedDate: "2025-02-01",
      }
      : null

  return {
    ...student,
    assessments,
    insights,
    coachFeedback,
  }
}

const detailsMap = new Map<string, StudentDetails>()
mockStudentsList.forEach((s) => {
  detailsMap.set(s.id, getDetailsForStudent(s))
})

export function getStudentById(id: string): Student | undefined {
  return mockStudentsList.find((s) => s.id === id)
}

export function getStudentDetailsById(id: string): StudentDetails | undefined {
  const cached = detailsMap.get(id)
  if (cached) return cached
  const s = getStudentById(id)
  return s ? getDetailsForStudent(s) : undefined
}
