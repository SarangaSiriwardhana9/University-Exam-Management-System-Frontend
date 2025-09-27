export type FileUpload = {
  _id: string
  originalName: string
  fileName: string
  filePath: string
  mimeType: string
  fileSize: number
  relatedTable?: string
  relatedId?: string
  description?: string
  uploadedBy: string
  uploadedByName?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type CreateFileUploadDto = {
  file: File
  relatedTable?: string
  relatedId?: string
  description?: string
}

export type FileUploadStats = {
  totalFiles: number
  totalSize: number
  filesByType: Record<string, number>
}

export type GetFileUploadsParams = {
  relatedTable?: string
  relatedId?: string
  mimeType?: string
  uploadedBy?: string
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}