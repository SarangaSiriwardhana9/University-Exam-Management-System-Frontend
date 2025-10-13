import { apiClient } from '@/lib/api/client'
import type { 
  User, 
  CreateUserDto, 
  UpdateUserDto, 
  ChangePasswordDto, 
  UserStats, 
  GetUsersParams,
  BackendUsersListResponse
} from '../types/users'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

export const usersService = {
  getAll: async (params?: GetUsersParams): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get<BackendUsersListResponse>('/api/v1/users', { params })
    return {
      data: response.users || [],
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
      totalPages: response.totalPages || 1
    }
  },

  getById: async (id: string): Promise<ApiResponse<User>> => {
    const user = await apiClient.get<User>(`/api/v1/users/${id}`)
    console.log('User fetched from API:', user)
    // If backend returns user directly, wrap it
    return {
      data: user
    }
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const user = await apiClient.get<User>('/api/v1/users/profile')
    return {
      data: user
    }
  },

  getStats: (): Promise<ApiResponse<UserStats>> =>
    apiClient.get('/api/v1/users/stats'),

  create: async (data: CreateUserDto): Promise<ApiResponse<User>> => {
    const user = await apiClient.post<User>('/api/v1/users', data)
    return {
      data: user
    }
  },

  update: async (id: string, data: UpdateUserDto): Promise<ApiResponse<User>> => {
    const user = await apiClient.patch<User>(`/api/v1/users/${id}`, data)
    return {
      data: user
    }
  },

  updateProfile: async (data: UpdateUserDto): Promise<ApiResponse<User>> => {
    const user = await apiClient.patch<User>('/api/v1/users/profile', data)
    return {
      data: user
    }
  },

  changePassword: (data: ChangePasswordDto): Promise<ApiResponse<{ message: string }>> =>
    apiClient.patch('/api/v1/users/profile/change-password', data),

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/users/${id}`)
}