import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { registrationsService } from './use-registrations'
import type { GetRegistrationsParams } from '../types/registrations'
import { toast } from 'sonner'

export const useRegistrationsQuery = (params?: GetRegistrationsParams) => {
  return useQuery({
    queryKey: ['exam-registrations', params],
    queryFn: () => registrationsService.getAll(params),
    staleTime: 30000,
  })
}

export const useRegistrationQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: ['exam-registrations', id],
    queryFn: async () => {
      if (!id) throw new Error('Registration ID is required')
      return registrationsService.getById(id)
    },
    enabled: !!id && id !== 'undefined',
    retry: 1,
  })
}

export const useSessionRegistrationsQuery = (sessionId: string, params?: GetRegistrationsParams) => {
  return useQuery({
    queryKey: ['exam-registrations', 'session', sessionId, params],
    queryFn: () => registrationsService.getBySession(sessionId, params),
    enabled: !!sessionId,
    staleTime: 30000,
  })
}

export const useRegistrationStatsQuery = (sessionId?: string) => {
  return useQuery({
    queryKey: ['exam-registrations', 'stats', sessionId],
    queryFn: () => registrationsService.getStats(sessionId),
    staleTime: 60000,
  })
}

export const useMarkAsAbsent = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => registrationsService.markAsAbsent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-registrations'] })
      toast.success('Student marked as absent')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to mark as absent')
    },
  })
}

export const useDeleteRegistration = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => registrationsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-registrations'] })
      toast.success('Registration deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete registration')
    },
  })
}

export const useExportRegistrations = () => {
  return useMutation({
    mutationFn: (params?: GetRegistrationsParams) => registrationsService.exportData(params),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `registrations-${new Date().toISOString()}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Data exported successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to export data')
    },
  })
}
