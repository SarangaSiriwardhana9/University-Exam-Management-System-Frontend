import type { CreateQuestionFormData, CreateSubQuestionDto } from '../validations/question-schemas'
import type { Question, SubQuestion } from '../types/questions'
import { QUESTION_TYPES, SUB_QUESTION_TYPES } from '@/constants/roles'

const SUB_LABELS = {
  LEVEL_1: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  LEVEL_2: ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii'],
  LEVEL_3: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
}

const getSubQuestionLabel = (index: number, level: number): string => {
  if (level === 1) return SUB_LABELS.LEVEL_1[index] || `${index + 1}`
  if (level === 2) return SUB_LABELS.LEVEL_2[index] || `${index + 1}`
  if (level === 3) return SUB_LABELS.LEVEL_3[index] || `${index + 1}`
  return `${index + 1}`
}

export const getDefaultQuestionFormData = (): CreateQuestionFormData => ({
  subjectId: '',
  questionText: '',
  questionDescription: '',
  questionType: QUESTION_TYPES.MCQ,
  difficultyLevel: 'medium',
  marks: 1,
  topic: '',
  subtopic: '',
  bloomsTaxonomy: undefined,
  keywords: '',
  isPublic: true,
  options: [],
  subQuestions: [],
})

export const getDefaultMcqOptions = () => [
  { optionText: '', isCorrect: false, optionOrder: 1 },
  { optionText: '', isCorrect: false, optionOrder: 2 },
]

export const getDefaultSubQuestion = (index: number, level: number = 1): CreateSubQuestionDto => ({
  questionText: '',
  questionDescription: '',
  questionType: SUB_QUESTION_TYPES.SHORT_ANSWER,
  marks: 1,
  subQuestionLabel: getSubQuestionLabel(index, level),
  subQuestionOrder: index + 1,
  subQuestions: [],
})

export const calculateTotalMarks = (
  questionType: string,
  marks: number,
  subQuestions: CreateSubQuestionDto[] = []
): number => {
  if (questionType === QUESTION_TYPES.MCQ || subQuestions.length === 0) {
    return marks
  }

  const calculateSubMarks = (subs: CreateSubQuestionDto[]): number => {
    return subs.reduce((total, sub) => {
      return total + (sub.marks || 0) + (sub.subQuestions?.length ? calculateSubMarks(sub.subQuestions) : 0)
    }, 0)
  }

  return calculateSubMarks(subQuestions)
}

const cleanSubQuestionsForSubmit = (subQuestions: any[]): CreateSubQuestionDto[] => {
  if (!subQuestions || !Array.isArray(subQuestions)) return []
  
  return subQuestions.map(sq => ({
    questionText: sq.questionText || '',
    questionDescription: sq.questionDescription || '',
    questionType: sq.questionType,
    marks: Number(sq.marks) || 0,
    subQuestionLabel: sq.subQuestionLabel || '',
    subQuestionOrder: Number(sq.subQuestionOrder) || 0,
    subQuestions: sq.subQuestions?.length ? cleanSubQuestionsForSubmit(sq.subQuestions) : []
  }))
}

export const cleanQuestionFormData = (data: CreateQuestionFormData): CreateQuestionFormData => {
  const cleanString = (str: string | undefined) => str?.trim() || undefined
  const subjectId = typeof data.subjectId === 'object' && data.subjectId !== null 
    ? (data.subjectId as any)._id || String(data.subjectId)
    : String(data.subjectId)
  
  // Ensure options have correct sequential optionOrder to prevent duplicates
  const cleanedOptions = data.questionType === QUESTION_TYPES.MCQ && data.options
    ? data.options.map((opt, index) => ({
        optionText: opt.optionText,
        isCorrect: opt.isCorrect,
        optionOrder: index + 1  // Force sequential order starting from 1
      }))
    : []
  
  return {
    ...data,
    subjectId,
    questionDescription: cleanString(data.questionDescription),
    topic: cleanString(data.topic),
    subtopic: cleanString(data.subtopic),
    keywords: cleanString(data.keywords),
    options: cleanedOptions,
    subQuestions: data.questionType === QUESTION_TYPES.MCQ ? [] : cleanSubQuestionsForSubmit(data.subQuestions || []),
  }
}

const mapSubQuestionsToFormData = (subQuestions: any[]): CreateSubQuestionDto[] => {
  if (!subQuestions || !Array.isArray(subQuestions)) return []
  
  return subQuestions.map(sq => ({
    questionText: sq.questionText || '',
    questionDescription: sq.questionDescription || '',
    questionType: sq.questionType,
    marks: sq.marks || 0,
    subQuestionLabel: sq.subQuestionLabel || '',
    subQuestionOrder: sq.subQuestionOrder || 0,
    subQuestions: sq.subQuestions?.length ? mapSubQuestionsToFormData(sq.subQuestions) : []
  }))
}

export const mapQuestionToFormData = (question: Question): CreateQuestionFormData => {
  let subjectId = question.subjectId

  if (typeof subjectId === 'string' && subjectId.includes('ObjectId')) {
    try {
      const parsed = JSON.parse(subjectId.replace(/new ObjectId\('([^']+)'\)/g, '"$1"').replace(/ObjectId\('([^']+)'\)/g, '"$1"'))
      subjectId = parsed._id || subjectId
    } catch {
      const match = subjectId.match(/ObjectId\('([^']+)'\)/)
      if (match) subjectId = match[1]
    }
  } else if (typeof subjectId === 'object' && subjectId !== null) {
    subjectId = (subjectId as any)._id || subjectId
  }

  return {
    subjectId: typeof subjectId === 'string' ? subjectId : String(subjectId),
    questionText: question.questionText,
    questionDescription: question.questionDescription || '',
    questionType: question.questionType as 'mcq' | 'structured' | 'essay',
    difficultyLevel: question.difficultyLevel,
    marks: question.marks,
    topic: question.topic || '',
    subtopic: question.subtopic || '',
    bloomsTaxonomy: question.bloomsTaxonomy,
    keywords: question.keywords || '',
    isPublic: question.isPublic,
    allowMultipleAnswers: question.allowMultipleAnswers,
    options: question.options?.map(opt => ({
      optionText: opt.optionText,
      isCorrect: opt.isCorrect,
      optionOrder: opt.optionOrder
    })) || [],
    subQuestions: question.subQuestions?.length ? mapSubQuestionsToFormData(question.subQuestions) : [],
  }
}

export const parseStringifiedField = (field: string, pattern: string): string | null => {
  if (!field || typeof field !== 'string') return null
  
  try {
    const match = field.match(new RegExp(`${pattern}:\\s*'([^']+)'`))
    return match ? match[1] : null
  } catch {
    return null
  }
}

export const getSubjectInfo = (question: Question) => {
  if (question.subjectCode && question.subjectName) {
    return { code: question.subjectCode, name: question.subjectName }
  }
  
  if (typeof question.subjectId === 'string' && question.subjectId.includes('subjectCode')) {
    const code = parseStringifiedField(question.subjectId, 'subjectCode')
    const name = parseStringifiedField(question.subjectId, 'subjectName')
    if (code && name) return { code, name }
  }
  
  return { code: null, name: null }
}

export const getCreatedByName = (question: Question): string | null => {
  if (question.createdByName) return question.createdByName
  
  if (typeof question.createdBy === 'string' && question.createdBy.includes('fullName')) {
    return parseStringifiedField(question.createdBy, 'fullName')
  }
  
  return null
}

export const calculateQuestionTotalMarks = (question: Question): number => {
  if (!question.hasSubQuestions) return question.marks

  const calculateSubMarks = (sqs: SubQuestion[]): number => {
    return sqs.reduce((sum, sq) => {
      let total = sq.marks
      if (sq.subQuestions?.length) {
        total += calculateSubMarks(sq.subQuestions)
      }
      return sum + total
    }, 0)
  }

  return question.subQuestions ? calculateSubMarks(question.subQuestions) : question.marks
}