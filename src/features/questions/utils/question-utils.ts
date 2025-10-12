import type { CreateQuestionFormData, CreateSubQuestionDto } from '../validations/question-schemas'
import type { Question } from '../types/questions'
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
  isPublic: false,
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

export const cleanQuestionFormData = (data: CreateQuestionFormData): CreateQuestionFormData => {
  const cleanString = (str: string | undefined) => str?.trim() || undefined
  
  return {
    ...data,
    questionDescription: cleanString(data.questionDescription),
    topic: cleanString(data.topic),
    subtopic: cleanString(data.subtopic),
    keywords: cleanString(data.keywords),
    options: data.questionType === QUESTION_TYPES.MCQ ? data.options : [],
    subQuestions: data.questionType === QUESTION_TYPES.MCQ ? [] : data.subQuestions,
  }
}

export const mapQuestionToFormData = (question: Question): CreateQuestionFormData => ({
  subjectId: question.subjectId,
  questionText: question.questionText,
  questionDescription: question.questionDescription || '',
  questionType: question.questionType,
  difficultyLevel: question.difficultyLevel,
  marks: question.marks,
  topic: question.topic || '',
  subtopic: question.subtopic || '',
  bloomsTaxonomy: question.bloomsTaxonomy,
  keywords: question.keywords || '',
  isPublic: question.isPublic,
  options: question.options || [],
  subQuestions: question.subQuestions || [],
})