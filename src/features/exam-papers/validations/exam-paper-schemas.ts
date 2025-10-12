/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod'
import { EXAM_TYPES } from '../types/exam-papers'

const subQuestionSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    questionId: z.string().min(1, 'Question is required'),
    marksAllocated: z.number().min(0.5, 'Marks must be at least 0.5'),
    subQuestionLabel: z.string().min(1, 'Sub-question label is required'),
    subQuestionOrder: z.number().int().min(1),
    subQuestions: z.array(subQuestionSchema).optional()
  })
)

const paperQuestionSchema = z.object({
  questionId: z.string().min(1, 'Question is required'),
  questionOrder: z.number().int().min(1),
  marksAllocated: z.number().min(0.5, 'Marks must be at least 0.5'),
  partLabel: z.string().min(1, 'Part label is required'),
  partTitle: z.string().optional(),
  isOptional: z.boolean().optional(),
  subQuestions: z.array(subQuestionSchema).optional()
})

const paperPartSchema = z.object({
  partLabel: z.string().min(1, 'Part label is required'),
  partTitle: z.string().min(1, 'Part title is required'),
  partInstructions: z.string().optional(),
  partOrder: z.number().int().min(1),
  hasOptionalQuestions: z.boolean().optional(),
  minimumQuestionsToAnswer: z.number().int().min(0).optional()
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
  totalMarks: z.number().min(1, 'Total marks must be at least 1'),
  durationMinutes: z.number().int().min(1, 'Duration must be at least 1 minute'),
  instructions: z.string().optional(),
  parts: z.array(paperPartSchema).min(1, 'At least one part is required'),
  questions: z.array(paperQuestionSchema).min(1, 'At least one question is required')
})

export const updateExamPaperSchema = createExamPaperSchema.partial().extend({
  isActive: z.boolean().optional()
})

const questionCriteriaSchema = z.object({
  topic: z.string().optional(),
  difficultyLevel: z.enum(['easy', 'medium', 'hard']).optional(),
  questionType: z.string().optional(),
  count: z.number().int().min(1, 'Count must be at least 1'),
  marksPerQuestion: z.number().min(0.5, 'Marks per question must be at least 0.5'),
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