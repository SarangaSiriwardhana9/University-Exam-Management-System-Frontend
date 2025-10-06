import { z } from 'zod'
import { EXAM_SESSION_STATUS } from '../types/exam-sessions'

export const createExamSessionSchema = z.object({
  paperId: z.string().min(1, 'Exam paper is required'),
  examTitle: z.string()
    .min(3, 'Exam title must be at least 3 characters')
    .max(100, 'Exam title must be less than 100 characters'),
  examDateTime: z.string().min(1, 'Exam date and time is required'),
  durationMinutes: z.number()
    .min(15, 'Duration must be at least 15 minutes')
    .max(480, 'Duration cannot exceed 8 hours'),
  roomId: z.string().min(1, 'Room is required'),
  maxStudents: z.number()
    .min(1, 'Maximum students must be at least 1')
    .max(500, 'Maximum students cannot exceed 500'),
  instructions: z.string().optional(),
  academicYear: z.string().min(1, 'Academic year is required'),
  semester: z.number()
    .min(1, 'Semester must be at least 1')
    .max(8, 'Semester cannot exceed 8')
})

export const updateExamSessionSchema = createExamSessionSchema.partial().extend({
  status: z.enum([
    EXAM_SESSION_STATUS.SCHEDULED,
    EXAM_SESSION_STATUS.IN_PROGRESS,
    EXAM_SESSION_STATUS.COMPLETED,
    EXAM_SESSION_STATUS.CANCELLED
  ]).optional()
})

export const cancelExamSessionSchema = z.object({
  reason: z.string().min(10, 'Cancellation reason must be at least 10 characters').optional()
})

export type CreateExamSessionFormData = z.infer<typeof createExamSessionSchema>
export type UpdateExamSessionFormData = z.infer<typeof updateExamSessionSchema>
export type CancelExamSessionFormData = z.infer<typeof cancelExamSessionSchema>