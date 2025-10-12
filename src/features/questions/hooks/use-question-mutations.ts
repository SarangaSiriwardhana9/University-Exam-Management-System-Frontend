import { useMutation, useQueryClient } from '@tanstack/react-query'
import { questionsService } from './use-questions'
import type { CreateQuestionDto, UpdateQuestionDto } from '../types/questions'
import type { ApiError } from '@/types/common'
import { toast } from 'sonner'

export { useQuestionQuery } from './use-questions-query'

export const useCreateQuestion = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateQuestionDto) => questionsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] })
      toast.success('Question created successfully')
    },
    onError: (error: ApiError) => {
      toast.error('Failed to create question', {
        description: error.message || 'An error occurred.'
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
      toast.success('Question updated successfully')
    },
    onError: (error: ApiError) => {
      toast.error('Failed to update question', {
        description: error.message || 'An error occurred.'
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
      toast.success('Question deleted successfully')
    },
    onError: (error: ApiError) => {
      toast.error('Failed to delete question', {
        description: error.message || 'An error occurred.'
      })
    }
  })
}