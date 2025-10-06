 
import { apiClient } from '@/lib/api/client'
import type { 
  StudentEnrollment, 
  CreateEnrollmentDto, 
  UpdateEnrollmentDto, 
  EnrollmentStats, 
  GetEnrollmentsParams,
  AvailableSubject,
  SelfEnrollmentDto
} from '../types/enrollments'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

type BackendEnrollmentsListResponse = {
  enrollments: StudentEnrollment[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const studentEnrollmentsService = {
  getAll: async (params?: GetEnrollmentsParams): Promise<PaginatedResponse<StudentEnrollment>> => {
    const response = await apiClient.get<BackendEnrollmentsListResponse>('/api/v1/student-enrollments', { params })
    return {
      data: response.enrollments || [],
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
      totalPages: response.totalPages || 1
    }
  },

  getById: async (id: string): Promise<ApiResponse<StudentEnrollment>> => {
    const enrollment = await apiClient.get<StudentEnrollment>(`/api/v1/student-enrollments/${id}`)
    return {
      data: enrollment
    }
  },

  getByStudent: async (studentId: string, params?: { academicYear?: string; semester?: number }): Promise<ApiResponse<StudentEnrollment[]>> => {
    const enrollments = await apiClient.get<StudentEnrollment[]>(`/api/v1/student-enrollments/student/${studentId}`, { params })
    return {
      data: Array.isArray(enrollments) ? enrollments : []
    }
  },


  getMyEnrollments: async (params?: { academicYear?: string; semester?: number; status?: string }): Promise<ApiResponse<StudentEnrollment[]>> => {
    const enrollments = await apiClient.get<StudentEnrollment[]>('/api/v1/student-enrollments/my-enrollments', { params })
    return {
      data: Array.isArray(enrollments) ? enrollments : []
    }
  },

  getBySubject: async (subjectId: string, params?: { academicYear?: string; semester?: number }): Promise<ApiResponse<StudentEnrollment[]>> => {
    const enrollments = await apiClient.get<StudentEnrollment[]>(`/api/v1/student-enrollments/subject/${subjectId}`, { params })
    return {
      data: Array.isArray(enrollments) ? enrollments : []
    }
  },

  getStats: (): Promise<ApiResponse<EnrollmentStats>> =>
    apiClient.get('/api/v1/student-enrollments/stats'),


  getAvailableSubjects: async (academicYear: string, semester: number): Promise<ApiResponse<AvailableSubject[]>> => {
    const subjects = await apiClient.get<AvailableSubject[]>('/api/v1/student-enrollments/available-subjects', {
      params: { academicYear, semester }
    })
    return {
      data: Array.isArray(subjects) ? subjects : []
    }
  },

  create: async (data: CreateEnrollmentDto): Promise<ApiResponse<StudentEnrollment>> => {
    const enrollment = await apiClient.post<StudentEnrollment>('/api/v1/student-enrollments', data)
    return {
      data: enrollment
    }
  },


  selfEnroll: async (data: SelfEnrollmentDto): Promise<ApiResponse<StudentEnrollment>> => {
    const enrollment = await apiClient.post<StudentEnrollment>('/api/v1/student-enrollments/self-enroll', data)
    return {
      data: enrollment
    }
  },

  update: async (id: string, data: UpdateEnrollmentDto): Promise<ApiResponse<StudentEnrollment>> => {
    const enrollment = await apiClient.patch<StudentEnrollment>(`/api/v1/student-enrollments/${id}`, data)
    return {
      data: enrollment
    }
  },

  withdraw: async (id: string, reason?: string): Promise<ApiResponse<StudentEnrollment>> => {
    const enrollment = await apiClient.patch<StudentEnrollment>(`/api/v1/student-enrollments/${id}/withdraw`, { reason })
    return {
      data: enrollment
    }
  },

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/student-enrollments/${id}`)
}