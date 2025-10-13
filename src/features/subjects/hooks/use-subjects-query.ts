'use client'

import { useQuery } from '@tanstack/react-query'
import { subjectsService } from './use-subjects'
import type { GetSubjectsParams } from '../types/subjects'
import { useAuth } from '@/lib/auth/auth-provider'

export const useSubjectsQuery = (params?: GetSubjectsParams) => {
  return useQuery({
    queryKey: ['subjects', params],
    queryFn: () => subjectsService.getAll(params),
    staleTime: 30000,
  })
}

export const useSubjectQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: ['subjects', id],
    queryFn: async () => {
      if (!id) throw new Error('Subject ID is required')
      return await subjectsService.getById(id)
    },
    enabled: !!id && id !== 'undefined',
    retry: 1,
  })
}

export const useSubjectStatsQuery = () => {
  return useQuery({
    queryKey: ['subjects', 'stats'],
    queryFn: () => subjectsService.getStats(),
    staleTime: 60000,
  })
}

export const useFacultyAssignmentsQuery = (subjectId: string | undefined, params?: { year?: number; semester?: number }) => {
  return useQuery({
    queryKey: ['subjects', subjectId, 'assignments', params],
    queryFn: async () => {
      if (!subjectId) throw new Error('Subject ID is required')
      return await subjectsService.getFacultyAssignments(subjectId, params)
    },
    enabled: !!subjectId && subjectId !== 'undefined',
    retry: 1,
  })
}

export const useSubjectsByDepartmentQuery = (departmentId: string | undefined) => {
  return useQuery({
    queryKey: ['subjects', 'department', departmentId],
    queryFn: async () => {
      if (!departmentId) throw new Error('Department ID is required')
      return await subjectsService.getByDepartment(departmentId)
    },
    enabled: !!departmentId && departmentId !== 'undefined',
    staleTime: 30000,
  })
}

export const useMySubjectsQuery = (params?: GetSubjectsParams) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['subjects', 'my-subjects', user?._id, params],
    queryFn: async () => {
      if (!user?._id) throw new Error('User not authenticated');

      return await subjectsService.getMySubjects(params, user._id);
    },
    enabled: !!user?._id,
    staleTime: 30000,
  });
};