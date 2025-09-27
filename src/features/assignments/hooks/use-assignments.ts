import { apiClient } from '@/lib/api/client'
import type { 
  InvigilatorAssignment, 
  CreateAssignmentDto, 
  UpdateAssignmentDto, 
  AssignmentStats, 
  GetAssignmentsParams 
} from '../types/assignments'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

export const invigilatorAssignmentsService = {
  getAll: (params?: GetAssignmentsParams): Promise<PaginatedResponse<InvigilatorAssignment>> =>
    apiClient.get('/api/v1/invigilator-assignments', { params }),

  getById: (id: string): Promise<ApiResponse<InvigilatorAssignment>> =>
    apiClient.get(`/api/v1/invigilator-assignments/${id}`),

  getBySession: (sessionId: string): Promise<ApiResponse<InvigilatorAssignment[]>> =>
    apiClient.get(`/api/v1/invigilator-assignments/session/${sessionId}`),

  getByInvigilator: (invigilatorId: string, params?: { upcoming?: boolean }): Promise<ApiResponse<InvigilatorAssignment[]>> =>
    apiClient.get(`/api/v1/invigilator-assignments/invigilator/${invigilatorId}`, { params }),

  getStats: (): Promise<ApiResponse<AssignmentStats>> =>
    apiClient.get('/api/v1/invigilator-assignments/stats'),

  create: (data: CreateAssignmentDto): Promise<ApiResponse<InvigilatorAssignment>> =>
    apiClient.post('/api/v1/invigilator-assignments', data),

  update: (id: string, data: UpdateAssignmentDto): Promise<ApiResponse<InvigilatorAssignment>> =>
    apiClient.patch(`/api/v1/invigilator-assignments/${id}`, data),

  confirm: (id: string): Promise<ApiResponse<InvigilatorAssignment>> =>
    apiClient.patch(`/api/v1/invigilator-assignments/${id}/confirm`),

  decline: (id: string, reason?: string): Promise<ApiResponse<InvigilatorAssignment>> =>
    apiClient.patch(`/api/v1/invigilator-assignments/${id}/decline`, { reason }),

  complete: (id: string, notes?: string): Promise<ApiResponse<InvigilatorAssignment>> =>
    apiClient.patch(`/api/v1/invigilator-assignments/${id}/complete`, { notes }),

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/invigilator-assignments/${id}`)
}