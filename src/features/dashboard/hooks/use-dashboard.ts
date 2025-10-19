import { apiClient } from '@/lib/api/client'
import type { 
  AdminDashboard, 
  FacultyDashboard, 
  StudentDashboard, 
  DashboardStats 
} from '../types/dashboard'

export const dashboardService = {
  getAdminDashboard: (): Promise<AdminDashboard> =>
    apiClient.get('/api/v1/dashboard/admin'),

  getFacultyDashboard: (): Promise<FacultyDashboard> =>
    apiClient.get('/api/v1/dashboard/faculty'),

  getStudentDashboard: (): Promise<StudentDashboard> =>
    apiClient.get('/api/v1/dashboard/student'),

  getDashboard: (): Promise<DashboardStats> =>
    apiClient.get('/api/v1/dashboard'),

  getSystemHealth: (): Promise<Record<string, boolean>> =>
    apiClient.get('/api/v1/dashboard/system-health'),

  getRecentActivity: (params?: { limit?: number }): Promise<DashboardStats['recentActivity']> =>
    apiClient.get('/api/v1/dashboard/recent-activity', { params })
}