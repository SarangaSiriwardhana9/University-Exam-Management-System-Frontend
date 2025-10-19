import { apiClient } from '@/lib/api/client'

export interface ExamStatus {
  registrationId: string
  status: string
  examStartTime?: string
  examEndTime?: string
  timeRemainingSeconds: number
  isAutoSubmitted: boolean
  canStart: boolean
  sessionStartTime: string
  sessionEndTime: string
  deliveryMode: string
}

export interface ExamCalendarEvent {
  registrationId: string
  examTitle: string
  examDate: string
  startTime: string
  endTime: string
  durationMinutes: number
  year: number
  semester: number
  deliveryMode: string
  status: string
  seatNumber?: string
  subject: {
    id: string
    code: string
    name: string
    credits: number
  }
  room: {
    id: string
    roomNumber: string
    building: string
    floor: string
    capacity: number
  } | null
  paper: {
    id: string
    totalMarks: number
  }
  specialInstructions?: string
}

export interface ExamCalendarResponse {
  totalExams: number
  exams: ExamCalendarEvent[]
  examsByDate: Record<string, ExamCalendarEvent[]>
  upcomingExams: number
  completedExams: number
}

export interface GetExamCalendarParams {
  year?: number
  semester?: number
  fromDate?: string
  toDate?: string
}

export const examRegistrationsApi = {
  startExam: async (registrationId: string) => {
    return apiClient.post(`/api/v1/exam-registrations/${registrationId}/start`)
  },

  getExamStatus: async (registrationId: string) => {
    return apiClient.get<ExamStatus>(`/api/v1/exam-registrations/${registrationId}/status`)
  },

  updateActivity: async (registrationId: string) => {
    return apiClient.post(`/api/v1/exam-registrations/${registrationId}/activity`)
  },

  getMyExamCalendar: async (params?: GetExamCalendarParams) => {
    return apiClient.get<ExamCalendarResponse>('/api/v1/exam-registrations/my-exam-calendar', { params })
  },
}
