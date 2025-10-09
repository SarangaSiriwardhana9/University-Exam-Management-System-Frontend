import { apiClient } from '@/lib/api/client'
import type { 
  Department, 
  CreateDepartmentDto, 
  UpdateDepartmentDto, 
  DepartmentStats, 
  GetDepartmentsParams 
} from '../types/departments'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

type BackendDepartmentsListResponse = {
  departments: Department[]
  total: number
  page: number
  limit: number
  totalPages: number
}

type RawDepartment = Omit<Department, 'headOfDepartment' | 'headOfDepartmentName'> & {
  headOfDepartment?: string | { _id: string; email: string; fullName: string }
}

 
const extractHeadOfDepartmentName = (headOfDepartment: RawDepartment['headOfDepartment']): string | undefined => {
  if (!headOfDepartment) return undefined
  
 
  if (typeof headOfDepartment === 'object' && headOfDepartment._id) {
    return headOfDepartment.fullName
  }
  
 
  if (typeof headOfDepartment === 'string' && headOfDepartment.includes('fullName')) {
    try {
 
      const match = headOfDepartment.match(/fullName:\s*'([^']+)'/)
      if (match && match[1]) {
        return match[1]
      }
    } catch (error) {
      console.error('Failed to parse headOfDepartment:', error)
    }
  }
  
  return undefined
}

 
const extractHeadOfDepartmentId = (headOfDepartment: RawDepartment['headOfDepartment']): string | undefined => {
  if (!headOfDepartment) return undefined
  
 
  if (typeof headOfDepartment === 'string' && !headOfDepartment.includes('{')) {
    return headOfDepartment
  }
  
 
  if (typeof headOfDepartment === 'object' && headOfDepartment._id) {
    return headOfDepartment._id
  }
  
 
  if (typeof headOfDepartment === 'string' && headOfDepartment.includes('ObjectId')) {
    try {
      const match = headOfDepartment.match(/ObjectId\('([^']+)'\)/)
      if (match && match[1]) {
        return match[1]
      }
    } catch (error) {
      console.error('Failed to parse headOfDepartment ID:', error)
    }
  }
  
  return undefined
}

 
const transformDepartment = (dept: RawDepartment): Department => {
  const headOfDepartmentId = extractHeadOfDepartmentId(dept.headOfDepartment)
  const headOfDepartmentName = extractHeadOfDepartmentName(dept.headOfDepartment)
  
  return {
    ...dept,
    headOfDepartment: headOfDepartmentId,
    headOfDepartmentName: headOfDepartmentName
  }
}

export const departmentsService = {
  getAll: async (params?: GetDepartmentsParams): Promise<PaginatedResponse<Department>> => {
    const response = await apiClient.get<BackendDepartmentsListResponse>('/api/v1/departments', { params })
    return {
      data: (response.departments || []).map(transformDepartment),
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
      totalPages: response.totalPages || 1
    }
  },

  getById: async (id: string): Promise<ApiResponse<Department>> => {
    const department = await apiClient.get<RawDepartment>(`/api/v1/departments/${id}`)
    return {
      data: transformDepartment(department)
    }
  },

  getStats: (): Promise<ApiResponse<DepartmentStats>> =>
    apiClient.get('/api/v1/departments/stats'),

  create: async (data: CreateDepartmentDto): Promise<ApiResponse<Department>> => {
    const department = await apiClient.post<RawDepartment>('/api/v1/departments', data)
    return {
      data: transformDepartment(department)
    }
  },

  update: async (id: string, data: UpdateDepartmentDto): Promise<ApiResponse<Department>> => {
    const department = await apiClient.patch<RawDepartment>(`/api/v1/departments/${id}`, data)
    return {
      data: transformDepartment(department)
    }
  },

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/departments/${id}`)
}