export const USER_ROLES = {
  ADMIN: 'admin',
  FACULTY: 'faculty',
  STUDENT: 'student',
  EXAM_COORDINATOR: 'exam_coordinator',
  INVIGILATOR: 'invigilator'
} as const

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]

export const QUESTION_TYPES = {
  MCQ: 'mcq',
  STRUCTURED: 'structured',
  ESSAY: 'essay',
  SHORT_ANSWER: 'short_answer',
  LONG_ANSWER: 'long_answer',
  FILL_BLANK: 'fill_blank',
  TRUE_FALSE: 'true_false',
} as const

export type QuestionType = typeof QUESTION_TYPES[keyof typeof QUESTION_TYPES]

export const SUB_QUESTION_TYPES = {
  SHORT_ANSWER: 'short_answer',
  LONG_ANSWER: 'long_answer',
  FILL_BLANK: 'fill_blank',
  STRUCTURED: 'structured',
  ESSAY: 'essay',
} as const

export type SubQuestionType = typeof SUB_QUESTION_TYPES[keyof typeof SUB_QUESTION_TYPES]

export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
} as const

export type DifficultyLevel = typeof DIFFICULTY_LEVELS[keyof typeof DIFFICULTY_LEVELS]

export const BLOOMS_TAXONOMY = {
  REMEMBER: 'remember',
  UNDERSTAND: 'understand',
  APPLY: 'apply',
  ANALYZE: 'analyze',
  EVALUATE: 'evaluate',
  CREATE: 'create'
} as const

export type BloomsTaxonomy = typeof BLOOMS_TAXONOMY[keyof typeof BLOOMS_TAXONOMY]

export const EXAM_TYPES = {
  MIDTERM: 'midterm',
  FINAL: 'final',
  QUIZ: 'quiz',
  ASSIGNMENT: 'assignment'
} as const

export type ExamType = typeof EXAM_TYPES[keyof typeof EXAM_TYPES]