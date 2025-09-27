import { apiClient } from '@/lib/api/client'
import type { 
  Result, 
  CreateResultDto, 
  UpdateResultDto, 
  ResultStats, 
  GetResultsParams 
} from '../types/results'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

export const resultsService = {
  getAll: (params?: GetResultsParams): Promise<PaginatedResponse<Result>> =>
    apiClient.get('/api/v1/results', { params }),

  getById: (id: string): Promise<ApiResponse<Result>> =>
    apiClient.get(`/api/v1/results/${id}`),

  getBySession: (sessionId: string): Promise<ApiResponse<Result[]>> =>
    apiClient.get(`/api/v1/results/session/${sessionId}`),

  getByStudent: (studentId: string, params?: { published?: boolean }): Promise<ApiResponse<Result[]>> =>
    apiClient.get(`/api/v1/results/student/${studentId}`, { params }),

  getStats: (params?: { sessionId?: string; subjectId?: string }): Promise<ApiResponse<ResultStats>> =>
    apiClient.get('/api/v1/results/stats', { params }),

  create: (data: CreateResultDto): Promise<ApiResponse<Result>> =>
    apiClient.post('/api/v1/results', data),

  createBulk: (data: CreateResultDto[]): Promise<ApiResponse<Result[]>> =>
    apiClient.post('/api/v1/results/bulk', { results: data }),

  update: (id: string, data: UpdateResultDto): Promise<ApiResponse<Result>> =>
    apiClient.patch(`/api/v1/results/${id}`, data),

  verify: (id: string): Promise<ApiResponse<Result>> =>
    apiClient.patch(`/api/v1/results/${id}/verify`),

  publish: (id: string): Promise<ApiResponse<Result>> =>
    apiClient.patch(`/api/v1/results/${id}/publish`),

  publishBulk: (sessionId: string): Promise<ApiResponse<Result[]>> =>
    apiClient.patch(`/api/v1/results/session/${sessionId}/publish`),

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/results/${id}`)
}