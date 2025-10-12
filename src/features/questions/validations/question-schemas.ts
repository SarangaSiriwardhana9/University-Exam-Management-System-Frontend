import { z } from 'zod'
import { QUESTION_TYPES, SUB_QUESTION_TYPES, DIFFICULTY_LEVELS, BLOOMS_TAXONOMY } from '@/constants/roles'

const questionOptionSchema = z.object({
  optionText: z.string().min(1, 'Option text is required'),
  isCorrect: z.boolean(),
  optionOrder: z.number().int().min(1)
})

export type SubQuestionSchemaType = {
  questionText: string
  questionDescription?: string
  questionType: 'short_answer' | 'long_answer' | 'fill_blank' | 'structured' | 'essay'
  marks: number
  subQuestionLabel: string
  subQuestionOrder: number
  subQuestions?: SubQuestionSchemaType[]
}

const subQuestionSchemaBase = z.object({
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
})

type SubQuestionSchemaInput = z.infer<typeof subQuestionSchemaBase> & {
  subQuestions?: SubQuestionSchemaInput[]
}

const subQuestionSchema: z.ZodType<SubQuestionSchemaInput> = subQuestionSchemaBase.extend({
  subQuestions: z.lazy(() => z.array(subQuestionSchema).optional()) as any
}) as any

export type CreateSubQuestionDto = SubQuestionSchemaType

const baseQuestionSchema = z.object({
  subjectId: z.string().min(1, 'Subject is required'),
  questionText: z.string().min(10, 'Question text must be at least 10 characters'),
  questionDescription: z.string().optional().or(z.literal('')),
  questionType: z.enum([QUESTION_TYPES.MCQ, QUESTION_TYPES.STRUCTURED, QUESTION_TYPES.ESSAY]),
  difficultyLevel: z.enum([DIFFICULTY_LEVELS.EASY, DIFFICULTY_LEVELS.MEDIUM, DIFFICULTY_LEVELS.HARD]),
  marks: z.number().min(0.5, 'Marks must be at least 0.5').max(100, 'Marks cannot exceed 100'),
  topic: z.string().optional().or(z.literal('')),
  subtopic: z.string().optional().or(z.literal('')),
  bloomsTaxonomy: z.enum([
    BLOOMS_TAXONOMY.REMEMBER,
    BLOOMS_TAXONOMY.UNDERSTAND,
    BLOOMS_TAXONOMY.APPLY,
    BLOOMS_TAXONOMY.ANALYZE,
    BLOOMS_TAXONOMY.EVALUATE,
    BLOOMS_TAXONOMY.CREATE
  ]).optional(),
  keywords: z.string().optional().or(z.literal('')),
  isPublic: z.boolean().optional(),
  options: z.array(questionOptionSchema).optional(),
  subQuestions: z.array(subQuestionSchema).optional()
})

export const createQuestionSchema = baseQuestionSchema.superRefine((data, ctx) => {
  if (data.questionType === QUESTION_TYPES.MCQ) {
    if (!data.options || data.options.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "MCQ questions must have at least 2 options",
        path: ["options"]
      })
      return
    }

    const correctCount = data.options.filter(opt => opt.isCorrect).length
    if (correctCount !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "MCQ must have exactly one correct answer",
        path: ["options"]
      })
      return
    }

    if (data.subQuestions?.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "MCQ questions cannot have sub-questions",
        path: ["subQuestions"]
      })
    }
  }

  if (data.questionType === QUESTION_TYPES.STRUCTURED || data.questionType === QUESTION_TYPES.ESSAY) {
    if (data.options?.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "STRUCTURED and ESSAY questions cannot have MCQ options",
        path: ["options"]
      })
    }
  }
})

export const updateQuestionSchema = baseQuestionSchema.partial().omit({ subjectId: true }).extend({
  isActive: z.boolean().optional()
})

export type CreateQuestionFormData = z.infer<typeof createQuestionSchema>
export type UpdateQuestionFormData = z.infer<typeof updateQuestionSchema>