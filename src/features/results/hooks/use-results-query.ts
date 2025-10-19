import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { resultsService } from './use-results'
import type { GetResultsParams, CreateResultDto, UpdateResultDto } from '../types/results'
import { toast } from 'sonner'

export const RESULTS_QUERY_KEY = 'results'

export function useResultsQuery(params?: GetResultsParams) {
  return useQuery({
    queryKey: [RESULTS_QUERY_KEY, params],
    queryFn: () => resultsService.getAll(params),
  })
}

export function useResultQuery(id: string) {
  return useQuery({
    queryKey: [RESULTS_QUERY_KEY, id],
    queryFn: () => resultsService.getById(id),
    enabled: !!id,
  })
}

export function useResultsBySessionQuery(sessionId: string) {
  return useQuery({
    queryKey: [RESULTS_QUERY_KEY, 'session', sessionId],
    queryFn: () => resultsService.getBySession(sessionId),
    enabled: !!sessionId,
  })
}

export function useResultsByStudentQuery(studentId: string, published?: boolean) {
  return useQuery({
    queryKey: [RESULTS_QUERY_KEY, 'student', studentId, published],
    queryFn: () => resultsService.getByStudent(studentId, { published }),
    enabled: !!studentId,
  })
}

export function useResultStatsQuery(params?: { sessionId?: string; subjectId?: string }) {
  return useQuery({
    queryKey: [RESULTS_QUERY_KEY, 'stats', params],
    queryFn: () => resultsService.getStats(params),
  })
}

export function useCreateResult() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateResultDto) => resultsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RESULTS_QUERY_KEY] })
      toast.success('Result created successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create result')
    },
  })
}

export function useCreateBulkResults() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateResultDto[]) => resultsService.createBulk(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RESULTS_QUERY_KEY] })
      toast.success('Results created successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create results')
    },
  })
}

export function useUpdateResult() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateResultDto }) =>
      resultsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RESULTS_QUERY_KEY] })
      toast.success('Result updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update result')
    },
  })
}

export function useVerifyResult() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => resultsService.verify(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RESULTS_QUERY_KEY] })
      toast.success('Result verified successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to verify result')
    },
  })
}

export function usePublishResult() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => resultsService.publish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RESULTS_QUERY_KEY] })
      toast.success('Result published successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to publish result')
    },
  })
}

export function usePublishBulkResults() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sessionId: string) => resultsService.publishBulk(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RESULTS_QUERY_KEY] })
      toast.success('Results published successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to publish results')
    },
  })
}

export function useDeleteResult() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => resultsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RESULTS_QUERY_KEY] })
      toast.success('Result deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete result')
    },
  })
}

export function useStudentResultsQuery() {
  return useQuery({
    queryKey: [RESULTS_QUERY_KEY, 'my-results'],
    queryFn: () => resultsService.getMyResults(),
  })
}
