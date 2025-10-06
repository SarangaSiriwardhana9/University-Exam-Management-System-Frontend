 
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { studentEnrollmentsService } from './use-enrollments'
import type { CreateEnrollmentDto, UpdateEnrollmentDto, SelfEnrollmentDto } from '../types/enrollments'
import type { ApiError } from '@/types/common'
import { toast } from 'sonner'

export const useCreateEnrollment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateEnrollmentDto) => studentEnrollmentsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
      toast.success('Enrollment Created', {
        description: 'Student has been enrolled successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Create Enrollment', {
        description: error.message || 'An error occurred while creating the enrollment.'
      })
    }
  })
}

 
export const useSelfEnrollment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SelfEnrollmentDto) => studentEnrollmentsService.selfEnroll(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
      toast.success('Enrolled Successfully', {
        description: 'You have been enrolled in the subject.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Enroll', {
        description: error.message || 'An error occurred while enrolling.'
      })
    }
  })
}

export const useUpdateEnrollment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEnrollmentDto }) =>
      studentEnrollmentsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
      toast.success('Enrollment Updated', {
        description: 'Enrollment has been updated successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Update Enrollment', {
        description: error.message || 'An error occurred while updating the enrollment.'
      })
    }
  })
}

export const useWithdrawEnrollment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      studentEnrollmentsService.withdraw(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
      toast.success('Enrollment Withdrawn', {
        description: 'Student has been withdrawn from the subject.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Withdraw Enrollment', {
        description: error.message || 'An error occurred while withdrawing the enrollment.'
      })
    }
  })
}

export const useDeleteEnrollment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => studentEnrollmentsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
      toast.success('Enrollment Deleted', {
        description: 'Enrollment has been deleted successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Delete Enrollment', {
        description: error.message || 'An error occurred while deleting the enrollment.'
      })
    }
  })
}