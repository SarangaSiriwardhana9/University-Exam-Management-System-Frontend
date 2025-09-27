import { apiClient } from '@/lib/api/client'
import type { 
  StudentEnrollment, 
  CreateEnrollmentDto, 
  UpdateEnrollmentDto, 
  EnrollmentStats, 
  GetEnrollmentsParams 
} from '../types/enrollments'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

export const studentEnrollmentsService = {
  getAll: (params?: GetEnrollmentsParams): Promise<PaginatedResponse<StudentEnrollment>> =>
    apiClient.get('/api/v1/student-enrollments', { params }),

  getById: (id: string): Promise<ApiResponse<StudentEnrollment>> =>
    apiClient.get(`/api/v1/student-enrollments/${id}`),

  getByStudent: (studentId: string, params?: { academicYear?: string; semester?: number }): Promise<ApiResponse<StudentEnrollment[]>> =>
    apiClient.get(`/api/v1/student-enrollments/student/${studentId}`, { params }),

  getBySubject: (subjectId: string, params?: { academicYear?: string; semester?: number }): Promise<ApiResponse<StudentEnrollment[]>> =>
    apiClient.get(`/api/v1/student-enrollments/subject/${subjectId}`, { params }),

  getStats: (): Promise<ApiResponse<EnrollmentStats>> =>
    apiClient.get('/api/v1/student-enrollments/stats'),

  create: (data: CreateEnrollmentDto): Promise<ApiResponse<StudentEnrollment>> =>
    apiClient.post('/api/v1/student-enrollments', data),

  update: (id: string, data: UpdateEnrollmentDto): Promise<ApiResponse<StudentEnrollment>> =>
    apiClient.patch(`/api/v1/student-enrollments/${id}`, data),

  withdraw: (id: string, reason?: string): Promise<ApiResponse<StudentEnrollment>> =>
    apiClient.patch(`/api/v1/student-enrollments/${id}/withdraw`, { reason }),

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/student-enrollments/${id}`)
}