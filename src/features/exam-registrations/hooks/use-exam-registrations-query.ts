'use client'

import { useQuery } from '@tanstack/react-query'
import { examRegistrationsService } from './use-exam-registrations'
import type { GetExamRegistrationsParams } from '../types/exam-registrations'

export const useExamRegistrationsQuery = (params?: GetExamRegistrationsParams) => {
  return useQuery({
    queryKey: ['exam-registrations', params],
    queryFn: () => examRegistrationsService.getAll(params),
    staleTime: 30000,
  })
}

export const useExamRegistrationQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: ['exam-registrations', id],
    queryFn: async () => {
      if (!id) throw new Error('Registration ID is required')
      return await examRegistrationsService.getById(id)
    },
    enabled: !!id && id !== 'undefined',
    retry: 1,
  })
}

export const useMyExamRegistrationsQuery = () => {
  return useQuery({
    queryKey: ['exam-registrations', 'my-registrations'],
    queryFn: () => examRegistrationsService.getMyRegistrations(),
    staleTime: 30000,
  })
}

export const useSessionRegistrationsQuery = (sessionId: string | undefined) => {
  return useQuery({
    queryKey: ['exam-registrations', 'session', sessionId],
    queryFn: async () => {
      if (!sessionId) throw new Error('Session ID is required')
      return await examRegistrationsService.getBySession(sessionId)
    },
    enabled: !!sessionId && sessionId !== 'undefined',
    retry: 1,
  })
}
