import { apiClient } from '@/lib/api/client'
import type { 
  ReportConfig, 
  ReportResult, 
  ReportType 
} from '../types/reports'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

export const reportsService = {
  generate: (data: ReportConfig): Promise<ApiResponse<ReportResult>> =>
    apiClient.post('/api/v1/reports/generate', data),

  getReportTypes: (): Promise<ApiResponse<ReportType[]>> =>
    apiClient.get('/api/v1/reports/types'),

  getReportHistory: (params?: { limit?: number; page?: number }): Promise<PaginatedResponse<ReportResult>> =>
    apiClient.get('/api/v1/reports/history', { params }),

  download: (reportId: string): Promise<Blob> =>
    apiClient.get(`/api/v1/reports/${reportId}/download`),

  delete: (reportId: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/reports/${reportId}`)
}