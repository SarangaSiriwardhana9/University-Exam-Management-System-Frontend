 
# Directory Structure
```
src/features/questions/components/question-columns.tsx
src/features/questions/components/question-details.tsx
src/features/questions/components/question-form.tsx
src/features/questions/hooks/use-question-mutations.ts
src/features/questions/hooks/use-questions-query.ts
src/features/questions/hooks/use-questions.ts
src/features/questions/types/questions.ts
src/features/questions/utils/question-utils.ts
src/features/questions/utils/subject-parser.ts
src/features/questions/validations/question-schemas.ts
```

# Files

## File: src/features/questions/hooks/use-question-mutations.ts
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { questionsService } from './use-questions'
import type { CreateQuestionDto, UpdateQuestionDto } from '../types/questions'
import type { ApiError } from '@/types/common'
import { toast } from 'sonner'

export { useQuestionQuery } from './use-questions-query'

export const useCreateQuestion = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateQuestionDto) => questionsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] })
      toast.success('Question created successfully')
    },
    onError: (error: ApiError) => {
      toast.error('Failed to create question', {
        description: error.message || 'An error occurred.'
      })
    }
  })
}

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateQuestionDto }) => 
      questionsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] })
      toast.success('Question updated successfully')
    },
    onError: (error: ApiError) => {
      toast.error('Failed to update question', {
        description: error.message || 'An error occurred.'
      })
    }
  })
}

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => questionsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] })
      toast.success('Question deleted successfully')
    },
    onError: (error: ApiError) => {
      toast.error('Failed to delete question', {
        description: error.message || 'An error occurred.'
      })
    }
  })
}
```

## File: src/features/questions/utils/question-utils.ts
```typescript
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
      const subTotal = total + (sub.marks || 0) + (sub.subQuestions?.length ? calculateSubMarks(sub.subQuestions) : 0)
      console.log('📊 Calculating marks for sub:', {
        label: sub.subQuestionLabel,
        marks: sub.marks,
        runningTotal: subTotal
      })
      return subTotal
    }, 0)
  }

  const total = calculateSubMarks(subQuestions)
  console.log('📊 Final calculated total marks:', total)
  return total
}

const cleanSubQuestionsForSubmit = (subQuestions: any[]): CreateSubQuestionDto[] => {
  if (!subQuestions || !Array.isArray(subQuestions)) return []
  
  const cleaned = subQuestions.map(sq => {
    const cleanedSq = {
      questionText: sq.questionText || '',
      questionDescription: sq.questionDescription || '',
      questionType: sq.questionType,
      marks: Number(sq.marks) || 0,
      subQuestionLabel: sq.subQuestionLabel || '',
      subQuestionOrder: Number(sq.subQuestionOrder) || 0,
      subQuestions: sq.subQuestions?.length ? cleanSubQuestionsForSubmit(sq.subQuestions) : []
    }
    console.log('🧹 Cleaning sub-question:', {
      label: sq.subQuestionLabel,
      originalMarks: sq.marks,
      cleanedMarks: cleanedSq.marks
    })
    return cleanedSq
  })
  return cleaned
}

export const cleanQuestionFormData = (data: CreateQuestionFormData): CreateQuestionFormData => {
  const cleanString = (str: string | undefined) => str?.trim() || undefined
  const subjectId = typeof data.subjectId === 'object' && data.subjectId !== null 
    ? (data.subjectId as any)._id || String(data.subjectId)
    : String(data.subjectId)
  
  return {
    ...data,
    subjectId,
    questionDescription: cleanString(data.questionDescription),
    topic: cleanString(data.topic),
    subtopic: cleanString(data.subtopic),
    keywords: cleanString(data.keywords),
    options: data.questionType === QUESTION_TYPES.MCQ ? data.options : [],
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
```

## File: src/features/questions/utils/subject-parser.ts
```typescript
type SubjectData = {
  id: string
  code: string
  name: string
}

export const parseSubjectData = (subjectId: string): SubjectData => {
  try {
    if (typeof subjectId === 'string' && subjectId.includes('_id:')) {
      const idMatch = subjectId.match(/_id:\s*new ObjectId\('([^']+)'\)/)
      const codeMatch = subjectId.match(/subjectCode:\s*'([^']+)'/)
      const nameMatch = subjectId.match(/subjectName:\s*'([^']+)'/)
      
      if (idMatch && codeMatch && nameMatch) {
        return {
          id: idMatch[1],
          code: codeMatch[1],
          name: nameMatch[1]
        }
      }
    }
    
    if (typeof subjectId === 'string' && subjectId.startsWith('{')) {
      const cleaned = subjectId.replace(/\n/g, '').replace(/\s+/g, ' ')
      const parsed = JSON.parse(cleaned)
      return {
        id: parsed._id,
        code: parsed.subjectCode,
        name: parsed.subjectName
      }
    }
    
    return {
      id: subjectId,
      code: 'N/A',
      name: 'Subject not found'
    }
  } catch {
    return {
      id: subjectId,
      code: 'N/A',
      name: 'Subject not found'
    }
  }
}

export const extractSubjectId = (subjectId: string): string => {
  const parsed = parseSubjectData(subjectId)
  return parsed.id
}
```

## File: src/features/questions/components/question-details.tsx
```typescript
'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Question, SubQuestion } from '../types/questions'
import { CheckCircle2Icon, CircleIcon } from 'lucide-react'
import { JSX } from 'react'
import { cn } from '@/lib/utils'

type QuestionDetailsProps = {
  question: Question
}

const LEVEL_COLORS = [
  'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950',
  'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950',
  'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950'
] as const

const LEVEL_BADGE_COLORS = [
  'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
] as const

const getLevelColors = (level: number): string => LEVEL_COLORS[level] || LEVEL_COLORS[0]
const getLevelBadgeColors = (level: number): string => LEVEL_BADGE_COLORS[level] || LEVEL_BADGE_COLORS[0]

export const QuestionDetails = ({ question }: QuestionDetailsProps) => {
  const renderSubQuestions = (subQuestions: SubQuestion[], level: number = 0, parentLabel: string = ''): JSX.Element => {
    return (
      <div className={cn("space-y-3", level > 0 && "ml-6 mt-3")}>
        {subQuestions.map((sq) => {
          const fullLabel = parentLabel ? `${parentLabel}.${sq.subQuestionLabel}` : sq.subQuestionLabel
          
          return (
            <div key={sq._id} className={cn("p-4 border-2 rounded-lg", getLevelColors(level))}>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className={cn("font-mono font-bold mt-0.5", getLevelBadgeColors(level))}>
                  {fullLabel}
                </Badge>
                <div className="flex-1">
                  <p className="font-medium">{sq.questionText}</p>
                  {sq.questionDescription && (
                    <p className="text-sm text-muted-foreground mt-1 italic">{sq.questionDescription}</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {sq.marks} marks
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {sq.questionType.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
              {sq.subQuestions && sq.subQuestions.length > 0 && (
                <div className="mt-3">
                  {renderSubQuestions(sq.subQuestions, level + 1, fullLabel)}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  const calculateTotalMarks = (): number => {
    if (!question.hasSubQuestions) return question.marks

    const calculateSubMarks = (sqs: SubQuestion[]): number => {
      return sqs.reduce((sum, sq) => {
        let total = sq.marks
        if (sq.subQuestions && sq.subQuestions.length > 0) {
          total += calculateSubMarks(sq.subQuestions)
        }
        return sum + total
      }, 0)
    }

    return question.subQuestions ? calculateSubMarks(question.subQuestions) : question.marks
  }

  const totalMarks = calculateTotalMarks()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle>{question.questionText}</CardTitle>
                {question.hasSubQuestions && (
                  <Badge variant="default" className="bg-purple-600">
                    Structured
                  </Badge>
                )}
              </div>
              {question.questionDescription && (
                <CardDescription className="mt-2">
                  {question.questionDescription}
                </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Subject</p>
              <p className="mt-1">
                {question.subjectCode} - {question.subjectName}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Type</p>
              <Badge variant="outline" className="mt-1">
                {question.questionType.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Difficulty</p>
              <Badge variant="outline" className="mt-1">
                {question.difficultyLevel.charAt(0).toUpperCase() + question.difficultyLevel.slice(1)}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Marks</p>
              <p className="mt-1 font-semibold text-lg">{totalMarks}</p>
            </div>
          </div>

          {(question.topic || question.subtopic) && (
            <>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                {question.topic && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Topic</p>
                    <p className="mt-1">{question.topic}</p>
                  </div>
                )}
                {question.subtopic && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Subtopic</p>
                    <p className="mt-1">{question.subtopic}</p>
                  </div>
                )}
              </div>
            </>
          )}

          {question.bloomsTaxonomy && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bloom&#39;s Taxonomy</p>
                <Badge variant="secondary" className="mt-1">
                  {question.bloomsTaxonomy.charAt(0).toUpperCase() + question.bloomsTaxonomy.slice(1)}
                </Badge>
              </div>
            </>
          )}

          {question.keywords && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Keywords</p>
                <p className="mt-1 text-sm">{question.keywords}</p>
              </div>
            </>
          )}

          <Separator />
          <div className="flex gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Usage Count</p>
              <p className="mt-1">{question.usageCount}x</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Visibility</p>
              <Badge variant={question.isPublic ? 'default' : 'secondary'} className="mt-1">
                {question.isPublic ? 'Public' : 'Private'}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge variant={question.isActive ? 'default' : 'secondary'} className="mt-1">
                {question.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>

          {question.createdByName && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created By</p>
                <p className="mt-1">{question.createdByName}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {question.options && question.options.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Answer Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {question.options.map((option, index) => (
                <div
                  key={option._id}
                  className={cn(
                    "flex items-start gap-3 p-3 border rounded-lg",
                    option.isCorrect && "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                  )}
                >
                  {option.isCorrect ? (
                    <CheckCircle2Icon className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  ) : (
                    <CircleIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className={option.isCorrect ? 'font-medium' : ''}>
                      {String.fromCharCode(97 + index)}. {option.optionText}
                    </p>
                  </div>
                  {option.isCorrect && (
                    <Badge variant="default" className="bg-green-600">
                      Correct
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {question.hasSubQuestions && question.subQuestions && question.subQuestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Question Parts & Sub-parts</CardTitle>
            <CardDescription>
              This structured question contains {question.subQuestions.length} main part(s) with nested sub-parts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderSubQuestions(question.subQuestions)}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
```

## File: src/features/questions/hooks/use-questions-query.ts
```typescript
'use client'

import { useQuery } from '@tanstack/react-query'
import { questionsService } from './use-questions'
import type { GetQuestionsParams, Question } from '../types/questions'
import type { ApiResponse } from '@/types/common'

export const useQuestionsQuery = (params?: GetQuestionsParams) => {
  return useQuery({
    queryKey: ['questions', params],
    queryFn: () => questionsService.getAll(params),
    staleTime: 30000,
  })
}

export const useQuestionQuery = (id: string | undefined) => {
  return useQuery<ApiResponse<Question>>({
    queryKey: ['questions', id],
    queryFn: async () => {
      if (!id) throw new Error('Question ID is required')
      return await questionsService.getById(id)
    },
    enabled: !!id && id !== 'undefined',
    retry: 1,
  })
}

export const useQuestionsBySubjectQuery = (subjectId: string | undefined, includePrivate = false) => {
  return useQuery({
    queryKey: ['questions', 'subject', subjectId, includePrivate],
    queryFn: async () => {
      if (!subjectId) throw new Error('Subject ID is required')
      return await questionsService.getBySubject(subjectId, { includePrivate })
    },
    enabled: !!subjectId && subjectId !== 'undefined',
    retry: 1,
  })
}
```

## File: src/features/questions/components/question-columns.tsx
```typescript
'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontalIcon, EditIcon, TrashIcon, EyeIcon, ListTreeIcon } from 'lucide-react'
import type { Question } from '../types/questions'
import { cn } from '@/lib/utils'
import type { QuestionType, DifficultyLevel } from '@/constants/roles'
import { parseSubjectData } from '../utils/subject-parser'

const getQuestionTypeBadge = (type: QuestionType | string): string => {
  const styles: Record<string, string> = {
    mcq: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    structured: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
    essay: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  }
  return styles[type] || 'bg-muted'
}

const getDifficultyBadge = (level: DifficultyLevel | string): string => {
  const styles: Record<string, string> = {
    easy: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    hard: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
  }
  return styles[level] || 'bg-muted'
}

const formatQuestionType = (type: string): string => {
  const typeMap: Record<string, string> = {
    mcq: 'MCQ',
    structured: 'STRUCTURED',
    essay: 'ESSAY',
  }
  return typeMap[type] || type.toUpperCase()
}

const formatDifficulty = (level: string): string => level.charAt(0).toUpperCase() + level.slice(1)

type QuestionColumnsProps = {
  onEdit: (question: Question) => void
  onDelete: (question: Question) => void
  onView: (question: Question) => void
}

export const getQuestionColumns = ({ onEdit, onDelete, onView }: QuestionColumnsProps): ColumnDef<Question>[] => [
  {
    accessorKey: 'questionText',
    header: 'Question',
    cell: ({ row }) => {
      const text = row.original.questionText
      const hasSubQuestions = row.original.hasSubQuestions
      return (
        <div className="max-w-md">
          <div className="flex items-start gap-2">
            {hasSubQuestions && (
              <ListTreeIcon className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            )}
            <p className="font-medium line-clamp-2">{text}</p>
          </div>
          {row.original.topic && (
            <p className="text-xs text-muted-foreground mt-1">Topic: {row.original.topic}</p>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'subjectCode',
    header: 'Subject',
    cell: ({ row }) => {
      const subjectData = parseSubjectData(row.original.subjectId)
      return (
        <div>
          <p className="font-medium">{subjectData.code}</p>
          <p className="text-xs text-muted-foreground line-clamp-1">{subjectData.name}</p>
        </div>
      )
    },
  },
  {
    accessorKey: 'questionType',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.original.questionType
      return (
        <Badge variant="outline" className={cn('font-medium', getQuestionTypeBadge(type))}>
          {formatQuestionType(type)}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'difficultyLevel',
    header: 'Difficulty',
    cell: ({ row }) => {
      const level = row.original.difficultyLevel
      return (
        <Badge variant="outline" className={cn('font-medium', getDifficultyBadge(level))}>
          {formatDifficulty(level)}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'marks',
    header: 'Marks',
    cell: ({ row }) => (
      <span className="font-semibold">{row.original.marks}</span>
    ),
  },
  {
    accessorKey: 'usageCount',
    header: 'Usage',
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.usageCount}x</span>
    ),
  },
  {
    accessorKey: 'isPublic',
    header: 'Visibility',
    cell: ({ row }) => {
      const isPublic = row.original.isPublic
      return (
        <Badge variant={isPublic ? 'default' : 'secondary'}>
          {isPublic ? 'Public' : 'Private'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.original.isActive
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const question = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onView(question)}>
              <EyeIcon className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(question)}>
              <EditIcon className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(question)}
              className="text-destructive focus:text-destructive"
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
```

## File: src/features/questions/hooks/use-questions.ts
```typescript
import { apiClient } from '@/lib/api/client'
import type { 
  Question, 
  CreateQuestionDto, 
  UpdateQuestionDto,
  GetQuestionsParams,
  BackendQuestionsListResponse
} from '../types/questions'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

export const questionsService = {
  getAll: async (params?: GetQuestionsParams): Promise<PaginatedResponse<Question>> => {
    const response = await apiClient.get<BackendQuestionsListResponse>('/api/v1/questions', { params })
    return {
      data: response.questions || [],
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
      totalPages: response.totalPages || 1
    }
  },

  getById: async (id: string): Promise<ApiResponse<Question>> => {
    const question = await apiClient.get<Question>(`/api/v1/questions/${id}`)
    return { data: question }
  },

  getBySubject: async (subjectId: string, params?: { includePrivate?: boolean }): Promise<ApiResponse<Question[]>> => {
    const questions = await apiClient.get<Question[]>(`/api/v1/questions/subject/${subjectId}`, { params })
    return { data: Array.isArray(questions) ? questions : [] }
  },

  create: async (data: CreateQuestionDto): Promise<ApiResponse<Question>> => {
    const question = await apiClient.post<Question>('/api/v1/questions', data)
    return { data: question }
  },

  update: async (id: string, data: UpdateQuestionDto): Promise<ApiResponse<Question>> => {
    const question = await apiClient.patch<Question>(`/api/v1/questions/${id}`, data)
    return { data: question }
  },

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/questions/${id}`)
}
```

## File: src/features/questions/types/questions.ts
```typescript
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
  allowMultipleAnswers?: boolean
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
  allowMultipleAnswers?: boolean
  options?: Omit<QuestionOption, '_id' | 'createdAt'>[]
  subQuestions?: CreateSubQuestionDto[]
}

export type UpdateQuestionDto = Partial<Omit<CreateQuestionDto, 'subjectId'>> & {
  isActive?: boolean
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
```

## File: src/features/questions/validations/question-schemas.ts
```typescript
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
  allowMultipleAnswers: z.boolean().optional(),
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
    if (data.allowMultipleAnswers) {
      // For multiple answer MCQs, at least 1 correct answer required
      if (correctCount < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Multiple answer MCQ must have at least one correct answer",
          path: ["options"]
        })
        return
      }
    } else {
      // For single answer MCQs, exactly 1 correct answer required
      if (correctCount !== 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Single answer MCQ must have exactly one correct answer",
          path: ["options"]
        })
        return
      }
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
```

## File: src/features/questions/components/question-form.tsx
```typescript
'use client'

import { useEffect, useState, useMemo, useRef } from 'react'
import { useForm, useFieldArray, type UseFormReturn, type FieldValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  createQuestionSchema,
  type CreateQuestionFormData,
} from '../validations/question-schemas'
import type { Question } from '../types/questions'
import { useMySubjectsQuery } from '@/features/subjects/hooks/use-subjects-query'
import { QUESTION_TYPES, DIFFICULTY_LEVELS, BLOOMS_TAXONOMY, SUB_QUESTION_TYPES } from '@/constants/roles'
import { PlusIcon, TrashIcon, ListTreeIcon } from 'lucide-react'
import {
  getDefaultQuestionFormData,
  getDefaultMcqOptions,
  getDefaultSubQuestion,
  calculateTotalMarks,
  cleanQuestionFormData,
  mapQuestionToFormData,
} from '../utils/question-utils'

type QuestionFormProps = {
  question?: Question
  onSubmit: (data: CreateQuestionFormData) => void
  onCancel: () => void
  isLoading?: boolean
  initialData?: Partial<CreateQuestionFormData> | null
}

type SubQuestionFieldsProps = {
  form: UseFormReturn<CreateQuestionFormData>
  parentPath: string
  level: number
  onRemove: () => void
}

const SubQuestionFields = ({ form, parentPath, level, onRemove }: SubQuestionFieldsProps) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `${parentPath}.subQuestions` as 'subQuestions',
  })

  const addNestedSubQuestion = () => {
    append(getDefaultSubQuestion(fields.length))
  }

  const subQuestionLabel = form.watch(`${parentPath}.subQuestionLabel` as any)
  const marks = form.watch(`${parentPath}.marks` as any)

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">
              {subQuestionLabel}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Level {level}
            </Badge>
            <Badge variant="default" className="text-xs">
              {marks || 0} marks
            </Badge>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name={`${parentPath}.questionText` as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Text *</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter question text..." className="min-h-[80px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name={`${parentPath}.questionType` as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={SUB_QUESTION_TYPES.SHORT_ANSWER}>Short Answer</SelectItem>
                      <SelectItem value={SUB_QUESTION_TYPES.LONG_ANSWER}>Long Answer</SelectItem>
                      <SelectItem value={SUB_QUESTION_TYPES.FILL_BLANK}>Fill in Blank</SelectItem>
                      <SelectItem value={SUB_QUESTION_TYPES.STRUCTURED}>Structured</SelectItem>
                      <SelectItem value={SUB_QUESTION_TYPES.ESSAY}>Essay</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`${parentPath}.marks` as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marks *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0.5"
                      max="100"
                      step="0.5"
                      value={field.value || ''}
                      onChange={(e) => {
                        const value = e.target.value ? parseFloat(e.target.value) : 0
                        console.log('🔵 Sub-question marks changed:', {
                          path: parentPath,
                          oldValue: field.value,
                          newValue: value,
                          level: level
                        })
                        field.onChange(value)
                        console.log('🟢 After field.onChange, form values:', form.getValues())
                        
                        setTimeout(() => {
                          const allSubQuestions = form.getValues('subQuestions')
                          const calculatedMarks = calculateTotalMarks(form.getValues('questionType'), 0, allSubQuestions)
                          console.log('🔵 Manually recalculating total after sub-question change:', calculatedMarks)
                          form.setValue('marks', calculatedMarks, { shouldValidate: false, shouldDirty: true })
                        }, 0)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name={`${parentPath}.questionDescription` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Additional context..." rows={2} {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {level < 3 && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ListTreeIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Nested Sub-questions</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addNestedSubQuestion}
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Sub-part
                </Button>
              </div>

              {fields.length > 0 && (
                <div className="space-y-3 ml-4 border-l-2 pl-4">
                  {fields.map((field, index) => (
                    <SubQuestionFields
                      key={field.id}
                      form={form}
                      parentPath={`${parentPath}.subQuestions.${index}`}
                      level={level + 1}
                      onRemove={() => remove(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export const QuestionForm = ({ question, onSubmit, onCancel, isLoading, initialData }: QuestionFormProps) => {
  const isEditMode = !!question
  const { data: subjectsData, isLoading: isSubjectsLoading } = useMySubjectsQuery()
  const [formKey, setFormKey] = useState(0)
  const hasInitialized = useRef(false)

  const form = useForm({
    resolver: zodResolver(createQuestionSchema) as any,
    defaultValues: getDefaultQuestionFormData(),
  }) as UseFormReturn<CreateQuestionFormData>

  const questionType = form.watch('questionType')

  const { fields: optionFields, append: appendOption, remove: removeOption } = useFieldArray({
    control: form.control,
    name: 'options',
  })

  const { fields: subQuestionFields, append: appendSubQuestion, remove: removeSubQuestion } = useFieldArray({
    control: form.control,
    name: 'subQuestions',
  })

  useEffect(() => {
    if (questionType === QUESTION_TYPES.STRUCTURED || questionType === QUESTION_TYPES.ESSAY) {
      form.setValue('options', [])
    } else if (questionType === QUESTION_TYPES.MCQ && (!form.getValues('options') || form.getValues('options')?.length === 0)) {
      form.setValue('options', getDefaultMcqOptions())
    }
  }, [questionType, form])

  useEffect(() => {
    if (isEditMode && question && !isSubjectsLoading && !hasInitialized.current) {
      console.log('🟣 Initializing form with question data')
      const formData = mapQuestionToFormData(question)
      form.reset(formData)
      setFormKey((prev: number) => prev + 1)
      hasInitialized.current = true
    } else if (!isEditMode && initialData && !hasInitialized.current) {
      form.reset({ ...getDefaultQuestionFormData(), ...initialData })
      setFormKey((prev: number) => prev + 1)
      hasInitialized.current = true
    }
  }, [isEditMode, question, isSubjectsLoading, initialData, form])

  const handleSubmit = (data: CreateQuestionFormData) => {
    console.log('🔴 SUBMIT - Raw form data:', JSON.stringify(data, null, 2))
    console.log('🔴 SUBMIT - Raw subQuestions:', data.subQuestions)
    if (data.questionType === QUESTION_TYPES.STRUCTURED || data.questionType === QUESTION_TYPES.ESSAY) {
      data.marks = calculateTotalMarks(data.questionType, 0, data.subQuestions)
      console.log('🔴 SUBMIT - Calculated total marks:', data.marks)
    }
    
    const cleanedData = cleanQuestionFormData(data)
    console.log('🔴 SUBMIT - Cleaned data:', JSON.stringify(cleanedData, null, 2))
    console.log('🔴 SUBMIT - Cleaned subQuestions:', cleanedData.subQuestions)
    if (isEditMode) {
      const { subjectId, ...updateData } = cleanedData
      console.log('🔴 SUBMIT - Final update data (without subjectId):', JSON.stringify(updateData, null, 2))
      console.log('🔴 SUBMIT - Final subQuestions being sent:', updateData.subQuestions)
      onSubmit(updateData as CreateQuestionFormData)
    } else {
      onSubmit(cleanedData)
    }
  }

  const addOption = () => {
    appendOption({
      optionText: '',
      isCorrect: false,
      optionOrder: optionFields.length + 1,
    })
  }

  const addSubQuestion = () => {
    appendSubQuestion(getDefaultSubQuestion(subQuestionFields.length))
  }

  const watchedMarks = form.watch('marks')
  const watchedSubQuestions = form.watch('subQuestions')
  const subjects = subjectsData?.data || []

  const totalMarks = useMemo(() => {
    const total = calculateTotalMarks(questionType, watchedMarks, watchedSubQuestions)
    console.log('🧮 useMemo totalMarks recalculated:', total)
    return total
  }, [questionType, watchedMarks, JSON.stringify(watchedSubQuestions)])

  useEffect(() => {
    if (questionType === QUESTION_TYPES.STRUCTURED || questionType === QUESTION_TYPES.ESSAY) {
      const calculatedMarks = calculateTotalMarks(questionType, 0, watchedSubQuestions)
      console.log('🟡 Total marks calculation triggered:', {
        questionType,
        calculatedMarks,
        currentMarks: watchedMarks,
        subQuestionsCount: watchedSubQuestions?.length,
        subQuestions: watchedSubQuestions
      })
      if (calculatedMarks !== watchedMarks) {
        console.log('🟠 Updating total marks from', watchedMarks, 'to', calculatedMarks)
        form.setValue('marks', calculatedMarks, { shouldValidate: false, shouldDirty: true })
      }
    }
  }, [questionType, JSON.stringify(watchedSubQuestions), watchedMarks, form])

  return (
    <Form {...form}>
      <form key={formKey} onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="subjectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject *</FormLabel>
                  <Select 
                    key={field.value || 'empty'}
                    onValueChange={field.onChange} 
                    value={field.value} 
                    disabled={isSubjectsLoading || isEditMode}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isSubjectsLoading ? "Loading subjects..." : "Select subject"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isSubjectsLoading ? (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                          Loading subjects...
                        </div>
                      ) : subjects.length === 0 ? (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                          No subjects assigned to you
                        </div>
                      ) : (
                        subjects.map((subject) => (
                          <SelectItem key={subject._id} value={subject._id}>
                            {subject.subjectCode} - {subject.subjectName}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="questionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={QUESTION_TYPES.MCQ}>Multiple Choice (MCQ)</SelectItem>
                        <SelectItem value={QUESTION_TYPES.STRUCTURED}>Structured Question</SelectItem>
                        <SelectItem value={QUESTION_TYPES.ESSAY}>Essay Question</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="difficultyLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty Level *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={DIFFICULTY_LEVELS.EASY}>Easy</SelectItem>
                        <SelectItem value={DIFFICULTY_LEVELS.MEDIUM}>Medium</SelectItem>
                        <SelectItem value={DIFFICULTY_LEVELS.HARD}>Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="questionText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Text *</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter the question text..." className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="questionDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Instructions (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Additional context or instructions..." className="min-h-[80px]" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {questionType === QUESTION_TYPES.MCQ && (
              <FormField
                control={form.control}
                name="marks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marks *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0.5"
                        max="100"
                        step="0.5"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {(questionType === QUESTION_TYPES.STRUCTURED || questionType === QUESTION_TYPES.ESSAY) && (
              <div className="rounded-lg border p-4 bg-muted/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Total Marks (Auto-calculated)</p>
                    <p className="text-xs text-muted-foreground">
                      Sum of all sub-question marks
                    </p>
                  </div>
                  <Badge variant="default" className="text-lg px-4 py-1">
                    {totalMarks} marks
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {questionType === QUESTION_TYPES.MCQ && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <CardTitle>Answer Options</CardTitle>
                  <FormField
                    control={form.control}
                    name="allowMultipleAnswers"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0 cursor-pointer">
                          Allow multiple correct answers
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addOption}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {optionFields.map((field, index) => {
                const allowMultiple = form.watch('allowMultipleAnswers')
                return (
                  <div key={field.id} className="flex gap-2 items-start">
                    <FormField
                      control={form.control}
                      name={`options.${index}.isCorrect`}
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 mt-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={!allowMultiple}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="flex-1">
                      <FormField
                        control={form.control}
                        name={`options.${index}.optionText`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder={`Option ${index + 1}`}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {optionFields.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(index)}
                        className="mt-1"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        )}

        {(questionType === QUESTION_TYPES.STRUCTURED || questionType === QUESTION_TYPES.ESSAY) && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ListTreeIcon className="h-5 w-5" />
                    Sub-Questions
                  </CardTitle>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addSubQuestion}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Part
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {subQuestionFields.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ListTreeIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No sub-questions added yet. Click "Add Part" to create structured sub-questions.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {subQuestionFields.map((field, index) => (
                    <SubQuestionFields
                      key={field.id}
                      form={form}
                      parentPath={`subQuestions.${index}`}
                      level={1}
                      onRemove={() => removeSubQuestion(index)}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="Data Structures" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subtopic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtopic</FormLabel>
                    <FormControl>
                      <Input placeholder="Binary Trees" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bloomsTaxonomy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bloom&#39;s Taxonomy Level</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={BLOOMS_TAXONOMY.REMEMBER}>Remember</SelectItem>
                      <SelectItem value={BLOOMS_TAXONOMY.UNDERSTAND}>Understand</SelectItem>
                      <SelectItem value={BLOOMS_TAXONOMY.APPLY}>Apply</SelectItem>
                      <SelectItem value={BLOOMS_TAXONOMY.ANALYZE}>Analyze</SelectItem>
                      <SelectItem value={BLOOMS_TAXONOMY.EVALUATE}>Evaluate</SelectItem>
                      <SelectItem value={BLOOMS_TAXONOMY.CREATE}>Create</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywords</FormLabel>
                  <FormControl>
                    <Input placeholder="sorting, algorithm, complexity" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Public Question</FormLabel>
                    <FormDescription>
                      Make this question available to all faculty members
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex items-center justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || subjects.length === 0}>
            {isLoading ? 'Saving...' : isEditMode ? 'Update Question' : 'Create Question'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
```
