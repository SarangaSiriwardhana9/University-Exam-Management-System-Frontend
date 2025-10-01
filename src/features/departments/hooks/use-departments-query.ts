'use client'

import { useQuery } from '@tanstack/react-query'
import { departmentsService } from './use-departments'
import type { GetDepartmentsParams } from '../types/departments'

export const useDepartmentsQuery = (params?: GetDepartmentsParams) => {
  return useQuery({
    queryKey: ['departments', params],
    queryFn: () => departmentsService.getAll(params),
    staleTime: 30000,
  })
}

export const useDepartmentQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: ['departments', id],
    queryFn: async () => {
      if (!id) throw new Error('Department ID is required')
      return await departmentsService.getById(id)
    },
    enabled: !!id && id !== 'undefined',
    retry: 1,
  })
}

export const useDepartmentStatsQuery = () => {
  return useQuery({
    queryKey: ['departments', 'stats'],
    queryFn: () => departmentsService.getStats(),
    staleTime: 60000,
  })
}