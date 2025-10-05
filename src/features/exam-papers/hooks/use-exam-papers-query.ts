 
'use client'

import { useQuery } from '@tanstack/react-query'
import { examPapersService } from './use-exam-papers'
import type { GetExamPapersParams } from '../types/exam-papers'

export const useExamPapersQuery = (params?: GetExamPapersParams) => {
  return useQuery({
    queryKey: ['exam-papers', params],
    queryFn: () => examPapersService.getAll(params),
    staleTime: 30000,
  })
}

export const useExamPaperQuery = (id: string | undefined, includeQuestions = true) => {
  return useQuery({
    queryKey: ['exam-papers', id, includeQuestions],
    queryFn: async () => {
      if (!id) throw new Error('Exam Paper ID is required')
      return await examPapersService.getById(id, { includeQuestions })
    },
    enabled: !!id && id !== 'undefined',
    retry: 1,
  })
}

export const useExamPaperStatsQuery = () => {
  return useQuery({
    queryKey: ['exam-papers', 'stats'],
    queryFn: () => examPapersService.getStats(),
    staleTime: 60000,
  })
}