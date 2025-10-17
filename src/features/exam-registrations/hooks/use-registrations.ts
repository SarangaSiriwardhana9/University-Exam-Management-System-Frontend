import { apiClient } from '@/lib/api/client'
import type { 
  ExamRegistration,
  RegistrationStats,
  GetRegistrationsParams,
  RegistrationsListResponse
} from '../types/registrations'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

export const registrationsService = {
  getAll: async (params?: GetRegistrationsParams): Promise<PaginatedResponse<ExamRegistration>> => {
    const response = await apiClient.get<RegistrationsListResponse>('/api/v1/exam-registrations', { params: params as Record<string, unknown> })
    console.log('Registrations API Response:', response)
    return {
      data: response.registrations || [],
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
      totalPages: response.totalPages || 1
    }
  },

  getById: async (id: string): Promise<ApiResponse<ExamRegistration>> => {
    return apiClient.get(`/api/v1/exam-registrations/${id}`)
  },

  getBySession: async (sessionId: string, params?: GetRegistrationsParams): Promise<PaginatedResponse<ExamRegistration>> => {
    const response = await apiClient.get<RegistrationsListResponse>(`/api/v1/exam-registrations/session/${sessionId}`, { params: params as Record<string, unknown> })
    return {
      data: response.registrations || [],
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
      totalPages: response.totalPages || 1
    }
  },

  getStats: async (sessionId?: string): Promise<ApiResponse<RegistrationStats>> => {
    const url = sessionId 
      ? `/api/v1/exam-registrations/stats?sessionId=${sessionId}`
      : '/api/v1/exam-registrations/stats'
    return apiClient.get(url)
  },

  markAsAbsent: async (id: string): Promise<ApiResponse<ExamRegistration>> => {
    return apiClient.patch(`/api/v1/exam-registrations/${id}/absent`)
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/api/v1/exam-registrations/${id}`)
  },

  exportData: async (params?: GetRegistrationsParams): Promise<Blob> => {
    const response = await fetch('/api/v1/exam-registrations/export', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
    return response.blob()
  }
}
