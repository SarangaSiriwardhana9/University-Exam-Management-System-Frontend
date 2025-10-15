'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { reportsService } from './use-reports'
import type { ReportConfig } from '../types/reports'
import type { ApiError } from '@/types/common'
import { toast } from 'sonner'

export const useGenerateReport = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ReportConfig) => reportsService.generate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      toast.success('Report Generated', {
        description: 'Report has been generated successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Generate Report', {
        description: error.message || 'An error occurred while generating the report.'
      })
    }
  })
}

export const useDeleteReport = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => reportsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      toast.success('Report Deleted', {
        description: 'Report has been deleted successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Delete Report', {
        description: error.message || 'An error occurred while deleting the report.'
      })
    }
  })
}

export const useDownloadReport = () => {
  return useMutation({
    mutationFn: async (reportId: string) => {
      const blob = await reportsService.download(reportId)
      return { blob, reportId }
    },
    onSuccess: ({ blob, reportId }) => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `report_${reportId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success('Report Downloaded', {
        description: 'Report has been downloaded successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Download Report', {
        description: error.message || 'An error occurred while downloading the report.'
      })
    }
  })
}