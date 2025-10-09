export const EXAM_SESSION_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const

export type ExamSessionStatus = typeof EXAM_SESSION_STATUS[keyof typeof EXAM_SESSION_STATUS]

export type ExamSession = {
  _id: string
  paperId: string
  paperTitle?: string
  subjectCode?: string
  subjectName?: string
  examTitle: string
  examDateTime: string
  durationMinutes: number
  formattedDuration: string
  roomId: string
  roomNumber?: string
  building?: string
  maxStudents: number
  registeredStudents: number
  instructions?: string
  status: ExamSessionStatus
  createdBy: string
  createdByName?: string
  academicYear: string
  semester: number
  createdAt: string
  updatedAt: string
}

export type CreateExamSessionDto = {
  paperId: string
  examTitle: string
  examDateTime: string
  durationMinutes: number
  roomId: string
  maxStudents: number
  instructions?: string
  academicYear: string
  semester: number
}

export type UpdateExamSessionDto = Partial<CreateExamSessionDto> & {
  status?: ExamSessionStatus
}

export type ExamSessionStats = {
  totalSessions: number
  sessionsByStatus: Record<string, number>
  upcomingSessions: number
  completedSessions: number
}

export type GetExamSessionsParams = {
  paperId?: string
  roomId?: string
  status?: ExamSessionStatus
  academicYear?: string
  semester?: number
  dateFrom?: string
  dateTo?: string
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export type BackendExamSessionsListResponse = {
  examSessions: ExamSession[]
  total: number
  page: number
  limit: number
  totalPages: number
}