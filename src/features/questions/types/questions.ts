import type { QuestionType, DifficultyLevel, BloomsTaxonomy, SubQuestionType } from '@/constants/roles'

export type SubQuestion = {
  _id: string
  questionText: string
  questionDescription?: string
  questionType: SubQuestionType
  marks: number
  subQuestionLabel: string
  subQuestionOrder: number
  subQuestionLevel: number
  subQuestions?: SubQuestion[]
  createdAt: string
  updatedAt: string
}

export type QuestionOption = {
  _id?: string
  optionText: string
  isCorrect: boolean
  optionOrder: number
  createdAt?: string
}

export type Question = {
  _id: string
  subjectId: string
  subjectCode?: string
  subjectName?: string
  questionText: string
  questionDescription?: string
  questionType: QuestionType
  difficultyLevel: DifficultyLevel
  marks: number
  topic?: string
  subtopic?: string
  bloomsTaxonomy?: BloomsTaxonomy
  keywords?: string
  usageCount: number
  isPublic: boolean
  createdBy: string
  createdByName?: string
  isActive: boolean
  hasSubQuestions: boolean
  subQuestionLevel: number
  options?: QuestionOption[]
  subQuestions?: SubQuestion[]
  createdAt: string
  updatedAt: string
}

export type CreateSubQuestionDto = {
  questionText: string
  questionDescription?: string
  questionType: SubQuestionType
  marks: number
  subQuestionLabel: string
  subQuestionOrder: number
  subQuestions?: CreateSubQuestionDto[]
}

export type CreateQuestionDto = {
  subjectId: string
  questionText: string
  questionDescription?: string
  questionType: QuestionType
  difficultyLevel: DifficultyLevel
  marks: number
  topic?: string
  subtopic?: string
  bloomsTaxonomy?: BloomsTaxonomy
  keywords?: string
  isPublic?: boolean
  options?: Omit<QuestionOption, '_id' | 'createdAt'>[]
  subQuestions?: CreateSubQuestionDto[]
}

export type UpdateQuestionDto = Partial<Omit<CreateQuestionDto, 'subjectId'>> & {
  isActive?: boolean
}

export type QuestionStats = {
  totalQuestions: number
  activeQuestions: number
  publicQuestions: number
  questionsByType: Record<string, number>
  questionsByDifficulty: Record<string, number>
  questionsBySubject: Array<{ subjectName: string; count: number }>
}

export type GetQuestionsParams = {
  subjectId?: string
  questionType?: QuestionType
  difficultyLevel?: DifficultyLevel
  topic?: string
  isPublic?: boolean
  isActive?: boolean
  myQuestions?: boolean
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export type BackendQuestionsListResponse = {
  questions: Question[]
  total: number
  page: number
  limit: number
  totalPages: number
}