'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { examSessionsService } from './use-exam-sessions'
import type { CreateExamSessionDto, UpdateExamSessionDto } from '../types/exam-sessions'
import type { ApiError } from '@/types/common'
import { toast } from 'sonner'

export const useCreateExamSession = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateExamSessionDto) => examSessionsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-sessions'] })
      toast.success('Exam Session Created', {
        description: 'Exam session has been scheduled successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Create Exam Session', {
        description: error.message || 'An error occurred while creating the exam session.'
      })
    }
  })
}

export const useUpdateExamSession = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExamSessionDto }) =>
      examSessionsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-sessions'] })
      toast.success('Exam Session Updated', {
        description: 'Exam session has been updated successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Update Exam Session', {
        description: error.message || 'An error occurred while updating the exam session.'
      })
    }
  })
}

export const useCancelExamSession = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      examSessionsService.cancel(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-sessions'] })
      toast.success('Exam Session Cancelled', {
        description: 'Exam session has been cancelled successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Cancel Exam Session', {
        description: error.message || 'An error occurred while cancelling the exam session.'
      })
    }
  })
}

export const useDeleteExamSession = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => examSessionsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-sessions'] })
      toast.success('Exam Session Deleted', {
        description: 'Exam session has been deleted successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Delete Exam Session', {
        description: error.message || 'An error occurred while deleting the exam session.'
      })
    }
  })
}