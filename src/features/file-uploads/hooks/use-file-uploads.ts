import { apiClient } from '@/lib/api/client'
import type { 
  FileUpload, 
  FileUploadStats, 
  GetFileUploadsParams 
} from '../types/file-uploads'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

export const fileUploadsService = {
  uploadSingle: (file: File, relatedTable?: string, relatedId?: string, description?: string): Promise<ApiResponse<FileUpload>> => {
    const formData = new FormData()
    formData.append('file', file)
    if (relatedTable) formData.append('relatedTable', relatedTable)
    if (relatedId) formData.append('relatedId', relatedId)
    if (description) formData.append('description', description)
    
    return apiClient.upload('/api/v1/file-uploads/single', formData)
  },

  uploadMultiple: (files: File[], relatedTable?: string, relatedId?: string): Promise<ApiResponse<FileUpload[]>> => {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    if (relatedTable) formData.append('relatedTable', relatedTable)
    if (relatedId) formData.append('relatedId', relatedId)
    
    return apiClient.upload('/api/v1/file-uploads/multiple', formData)
  },

  getAll: (params?: GetFileUploadsParams): Promise<PaginatedResponse<FileUpload>> => 
    apiClient.get('/api/v1/file-uploads', { params }),

  getById: (id: string): Promise<ApiResponse<FileUpload>> =>
    apiClient.get(`/api/v1/file-uploads/${id}`),

  getByRelated: (relatedTable: string, relatedId: string): Promise<ApiResponse<FileUpload[]>> =>
    apiClient.get(`/api/v1/file-uploads/related/${relatedTable}/${relatedId}`),

  getStats: (): Promise<ApiResponse<FileUploadStats>> =>
    apiClient.get('/api/v1/file-uploads/stats'),

  download: (id: string): Promise<Blob> =>
    apiClient.get(`/api/v1/file-uploads/${id}/download`),

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/file-uploads/${id}`)
}