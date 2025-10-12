'use client'

import { useQuery } from '@tanstack/react-query'
import { questionsService } from './use-questions'
import type { GetQuestionsParams, Question } from '../types/questions'
import type { ApiResponse } from '@/types/common'

export const useQuestionsQuery = (params?: GetQuestionsParams) => {
  return useQuery({
    queryKey: ['questions', params],
    queryFn: () => questionsService.getAll(params),
    staleTime: 30000,
  })
}

export const useQuestionQuery = (id: string | undefined) => {
  return useQuery<ApiResponse<Question>>({
    queryKey: ['questions', id],
    queryFn: async () => {
      if (!id) throw new Error('Question ID is required')
      return await questionsService.getById(id)
    },
    enabled: !!id && id !== 'undefined',
    retry: 1,
  })
}

export const useQuestionsBySubjectQuery = (subjectId: string | undefined, includePrivate = false) => {
  return useQuery({
    queryKey: ['questions', 'subject', subjectId, includePrivate],
    queryFn: async () => {
      if (!subjectId) throw new Error('Subject ID is required')
      return await questionsService.getBySubject(subjectId, { includePrivate })
    },
    enabled: !!subjectId && subjectId !== 'undefined',
    retry: 1,
  })
}