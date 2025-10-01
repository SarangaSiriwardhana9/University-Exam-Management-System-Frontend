import { apiClient } from '@/lib/api/client'
import type { 
  Subject, 
  CreateSubjectDto, 
  UpdateSubjectDto, 
  AssignFacultyDto,
  FacultyAssignment,
  SubjectStats, 
  GetSubjectsParams 
} from '../types/subjects'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

type BackendSubjectsListResponse = {
  subjects: Subject[]
  total: number
  page: number
  limit: number
  totalPages: number
}

type RawSubject = Omit<Subject, 'departmentId' | 'departmentName'> & {
  departmentId: string | { _id: string; departmentCode: string; departmentName: string }
}

// Helper function to extract department name
const extractDepartmentName = (departmentId: RawSubject['departmentId']): string | undefined => {
  if (!departmentId) return undefined
  
  // If it's already an object
  if (typeof departmentId === 'object' && '_id' in departmentId) {
    return departmentId.departmentName
  }
  
  // If it's a stringified object (malformed backend response)
  if (typeof departmentId === 'string' && departmentId.includes('departmentName')) {
    try {
      // Try to extract the departmentName from the string
      const match = departmentId.match(/departmentName:\s*'([^']+)'/)
      if (match && match[1]) {
        return match[1]
      }
    } catch (error) {
      console.error('Failed to parse departmentId:', error)
    }
  }
  
  return undefined
}

// Helper function to extract department ID
const extractDepartmentId = (departmentId: RawSubject['departmentId']): string | undefined => {
  if (!departmentId) return undefined
  
  // If it's a string ID
  if (typeof departmentId === 'string' && !departmentId.includes('{')) {
    return departmentId
  }
  
  // If it's an object
  if (typeof departmentId === 'object' && '_id' in departmentId) {
    return departmentId._id
  }
  
  // If it's a stringified object
  if (typeof departmentId === 'string' && departmentId.includes('ObjectId')) {
    try {
      const match = departmentId.match(/ObjectId\('([^']+)'\)/)
      if (match && match[1]) {
        return match[1]
      }
    } catch (error) {
      console.error('Failed to parse departmentId:', error)
    }
  }
  
  return undefined
}

// Transform subject to normalize the data
const transformSubject = (subj: RawSubject): Subject => {
  const departmentId = extractDepartmentId(subj.departmentId)
  const departmentName = extractDepartmentName(subj.departmentId)
  
  return {
    ...subj,
    departmentId: departmentId || '',
    departmentName: departmentName
  }
}

export const subjectsService = {
  getAll: async (params?: GetSubjectsParams): Promise<PaginatedResponse<Subject>> => {
    const response = await apiClient.get<BackendSubjectsListResponse>('/api/v1/subjects', { params })
    return {
      data: (response.subjects || []).map(transformSubject),
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
      totalPages: response.totalPages || 1
    }
  },

  getById: async (id: string): Promise<ApiResponse<Subject>> => {
    const subject = await apiClient.get<RawSubject>(`/api/v1/subjects/${id}`)
    return {
      data: transformSubject(subject)
    }
  },

  getByDepartment: async (departmentId: string): Promise<ApiResponse<Subject[]>> => {
    const subjects = await apiClient.get<RawSubject[]>(`/api/v1/subjects/department/${departmentId}`)
    return {
      data: Array.isArray(subjects) ? subjects.map(transformSubject) : []
    }
  },

  getStats: (): Promise<ApiResponse<SubjectStats>> =>
    apiClient.get('/api/v1/subjects/stats'),

  create: async (data: CreateSubjectDto): Promise<ApiResponse<Subject>> => {
    const subject = await apiClient.post<RawSubject>('/api/v1/subjects', data)
    return {
      data: transformSubject(subject)
    }
  },

  update: async (id: string, data: UpdateSubjectDto): Promise<ApiResponse<Subject>> => {
    const subject = await apiClient.patch<RawSubject>(`/api/v1/subjects/${id}`, data)
    return {
      data: transformSubject(subject)
    }
  },

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/subjects/${id}`),

  assignFaculty: (id: string, data: AssignFacultyDto): Promise<ApiResponse<FacultyAssignment>> =>
    apiClient.post(`/api/v1/subjects/${id}/assign-faculty`, data),

  getFacultyAssignments: (id: string, params?: { academicYear?: string; semester?: number }): Promise<ApiResponse<FacultyAssignment[]>> =>
    apiClient.get(`/api/v1/subjects/${id}/faculty`, { params }),

  removeFacultyAssignment: (assignmentId: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/subjects/faculty-assignment/${assignmentId}`)
}