import { apiClient } from '@/lib/api/client'
import type { 
  ExamPaper, 
  CreateExamPaperDto, 
  UpdateExamPaperDto, 
  GeneratePaperDto,
  ExamPaperStats, 
  GetExamPapersParams,
  BackendExamPapersListResponse
} from '../types/exam-papers'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

export const examPapersService = {
  getAll: async (params?: GetExamPapersParams): Promise<PaginatedResponse<ExamPaper>> => {
    const response = await apiClient.get<BackendExamPapersListResponse>('/api/v1/exam-papers', { params })
    return {
      data: response.examPapers || [],
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
      totalPages: response.totalPages || 1
    }
  },

  getById: async (id: string, params?: { includeQuestions?: boolean }): Promise<ApiResponse<ExamPaper>> => {
    console.log('=== DEBUG: examPapersService.getById ===')
    console.log('ID:', id)
    console.log('Params:', params)
    const paper = await apiClient.get<ExamPaper>(`/api/v1/exam-papers/${id}`, { params })
    console.log('Response Paper:', paper)
    console.log('Response Questions:', paper.questions)
    return { data: paper }
  },

  getStats: (): Promise<ApiResponse<ExamPaperStats>> =>
    apiClient.get('/api/v1/exam-papers/stats'),

  create: async (data: CreateExamPaperDto): Promise<ApiResponse<ExamPaper>> => {
    const paper = await apiClient.post<ExamPaper>('/api/v1/exam-papers', data)
    return { data: paper }
  },

  generate: async (data: GeneratePaperDto): Promise<ApiResponse<ExamPaper>> => {
    const paper = await apiClient.post<ExamPaper>('/api/v1/exam-papers/generate', data)
    return { data: paper }
  },

  update: async (id: string, data: UpdateExamPaperDto): Promise<ApiResponse<ExamPaper>> => {
    const paper = await apiClient.patch<ExamPaper>(`/api/v1/exam-papers/${id}`, data)
    return { data: paper }
  },

  duplicate: async (id: string, newTitle: string): Promise<ApiResponse<ExamPaper>> => {
    const paper = await apiClient.post<ExamPaper>(`/api/v1/exam-papers/${id}/duplicate`, { newTitle })
    return { data: paper }
  },

  finalize: async (id: string): Promise<ApiResponse<ExamPaper>> => {
    const paper = await apiClient.patch<ExamPaper>(`/api/v1/exam-papers/${id}/finalize`)
    return { data: paper }
  },

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/exam-papers/${id}`)
}