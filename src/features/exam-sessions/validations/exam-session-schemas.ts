import { z } from 'zod'
import { EXAM_SESSION_STATUS } from '../types/exam-sessions'

export const createExamSessionSchema = z.object({
  paperId: z.string().min(1, 'Exam paper is required'),
  examTitle: z.string()
    .min(3, 'Exam title must be at least 3 characters')
    .max(100, 'Exam title must be less than 100 characters'),
  examDate: z.string().min(1, 'Exam date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  deliveryMode: z.enum(['onsite', 'online']),
  roomId: z.string().optional(),
  enrollmentKey: z.string().optional(),
  maxStudents: z.number()
    .min(1, 'Maximum students must be at least 1')
    .max(500, 'Maximum students cannot exceed 500'),
  instructions: z.string().optional(),
  year: z.number()
    .int('Year must be an integer')
    .min(1, 'Year must be at least 1')
    .max(4, 'Year must be at most 4'),
  semester: z.number()
    .int('Semester must be an integer')
    .min(1, 'Semester must be 1 or 2')
    .max(2, 'Semester must be 1 or 2')
}).refine((data) => {
  const [startHour, startMin] = data.startTime.split(':').map(Number)
  const [endHour, endMin] = data.endTime.split(':').map(Number)
  const startMinutes = startHour * 60 + startMin
  const endMinutes = endHour * 60 + endMin
  return startMinutes < endMinutes
}, {
  message: 'Start time must be before end time',
  path: ['endTime']
}).refine((data) => {
  if (data.deliveryMode === 'onsite' || data.deliveryMode === 'online') {
    return !!data.roomId
  }
  return true
}, {
  message: 'Room is required for onsite and online exams',
  path: ['roomId']
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