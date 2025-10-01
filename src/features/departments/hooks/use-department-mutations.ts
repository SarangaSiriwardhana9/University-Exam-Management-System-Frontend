'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { departmentsService } from './use-departments'
import type { CreateDepartmentDto, UpdateDepartmentDto } from '../types/departments'
import type { ApiError } from '@/types/common'
import { toast } from 'sonner'

export const useCreateDepartment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateDepartmentDto) => departmentsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] })
      toast.success('Department Created', {
        description: 'Department has been created successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Create Department', {
        description: error.message || 'An error occurred while creating the department.'
      })
    }
  })
}

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDepartmentDto }) =>
      departmentsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] })
      toast.success('Department Updated', {
        description: 'Department has been updated successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Update Department', {
        description: error.message || 'An error occurred while updating the department.'
      })
    }
  })
}

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => departmentsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] })
      toast.success('Department Deleted', {
        description: 'Department has been deleted successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Delete Department', {
        description: error.message || 'An error occurred while deleting the department.'
      })
    }
  })
}