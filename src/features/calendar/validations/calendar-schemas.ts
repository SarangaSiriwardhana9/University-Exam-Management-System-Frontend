import { z } from 'zod'

export const createCalendarSchema = z.object({
  academicYear: z.string()
    .min(9, 'Academic year must be in YYYY/YYYY format')
    .max(9, 'Academic year must be in YYYY/YYYY format')
    .regex(/^\d{4}\/\d{4}$/, 'Academic year must be in YYYY/YYYY format (e.g., 2024/2025)'),
  semester: z.number()
    .min(1, 'Semester must be at least 1')
    .max(8, 'Semester cannot exceed 8'),
  semesterStart: z.string().min(1, 'Semester start date is required'),
  semesterEnd: z.string().min(1, 'Semester end date is required'),
  examStart: z.string().min(1, 'Exam start date is required'),
  examEnd: z.string().min(1, 'Exam end date is required'),
  resultPublishDate: z.string().optional(),
  isCurrent: z.boolean().optional(),
  description: z.string().optional()
}).refine((data) => {
  const semesterStart = new Date(data.semesterStart)
  const semesterEnd = new Date(data.semesterEnd)
  const examStart = new Date(data.examStart)
  const examEnd = new Date(data.examEnd)
  
  return semesterStart < semesterEnd
}, {
  message: "Semester start date must be before semester end date",
  path: ["semesterEnd"]
}).refine((data) => {
  const semesterStart = new Date(data.semesterStart)
  const examStart = new Date(data.examStart)
  
  return examStart >= semesterStart
}, {
  message: "Exam start date must be after or equal to semester start date",
  path: ["examStart"]
}).refine((data) => {
  const examStart = new Date(data.examStart)
  const examEnd = new Date(data.examEnd)
  
  return examStart < examEnd
}, {
  message: "Exam start date must be before exam end date",
  path: ["examEnd"]
}).refine((data) => {
  const semesterEnd = new Date(data.semesterEnd)
  const examEnd = new Date(data.examEnd)
  
  return examEnd <= semesterEnd
}, {
  message: "Exam end date must be before or equal to semester end date",
  path: ["examEnd"]
}).refine((data) => {
  if (!data.resultPublishDate) return true
  
  const examEnd = new Date(data.examEnd)
  const resultPublishDate = new Date(data.resultPublishDate)
  
  return resultPublishDate >= examEnd
}, {
  message: "Result publish date must be after or equal to exam end date",
  path: ["resultPublishDate"]
})

export const updateCalendarSchema = createCalendarSchema.partial().extend({
  isActive: z.boolean().optional()
})

export type CreateCalendarFormData = z.infer<typeof createCalendarSchema>
export type UpdateCalendarFormData = z.infer<typeof updateCalendarSchema>