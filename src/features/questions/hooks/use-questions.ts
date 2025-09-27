import { apiClient } from '@/lib/api/client'
import type { 
  Question, 
  CreateQuestionDto, 
  UpdateQuestionDto, 
  QuestionStats, 
  GetQuestionsParams 
} from '../types/questions'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

export const questionsService = {
  getAll: (params?: GetQuestionsParams): Promise<PaginatedResponse<Question>> =>
    apiClient.get('/api/v1/questions', { params }),

  getById: (id: string): Promise<ApiResponse<Question>> =>
    apiClient.get(`/api/v1/questions/${id}`),

  getBySubject: (subjectId: string, params?: { includePrivate?: boolean }): Promise<ApiResponse<Question[]>> =>
    apiClient.get(`/api/v1/questions/subject/${subjectId}`, { params }),

  getStats: (): Promise<ApiResponse<QuestionStats>> =>
    apiClient.get('/api/v1/questions/stats'),

  create: (data: CreateQuestionDto): Promise<ApiResponse<Question>> =>
    apiClient.post('/api/v1/questions', data),

  update: (id: string, data: UpdateQuestionDto): Promise<ApiResponse<Question>> =>
    apiClient.patch(`/api/v1/questions/${id}`, data),

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/questions/${id}`)
}