import { apiClient } from '@/lib/api/client'
import type { 
  User, 
  CreateUserDto, 
  UpdateUserDto, 
  ChangePasswordDto, 
  UserStats, 
  GetUsersParams 
} from '../types/users'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

export const usersService = {
  getAll: (params?: GetUsersParams): Promise<PaginatedResponse<User>> =>
    apiClient.get('/api/v1/users', { params }),

  getById: (id: string): Promise<ApiResponse<User>> =>
    apiClient.get(`/api/v1/users/${id}`),

  getProfile: (): Promise<ApiResponse<User>> =>
    apiClient.get('/api/v1/users/profile'),

  getStats: (): Promise<ApiResponse<UserStats>> =>
    apiClient.get('/api/v1/users/stats'),

  create: (data: CreateUserDto): Promise<ApiResponse<User>> =>
    apiClient.post('/api/v1/users', data),

  update: (id: string, data: UpdateUserDto): Promise<ApiResponse<User>> =>
    apiClient.patch(`/api/v1/users/${id}`, data),

  updateProfile: (data: UpdateUserDto): Promise<ApiResponse<User>> =>
    apiClient.patch('/api/v1/users/profile', data),

  changePassword: (data: ChangePasswordDto): Promise<ApiResponse<{ message: string }>> =>
    apiClient.patch('/api/v1/users/profile/change-password', data),

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/users/${id}`)
}