// src/features/exam-papers/hooks/use-exam-papers.ts
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

type RawExamPaper = Omit<ExamPaper, 'subjectId' | 'subjectCode' | 'subjectName'> & {
  subjectId: string | { _id: string; subjectCode: string; subjectName: string }
}

// Helper functions for subject transformation
const extractSubjectCode = (subjectId: RawExamPaper['subjectId']): string | undefined => {
  if (!subjectId) return undefined
  if (typeof subjectId === 'object' && '_id' in subjectId) {
    return subjectId.subjectCode
  }
  if (typeof subjectId === 'string' && subjectId.includes('subjectCode')) {
    try {
      const match = subjectId.match(/subjectCode:\s*'([^']+)'/)
      if (match && match[1]) return match[1]
    } catch (error) {
      console.error('Failed to parse subjectId:', error)
    }
  }
  return undefined
}

const extractSubjectName = (subjectId: RawExamPaper['subjectId']): string | undefined => {
  if (!subjectId) return undefined
  if (typeof subjectId === 'object' && '_id' in subjectId) {
    return subjectId.subjectName
  }
  if (typeof subjectId === 'string' && subjectId.includes('subjectName')) {
    try {
      const match = subjectId.match(/subjectName:\s*'([^']+)'/)
      if (match && match[1]) return match[1]
    } catch (error) {
      console.error('Failed to parse subjectId:', error)
    }
  }
  return undefined
}

const extractSubjectId = (subjectId: RawExamPaper['subjectId']): string => {
  if (!subjectId) return ''
  if (typeof subjectId === 'string' && !subjectId.includes('{')) {
    return subjectId
  }
  if (typeof subjectId === 'object' && '_id' in subjectId) {
    return subjectId._id
  }
  if (typeof subjectId === 'string' && subjectId.includes('ObjectId')) {
    try {
      const match = subjectId.match(/ObjectId\('([^']+)'\)/)
      if (match && match[1]) return match[1]
    } catch (error) {
      console.error('Failed to parse subjectId:', error)
    }
  }
  return ''
}

const transformExamPaper = (paper: RawExamPaper): ExamPaper => {
  const subjectId = extractSubjectId(paper.subjectId)
  const subjectCode = extractSubjectCode(paper.subjectId)
  const subjectName = extractSubjectName(paper.subjectId)
  
  return {
    ...paper,
    subjectId,
    subjectCode,
    subjectName
  }
}

export const examPapersService = {
  getAll: async (params?: GetExamPapersParams): Promise<PaginatedResponse<ExamPaper>> => {
    const response = await apiClient.get<BackendExamPapersListResponse>('/api/v1/exam-papers', { params })
    return {
      data: (response.examPapers || []).map(transformExamPaper),
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
      totalPages: response.totalPages || 1
    }
  },

  getById: async (id: string, params?: { includeQuestions?: boolean }): Promise<ApiResponse<ExamPaper>> => {
    const paper = await apiClient.get<RawExamPaper>(`/api/v1/exam-papers/${id}`, { params })
    return {
      data: transformExamPaper(paper)
    }
  },

  getStats: (): Promise<ApiResponse<ExamPaperStats>> =>
    apiClient.get('/api/v1/exam-papers/stats'),

  create: async (data: CreateExamPaperDto): Promise<ApiResponse<ExamPaper>> => {
    const paper = await apiClient.post<RawExamPaper>('/api/v1/exam-papers', data)
    return {
      data: transformExamPaper(paper)
    }
  },

  generate: async (data: GeneratePaperDto): Promise<ApiResponse<ExamPaper>> => {
    const paper = await apiClient.post<RawExamPaper>('/api/v1/exam-papers/generate', data)
    return {
      data: transformExamPaper(paper)
    }
  },

  update: async (id: string, data: UpdateExamPaperDto): Promise<ApiResponse<ExamPaper>> => {
    const paper = await apiClient.patch<RawExamPaper>(`/api/v1/exam-papers/${id}`, data)
    return {
      data: transformExamPaper(paper)
    }
  },

  duplicate: async (id: string): Promise<ApiResponse<ExamPaper>> => {
    const paper = await apiClient.post<RawExamPaper>(`/api/v1/exam-papers/${id}/duplicate`)
    return {
      data: transformExamPaper(paper)
    }
  },

  finalize: async (id: string): Promise<ApiResponse<ExamPaper>> => {
    const paper = await apiClient.patch<RawExamPaper>(`/api/v1/exam-papers/${id}/finalize`)
    return {
      data: transformExamPaper(paper)
    }
  },

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/exam-papers/${id}`)
}