import { apiClient } from '@/lib/api/client'
import type { 
  ExamSession, 
  CreateExamSessionDto, 
  UpdateExamSessionDto, 
  ExamSessionStats, 
  GetExamSessionsParams,
  BackendExamSessionsListResponse
} from '../types/exam-sessions'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

type RawExamSession = Omit<ExamSession, 'paperId' | 'paperTitle' | 'subjectCode' | 'subjectName' | 'roomId' | 'roomNumber' | 'building'> & {
  paperId: string | { _id: string; paperTitle: string; subjectCode?: string; subjectName?: string }
  roomId: string | { _id: string; roomNumber: string; building?: string }
}

// Helper functions for paper transformation
const extractPaperId = (paperId: RawExamSession['paperId']): string => {
  if (!paperId) return ''
  if (typeof paperId === 'string' && !paperId.includes('{')) {
    return paperId
  }
  if (typeof paperId === 'object' && '_id' in paperId) {
    return paperId._id
  }
  return ''
}

const extractPaperTitle = (paperId: RawExamSession['paperId']): string | undefined => {
  if (!paperId) return undefined
  if (typeof paperId === 'object' && '_id' in paperId) {
    return paperId.paperTitle
  }
  return undefined
}

const extractSubjectCode = (paperId: RawExamSession['paperId']): string | undefined => {
  if (!paperId) return undefined
  if (typeof paperId === 'object' && '_id' in paperId) {
    return paperId.subjectCode
  }
  return undefined
}

const extractSubjectName = (paperId: RawExamSession['paperId']): string | undefined => {
  if (!paperId) return undefined
  if (typeof paperId === 'object' && '_id' in paperId) {
    return paperId.subjectName
  }
  return undefined
}

// Helper functions for room transformation
const extractRoomId = (roomId: RawExamSession['roomId']): string => {
  if (!roomId) return ''
  if (typeof roomId === 'string' && !roomId.includes('{')) {
    return roomId
  }
  if (typeof roomId === 'object' && '_id' in roomId) {
    return roomId._id
  }
  return ''
}

const extractRoomNumber = (roomId: RawExamSession['roomId']): string | undefined => {
  if (!roomId) return undefined
  if (typeof roomId === 'object' && '_id' in roomId) {
    return roomId.roomNumber
  }
  return undefined
}

const extractBuilding = (roomId: RawExamSession['roomId']): string | undefined => {
  if (!roomId) return undefined
  if (typeof roomId === 'object' && '_id' in roomId) {
    return roomId.building
  }
  return undefined
}

const transformExamSession = (session: RawExamSession): ExamSession => {
  const paperId = extractPaperId(session.paperId)
  const paperTitle = extractPaperTitle(session.paperId)
  const subjectCode = extractSubjectCode(session.paperId)
  const subjectName = extractSubjectName(session.paperId)
  const roomId = extractRoomId(session.roomId)
  const roomNumber = extractRoomNumber(session.roomId)
  const building = extractBuilding(session.roomId)
  
  return {
    ...session,
    paperId,
    paperTitle,
    subjectCode,
    subjectName,
    roomId,
    roomNumber,
    building
  }
}

export const examSessionsService = {
  getAll: async (params?: GetExamSessionsParams): Promise<PaginatedResponse<ExamSession>> => {
    const response = await apiClient.get<BackendExamSessionsListResponse>('/api/v1/exam-sessions', { params })
    return {
      data: (response.examSessions || []).map(transformExamSession),
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
      totalPages: response.totalPages || 1
    }
  },

  getById: async (id: string): Promise<ApiResponse<ExamSession>> => {
    const session = await apiClient.get<RawExamSession>(`/api/v1/exam-sessions/${id}`)
    return {
      data: transformExamSession(session)
    }
  },

  getUpcoming: async (params?: { limit?: number }): Promise<ApiResponse<ExamSession[]>> => {
    const sessions = await apiClient.get<RawExamSession[]>('/api/v1/exam-sessions/upcoming', { params })
    return {
      data: sessions.map(transformExamSession)
    }
  },

  getStats: (): Promise<ApiResponse<ExamSessionStats>> =>
    apiClient.get('/api/v1/exam-sessions/stats'),

  create: async (data: CreateExamSessionDto): Promise<ApiResponse<ExamSession>> => {
    const session = await apiClient.post<RawExamSession>('/api/v1/exam-sessions', data)
    return {
      data: transformExamSession(session)
    }
  },

  update: async (id: string, data: UpdateExamSessionDto): Promise<ApiResponse<ExamSession>> => {
    const session = await apiClient.patch<RawExamSession>(`/api/v1/exam-sessions/${id}`, data)
    return {
      data: transformExamSession(session)
    }
  },

  cancel: async (id: string, reason?: string): Promise<ApiResponse<ExamSession>> => {
    const session = await apiClient.patch<RawExamSession>(`/api/v1/exam-sessions/${id}/cancel`, { reason })
    return {
      data: transformExamSession(session)
    }
  },

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/exam-sessions/${id}`)
}