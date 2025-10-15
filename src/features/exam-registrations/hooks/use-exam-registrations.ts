import { apiClient } from '@/lib/api/client'
import type { 
  ExamRegistration, 
  CreateExamRegistrationDto, 
  UpdateExamRegistrationDto,
  GetExamRegistrationsParams,
  BackendExamRegistrationsListResponse
} from '../types/exam-registrations'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

export const examRegistrationsService = {
  getAll: async (params?: GetExamRegistrationsParams): Promise<PaginatedResponse<ExamRegistration>> => {
    const response = await apiClient.get<BackendExamRegistrationsListResponse>('/api/v1/exam-registrations', { params })
    return {
      data: response.registrations || [],
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
      totalPages: response.totalPages || 1
    }
  },

  getById: async (id: string): Promise<ApiResponse<ExamRegistration>> => {
    const registration = await apiClient.get<ExamRegistration>(`/api/v1/exam-registrations/${id}`)
    return { data: registration }
  },

  getMyRegistrations: async (): Promise<ApiResponse<ExamRegistration[]>> => {
    const registrations = await apiClient.get<ExamRegistration[]>('/api/v1/exam-registrations/my-registrations')
    return { data: Array.isArray(registrations) ? registrations : [] }
  },

  getBySession: async (sessionId: string): Promise<ApiResponse<ExamRegistration[]>> => {
    const registrations = await apiClient.get<ExamRegistration[]>(`/api/v1/exam-registrations/session/${sessionId}`)
    return { data: Array.isArray(registrations) ? registrations : [] }
  },

  create: async (data: CreateExamRegistrationDto): Promise<ApiResponse<ExamRegistration>> => {
    const registration = await apiClient.post<ExamRegistration>('/api/v1/exam-registrations', data)
    return { data: registration }
  },

  update: async (id: string, data: UpdateExamRegistrationDto): Promise<ApiResponse<ExamRegistration>> => {
    const registration = await apiClient.patch<ExamRegistration>(`/api/v1/exam-registrations/${id}`, data)
    return { data: registration }
  },

  cancel: async (id: string, reason?: string): Promise<ApiResponse<ExamRegistration>> => {
    const registration = await apiClient.patch<ExamRegistration>(`/api/v1/exam-registrations/${id}`, {
      status: 'cancelled',
      cancellationReason: reason || 'Cancelled by student'
    })
    return { data: registration }
  },

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/exam-registrations/${id}`),

  verifyEnrollmentKey: async (id: string, enrollmentKey: string): Promise<ApiResponse<{ verified: boolean; registrationId: string; sessionId: string; paperId: string }>> => {
    const result = await apiClient.post<{ verified: boolean; registrationId: string; sessionId: string; paperId: string }>(`/api/v1/exam-registrations/${id}/verify-enrollment`, { enrollmentKey })
    return { data: result }
  }
}
