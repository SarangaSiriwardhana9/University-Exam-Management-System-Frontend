import { apiClient } from '@/lib/api/client'
import type { 
  ExamRegistration, 
  CreateRegistrationDto, 
  UpdateRegistrationDto, 
  RegistrationStats, 
  GetRegistrationsParams 
} from '../types/registrations'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

export const examRegistrationsService = {
  getAll: (params?: GetRegistrationsParams): Promise<PaginatedResponse<ExamRegistration>> =>
    apiClient.get('/api/v1/exam-registrations', { params }),

  getById: (id: string): Promise<ApiResponse<ExamRegistration>> =>
    apiClient.get(`/api/v1/exam-registrations/${id}`),

  getBySession: (sessionId: string): Promise<ApiResponse<ExamRegistration[]>> =>
    apiClient.get(`/api/v1/exam-registrations/session/${sessionId}`),

  getByStudent: (studentId: string, params?: { upcoming?: boolean }): Promise<ApiResponse<ExamRegistration[]>> =>
    apiClient.get(`/api/v1/exam-registrations/student/${studentId}`, { params }),

  getStats: (): Promise<ApiResponse<RegistrationStats>> =>
    apiClient.get('/api/v1/exam-registrations/stats'),

  create: (data: CreateRegistrationDto): Promise<ApiResponse<ExamRegistration>> =>
    apiClient.post('/api/v1/exam-registrations', data),

  update: (id: string, data: UpdateRegistrationDto): Promise<ApiResponse<ExamRegistration>> =>
    apiClient.patch(`/api/v1/exam-registrations/${id}`, data),

  cancel: (id: string, reason?: string): Promise<ApiResponse<ExamRegistration>> =>
    apiClient.patch(`/api/v1/exam-registrations/${id}/cancel`, { reason }),

  markAttendance: (id: string, status: string): Promise<ApiResponse<ExamRegistration>> =>
    apiClient.patch(`/api/v1/exam-registrations/${id}/attendance`, { status }),

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/exam-registrations/${id}`)
}