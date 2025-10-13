import { z } from 'zod'

export const createSubjectSchema = z.object({
  subjectCode: z.string()
    .min(2, 'Subject code must be at least 2 characters')
    .max(20, 'Subject code must be less than 20 characters')
    .regex(/^[A-Z0-9\-]+$/, 'Subject code must contain only uppercase letters, numbers, and hyphens'),
  subjectName: z.string()
    .min(3, 'Subject name must be at least 3 characters')
    .max(200, 'Subject name must be less than 200 characters'),
  departmentId: z.string()
    .min(1, 'Department is required'),
  year: z.coerce.number()
    .int('Year must be an integer')
    .min(1, 'Year must be at least 1')
    .max(4, 'Year must be at most 4'),
  semester: z.coerce.number()
    .int('Semester must be an integer')
    .min(1, 'Semester must be 1 or 2')
    .max(2, 'Semester must be 1 or 2'),
  credits: z.coerce.number()
    .min(0, 'Credits must be at least 0')
    .max(10, 'Credits must be at most 10')
    .optional()
    .default(3),
  description: z.string().optional(),
  licId: z.string().optional(),
  lecturerIds: z.array(z.string()).optional()
})

export const updateSubjectSchema = createSubjectSchema.partial().omit({ subjectCode: true }).extend({
  isActive: z.boolean().optional()
})

export type CreateSubjectFormData = z.infer<typeof createSubjectSchema>
export type UpdateSubjectFormData = z.infer<typeof updateSubjectSchema>