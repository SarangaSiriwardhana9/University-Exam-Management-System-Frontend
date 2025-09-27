import { apiClient } from '@/lib/api/client'
import type { 
  Department, 
  CreateDepartmentDto, 
  UpdateDepartmentDto, 
  DepartmentStats, 
  GetDepartmentsParams 
} from '../types/departments'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

export const departmentsService = {
  getAll: (params?: GetDepartmentsParams): Promise<PaginatedResponse<Department>> =>
    apiClient.get('/api/v1/departments', { params }),

  getById: (id: string): Promise<ApiResponse<Department>> =>
    apiClient.get(`/api/v1/departments/${id}`),

  getStats: (): Promise<ApiResponse<DepartmentStats>> =>
    apiClient.get('/api/v1/departments/stats'),

  create: (data: CreateDepartmentDto): Promise<ApiResponse<Department>> =>
    apiClient.post('/api/v1/departments', data),

  update: (id: string, data: UpdateDepartmentDto): Promise<ApiResponse<Department>> =>
    apiClient.patch(`/api/v1/departments/${id}`, data),

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/departments/${id}`)
}