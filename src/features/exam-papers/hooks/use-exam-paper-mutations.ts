'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { examPapersService } from './use-exam-papers'
import type { CreateExamPaperDto, UpdateExamPaperDto, GeneratePaperDto } from '../types/exam-papers'
import type { ApiError } from '@/types/common'
import { toast } from 'sonner'

export const useCreateExamPaper = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateExamPaperDto) => examPapersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-papers'] })
      toast.success('Exam Paper Created', {
        description: 'Exam paper has been created successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Create Exam Paper', {
        description: error.message || 'An error occurred while creating the exam paper.'
      })
    }
  })
}

export const useGenerateExamPaper = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: GeneratePaperDto) => examPapersService.generate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-papers'] })
      toast.success('Exam Paper Generated', {
        description: 'Exam paper has been generated successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Generate Exam Paper', {
        description: error.message || 'An error occurred while generating the exam paper.'
      })
    }
  })
}

export const useUpdateExamPaper = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExamPaperDto }) =>
      examPapersService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-papers'] })
      toast.success('Exam Paper Updated', {
        description: 'Exam paper has been updated successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Update Exam Paper', {
        description: error.message || 'An error occurred while updating the exam paper.'
      })
    }
  })
}

export const useDuplicateExamPaper = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, newTitle }: { id: string; newTitle: string }) => 
      examPapersService.duplicate(id, newTitle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-papers'] })
      toast.success('Exam Paper Duplicated', {
        description: 'Exam paper has been duplicated successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Duplicate Exam Paper', {
        description: error.message || 'An error occurred while duplicating the exam paper.'
      })
    }
  })
}

export const useFinalizeExamPaper = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => examPapersService.finalize(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-papers'] })
      toast.success('Exam Paper Finalized', {
        description: 'Exam paper has been finalized and locked.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Finalize Exam Paper', {
        description: error.message || 'An error occurred while finalizing the exam paper.'
      })
    }
  })
}

export const useToggleExamPaperActive = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => examPapersService.toggleActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-papers'] })
      toast.success('Status Updated', {
        description: 'Exam paper active status has been updated.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Update Status', {
        description: error.message || 'An error occurred while updating the status.'
      })
    }
  })
}

export const useDeleteExamPaper = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => examPapersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-papers'] })
      toast.success('Exam Paper Deleted', {
        description: 'Exam paper has been deleted successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Delete Exam Paper', {
        description: error.message || 'An error occurred while deleting the exam paper.'
      })
    }
  })
}