 
import { z } from 'zod'
import { QUESTION_TYPES, DIFFICULTY_LEVELS, BLOOMS_TAXONOMY } from '@/constants/roles'

const questionOptionSchema = z.object({
  optionText: z.string().min(1, 'Option text is required'),
  isCorrect: z.boolean(),
  optionOrder: z.number().int().min(1)
})

export const createQuestionSchema = z.object({
  subjectId: z.string().min(1, 'Subject is required'),
  questionText: z.string().min(10, 'Question text must be at least 10 characters'),
  questionDescription: z.string().optional(),
  questionType: z.enum([
    QUESTION_TYPES.MCQ,
    QUESTION_TYPES.SHORT_ANSWER,
    QUESTION_TYPES.LONG_ANSWER,
    QUESTION_TYPES.FILL_BLANK,
    QUESTION_TYPES.TRUE_FALSE
  ]),
  difficultyLevel: z.enum([
    DIFFICULTY_LEVELS.EASY,
    DIFFICULTY_LEVELS.MEDIUM,
    DIFFICULTY_LEVELS.HARD
  ]),
  marks: z.number().int().min(1, 'Marks must be at least 1').max(100, 'Marks cannot exceed 100'),
  topic: z.string().optional(),
  subtopic: z.string().optional(),
  bloomsTaxonomy: z.enum([
    BLOOMS_TAXONOMY.REMEMBER,
    BLOOMS_TAXONOMY.UNDERSTAND,
    BLOOMS_TAXONOMY.APPLY,
    BLOOMS_TAXONOMY.ANALYZE,
    BLOOMS_TAXONOMY.EVALUATE,
    BLOOMS_TAXONOMY.CREATE
  ]).optional(),
  keywords: z.string().optional(),
  isPublic: z.boolean().optional(),
  options: z.array(questionOptionSchema).optional()
}).refine((data) => {
  // MCQ and TRUE_FALSE must have options
  if (data.questionType === QUESTION_TYPES.MCQ || data.questionType === QUESTION_TYPES.TRUE_FALSE) {
    return data.options && data.options.length >= 2
  }
  return true
}, {
  message: "MCQ and True/False questions must have at least 2 options",
  path: ["options"]
}).refine((data) => {
  // At least one correct answer for MCQ
  if (data.questionType === QUESTION_TYPES.MCQ && data.options) {
    return data.options.some(opt => opt.isCorrect)
  }
  return true
}, {
  message: "MCQ must have at least one correct answer",
  path: ["options"]
})

export const updateQuestionSchema = createQuestionSchema.partial().omit({ subjectId: true }).extend({
  isActive: z.boolean().optional()
})

export type CreateQuestionFormData = z.infer<typeof createQuestionSchema>
export type UpdateQuestionFormData = z.infer<typeof updateQuestionSchema> 