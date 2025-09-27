import { apiClient } from '@/lib/api/client'
import type { 
  AcademicCalendar, 
  CreateCalendarDto, 
  UpdateCalendarDto, 
  CalendarSummary, 
  GetCalendarParams 
} from '../types/calendar'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

export const academicCalendarService = {
  getAll: (params?: GetCalendarParams): Promise<PaginatedResponse<AcademicCalendar>> =>
    apiClient.get('/api/v1/academic-calendar', { params }),

  getById: (id: string): Promise<ApiResponse<AcademicCalendar>> =>
    apiClient.get(`/api/v1/academic-calendar/${id}`),

  getCurrent: (): Promise<ApiResponse<AcademicCalendar | null>> =>
    apiClient.get('/api/v1/academic-calendar/current'),

  getSummary: (): Promise<ApiResponse<CalendarSummary>> =>
    apiClient.get('/api/v1/academic-calendar/summary'),

  create: (data: CreateCalendarDto): Promise<ApiResponse<AcademicCalendar>> =>
    apiClient.post('/api/v1/academic-calendar', data),

  update: (id: string, data: UpdateCalendarDto): Promise<ApiResponse<AcademicCalendar>> =>
    apiClient.patch(`/api/v1/academic-calendar/${id}`, data),

  setCurrent: (id: string): Promise<ApiResponse<AcademicCalendar>> =>
    apiClient.patch(`/api/v1/academic-calendar/${id}/set-current`),

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/academic-calendar/${id}`)
}