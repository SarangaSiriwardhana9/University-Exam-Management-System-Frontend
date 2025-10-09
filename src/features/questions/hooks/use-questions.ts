 
import { apiClient } from '@/lib/api/client'
import type { 
  Question, 
  CreateQuestionDto, 
  UpdateQuestionDto, 
  QuestionStats, 
  GetQuestionsParams,
  BackendQuestionsListResponse
} from '../types/questions'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

type RawQuestion = Omit<Question, 'subjectId' | 'subjectCode' | 'subjectName'> & {
  subjectId: string | { _id: string; subjectCode: string; subjectName: string }
}

 
const extractSubjectCode = (subjectId: RawQuestion['subjectId']): string | undefined => {
  if (!subjectId) return undefined
  
 
  if (typeof subjectId === 'object' && '_id' in subjectId) {
    return subjectId.subjectCode
  }
 
  if (typeof subjectId === 'string' && subjectId.includes('subjectCode')) {
    try {
      const match = subjectId.match(/subjectCode:\s*'([^']+)'/)
      if (match && match[1]) {
        return match[1]
      }
    } catch (error) {
      console.error('Failed to parse subjectId:', error)
    }
  }
  
  return undefined
}

const extractSubjectName = (subjectId: RawQuestion['subjectId']): string | undefined => {
  if (!subjectId) return undefined
  
 
  if (typeof subjectId === 'object' && '_id' in subjectId) {
    return subjectId.subjectName
  }
  
 
  if (typeof subjectId === 'string' && subjectId.includes('subjectName')) {
    try {
      const match = subjectId.match(/subjectName:\s*'([^']+)'/)
      if (match && match[1]) {
        return match[1]
      }
    } catch (error) {
      console.error('Failed to parse subjectId:', error)
    }
  }
  
  return undefined
}

 
const extractSubjectId = (subjectId: RawQuestion['subjectId']): string => {
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
      if (match && match[1]) {
        return match[1]
      }
    } catch (error) {
      console.error('Failed to parse subjectId:', error)
    }
  }
  
  return ''
}

 
const transformQuestion = (question: RawQuestion): Question => {
  const subjectId = extractSubjectId(question.subjectId)
  const subjectCode = extractSubjectCode(question.subjectId)
  const subjectName = extractSubjectName(question.subjectId)
  
  return {
    ...question,
    subjectId,
    subjectCode,
    subjectName
  }
}

export const questionsService = {
  getAll: async (params?: GetQuestionsParams): Promise<PaginatedResponse<Question>> => {
    const response = await apiClient.get<BackendQuestionsListResponse>('/api/v1/questions', { params })
    return {
      data: (response.questions || []).map(transformQuestion),
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
      totalPages: response.totalPages || 1
    }
  },

  getById: async (id: string): Promise<ApiResponse<Question>> => {
    const question = await apiClient.get<RawQuestion>(`/api/v1/questions/${id}`)
    return {
      data: transformQuestion(question)
    }
  },

  getBySubject: async (subjectId: string, params?: { includePrivate?: boolean }): Promise<ApiResponse<Question[]>> => {
    const questions = await apiClient.get<RawQuestion[]>(`/api/v1/questions/subject/${subjectId}`, { params })
    return {
      data: Array.isArray(questions) ? questions.map(transformQuestion) : []
    }
  },

  getStats: (): Promise<ApiResponse<QuestionStats>> =>
    apiClient.get('/api/v1/questions/stats'),

  create: async (data: CreateQuestionDto): Promise<ApiResponse<Question>> => {
    const question = await apiClient.post<RawQuestion>('/api/v1/questions', data)
    return {
      data: transformQuestion(question)
    }
  },

  update: async (id: string, data: UpdateQuestionDto): Promise<ApiResponse<Question>> => {
    const question = await apiClient.patch<RawQuestion>(`/api/v1/questions/${id}`, data)
    return {
      data: transformQuestion(question)
    }
  },

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/questions/${id}`)
}