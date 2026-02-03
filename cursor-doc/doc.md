# Product Requirements Document: School Partner Portal

## Overview
Build a partner portal for schools to monitor and track their students' progress through a coaching program. The portal includes a dashboard with analytics, a searchable student list, and detailed student profiles. This initial version focuses on UI with dummy/mock data for demo purposes.

## Application Routes
```
/dashboard           → Partner Dashboard (analytics and overview)
/students            → Student List (data table with search & pagination)
/students/:id        → Student Detail Page (profile, progress, assessments)
```

## Data Structures

```typescript
// Coaching stages
type Stage = 
  | 'Registered'
  | 'Preliminary Call'
  | 'In Coaching - Session 2'
  | 'In Coaching - Session 3'
  | 'In Coaching - Session 4'
  | 'In Coaching - Session 5'
  | 'In Coaching - Session 6'
  | 'In Coaching - Session 7'
  | 'In Coaching - Session 8'
  | 'In Coaching - Session 9'
  | 'Completed';

// Assessment types
type AssessmentType = 
  | 'Personality Assessment'
  | 'Career Maturity Assessment'
  | 'Psychological Wellbeing Assessment'
  | 'Strengths & Difficulties Assessment';

interface Student {
  id: string;
  name: string;
  class: string; // e.g., "10th Grade", "12th Grade"
  registrationNumber: string;
  email: string;
  phone: string;
  stage: Stage;
  dateOfRegistration: string; // ISO date string
  
  // Additional profile fields
  dateOfBirth: string; // ISO date string
  gender: 'Male' | 'Female' | 'Other';
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  schoolName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface AssessmentScore {
  assessmentType: AssessmentType;
  preInterventionScore: number; // 0-100
  postInterventionScore: number | null; // 0-100, null if not completed
  completedDate: string | null; // ISO date string
}

interface StudentInsights {
  personality: string[]; // Array of personality traits
  interests: string[]; // Array of interests
  values: string[]; // Array of values
  strengths: string[]; // Array of strengths
  additionalInsights: string; // Long text field
}

interface CoachFeedback {
  overallFeedback: string;
  coachName: string;
  submittedDate: string; // ISO date string
}

interface StudentDetails extends Student {
  assessments: AssessmentScore[];
  insights: StudentInsights | null; // null if not completed
  coachFeedback: CoachFeedback | null; // null if coaching not completed
}

interface DashboardStats {
  totalRegistered: number;
  preliminaryCallCompleted: number;
  inCoaching: number;
  completedCoaching: number;
  
  // Session-wise breakdown for "In Coaching"
  sessionBreakdown: {
    session2: number;
    session3: number;
    session4: number;
    session5: number;
    session6: number;
    session7: number;
    session8: number;
    session9: number;
  };
}

interface MonthlyProgress {
  month: string; // "Jan 2024", "Feb 2024", etc.
  avgPersonalityScore: number;
  avgCareerMaturityScore: number;
  avgPsychologicalWellbeingScore: number;
  avgStrengthsDifficultiesScore: number;
}
```

## Page 1: Dashboard (/dashboard)

### Layout Structure
```
Header (sticky)
└── Partner logo + name on left
└── User profile dropdown on right

Main Content Area
├── Stats Cards Section (4 cards in a row, responsive)
├── Session Breakdown Section (bar chart or grid)
└── Monthly Progress Section (line chart)
```

### 1.1 Stats Cards Section
**Requirements:**
- 4 cards displayed in a row (1 column on mobile, 2 on tablet, 4 on desktop)
- Each card shows:
  - Large number (metric value)
  - Label below number
  - Icon related to the metric
  - Subtle background color

**Cards:**
1. **Total Registered Students**
   - Icon: Users
   - Color: Blue background (#EFF6FF)
   - Number: Total count
   
2. **Preliminary Call Completed**
   - Icon: Phone
   - Color: Green background (#F0FDF4)
   - Number: Count of students who completed preliminary call
   
3. **Currently in Coaching**
   - Icon: GraduationCap
   - Color: Purple background (#F5F3FF)
   - Number: Total students in sessions 2-9
   
4. **Completed Coaching**
   - Icon: CheckCircle
   - Color: Emerald background (#ECFDF5)
   - Number: Count of students who completed all sessions

**UI Specifications:**
- Card padding: 24px
- Border radius: 12px
- Number font size: 36px, font-weight: bold
- Label font size: 14px, color: gray-600
- Icon size: 40px, positioned top-right
- Subtle shadow on cards

### 1.2 Session Breakdown Section
**Requirements:**
- Title: "Students in Coaching - Session Breakdown"
- Display count of students in each session (Session 2 through Session 9)
- Use horizontal bar chart or card grid layout

**Option A - Bar Chart (Recommended):**
- X-axis: Number of students
- Y-axis: Session names (Session 2, Session 3, ... Session 9)
- Bar color: Gradient blue
- Show exact number at end of each bar

**Option B - Grid Layout:**
- 8 small cards (one per session)
- Each card shows: Session number + student count
- Arranged in 2 rows of 4

**UI Specifications:**
- Section background: White card with border
- Padding: 24px
- Border radius: 12px
- Title: text-lg font-semibold mb-4

### 1.3 Monthly Progress Section
**Requirements:**
- Title: "Average Assessment Progress - Monthly Trends"
- Line chart showing progress over last 6-12 months
- 4 lines (one for each assessment type):
  - Personality Assessment (Blue)
  - Career Maturity Assessment (Green)
  - Psychological Wellbeing Assessment (Purple)
  - Strengths & Difficulties Assessment (Orange)
  
**Chart Specifications:**
- X-axis: Months (e.g., "Jan 2024", "Feb 2024")
- Y-axis: Average score (0-100)
- Legend: Bottom, showing all 4 assessment types
- Data points: Show dots on each line
- Tooltip: On hover, show exact scores for that month
- Grid lines: Subtle horizontal lines

**UI Specifications:**
- Section background: White card with border
- Padding: 24px
- Border radius: 12px
- Chart height: 400px
- Responsive: Stack legend below on mobile

### 1.4 Additional Dashboard Elements
**Before and After Comparison Section (Optional Enhancement):**
- Title: "Pre vs Post Intervention - Average Improvement"
- 4 comparison cards (one per assessment)
- Each card shows:
  - Assessment name
  - Average pre-intervention score
  - Average post-intervention score
  - Percentage change (with up/down arrow)
  - Color: Green if improved, red if declined

## Page 2: Students List (/students)

### Layout Structure
```
Header (same as dashboard)

Main Content Area
├── Page Title + Add Student Button (if needed later)
├── Search Bar
└── Data Table
    ├── Table Headers
    ├── Table Rows (student data)
    └── Pagination Controls
```

### 2.1 Search Bar
**Requirements:**
- Search input field with icon
- Placeholder: "Search by name, email, or registration number..."
- Real-time filtering (debounced by 300ms)
- Search across: name, email, registrationNumber
- Case-insensitive search
- Clear button (X) when text is entered

**UI Specifications:**
- Full width with max-width: 500px
- Height: 40px
- Border radius: 8px
- Icon: Search icon on left
- Padding: 12px

### 2.2 Data Table
**Requirements:**
- Use shadcn/ui Table component with sorting
- Display columns (left to right):
  1. Name (sortable)
  2. Class (sortable)
  3. Registration Number
  4. Email
  5. Phone Number
  6. Stage (sortable, with badge styling)
  7. Date of Registration (sortable, format: "DD MMM YYYY")
  
**Column Specifications:**

| Column | Width | Alignment | Special Styling |
|--------|-------|-----------|-----------------|
| Name | 180px | Left | font-semibold |
| Class | 100px | Left | - |
| Registration Number | 140px | Left | font-mono text-sm |
| Email | 220px | Left | text-sm text-gray-600 |
| Phone Number | 140px | Left | - |
| Stage | 180px | Left | Badge component |
| Date of Registration | 140px | Left | text-sm |

**Stage Badge Styling:**
- "Registered": Gray badge (#F3F4F6 bg, #374151 text)
- "Preliminary Call": Blue badge (#DBEAFE bg, #1E40AF text)
- "In Coaching - Session X": Purple badge (#EDE9FE bg, #6B21A8 text)
- "Completed": Green badge (#D1FAE5 bg, #065F46 text)

**Row Behavior:**
- Hover state: Light gray background (#F9FAFB)
- Cursor: pointer
- Click: Navigate to `/students/:id`
- Transition: Smooth background color change (150ms)

**Table Features:**
- Sticky header row
- Zebra striping (alternate row colors)
- Responsive: Horizontal scroll on mobile
- Empty state: "No students found" with icon when no results

### 2.3 Pagination
**Requirements:**
- Show 10 students per page (configurable)
- Display: "Showing 1-10 of 156 students"
- Pagination controls:
  - Previous button (disabled on first page)
  - Page numbers (show current, 2 before, 2 after)
  - Next button (disabled on last page)
  - Jump to page input (optional)

**UI Specifications:**
- Positioned at bottom of table
- Centered alignment
- Buttons: 36px height, rounded
- Current page: Primary blue color
- Other pages: Gray color
- Disabled state: Lower opacity

## Page 3: Student Detail Page (/students/:id)

### Layout Structure
```
Header (same as dashboard)

Breadcrumb Navigation
"Dashboard > Students > [Student Name]"

Main Content Area (2 column layout on desktop, stacked on mobile)
├── Left Column (60% width)
│   ├── Profile Details Card
│   ├── Assessment Reports Card
│   └── Insights Card
│
└── Right Column (40% width)
    ├── Coaching Progress Card
    └── Coach Feedback Card
```

### 3.1 Breadcrumb Navigation
**Requirements:**
- Show path: "Dashboard > Students > [Student Name]"
- Each segment is clickable (except current page)
- Separator: ">" or "/" icon

**UI Specifications:**
- Font size: 14px
- Color: gray-600
- Current page: gray-900, not clickable
- Hover: Underline on clickable segments

### 3.2 Profile Details Card
**Requirements:**
- Title: "Student Profile"
- Display all student information in a structured format
- Sections:
  1. Personal Information
  2. Contact Information
  3. Guardian Information
  4. Address

**Layout:**
```
Personal Information (2 columns)
├── Name                    ├── Registration Number
├── Date of Birth          ├── Gender
├── Class                  ├── School Name
└── Date of Registration   

Contact Information (2 columns)
├── Email                  ├── Phone Number

Guardian Information (2 columns)
├── Parent Name            ├── Parent Phone
└── Parent Email           

Address (full width)
├── Address
├── City, State - Pincode
```

**UI Specifications:**
- Card background: White
- Padding: 24px
- Border radius: 12px
- Labels: text-sm font-medium text-gray-600
- Values: text-base text-gray-900
- Spacing between rows: 16px
- Section dividers: Subtle horizontal line

### 3.3 Coaching Progress Card
**Requirements:**
- Title: "Coaching Progress"
- Display current stage prominently
- Visual progress indicator (stepper or progress bar)
- Show all 9 sessions + completed state

**Progress Stepper:**
- Session 1: Preliminary Call (Free)
- Sessions 2-9: Coaching Sessions
- Final: Completed

**Visual Design:**
- Vertical stepper on desktop, horizontal scroll on mobile
- Completed sessions: Green checkmark icon
- Current session: Blue highlight with pulse animation
- Future sessions: Gray with dotted line connector
- Each step shows:
  - Session number/name
  - Status icon
  - Date completed (if applicable)

**UI Specifications:**
- Card padding: 24px
- Step indicator size: 32px circle
- Connector line: 2px dashed gray
- Active step: 2px solid blue
- Font size for session names: 14px

### 3.4 Assessment Reports Card
**Requirements:**
- Title: "Assessment Reports"
- Show all 4 assessment types
- For each assessment, display:
  - Assessment name
  - Pre-intervention score
  - Post-intervention score (or "Not Completed")
  - Visual comparison (progress bar or before/after bars)
  - Score change indicator (↑ +15 points or ↓ -5 points)

**Assessment Display Format:**
```
[Assessment Name]
Pre-Intervention:  [Score] ████████░░ 80/100
Post-Intervention: [Score] ██████████ 95/100
Change: ↑ +15 points (+18.75%)
```

**UI Specifications:**
- Each assessment in a bordered sub-card
- Spacing between assessments: 16px
- Score bars: 
  - Pre-intervention: Gray color (#D1D5DB)
  - Post-intervention: Blue color (#3B82F6)
  - Height: 8px, rounded
- Change indicator:
  - Positive: Green text with ↑ arrow
  - Negative: Red text with ↓ arrow
  - No change: Gray text with → arrow
- "Not Completed" state: Show "Pending" badge

### 3.5 Insights Card
**Requirements:**
- Title: "Student Insights"
- Show only if insights are available
- If not available, show: "Insights will be available after assessment completion"

**Sections to Display:**
1. **Personality Traits**
   - Display as colored tags/badges
   - Examples: "Analytical", "Creative", "Organized"
   
2. **Interests**
   - Display as tags/badges
   - Examples: "Science", "Arts", "Sports", "Technology"
   
3. **Values**
   - Display as tags/badges
   - Examples: "Independence", "Achievement", "Helping Others"
   
4. **Strengths**
   - Display as tags/badges
   - Examples: "Problem Solving", "Communication", "Leadership"
   
5. **Additional Insights**
   - Long text paragraph
   - Background: Light gray box
   - Font: Regular text, readable line height

**UI Specifications:**
- Card padding: 24px
- Section spacing: 20px
- Tags/Badges:
  - Padding: 6px 12px
  - Border radius: 16px
  - Font size: 13px
  - Different colors for each category
  - Wrap to multiple lines
  - Gap between tags: 8px
- Additional insights box:
  - Padding: 16px
  - Background: #F9FAFB
  - Border radius: 8px
  - Line height: 1.6

### 3.6 Coach Feedback Card
**Requirements:**
- Title: "Coach Feedback"
- Show only if coaching is completed
- If not completed, show: "Feedback will be available after coaching completion"

**Content to Display:**
- Coach name with avatar icon
- Submission date
- Feedback text (can be long, multiple paragraphs)

**UI Specifications:**
- Card padding: 24px
- Coach info section:
  - Avatar: 40px circle with initials
  - Name: font-semibold, 16px
  - Date: text-sm text-gray-600
  - Layout: Flex row with avatar on left
- Feedback text:
  - Margin top: 16px
  - Background: Light yellow (#FFFBEB)
  - Padding: 16px
  - Border-left: 4px solid yellow (#F59E0B)
  - Border radius: 8px
  - Line height: 1.8

## Mock Data Requirements

### Dashboard Mock Data
- Create realistic numbers that add up correctly
- Total Registered: 156 students
- Preliminary Call Completed: 142 students
- In Coaching: 98 students (breakdown across sessions 2-9)
- Completed: 44 students
- Session breakdown should total 98
- Monthly data: Last 6 months with realistic trends showing improvement

### Students List Mock Data
- Create 30-50 mock student records
- Mix of different stages
- Realistic Indian names
- Valid email formats (firstname.lastname@email.com)
- Indian phone numbers (10 digits)
- Registration numbers: Format "REG2024-XXXXX"
- Dates: Distributed over last 6 months

### Student Detail Mock Data
- Create detailed profiles for at least 5 students
- Include all assessment scores (some with post-intervention, some without)
- Create realistic insights with 3-5 items per category
- Create thoughtful coach feedback (2-3 paragraphs)
- Ensure data consistency (if completed, should have post-scores and feedback)

## Styling Guidelines

### Color Palette
```css
/* Primary Colors */
--primary-blue: #3B82F6;
--primary-blue-light: #DBEAFE;
--primary-blue-dark: #1E40AF;

/* Status Colors */
--success: #10B981;
--success-light: #D1FAE5;
--warning: #F59E0B;
--warning-light: #FEF3C7;
--danger: #EF4444;
--danger-light: #FEE2E2;
--info: #8B5CF6;
--info-light: #EDE9FE;

/* Neutral Colors */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-600: #4B5563;
--gray-900: #111827;

/* Background */
--bg-main: #F9FAFB;
--bg-card: #FFFFFF;
```

### Typography
- **Headings**: 
  - H1: 30px, font-bold
  - H2: 24px, font-semibold
  - H3: 20px, font-semibold
  - H4: 18px, font-medium
  
- **Body**: 
  - Regular: 16px, font-normal
  - Small: 14px, font-normal
  - Tiny: 12px, font-normal

- **Font Family**: 
  - Sans: Inter, system-ui, -apple-system
  - Mono: 'Fira Code', monospace (for registration numbers)

### Spacing System
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

### Component Specifications

**Buttons:**
- Height: 40px
- Padding: 12px 24px
- Border radius: 8px
- Font weight: 500
- Transition: all 150ms

**Cards:**
- Background: White
- Border: 1px solid #E5E7EB
- Border radius: 12px
- Padding: 24px
- Shadow: 0 1px 3px rgba(0,0,0,0.1)

**Badges:**
- Padding: 4px 12px
- Border radius: 12px
- Font size: 12px
- Font weight: 500

**Input Fields:**
- Height: 40px
- Padding: 10px 16px
- Border: 1px solid #D1D5DB
- Border radius: 8px
- Focus: Blue border, shadow

## Responsive Design Breakpoints
```css
/* Mobile First Approach */
--mobile: 0px - 639px      /* Stack everything */
--tablet: 640px - 1023px   /* 2 column layouts become possible */
--desktop: 1024px+          /* Full multi-column layouts */
```

**Responsive Behavior:**
- Dashboard stats cards: 1 col (mobile), 2 col (tablet), 4 col (desktop)
- Session breakdown: Stack on mobile
- Student detail page: Single column on mobile, 2 columns on desktop
- Data table: Horizontal scroll on mobile

## Navigation & Header

### Header Component
**Requirements:**
- Sticky positioning (stays at top on scroll)
- Height: 64px
- Background: White with bottom border

**Left Section:**
- Logo/Icon (40px)
- Text: "Partner Portal" (font-semibold, 18px)

**Right Section:**
- Partner name/school name
- User avatar (32px circle)
- Dropdown menu on click:
  - Dashboard
  - Students
  - Settings (disabled for now)
  - Logout (disabled for now)

### Sidebar Navigation (Optional Alternative)
If you prefer sidebar instead of top navigation:
- Width: 240px
- Background: Dark blue (#1E293B)
- Menu items:
  - Dashboard (icon: LayoutDashboard)
  - Students (icon: Users)
- Active state: Light blue background
- Hover state: Lighter background

## Component Structure
```
App.tsx
├── Router
├── Header
│   ├── Logo
│   └── UserMenu
│
├── Route: /dashboard
│   └── DashboardPage
│       ├── StatsCards
│       │   ├── StatCard (×4)
│       ├── SessionBreakdownChart
│       └── MonthlyProgressChart
│
├── Route: /students
│   └── StudentsListPage
│       ├── SearchBar
│       ├── DataTable
│       │   ├── TableHeader
│       │   ├── TableRow (×N)
│       │   │   ├── Badge (for stage)
│       │   └── EmptyState
│       └── Pagination
│
└── Route: /students/:id
    └── StudentDetailPage
        ├── Breadcrumb
        ├── LeftColumn
        │   ├── ProfileCard
        │   ├── AssessmentCard
        │   │   └── AssessmentItem (×4)
        │   └── InsightsCard
        │       ├── TagGroup (×4 sections)
        │       └── AdditionalInsights
        └── RightColumn
            ├── CoachingProgressCard
            │   └── ProgressStepper
            └── CoachFeedbackCard
```

## File Structure
```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Breadcrumb.tsx
│   ├── dashboard/
│   │   ├── StatCard.tsx
│   │   ├── SessionBreakdown.tsx
│   │   ├── MonthlyProgressChart.tsx
│   ├── students/
│   │   ├── SearchBar.tsx
│   │   ├── StudentsTable.tsx
│   │   ├── StageBadge.tsx
│   │   ├── Pagination.tsx
│   ├── student-detail/
│   │   ├── ProfileCard.tsx
│   │   ├── CoachingProgressCard.tsx
│   │   ├── AssessmentCard.tsx
│   │   ├── InsightsCard.tsx
│   │   ├── CoachFeedbackCard.tsx
│   ├── ui/ (shadcn components)
│       ├── card.tsx
│       ├── badge.tsx
│       ├── table.tsx
│       ├── button.tsx
│       └── ...
├── pages/
│   ├── DashboardPage.tsx
│   ├── StudentsListPage.tsx
│   ├── StudentDetailPage.tsx
├── data/
│   ├── mockStudents.ts
│   ├── mockDashboard.ts
│   ├── mockAssessments.ts
├── types/
│   ├── student.ts
│   ├── assessment.ts
│   ├── dashboard.ts
├── utils/
│   ├── formatters.ts (date formatting, number formatting)
│   ├── calculations.ts (calculate percentages, averages)
├── App.tsx
├── main.tsx
└── index.css
```

## Implementation Priority

### Phase 1: Foundation
1. Install dependencies (shadcn/ui, Recharts, React Router)
3. Create TypeScript interfaces/types
4. Setup basic routing structure
5. Create Header component
6. Generate comprehensive mock data

### Phase 2: Dashboard
1. Create DashboardPage layout
2. Implement StatCard component
3. Add session breakdown visualization
4. Implement monthly progress chart with Recharts
5. Connect all components with mock data

### Phase 3: Students List
1. Create StudentsListPage
2. Implement SearchBar with debounced search
3. Create StudentsTable with shadcn/ui Table
4. Add sorting functionality
5. Implement Pagination component
6. Add StageBadge component

### Phase 4: Student Detail
1. Create StudentDetailPage layout
2. Implement Breadcrumb navigation
3. Create ProfileCard with all fields
4. Build CoachingProgressCard with stepper
5. Create AssessmentCard with score comparisons
6. Implement InsightsCard with tags
7. Add CoachFeedbackCard

### Phase 5: Polish & Responsive
1. Test all responsive breakpoints
2. Add loading states (skeletons)
3. Add smooth transitions and animations
4. Test navigation flow
5. Add empty states where needed
6. Final UI polish and consistency check

## Edge Cases to Handle

1. **No Students:**
   - Show friendly empty state with illustration
   - Message: "No students registered yet"

2. **Search No Results:**
   - Show "No students match your search" with search term
   - Provide "Clear search" button

3. **Assessment Not Completed:**
   - Show "Pending" badge
   - Post-intervention score: "Not Completed"

4. **Insights Not Available:**
   - Show message: "Insights will be available after assessment completion"

5. **Coaching Not Completed:**
   - Show message: "Feedback will be available after coaching completion"

6. **Long Student Names/Emails:**
   - Truncate with ellipsis and show full text on hover (tooltip)

7. **Mobile Navigation:**
   - Ensure table is horizontally scrollable
   - Stack cards appropriately
   - Hamburger menu if using sidebar

8. **Invalid Student ID:**
   - Redirect to 404 page or students list
   - Show "Student not found" message

## Success Criteria
- [ ] Dashboard displays all 4 stat cards with correct numbers
- [ ] Session breakdown shows counts for all 9 sessions
- [ ] Monthly progress chart displays 4 assessment trends
- [ ] Students table loads with mock data (30+ students)
- [ ] Search filters students in real-time
- [ ] Pagination works correctly
- [ ] Clicking a student row navigates to detail page
- [ ] Student detail page shows all profile information
- [ ] Assessment scores show pre/post comparison
- [ ] Coaching progress displays current stage correctly
- [ ] Insights show categorized tags
- [ ] Coach feedback displays for completed students
- [ ] All pages are responsive (mobile, tablet, desktop)
- [ ] Stage badges have correct colors
- [ ] Navigation between pages works smoothly

## Accessibility Requirements
- All interactive elements are keyboard accessible
- Proper semantic HTML (header, main, nav, section)
- ARIA labels for icons and buttons
- Color contrast meets WCAG AA standards
- Focus states visible on all interactive elements
- Tables have proper headers with scope attributes

## Performance Considerations
- Use React.memo for table rows (prevent unnecessary re-renders)
- Debounce search input (300ms)
- Lazy load charts (code splitting)
- Optimize bundle size
- Use CSS transforms for animations (not margin/padding)

## Future Enhancements (Out of Scope)
- Real API integration
- Export data to Excel/PDF
- Advanced filters (date range, multiple stages)
- Student comparison view
- Bulk operations
- Email notifications
- Role-based access (different views for different partners)
- Student performance trends over time
- Custom dashboard widgets

## Demo Data Guidelines
- Use realistic Indian names, cities, states
- Dates should be recent (last 6 months)
- Email format: firstname.lastname@email.com or firstname@schoolname.edu
- Phone numbers: Indian format (10 digits)
- Schools: Use well-known school names or generic ones
- Assessment scores: Vary between 40-95 to show realistic distribution
- Progress: Mix of students at different stages
- Ensure at least 2-3 students have complete data (all assessments + feedback)

---

## Notes for Developer
- This is a demo version, so focus on UI/UX quality over data validation
- Make the mock data feel realistic and varied
- Use Tailwind CSS utilities for all styling (avoid custom CSS where possible)
- Follow shadcn/ui patterns for consistent component styling
- Test with different screen sizes throughout development
- Keep components modular and reusable
- Add comments for complex logic
- Use TypeScript strictly (no `any` types)