export type AcademicCalendar = {
  _id: string
  academicYear: string
  semester: number
  semesterName: string
  semesterStart: string
  semesterEnd: string
  examStart: string
  examEnd: string
  resultPublishDate?: string
  isCurrent: boolean
  isActive: boolean
  description?: string
  examDuration: number
  createdAt: string
  updatedAt: string
}

export type CreateCalendarDto = {
  academicYear: string
  semester: number
  semesterStart: string
  semesterEnd: string
  examStart: string
  examEnd: string
  resultPublishDate?: string
  isCurrent?: boolean
  description?: string
}

export type UpdateCalendarDto = Partial<CreateCalendarDto> & {
  isActive?: boolean
}

export type CalendarSummary = {
  currentSemester: AcademicCalendar | null
  upcomingDeadlines: Array<{
    type: string
    date: string
    description: string
  }>
}

export type GetCalendarParams = {
  academicYear?: string
  semester?: number
  isCurrent?: boolean
  isActive?: boolean
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}