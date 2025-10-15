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
}
