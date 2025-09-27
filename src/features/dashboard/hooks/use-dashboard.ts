import { apiClient } from '@/lib/api/client'
import type { 
  AdminDashboard, 
  FacultyDashboard, 
  StudentDashboard, 
  DashboardStats 
} from '../types/dashboard'
import type { ApiResponse } from '@/types/common'

export const dashboardService = {
  getAdminDashboard: (): Promise<ApiResponse<AdminDashboard>> =>
    apiClient.get('/api/v1/dashboard/admin'),

  getFacultyDashboard: (): Promise<ApiResponse<FacultyDashboard>> =>
    apiClient.get('/api/v1/dashboard/faculty'),

  getStudentDashboard: (): Promise<ApiResponse<StudentDashboard>> =>
    apiClient.get('/api/v1/dashboard/student'),

  getDashboard: (): Promise<ApiResponse<DashboardStats>> =>
    apiClient.get('/api/v1/dashboard'),

  getSystemHealth: (): Promise<ApiResponse<Record<string, boolean>>> =>
    apiClient.get('/api/v1/dashboard/system-health'),

  getRecentActivity: (params?: { limit?: number }): Promise<ApiResponse<DashboardStats['recentActivity']>> =>
    apiClient.get('/api/v1/dashboard/recent-activity', { params })
}