import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { markingService } from './use-marking'
import type { MarkAnswerDto, BulkMarkAnswersDto } from '../types/marking'
import { toast } from 'sonner'

export const useRegistrationAnswersQuery = (registrationId: string) => {
  return useQuery({
    queryKey: ['marking', 'registration', registrationId],
    queryFn: () => markingService.getRegistrationAnswers(registrationId),
    enabled: !!registrationId,
  })
}

export const useSessionSubmissionsQuery = (sessionId: string, isMarked?: boolean) => {
  return useQuery({
    queryKey: ['marking', 'submissions', sessionId, isMarked],
    queryFn: () => markingService.getSessionSubmissions(sessionId, isMarked),
    enabled: !!sessionId,
  })
}

export const useMarkingStatsQuery = (sessionId: string) => {
  return useQuery({
    queryKey: ['marking', 'stats', sessionId],
    queryFn: () => markingService.getMarkingStats(sessionId),
    enabled: !!sessionId,
  })
}

export const useMarkAnswer = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ answerId, data }: { answerId: string; data: MarkAnswerDto }) =>
      markingService.markAnswer(answerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marking'] })
      toast.success('Answer marked successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to mark answer')
    },
  })
}

export const useBulkMarkAnswers = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ registrationId, data }: { registrationId: string; data: BulkMarkAnswersDto }) =>
      markingService.bulkMarkAnswers(registrationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marking'] })
      toast.success('Answers marked successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to mark answers')
    },
  })
}

export const useAutoMarkMcq = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (registrationId: string) => markingService.autoMarkMcq(registrationId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['marking'] })
      toast.success(data.message)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to auto-mark MCQ answers')
    },
  })
}

export const useFinalizeMarking = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (registrationId: string) => markingService.finalizeMarking(registrationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marking'] })
      toast.success('Marking finalized successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to finalize marking')
    },
  })
}
