import { apiClient } from '@/lib/api/client'
import type { 
  ExamSession, 
  CreateExamSessionDto, 
  UpdateExamSessionDto, 
  ExamSessionStats, 
  GetExamSessionsParams 
} from '../types/exam-sessions'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

export const examSessionsService = {
  getAll: (params?: GetExamSessionsParams): Promise<PaginatedResponse<ExamSession>> =>
    apiClient.get('/api/v1/exam-sessions', { params }),

  getById: (id: string): Promise<ApiResponse<ExamSession>> =>
    apiClient.get(`/api/v1/exam-sessions/${id}`),

  getUpcoming: (params?: { limit?: number }): Promise<ApiResponse<ExamSession[]>> =>
    apiClient.get('/api/v1/exam-sessions/upcoming', { params }),

  getStats: (): Promise<ApiResponse<ExamSessionStats>> =>
    apiClient.get('/api/v1/exam-sessions/stats'),

  create: (data: CreateExamSessionDto): Promise<ApiResponse<ExamSession>> =>
    apiClient.post('/api/v1/exam-sessions', data),

  update: (id: string, data: UpdateExamSessionDto): Promise<ApiResponse<ExamSession>> =>
    apiClient.patch(`/api/v1/exam-sessions/${id}`, data),

  cancel: (id: string, reason?: string): Promise<ApiResponse<ExamSession>> =>
    apiClient.patch(`/api/v1/exam-sessions/${id}/cancel`, { reason }),

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/exam-sessions/${id}`)
}