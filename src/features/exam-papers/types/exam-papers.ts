// src/features/exam-papers/types/exam-papers.ts
import type { QuestionType, DifficultyLevel } from '@/constants/roles'

export const EXAM_TYPES = {
  MIDTERM: 'midterm',
  FINAL: 'final',
  QUIZ: 'quiz',
  ASSIGNMENT: 'assignment'
} as const

export type ExamType = typeof EXAM_TYPES[keyof typeof EXAM_TYPES]

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
  instructions?: string
  createdBy: string
  createdByName?: string
  isFinalized: boolean
  finalizedAt?: string
  finalizedBy?: string
  versionNumber: number
  parentPaperId?: string
  isActive: boolean
  questions?: PaperQuestion[]
  questionCount?: number
  createdAt: string
  updatedAt: string
}

export type PaperQuestion = {
  _id: string
  questionId: string
  questionText: string
  questionType: string
  difficultyLevel: string
  questionOrder: number
  marksAllocated: number
  section: string
  isOptional: boolean
  createdAt: string
}

export type CreateExamPaperDto = {
  subjectId: string
  paperTitle: string
  paperType: ExamType
  totalMarks: number
  durationMinutes: number
  instructions?: string
  questions: Array<{
    questionId: string
    questionOrder: number
    marksAllocated: number
    section?: string
    isOptional?: boolean
  }>
}

export type UpdateExamPaperDto = Partial<CreateExamPaperDto> & {
  isActive?: boolean
}

export type GeneratePaperDto = {
  subjectId: string
  paperTitle: string
  paperType: ExamType
  durationMinutes: number
  instructions?: string
  questionCriteria: Array<{
    topic?: string
    difficultyLevel?: DifficultyLevel
    questionType?: QuestionType
    count: number
    marksPerQuestion: number
    section?: string
  }>
}

export type ExamPaperStats = {
  totalPapers: number
  papersByType: Record<string, number>
  papersBySubject: Record<string, number>
  finalizedPapers: number
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

// Backend response types
export type BackendExamPapersListResponse = {
  examPapers: ExamPaper[]
  total: number
  page: number
  limit: number
  totalPages: number
}