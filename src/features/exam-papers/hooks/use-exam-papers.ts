import { apiClient } from '@/lib/api/client'
import type { 
  ExamPaper, 
  CreateExamPaperDto, 
  UpdateExamPaperDto, 
  GeneratePaperDto,
  ExamPaperStats, 
  GetExamPapersParams 
} from '../types/exam-papers'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

export const examPapersService = {
  getAll: (params?: GetExamPapersParams): Promise<PaginatedResponse<ExamPaper>> =>
    apiClient.get('/api/v1/exam-papers', { params }),

  getById: (id: string, params?: { includeQuestions?: boolean }): Promise<ApiResponse<ExamPaper>> =>
    apiClient.get(`/api/v1/exam-papers/${id}`, { params }),

  getStats: (): Promise<ApiResponse<ExamPaperStats>> =>
    apiClient.get('/api/v1/exam-papers/stats'),

  create: (data: CreateExamPaperDto): Promise<ApiResponse<ExamPaper>> =>
    apiClient.post('/api/v1/exam-papers', data),

  generate: (data: GeneratePaperDto): Promise<ApiResponse<ExamPaper>> =>
    apiClient.post('/api/v1/exam-papers/generate', data),

  update: (id: string, data: UpdateExamPaperDto): Promise<ApiResponse<ExamPaper>> =>
    apiClient.patch(`/api/v1/exam-papers/${id}`, data),

  duplicate: (id: string): Promise<ApiResponse<ExamPaper>> =>
    apiClient.post(`/api/v1/exam-papers/${id}/duplicate`),

  finalize: (id: string): Promise<ApiResponse<ExamPaper>> =>
    apiClient.patch(`/api/v1/exam-papers/${id}/finalize`),

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/exam-papers/${id}`)
}