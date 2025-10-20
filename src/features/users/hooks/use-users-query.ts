'use client'

import { useQuery } from '@tanstack/react-query'
import { usersService } from './use-users'
import type { GetUsersParams } from '../types/users'

export const useUsersQuery = (params?: GetUsersParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => usersService.getAll(params),
    staleTime: 30000,
  })
}

export const useUserQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: async () => {
      if (!id) throw new Error('User ID is required')
      return usersService.getById(id)
    },
    enabled: !!id && id !== 'undefined',
    retry: 1,
  })
}