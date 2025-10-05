 
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { questionsService } from './use-questions'
import type { CreateQuestionDto, UpdateQuestionDto } from '../types/questions'
import type { ApiError } from '@/types/common'
import { toast } from 'sonner'

export const useCreateQuestion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateQuestionDto) => questionsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] })
      toast.success('Question Created', {
        description: 'Question has been added to the question bank.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Create Question', {
        description: error.message || 'An error occurred while creating the question.'
      })
    }
  })
}

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateQuestionDto }) =>
      questionsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] })
      toast.success('Question Updated', {
        description: 'Question has been updated successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Update Question', {
        description: error.message || 'An error occurred while updating the question.'
      })
    }
  })
}

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => questionsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] })
      toast.success('Question Deleted', {
        description: 'Question has been removed from the question bank.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Delete Question', {
        description: error.message || 'An error occurred while deleting the question.'
      })
    }
  })
}