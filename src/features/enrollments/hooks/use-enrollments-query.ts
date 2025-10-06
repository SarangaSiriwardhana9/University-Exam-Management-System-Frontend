 
'use client'

import { useQuery } from '@tanstack/react-query'
import { studentEnrollmentsService } from './use-enrollments'
import type { GetEnrollmentsParams } from '../types/enrollments'
import { useAuth } from '@/lib/auth/auth-provider'

export const useEnrollmentsQuery = (params?: GetEnrollmentsParams) => {
  return useQuery({
    queryKey: ['enrollments', params],
    queryFn: () => studentEnrollmentsService.getAll(params),
    staleTime: 30000,
  })
}

export const useEnrollmentQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: ['enrollments', id],
    queryFn: async () => {
      if (!id) throw new Error('Enrollment ID is required')
      return await studentEnrollmentsService.getById(id)
    },
    enabled: !!id && id !== 'undefined',
    retry: 1,
  })
}


export const useMyEnrollmentsQuery = (params?: { academicYear?: string; semester?: number; status?: string }) => {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['enrollments', 'my-enrollments', user?._id, params],
    queryFn: async () => {
      if (!user?._id) throw new Error('User not authenticated')
      return await studentEnrollmentsService.getMyEnrollments(params)
    },
    enabled: !!user?._id,
    staleTime: 30000,
  })
}

export const useEnrollmentsBySubjectQuery = (subjectId: string | undefined) => {
  return useQuery({
    queryKey: ['enrollments', 'subject', subjectId],
    queryFn: async () => {
      if (!subjectId) throw new Error('Subject ID is required')
      return await studentEnrollmentsService.getBySubject(subjectId)
    },
    enabled: !!subjectId && subjectId !== 'undefined',
    staleTime: 30000,
  })
}

export const useEnrollmentStatsQuery = () => {
  return useQuery({
    queryKey: ['enrollments', 'stats'],
    queryFn: () => studentEnrollmentsService.getStats(),
    staleTime: 60000,
  })
}


export const useAvailableSubjectsQuery = (academicYear: string, semester: number) => {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['enrollments', 'available-subjects', academicYear, semester, user?._id],
    queryFn: async () => {
      if (!academicYear || !semester) throw new Error('Academic year and semester are required')
      return await studentEnrollmentsService.getAvailableSubjects(academicYear, semester)
    },
    enabled: !!academicYear && !!semester && !!user?._id,
    staleTime: 30000,
  })
}