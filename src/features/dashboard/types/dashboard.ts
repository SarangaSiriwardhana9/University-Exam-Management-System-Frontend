export type DashboardActivity = {
  id: string
  type: string
  description: string
  timestamp: string
  userId: string
  userName: string
}

export type DashboardStats = {
  totalUsers: number
  totalDepartments: number
  totalSubjects: number
  totalExamSessions: number
  upcomingExams: number
  recentActivity: DashboardActivity[]
}

export type AdminDashboard = {
  overview: {
    totalStudents: number
    totalFaculty: number
    totalSubjects: number
    upcomingExams: number
    pendingResults: number
    overallPassRate: number
  }
  examStats: {
    scheduledExams: number
    ongoingExams: number
    completedExams: number
    cancelledExams: number
    averageAttendanceRate: number
  }
  recentActivities: Array<{
    id: string
    type: string
    description: string
    timestamp: string
    actor: string
  }>
  charts: {
    examsByMonth: Record<string, number>
    gradeDistribution: Record<string, number>
  }
}

export type FacultyDashboard = {
  overview: {
    mySubjects: number
    myUpcomingExams: number
    myPendingResults: number
    myActiveStudents: number
  }
  examStats: {
    scheduledExams: number
    ongoingExams: number
    completedExams: number
    totalQuestions: number
    totalPapers: number
  }
  recentActivities: Array<{
    type: string
    title: string
    status: string
    date: string
    createdAt: string
  }>
}

export type StudentDashboard = {
  enrolledSubjects: number
  upcomingExams: Array<{
    id: string
    title: string
    date: string
    room: string
  }>
  completedExams: number
  pendingResults: number
  recentGrades: Array<{
    id: string
    subject: string
    marks: number
    grade: string
  }>
  notifications: Array<{
    id: string
    title: string
    message: string
    time: string
  }>
}