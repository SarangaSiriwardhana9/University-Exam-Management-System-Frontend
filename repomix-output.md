 
# Files

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
```

## File: src/features/questions/utils/subject-parser.ts
```typescript
export const parseSubjectData = (subjectId: string) => {
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
  } catch (error) {
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
]

const LEVEL_BADGE_COLORS = [
  'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
]

const getLevelColors = (level: number) => LEVEL_COLORS[level] || LEVEL_COLORS[0]
const getLevelBadgeColors = (level: number) => LEVEL_BADGE_COLORS[level] || LEVEL_BADGE_COLORS[0]

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

## File: src/features/questions/hooks/use-questions-query.ts
```typescript
'use client'

import { useQuery } from '@tanstack/react-query'
import { questionsService } from './use-questions'
import type { GetQuestionsParams } from '../types/questions'

export const useQuestionsQuery = (params?: GetQuestionsParams) => {
  return useQuery({
    queryKey: ['questions', params],
    queryFn: () => questionsService.getAll(params),
    staleTime: 30000,
  })
}

export const useQuestionQuery = (id: string | undefined) => {
  return useQuery({
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

export const useQuestionStatsQuery = () => {
  return useQuery({
    queryKey: ['questions', 'stats'],
    queryFn: () => questionsService.getStats(),
    staleTime: 60000,
  })
}
```

## File: src/lib/api/client.ts
```typescript
import type { ApiError } from '@/types/common'

type RequestConfig = {
  params?: Record<string, unknown>
  headers?: Record<string, string>
}

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private getHeaders = (customHeaders?: Record<string, string>): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    return headers
  }

  private buildURL = (url: string, params?: Record<string, unknown>): string => {
    const fullURL = new URL(url, this.baseURL)
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          fullURL.searchParams.append(key, String(value))
        }
      })
    }
    
    return fullURL.toString()
  }

  private handleResponse = async <T>(response: Response): Promise<T> => {
    if (response.status === 401) {
      this.handleUnauthorized()
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const error: ApiError = {
        message: errorData.message || 'Request failed',
        error: errorData.error || 'HTTP Error',
        statusCode: response.status
      }
      throw error
    }

    return response.json()
  }

  private handleUnauthorized = () => {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
  }

  setToken = (token: string | null): void => {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token)
      } else {
        localStorage.removeItem('auth_token')
      }
    }
  }

  getToken = (): string | null => {
    if (this.token) return this.token
    
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth_token')
      if (storedToken) {
        this.token = storedToken
        return storedToken
      }
    }
    
    return null
  }

  get = async <T = unknown>(url: string, config?: RequestConfig): Promise<T> => {
    const fullURL = this.buildURL(url, config?.params)
    const response = await fetch(fullURL, {
      method: 'GET',
      headers: this.getHeaders(config?.headers)
    })
    return this.handleResponse<T>(response)
  }

  post = async <T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> => {
    const fullURL = this.buildURL(url, config?.params)
    const response = await fetch(fullURL, {
      method: 'POST',
      headers: this.getHeaders(config?.headers),
      body: JSON.stringify(data)
    })
    return this.handleResponse<T>(response)
  }

  patch = async <T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> => {
    const fullURL = this.buildURL(url, config?.params)
    const response = await fetch(fullURL, {
      method: 'PATCH',
      headers: this.getHeaders(config?.headers),
      body: JSON.stringify(data)
    })
    return this.handleResponse<T>(response)
  }

  put = async <T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> => {
    const fullURL = this.buildURL(url, config?.params)
    const response = await fetch(fullURL, {
      method: 'PUT',
      headers: this.getHeaders(config?.headers),
      body: JSON.stringify(data)
    })
    return this.handleResponse<T>(response)
  }

  delete = async <T = unknown>(url: string, config?: RequestConfig): Promise<T> => {
    const fullURL = this.buildURL(url, config?.params)
    const response = await fetch(fullURL, {
      method: 'DELETE',
      headers: this.getHeaders(config?.headers)
    })
    return this.handleResponse<T>(response)
  }

  upload = async <T = unknown>(url: string, formData: FormData, config?: RequestConfig): Promise<T> => {
    const fullURL = this.buildURL(url, config?.params)
    const headers = { ...config?.headers }
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }
    
    // Don't set Content-Type for FormData, let browser set it with boundary
    delete headers['Content-Type']
    
    const response = await fetch(fullURL, {
      method: 'POST',
      headers,
      body: formData
    })
    return this.handleResponse<T>(response)
  }
}

// Create and export the API client instance
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
export const apiClient = new ApiClient(API_BASE_URL)

// Initialize token from localStorage on client side
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('auth_token')
  if (token) {
    apiClient.setToken(token)
  }
}
```

## File: src/lib/api/index.ts
```typescript
import { invigilatorAssignmentsService } from '@/features/assignments/hooks/use-assignments'
import { authService } from '@/features/auth/hooks/use-api'
import { academicCalendarService } from '@/features/calendar/hooks/use-calendar'
import { dashboardService } from '@/features/dashboard/hooks/use-dashboard'
import { departmentsService } from '@/features/departments/hooks/use-departments'
import { studentEnrollmentsService } from '@/features/enrollments/hooks/use-enrollments'
import { examPapersService } from '@/features/exam-papers/hooks/use-exam-papers'
import { examSessionsService } from '@/features/exam-sessions/hooks/use-exam-sessions'
import { fileUploadsService } from '@/features/file-uploads/hooks/use-file-uploads'
import { notificationsService } from '@/features/notifications/hooks/use-notifications'
import { questionsService } from '@/features/questions/hooks/use-questions'
import { examRegistrationsService } from '@/features/registrations/hooks/use-registrations'
import { reportsService } from '@/features/reports/hooks/use-reports'
import { resultsService } from '@/features/results/hooks/use-results'
import { roomsService } from '@/features/rooms/hooks/use-rooms'
import { subjectsService } from '@/features/subjects/hooks/use-subjects'
import { usersService } from '@/features/users/hooks/use-users'

 
 
 
 

// Combined API object
export const api = {
  auth: authService,
  users: usersService,
  departments: departmentsService,
  subjects: subjectsService,
  questions: questionsService,
  rooms: roomsService,
  examPapers: examPapersService,
  examSessions: examSessionsService,
  studentEnrollments: studentEnrollmentsService,
  examRegistrations: examRegistrationsService,
  invigilatorAssignments: invigilatorAssignmentsService,
  results: resultsService,
  academicCalendar: academicCalendarService,
  notifications: notificationsService,
  fileUploads: fileUploadsService,
  reports: reportsService,
  dashboard: dashboardService
}

export default api
```

## File: src/lib/providers/query-provider.tsx
```typescript
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

## File: src/lib/utils.ts
```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
```

## File: src/types/auth.ts
```typescript
import type { UserRole } from '@/constants/roles'

export type LoginDto = {
  usernameOrEmail: string
  password: string
}

export type RegisterDto = {
  email: string
  username?: string
  password: string
  fullName: string
  contactPrimary?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
}

export type LoginResponse = {
  user: {
    id: string
    username: string
    email: string
    fullName: string
    role: string
    isActive: boolean
  }
  accessToken: string
}

export type ForgotPasswordDto = {
  email: string
}

export type ResetPasswordDto = {
  token: string
  password: string
  confirmPassword: string
}
```

## File: src/types/common.ts
```typescript
export type PaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type ApiResponse<T> = {
  data: T
  message?: string
}

export type ApiError = {
  message: string
  error?: string
  statusCode?: number
}

export type BaseQueryParams = {
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
```

 
## File: src/constants/roles.ts
```typescript
export const USER_ROLES = {
  ADMIN: 'admin',
  FACULTY: 'faculty', 
  STUDENT: 'student',
  EXAM_COORDINATOR: 'exam_coordinator',
  INVIGILATOR: 'invigilator'
} as const

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]

// Updated question types - only active types
export const QUESTION_TYPES = {
  MCQ: 'mcq',
  STRUCTURED: 'structured',
  ESSAY: 'essay',
} as const

export type QuestionType = typeof QUESTION_TYPES[keyof typeof QUESTION_TYPES]

// Sub-question types (can be used within STRUCTURED/ESSAY)
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

const getQuestionTypeBadge = (type: QuestionType | string) => {
  const styles = {
    mcq: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    structured: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
    essay: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  } as const
  return styles[type as keyof typeof styles] || 'bg-muted'
}

const getDifficultyBadge = (level: DifficultyLevel | string) => {
  const styles = {
    easy: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    hard: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
  } as const
  return styles[level as keyof typeof styles] || 'bg-muted'
}

const formatQuestionType = (type: string) => {
  const typeMap: Record<string, string> = {
    mcq: 'MCQ',
    structured: 'STRUCTURED',
    essay: 'ESSAY',
  }
  return typeMap[type] || type.toUpperCase()
}

const formatDifficulty = (level: string) => level.charAt(0).toUpperCase() + level.slice(1)

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

## File: src/app/layout.tsx
```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { AuthProvider } from '@/lib/auth/auth-provider'
import { QueryProvider } from '@/lib/providers/query-provider'
import { Toaster } from 'sonner'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "University Management System",
  description: "Comprehensive university exam management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            <NuqsAdapter>
              {children}
              <Toaster position="top-right" />
            </NuqsAdapter>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
```

## File: src/constants/routes.ts
```typescript
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    DEPARTMENTS: '/admin/departments',
    SUBJECTS: '/admin/subjects',
    ROOMS: '/admin/rooms',
    REPORTS: '/admin/reports',
    CALENDAR: '/admin/calendar',
    ENROLLMENTS: '/admin/enrollments',

    GENERATE_REPORT: '/admin/reports/generate',
  },
  
  FACULTY: {
    ROOT: '/faculty',
    DASHBOARD: '/faculty/dashboard',
    SUBJECTS: '/faculty/subjects',
    QUESTIONS: '/faculty/questions',
    EXAM_PAPERS: '/faculty/exam-papers',
    RESULTS: '/faculty/results',
    ASSIGNMENTS: '/faculty/assignments'
  },
  
  STUDENT: {
    ROOT: '/student',
    DASHBOARD: '/student/dashboard',
    ENROLLMENTS: '/student/enrollments',
    EXAMS: '/student/exams',
    RESULTS: '/student/results',
    NOTIFICATIONS: '/student/notifications'
  },
  
  EXAM_COORDINATOR: {
    ROOT: '/exam-coordinator',
    DASHBOARD: '/exam-coordinator/dashboard',
    EXAM_SESSIONS: '/exam-coordinator/exam-sessions',
    REGISTRATIONS: '/exam-coordinator/registrations',
    ROOMS: '/exam-coordinator/rooms',
    ASSIGNMENTS: '/exam-coordinator/assignments'
  },
  
  INVIGILATOR: {
    ROOT: '/invigilator',
    DASHBOARD: '/invigilator/dashboard',
    ASSIGNMENTS: '/invigilator/assignments'
  }
} as const
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

export type QuestionOption = {
  _id?: string
  optionText: string
  isCorrect: boolean
  optionOrder: number
  createdAt?: string
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
  options?: Array<{
    optionText: string
    isCorrect: boolean
    optionOrder: number
  }>
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
```

## File: src/features/questions/hooks/use-questions.ts
```typescript
import { apiClient } from '@/lib/api/client'
import type { 
  Question, 
  CreateQuestionDto, 
  UpdateQuestionDto, 
  QuestionStats, 
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

  getStats: (): Promise<ApiResponse<QuestionStats>> =>
    apiClient.get('/api/v1/questions/stats'),

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

## File: src/features/questions/validations/question-schemas.ts
```typescript
import { z } from 'zod'
import { QUESTION_TYPES, SUB_QUESTION_TYPES, DIFFICULTY_LEVELS, BLOOMS_TAXONOMY } from '@/constants/roles'

const questionOptionSchema = z.object({
  optionText: z.string().min(1, 'Option text is required'),
  isCorrect: z.boolean(),
  optionOrder: z.number().int().min(1)
})

const subQuestionSchema = z.lazy(() =>
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
    subQuestions: z.array(z.lazy(() => subQuestionSchema)).optional()
  })
)

type SubQuestionFormData = z.infer<typeof subQuestionSchema>

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

  if ([QUESTION_TYPES.STRUCTURED, QUESTION_TYPES.ESSAY].includes(data.questionType)) {
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
export type CreateSubQuestionDto = SubQuestionFormData
```

## File: src/features/questions/components/question-form.tsx
```typescript
'use client'

import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
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
}

type SubQuestionFieldsProps = {
  form: any
  parentPath: string
  level: number
  onRemove: () => void
}

const SubQuestionFields = ({ form, parentPath, level, onRemove }: SubQuestionFieldsProps) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `${parentPath}.subQuestions`,
  })

  const addNestedSubQuestion = () => {
    append(getDefaultSubQuestion(fields.length))
  }

  const subQuestionLabel = form.watch(`${parentPath}.subQuestionLabel`)
  const marks = form.watch(`${parentPath}.marks`)

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
              name={`${parentPath}.questionText`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Text *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter question text..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name={`${parentPath}.questionType`}
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
              name={`${parentPath}.marks`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marks *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0.5"
                      max="100"
                      step="0.5"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
          name={`${parentPath}.questionDescription`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional context..."
                  rows={2}
                  {...field}
                  value={field.value || ''}
                />
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

export const QuestionForm = ({ question, onSubmit, onCancel, isLoading }: QuestionFormProps) => {
  const isEditMode = !!question
  const { data: subjectsData, isLoading: isSubjectsLoading } = useMySubjectsQuery()

  const form = useForm<CreateQuestionFormData>({
    resolver: zodResolver(createQuestionSchema),
    defaultValues: getDefaultQuestionFormData(),
  })

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
    if (isEditMode && question) {
      form.reset(mapQuestionToFormData(question))
    }
  }, [isEditMode, question, form])

  const handleSubmit = (data: CreateQuestionFormData) => {
    const cleanedData = cleanQuestionFormData(data)
    onSubmit(cleanedData)
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
  const totalMarks = calculateTotalMarks(questionType, watchedMarks, watchedSubQuestions)
  const subjects = subjectsData?.data || []

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                  <Select onValueChange={field.onChange} value={field.value} disabled={isSubjectsLoading || isEditMode}>
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
                  {isEditMode && (
                    <FormDescription>
                      Subject cannot be changed when editing
                    </FormDescription>
                  )}
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <FormDescription>
                      {field.value === QUESTION_TYPES.MCQ && 'Single correct answer with multiple options'}
                      {field.value === QUESTION_TYPES.STRUCTURED && 'Question with multiple sub-parts with nested levels'}
                      {field.value === QUESTION_TYPES.ESSAY && 'Long-form answer with optional nested sub-parts'}
                    </FormDescription>
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <Textarea
                      placeholder="Enter the question text..."
                      className="min-h-[100px]"
                      {...field}
                    />
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
                    <Textarea
                      placeholder="Any additional context or instructions for students..."
                      className="min-h-[80px]"
                      {...field}
                      value={field.value || ''}
                    />
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
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
                <CardTitle>Answer Options</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addOption}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {optionFields.map((field, index) => (
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
              ))}
              <p className="text-sm text-muted-foreground">
                Toggle the switch to mark the correct answer. Exactly one option must be correct.
              </p>
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
                  <p className="text-sm text-muted-foreground mt-1">
                    Add parts (A, B, C, etc.) with up to 3 levels of nesting (A, A.i, A.i.a)
                  </p>
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
                  <p>No sub-questions added yet.</p>
                  <p className="text-sm">Click &quot;Add Part&quot; to create structured sub-questions.</p>
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
                      <Input placeholder="e.g., Data Structures" {...field} value={field.value || ''} />
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
                      <Input placeholder="e.g., Binary Trees" {...field} value={field.value || ''} />
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
                    <Input placeholder="e.g., sorting, algorithm, complexity" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormDescription>
                    Comma-separated keywords for search and filtering
                  </FormDescription>
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
