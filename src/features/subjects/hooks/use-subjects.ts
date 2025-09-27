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

export const subjectsService = {
  getAll: (params?: GetSubjectsParams): Promise<PaginatedResponse<Subject>> =>
    apiClient.get('/api/v1/subjects', { params }),

  getById: (id: string): Promise<ApiResponse<Subject>> =>
    apiClient.get(`/api/v1/subjects/${id}`),

  getByDepartment: (departmentId: string): Promise<ApiResponse<Subject[]>> =>
    apiClient.get(`/api/v1/subjects/department/${departmentId}`),

  getStats: (): Promise<ApiResponse<SubjectStats>> =>
    apiClient.get('/api/v1/subjects/stats'),

  create: (data: CreateSubjectDto): Promise<ApiResponse<Subject>> =>
    apiClient.post('/api/v1/subjects', data),

  update: (id: string, data: UpdateSubjectDto): Promise<ApiResponse<Subject>> =>
    apiClient.patch(`/api/v1/subjects/${id}`, data),

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/subjects/${id}`),

  assignFaculty: (id: string, data: AssignFacultyDto): Promise<ApiResponse<FacultyAssignment>> =>
    apiClient.post(`/api/v1/subjects/${id}/assign-faculty`, data),

  getFacultyAssignments: (id: string, params?: { academicYear?: string; semester?: number }): Promise<ApiResponse<FacultyAssignment[]>> =>
    apiClient.get(`/api/v1/subjects/${id}/faculty`, { params }),

  removeFacultyAssignment: (assignmentId: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/subjects/faculty-assignment/${assignmentId}`)
}