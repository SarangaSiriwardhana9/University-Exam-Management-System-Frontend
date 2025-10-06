'use client'

import { useQuery } from '@tanstack/react-query'
import { examSessionsService } from './use-exam-sessions'
import type { GetExamSessionsParams } from '../types/exam-sessions'

export const useExamSessionsQuery = (params?: GetExamSessionsParams) => {
  return useQuery({
    queryKey: ['exam-sessions', params],
    queryFn: () => examSessionsService.getAll(params),
    staleTime: 30000,
  })
}

export const useExamSessionQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: ['exam-sessions', id],
    queryFn: async () => {
      if (!id) throw new Error('Exam Session ID is required')
      console.log('Fetching exam session with ID:', id)
      const result = await examSessionsService.getById(id)
      console.log('Exam session fetch result:', result)
      return result
    },
    enabled: !!id && id !== 'undefined',
    retry: 1,
  })
}

export const useUpcomingExamSessionsQuery = (params?: { limit?: number }) => {
  return useQuery({
    queryKey: ['exam-sessions', 'upcoming', params],
    queryFn: () => examSessionsService.getUpcoming(params),
    staleTime: 60000, // 1 minute
  })
}

export const useExamSessionStatsQuery = () => {
  return useQuery({
    queryKey: ['exam-sessions', 'stats'],
    queryFn: () => examSessionsService.getStats(),
    staleTime: 300000, // 5 minutes
  })
}