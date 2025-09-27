import { apiClient } from '@/lib/api/client'
import type { LoginDto, RegisterDto, LoginResponse } from '../types/auth'
import { ApiResponse } from '@/types/common'

export const authService = {
  login: (data: LoginDto): Promise<LoginResponse> =>   
    apiClient.post('/api/v1/auth/login', data),

  register: (data: RegisterDto): Promise<LoginResponse> =>
    apiClient.post('/api/v1/auth/register', data),

  logout: (): Promise<ApiResponse<{ message: string }>> =>
    apiClient.post('/api/v1/auth/logout'),

  refreshToken: (): Promise<ApiResponse<{ accessToken: string }>> =>
    apiClient.post('/api/v1/auth/refresh'),

  forgotPassword: (email: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.post('/api/v1/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.post('/api/v1/auth/reset-password', { token, password }),

  setToken: (token: string | null): void => {
    apiClient.setToken(token)
  }
}