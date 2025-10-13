import type { QuestionType, DifficultyLevel } from '@/constants/roles'

export const EXAM_TYPES = {
  MIDTERM: 'midterm',
  FINAL: 'final',
  QUIZ: 'quiz',
  ASSIGNMENT: 'assignment'
} as const

export type ExamType = typeof EXAM_TYPES[keyof typeof EXAM_TYPES]

export type DeliveryMode = 'onsite' | 'online'

export type SubPaperQuestion = {
  _id: string
  questionId: string
  questionText: string
  questionType: string
  difficultyLevel: string
  marksAllocated: number
  subQuestionLabel: string
  subQuestionOrder: number
  subQuestionLevel: number
  subQuestions?: SubPaperQuestion[]
  createdAt: string
}

export type PaperQuestion = {
  _id: string
  questionId: string
  questionText: string
  questionType: string
  difficultyLevel: string
  questionOrder: number
  marksAllocated: number
  partLabel: string
  partTitle?: string
  isOptional: boolean
  subQuestionLevel: number
  subQuestions?: SubPaperQuestion[]
  createdAt: string
}

export type PaperPart = {
  partLabel: string
  partTitle: string
  partInstructions?: string
  partOrder: number
  totalMarks: number
  questionCount: number
  hasOptionalQuestions?: boolean
  minimumQuestionsToAnswer?: number
}

export type ExamPaper = {
  _id: string
  subjectId: string
  subjectCode?: string
  subjectName?: string
  paperTitle: string
  paperType: ExamType
  totalMarks: number
  durationMinutes: number
  formattedDuration: string
  deliveryMode: DeliveryMode
  instructions?: string
  createdBy: string
  createdByName?: string
  isFinalized: boolean
  finalizedAt?: string
  finalizedBy?: string
  versionNumber: number
  parentPaperId?: string
  isActive: boolean
  parts: PaperPart[]
  questions?: PaperQuestion[]
  questionCount?: number
  createdAt: string
  updatedAt: string
}

export type SubQuestionDto = {
  questionId: string
  marksAllocated: number
  subQuestionLabel: string
  subQuestionOrder: number
  subQuestions?: SubQuestionDto[]
}

export type PaperQuestionDto = {
  questionId: string
  questionOrder: number
  marksAllocated: number
  partLabel: string
  partTitle?: string
  isOptional?: boolean
  subQuestions?: SubQuestionDto[]
}

export type PaperPartDto = {
  partLabel: string
  partTitle: string
  partInstructions?: string
  partOrder: number
  hasOptionalQuestions?: boolean
  minimumQuestionsToAnswer?: number
}

export type CreateExamPaperDto = {
  subjectId: string
  paperTitle: string
  paperType: ExamType
  totalMarks: number
  durationMinutes: number
  deliveryMode: DeliveryMode
  instructions?: string
  parts: PaperPartDto[]
  questions: PaperQuestionDto[]
}

export type UpdateExamPaperDto = Partial<CreateExamPaperDto> & {
  isActive?: boolean
}

export type QuestionCriteriaDto = {
  topic?: string
  difficultyLevel?: DifficultyLevel
  questionType?: QuestionType
  count: number
  marksPerQuestion: number
  section?: string
}

export type GeneratePaperDto = {
  subjectId: string
  paperTitle: string
  paperType: ExamType
  durationMinutes: number
  instructions?: string
  questionCriteria: QuestionCriteriaDto[]
}

export type ExamPaperStats = {
  totalPapers: number
  finalizedPapers: number
  papersByType: Record<string, number>
  papersBySubject: Array<{ subjectName: string; count: number }>
  averageQuestionsPerPaper: number
  averageDuration: number
}

export type GetExamPapersParams = {
  subjectId?: string
  paperType?: ExamType
  isFinalized?: boolean
  isActive?: boolean
  myPapers?: boolean
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export type BackendExamPapersListResponse = {
  examPapers: ExamPaper[]
  total: number
  page: number
  limit: number
  totalPages: number
}