'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { examRegistrationsService } from './use-exam-registrations'
import { toast } from 'sonner'

export const useCreateExamRegistrationMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: examRegistrationsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-registrations'] })
      queryClient.invalidateQueries({ queryKey: ['exam-sessions'] })
      toast.success('Successfully registered for exam')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to register for exam')
    },
  })
}

export const useUpdateExamRegistrationMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      examRegistrationsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-registrations'] })
      toast.success('Registration updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update registration')
    },
  })
}

export const useCancelExamRegistrationMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      examRegistrationsService.cancel(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-registrations'] })
      queryClient.invalidateQueries({ queryKey: ['exam-sessions'] })
      toast.success('Registration cancelled successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to cancel registration')
    },
  })
}

export const useDeleteExamRegistrationMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: examRegistrationsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-registrations'] })
      queryClient.invalidateQueries({ queryKey: ['exam-sessions'] })
      toast.success('Registration deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete registration')
    },
  })
}
