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
      console.log('Fetching user with ID:', id)
      const result = await usersService.getById(id)
      console.log('User fetch result:', result)
      return result
    },
    enabled: !!id && id !== 'undefined',
    retry: 1,
  })
}