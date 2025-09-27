import { apiClient } from '@/lib/api/client'
import type { 
  Notification, 
  CreateNotificationDto, 
  UpdateNotificationDto, 
  NotificationStats, 
  GetNotificationsParams 
} from '../types/notifications'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

export const notificationsService = {
  getAll: (params?: GetNotificationsParams): Promise<PaginatedResponse<Notification>> =>
    apiClient.get('/api/v1/notifications', { params }),

  getById: (id: string): Promise<ApiResponse<Notification>> =>
    apiClient.get(`/api/v1/notifications/${id}`),

  getUnread: (params?: { limit?: number }): Promise<ApiResponse<Notification[]>> =>
    apiClient.get('/api/v1/notifications/unread', { params }),

  getStats: (): Promise<ApiResponse<NotificationStats>> =>
    apiClient.get('/api/v1/notifications/stats'),

  create: (data: CreateNotificationDto): Promise<ApiResponse<Notification>> =>
    apiClient.post('/api/v1/notifications', data),

  createBulk: (data: CreateNotificationDto[]): Promise<ApiResponse<Notification[]>> =>
    apiClient.post('/api/v1/notifications/bulk', { notifications: data }),

  update: (id: string, data: UpdateNotificationDto): Promise<ApiResponse<Notification>> =>
    apiClient.patch(`/api/v1/notifications/${id}`, data),

  markAsRead: (id: string): Promise<ApiResponse<Notification>> =>
    apiClient.patch(`/api/v1/notifications/${id}/mark-read`),

  markAllAsRead: (): Promise<ApiResponse<{ message: string; count: number }>> =>
    apiClient.patch('/api/v1/notifications/mark-all-read'),

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/notifications/${id}`),

  deleteAll: (): Promise<ApiResponse<{ message: string; count: number }>> =>
    apiClient.delete('/api/v1/notifications/all')
}