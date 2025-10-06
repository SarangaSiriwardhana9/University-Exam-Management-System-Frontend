'use client'

import { useQuery } from '@tanstack/react-query'
import { academicCalendarService } from './use-calendar'
import type { GetCalendarParams } from '../types/calendar'

export const useCalendarsQuery = (params?: GetCalendarParams) => {
  return useQuery({
    queryKey: ['calendars', params],
    queryFn: () => academicCalendarService.getAll(params),
    staleTime: 30000,
  })
}

export const useCalendarQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: ['calendars', id],
    queryFn: async () => {
      if (!id) throw new Error('Calendar ID is required')
      console.log('Fetching calendar with ID:', id)
      const result = await academicCalendarService.getById(id)
      console.log('Calendar fetch result:', result)
      return result
    },
    enabled: !!id && id !== 'undefined',
    retry: 1,
  })
}

export const useCurrentCalendarQuery = () => {
  return useQuery({
    queryKey: ['calendars', 'current'],
    queryFn: () => academicCalendarService.getCurrent(),
    staleTime: 60000, // 1 minute
  })
}

export const useCalendarSummaryQuery = () => {
  return useQuery({
    queryKey: ['calendars', 'summary'],
    queryFn: () => academicCalendarService.getSummary(),
    staleTime: 300000, // 5 minutes
  })
}