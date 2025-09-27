export const REPORT_FORMAT = {
  PDF: 'pdf',
  EXCEL: 'excel',
  CSV: 'csv',
  JSON: 'json'
} as const

export type ReportFormat = typeof REPORT_FORMAT[keyof typeof REPORT_FORMAT]

export type ReportConfig = {
  reportType: string
  title: string
  description: string
  parameters: Record<string, unknown>
  filters: Record<string, unknown>
  format: ReportFormat
}

export type ReportResult = {
  reportId: string
  title: string
  generatedAt: string
  generatedBy: string
  format: ReportFormat
  filePath?: string
  data?: Record<string, unknown>
}

export type ReportType = {
  id: string
  name: string
  description: string
  category: string
  parameters: Array<{
    name: string
    type: string
    required: boolean
    options?: string[]
  }>
}