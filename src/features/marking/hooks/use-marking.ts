import { apiClient } from '@/lib/api/client'
import type { 
  MarkingSubmission, 
  MarkingStats, 
  MarkAnswerDto, 
  BulkMarkAnswersDto,
  RegistrationAnswersResponse 
} from '../types/marking'

export const markingService = {
  getRegistrationAnswers: async (registrationId: string): Promise<RegistrationAnswersResponse> => {
    return apiClient.get(`/api/v1/student-answers/marking/registration/${registrationId}`)
  },

  markAnswer: async (answerId: string, data: MarkAnswerDto): Promise<any> => {
    return apiClient.patch(`/api/v1/student-answers/marking/answer/${answerId}`, data)
  },

  bulkMarkAnswers: async (registrationId: string, data: BulkMarkAnswersDto): Promise<any> => {
    return apiClient.post(`/api/v1/student-answers/marking/registration/${registrationId}/bulk`, data)
  },

  autoMarkMcq: async (registrationId: string): Promise<{ markedCount: number; message: string }> => {
    return apiClient.post(`/api/v1/student-answers/marking/registration/${registrationId}/auto-mark-mcq`)
  },

  finalizeMarking: async (registrationId: string): Promise<any> => {
    return apiClient.post(`/api/v1/student-answers/marking/registration/${registrationId}/finalize`)
  },

  getSessionSubmissions: async (sessionId: string, isMarked?: boolean): Promise<{ submissions: MarkingSubmission[]; total: number }> => {
    const params = isMarked !== undefined ? { isMarked: isMarked.toString() } : {}
    return apiClient.get(`/api/v1/student-answers/marking/session/${sessionId}/submissions`, { params })
  },

  getMarkingStats: async (sessionId: string): Promise<MarkingStats> => {
    return apiClient.get(`/api/v1/student-answers/marking/session/${sessionId}/stats`)
  },

  unmarkRegistration: async (registrationId: string): Promise<any> => {
    return apiClient.post(`/api/v1/student-answers/marking/registration/${registrationId}/unmark`)
  }
}
