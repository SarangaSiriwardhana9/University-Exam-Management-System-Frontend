import { apiClient } from '@/lib/api/client'
import type { 
  AcademicCalendar, 
  CreateCalendarDto, 
  UpdateCalendarDto, 
  CalendarSummary, 
  GetCalendarParams,
  BackendCalendarsListResponse
} from '../types/calendar'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

type RawAcademicCalendar = AcademicCalendar

const transformCalendar = (calendar: RawAcademicCalendar): AcademicCalendar => {
  return {
    ...calendar,
    // Ensure dates are properly formatted
    semesterStart: new Date(calendar.semesterStart).toISOString(),
    semesterEnd: new Date(calendar.semesterEnd).toISOString(),
    examStart: new Date(calendar.examStart).toISOString(),
    examEnd: new Date(calendar.examEnd).toISOString(),
    resultPublishDate: calendar.resultPublishDate 
      ? new Date(calendar.resultPublishDate).toISOString() 
      : undefined
  }
}

export const academicCalendarService = {
  getAll: async (params?: GetCalendarParams): Promise<PaginatedResponse<AcademicCalendar>> => {
    const response = await apiClient.get<BackendCalendarsListResponse>('/api/v1/academic-calendar', { params })
    return {
      data: (response.calendars || []).map(transformCalendar),
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
      totalPages: response.totalPages || 1
    }
  },

  getById: async (id: string): Promise<ApiResponse<AcademicCalendar>> => {
    const calendar = await apiClient.get<RawAcademicCalendar>(`/api/v1/academic-calendar/${id}`)
    return {
      data: transformCalendar(calendar)
    }
  },

  getCurrent: async (): Promise<ApiResponse<AcademicCalendar | null>> => {
    const calendar = await apiClient.get<RawAcademicCalendar | null>('/api/v1/academic-calendar/current')
    return {
      data: calendar ? transformCalendar(calendar) : null
    }
  },

  getSummary: (): Promise<ApiResponse<CalendarSummary>> =>
    apiClient.get('/api/v1/academic-calendar/summary'),

  create: async (data: CreateCalendarDto): Promise<ApiResponse<AcademicCalendar>> => {
    const calendar = await apiClient.post<RawAcademicCalendar>('/api/v1/academic-calendar', data)
    return {
      data: transformCalendar(calendar)
    }
  },

  update: async (id: string, data: UpdateCalendarDto): Promise<ApiResponse<AcademicCalendar>> => {
    const calendar = await apiClient.patch<RawAcademicCalendar>(`/api/v1/academic-calendar/${id}`, data)
    return {
      data: transformCalendar(calendar)
    }
  },

  setCurrent: async (id: string): Promise<ApiResponse<AcademicCalendar>> => {
    const calendar = await apiClient.patch<RawAcademicCalendar>(`/api/v1/academic-calendar/${id}/set-current`)
    return {
      data: transformCalendar(calendar)
    }
  },

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/academic-calendar/${id}`)
}