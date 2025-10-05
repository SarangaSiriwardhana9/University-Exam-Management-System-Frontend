import { z } from 'zod'
import { REPORT_FORMAT } from '../types/reports'

export const generateReportSchema = z.object({
  reportType: z.string().min(1, 'Report type is required'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  format: z.enum([
    REPORT_FORMAT.PDF,
    REPORT_FORMAT.EXCEL,
    REPORT_FORMAT.CSV,
    REPORT_FORMAT.JSON
  ]),
  parameters: z.record(z.string(), z.unknown()).default({}),
  filters: z.record(z.string(), z.unknown()).default({})
})

export type GenerateReportFormData = z.infer<typeof generateReportSchema>