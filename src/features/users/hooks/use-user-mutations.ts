'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usersService } from './use-users'
import type { CreateUserDto, UpdateUserDto } from '../types/users'
import type { ApiError } from '@/types/common'
import { toast } from 'sonner'

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUserDto) => usersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User Created', { description: 'User has been created successfully.' })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Create User', { description: error.message || 'An error occurred while creating the user.' })
    }
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) => usersService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User Updated', { description: 'User has been updated successfully.' })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Update User', { description: error.message || 'An error occurred while updating the user.' })
    }
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => usersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User Deleted', { description: 'User has been deleted successfully.' })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Delete User', { description: error.message || 'An error occurred while deleting the user.' })
    }
  })
}