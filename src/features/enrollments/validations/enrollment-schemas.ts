 import { z } from 'zod'
import { ENROLLMENT_STATUS } from '../types/enrollments'

export const createEnrollmentSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  subjectId: z.string().min(1, 'Subject is required'),
  year: z.coerce.number()
    .int('Year must be an integer')
    .min(1, 'Year must be at least 1')
    .max(4, 'Year must be at most 4'),
  semester: z.coerce.number()
    .int('Semester must be an integer')
    .min(1, 'Semester must be 1 or 2')
    .max(2, 'Semester must be 1 or 2'),
  enrollmentDate: z.string().min(1, 'Enrollment date is required'),
})

export const updateEnrollmentSchema = z.object({
  year: z.coerce.number()
    .int('Year must be an integer')
    .min(1, 'Year must be at least 1')
    .max(4, 'Year must be at most 4')
    .optional(),
  semester: z.coerce.number()
    .int('Semester must be an integer')
    .min(1, 'Semester must be 1 or 2')
    .max(2, 'Semester must be 1 or 2')
    .optional(),
  enrollmentDate: z.string().optional(),
  status: z.enum([
    ENROLLMENT_STATUS.ACTIVE,
    ENROLLMENT_STATUS.WITHDRAWN,
    ENROLLMENT_STATUS.COMPLETED
  ]).optional(),
})

export type CreateEnrollmentFormData = z.infer<typeof createEnrollmentSchema>
export type UpdateEnrollmentFormData = z.infer<typeof updateEnrollmentSchema>