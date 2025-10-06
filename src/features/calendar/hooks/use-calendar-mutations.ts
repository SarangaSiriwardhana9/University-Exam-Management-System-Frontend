'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { academicCalendarService } from './use-calendar'
import type { CreateCalendarDto, UpdateCalendarDto } from '../types/calendar'
import type { ApiError } from '@/types/common'
import { toast } from 'sonner'

export const useCreateCalendar = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCalendarDto) => academicCalendarService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendars'] })
      toast.success('Calendar Created', {
        description: 'Academic calendar has been created successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Create Calendar', {
        description: error.message || 'An error occurred while creating the calendar.'
      })
    }
  })
}

export const useUpdateCalendar = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCalendarDto }) =>
      academicCalendarService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendars'] })
      toast.success('Calendar Updated', {
        description: 'Academic calendar has been updated successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Update Calendar', {
        description: error.message || 'An error occurred while updating the calendar.'
      })
    }
  })
}

export const useSetCurrentCalendar = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => academicCalendarService.setCurrent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendars'] })
      toast.success('Current Calendar Set', {
        description: 'The selected calendar is now the current academic calendar.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Set Current Calendar', {
        description: error.message || 'An error occurred while setting the current calendar.'
      })
    }
  })
}

export const useDeleteCalendar = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => academicCalendarService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendars'] })
      toast.success('Calendar Deleted', {
        description: 'Academic calendar has been deleted successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Delete Calendar', {
        description: error.message || 'An error occurred while deleting the calendar.'
      })
    }
  })
}