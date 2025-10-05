 
import { z } from 'zod'
import { EXAM_TYPES } from '../types/exam-papers'

const paperQuestionSchema = z.object({
  questionId: z.string().min(1, 'Question is required'),
  questionOrder: z.number().int().min(1),
  marksAllocated: z.number().int().min(1, 'Marks must be at least 1'),
  section: z.string().optional(),
  isOptional: z.boolean().optional()
})

export const createExamPaperSchema = z.object({
  subjectId: z.string().min(1, 'Subject is required'),
  paperTitle: z.string().min(5, 'Title must be at least 5 characters'),
  paperType: z.enum([
    EXAM_TYPES.MIDTERM,
    EXAM_TYPES.FINAL,
    EXAM_TYPES.QUIZ,
    EXAM_TYPES.ASSIGNMENT
  ]),
  totalMarks: z.number().int().min(1, 'Total marks must be at least 1'),
  durationMinutes: z.number().int().min(1, 'Duration must be at least 1 minute'),
  instructions: z.string().optional(),
  questions: z.array(paperQuestionSchema).min(1, 'At least one question is required')
}).refine((data) => {
  const allocatedMarks = data.questions.reduce((sum, q) => sum + q.marksAllocated, 0)
  return allocatedMarks === data.totalMarks
}, {
  message: "Sum of allocated marks must equal total marks",
  path: ["totalMarks"]
})

export const updateExamPaperSchema = createExamPaperSchema.partial().extend({
  isActive: z.boolean().optional()
})

const questionCriteriaSchema = z.object({
  topic: z.string().optional(),
  difficultyLevel: z.enum(['easy', 'medium', 'hard']).optional(),
  questionType: z.enum(['mcq', 'short_answer', 'long_answer', 'fill_blank', 'true_false']).optional(),
  count: z.number().int().min(1, 'Count must be at least 1'),
  marksPerQuestion: z.number().int().min(1, 'Marks per question must be at least 1'),
  section: z.string().optional()
})

export const generatePaperSchema = z.object({
  subjectId: z.string().min(1, 'Subject is required'),
  paperTitle: z.string().min(5, 'Title must be at least 5 characters'),
  paperType: z.enum([
    EXAM_TYPES.MIDTERM,
    EXAM_TYPES.FINAL,
    EXAM_TYPES.QUIZ,
    EXAM_TYPES.ASSIGNMENT
  ]),
  durationMinutes: z.number().int().min(1, 'Duration must be at least 1 minute'),
  instructions: z.string().optional(),
  questionCriteria: z.array(questionCriteriaSchema).min(1, 'At least one criteria is required')
})

export type CreateExamPaperFormData = z.infer<typeof createExamPaperSchema>
export type UpdateExamPaperFormData = z.infer<typeof updateExamPaperSchema>
export type GeneratePaperFormData = z.infer<typeof generatePaperSchema>