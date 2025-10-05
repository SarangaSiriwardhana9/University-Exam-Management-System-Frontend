'use client'

import { useQuery } from '@tanstack/react-query'
import { reportsService } from './use-reports'

export const useReportTypesQuery = () => {
  return useQuery({
    queryKey: ['report-types'],
    queryFn: () => reportsService.getReportTypes(),
    staleTime: 300000,  
  })
}

export const useReportsHistoryQuery = (params?: { limit?: number; page?: number }) => {
  return useQuery({
    queryKey: ['reports', 'history', params],
    queryFn: () => reportsService.getReportHistory(params),
    staleTime: 30000,
  })
}