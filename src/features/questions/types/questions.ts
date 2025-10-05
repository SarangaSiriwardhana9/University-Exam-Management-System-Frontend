 
import type { QuestionType, DifficultyLevel, BloomsTaxonomy } from '@/constants/roles'

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
  options?: QuestionOption[]
  createdAt: string
  updatedAt: string
}

export type QuestionOption = {
  _id: string
  optionText: string
  isCorrect: boolean
  optionOrder: number
  createdAt: string
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
  options?: Array<{
    optionText: string
    isCorrect: boolean
    optionOrder: number
  }>
}

export type UpdateQuestionDto = Partial<CreateQuestionDto> & {
  isActive?: boolean
}

export type QuestionStats = {
  totalQuestions: number
  questionsByType: Record<string, number>
  questionsByDifficulty: Record<string, number>
  questionsBySubject: Record<string, number>
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

// Backend response types
export type BackendQuestionsListResponse = {
  questions: Question[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type BackendQuestionResponse = {
  question: Question
}