'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { subjectsService } from './use-subjects'
import type { CreateSubjectDto, UpdateSubjectDto } from '../types/subjects'
import type { ApiError } from '@/types/common'
import { toast } from 'sonner'

export const useCreateSubject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSubjectDto) => subjectsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      toast.success('Subject Created', {
        description: 'Subject has been created successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Create Subject', {
        description: error.message || 'An error occurred while creating the subject.'
      })
    }
  })
}

export const useUpdateSubject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSubjectDto }) =>
      subjectsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      toast.success('Subject Updated', {
        description: 'Subject has been updated successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Update Subject', {
        description: error.message || 'An error occurred while updating the subject.'
      })
    }
  })
}

export const useDeleteSubject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => subjectsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      toast.success('Subject Deleted', {
        description: 'Subject has been deleted successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Delete Subject', {
        description: error.message || 'An error occurred while deleting the subject.'
      })
    }
  })
}