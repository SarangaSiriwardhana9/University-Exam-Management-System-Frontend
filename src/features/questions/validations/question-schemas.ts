/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod'
import { QUESTION_TYPES, SUB_QUESTION_TYPES, DIFFICULTY_LEVELS, BLOOMS_TAXONOMY } from '@/constants/roles'

const questionOptionSchema = z.object({
  optionText: z.string().min(1, 'Option text is required'),
  isCorrect: z.boolean(),
  optionOrder: z.number().int().min(1)
})

const subQuestionSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    questionText: z.string().min(3, 'Question text must be at least 3 characters'),
    questionDescription: z.string().optional(),
    questionType: z.enum([
      SUB_QUESTION_TYPES.SHORT_ANSWER,
      SUB_QUESTION_TYPES.LONG_ANSWER,
      SUB_QUESTION_TYPES.FILL_BLANK,
      SUB_QUESTION_TYPES.STRUCTURED,
      SUB_QUESTION_TYPES.ESSAY
    ]),
    marks: z.number().min(0.5, 'Marks must be at least 0.5').max(100, 'Marks cannot exceed 100'),
    subQuestionLabel: z.string().min(1, 'Sub-question label is required'),
    subQuestionOrder: z.number().int().min(1),
    subQuestions: z.array(subQuestionSchema).optional()
  })
)

export const createQuestionSchema = z.object({
  subjectId: z.string().min(1, 'Subject is required'),
  questionText: z.string().min(10, 'Question text must be at least 10 characters'),
  questionDescription: z.string().optional(),
  questionType: z.enum([
    QUESTION_TYPES.MCQ,
    QUESTION_TYPES.STRUCTURED,
    QUESTION_TYPES.ESSAY
  ]),
  difficultyLevel: z.enum([
    DIFFICULTY_LEVELS.EASY,
    DIFFICULTY_LEVELS.MEDIUM,
    DIFFICULTY_LEVELS.HARD
  ]),
  marks: z.number().min(0.5, 'Marks must be at least 0.5').max(100, 'Marks cannot exceed 100'),
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
  options: z.array(questionOptionSchema).optional(),
  subQuestions: z.array(subQuestionSchema).optional()
}).refine((data) => {
  // MCQ must have at least 2 options
  if (data.questionType === QUESTION_TYPES.MCQ) {
    return data.options && data.options.length >= 2
  }
  return true
}, {
  message: "MCQ questions must have at least 2 options",
  path: ["options"]
}).refine((data) => {
  // MCQ must have exactly one correct answer
  if (data.questionType === QUESTION_TYPES.MCQ && data.options) {
    const correctCount = data.options.filter(opt => opt.isCorrect).length
    return correctCount === 1
  }
  return true
}, {
  message: "MCQ must have exactly one correct answer",
  path: ["options"]
}).refine((data) => {
  // MCQ cannot have sub-questions
  if (data.questionType === QUESTION_TYPES.MCQ) {
    return !data.subQuestions || data.subQuestions.length === 0
  }
  return true
}, {
  message: "MCQ questions cannot have sub-questions",
  path: ["subQuestions"]
}).refine((data) => {
  // STRUCTURED and ESSAY cannot have MCQ options
  if (data.questionType === QUESTION_TYPES.STRUCTURED || data.questionType === QUESTION_TYPES.ESSAY) {
    return !data.options || data.options.length === 0
  }
  return true
}, {
  message: "STRUCTURED and ESSAY questions cannot have MCQ options",
  path: ["options"]
})

export const updateQuestionSchema = createQuestionSchema.partial().omit({ subjectId: true }).extend({
  isActive: z.boolean().optional()
})

export type CreateQuestionFormData = z.infer<typeof createQuestionSchema>
export type UpdateQuestionFormData = z.infer<typeof updateQuestionSchema>