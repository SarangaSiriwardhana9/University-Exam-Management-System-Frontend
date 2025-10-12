 

## File: src/features/exam-papers/components/exam-paper-details.tsx
```typescript
// src/features/exam-papers/components/exam-paper-details.tsx
'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { ExamPaper, PaperQuestion, SubPaperQuestion } from '../types/exam-papers'
import { LockIcon, ClockIcon, FileTextIcon, ListTreeIcon } from 'lucide-react'
import { JSX } from 'react'
import { cn } from '@/lib/utils'

type ExamPaperDetailsProps = {
  paper: ExamPaper
}

const getLevelColors = (level: number) => {
  const colors = [
    'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950',
    'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950',
    'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950'
  ]
  return colors[level] || colors[0]
}

const getLevelBadgeColors = (level: number) => {
  const colors = [
    'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
  ]
  return colors[level] || colors[0]
}

export const ExamPaperDetails = ({ paper }: ExamPaperDetailsProps) => {
  const renderSubQuestions = (subQuestions: SubPaperQuestion[], level: number = 0, parentLabel: string = ''): JSX.Element => {
    return (
      <div className={cn("space-y-2", level > 0 && "ml-6 mt-2")}>
        {subQuestions.map((sq) => {
          const fullLabel = parentLabel ? `${parentLabel}.${sq.subQuestionLabel}` : sq.subQuestionLabel
          
          return (
            <div key={sq._id} className={cn("p-3 border-2 rounded-lg", getLevelColors(level))}>
              <div className="flex items-start gap-2">
                <Badge variant="outline" className={cn("font-mono text-xs font-bold", getLevelBadgeColors(level))}>
                  {fullLabel}
                </Badge>
                <div className="flex-1">
                  <p className="text-sm font-medium">{sq.questionText}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {sq.marksAllocated} marks
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {sq.questionType.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
              {sq.subQuestions && sq.subQuestions.length > 0 && (
                <div className="mt-2">
                  {renderSubQuestions(sq.subQuestions, level + 1, fullLabel)}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  const calculateQuestionTotalMarks = (question: PaperQuestion): number => {
    let total = question.marksAllocated
    
    if (question.subQuestions && question.subQuestions.length > 0) {
      const calculateSubMarks = (sqs: SubPaperQuestion[]): number => {
        return sqs.reduce((sum, sq) => {
          let subTotal = sq.marksAllocated
          if (sq.subQuestions && sq.subQuestions.length > 0) {
            subTotal += calculateSubMarks(sq.subQuestions)
          }
          return sum + subTotal
        }, 0)
      }
      total += calculateSubMarks(question.subQuestions)
    }
    
    return total
  }

  return (
    <div className="space-y-6">
      {/* Paper Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle>{paper.paperTitle}</CardTitle>
                {paper.isFinalized && (
                  <Badge variant="default" className="bg-purple-600">
                    <LockIcon className="h-3 w-3 mr-1" />
                    Finalized
                  </Badge>
                )}
              </div>
              <CardDescription>
                {paper.subjectCode} - {paper.subjectName}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Exam Type</p>
              <Badge variant="outline" className="mt-1">
                {paper.paperType.charAt(0).toUpperCase() + paper.paperType.slice(1)}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Marks</p>
              <p className="mt-1 font-semibold text-lg">{paper.totalMarks}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Duration</p>
              <div className="flex items-center gap-1 mt-1">
                <ClockIcon className="h-4 w-4" />
                <span>{paper.formattedDuration}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Questions</p>
              <div className="flex items-center gap-1 mt-1">
                <FileTextIcon className="h-4 w-4" />
                <span>{paper.questionCount || 0}</span>
              </div>
            </div>
          </div>

          {paper.instructions && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">General Instructions</p>
                <div className="p-3 bg-muted/50 rounded-md">
                  <p className="text-sm whitespace-pre-wrap">{paper.instructions}</p>
                </div>
              </div>
            </>
          )}

          <Separator />
          <div className="flex gap-4 flex-wrap">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Version</p>
              <p className="mt-1">{paper.versionNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created By</p>
              <p className="mt-1">{paper.createdByName || '—'}</p>
            </div>
            {paper.isFinalized && paper.finalizedAt && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Finalized At</p>
                <p className="mt-1">{new Date(paper.finalizedAt).toLocaleString()}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Paper Structure Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Paper Structure</CardTitle>
          <CardDescription>
            {paper.parts.length} section(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paper.parts.map((part) => (
              <div key={part.partLabel} className="p-4 border rounded-lg bg-muted/30">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">
                        Part {part.partLabel}
                      </Badge>
                      <h3 className="font-semibold">{part.partTitle}</h3>
                    </div>
                    {part.partInstructions && (
                      <p className="text-sm text-muted-foreground mt-2 italic">
                        {part.partInstructions}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{part.totalMarks} marks</p>
                    <p className="text-xs text-muted-foreground">{part.questionCount} questions</p>
                  </div>
                </div>
                {part.hasOptionalQuestions && (
                  <Badge variant="secondary" className="text-xs mt-2">
                    Optional: Answer minimum {part.minimumQuestionsToAnswer} questions
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      {paper.questions && paper.questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Questions</CardTitle>
            <CardDescription>
              Detailed breakdown of all questions in this exam paper
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="space-y-2">
              {paper.parts.map((part) => {
                const partQuestions = paper.questions?.filter(q => q.partLabel === part.partLabel) || []
                
                return (
                  <AccordionItem key={part.partLabel} value={part.partLabel} className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 flex-1">
                        <Badge variant="outline" className="font-mono">
                          Part {part.partLabel}
                        </Badge>
                        <span className="font-medium">{part.partTitle}</span>
                        <Badge variant="secondary" className="ml-auto mr-4">
                          {partQuestions.length} questions
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pt-3">
                      {partQuestions.map((question, idx) => {
                        const questionTotalMarks = calculateQuestionTotalMarks(question)
                        const hasSubParts = question.subQuestions && question.subQuestions.length > 0
                        
                        return (
                          <div key={question._id} className="p-4 border rounded-lg bg-card">
                            <div className="flex items-start gap-3">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="font-mono mt-0.5">
                                  Q{idx + 1}
                                </Badge>
                                {hasSubParts && (
                                  <ListTreeIcon className="h-4 w-4 text-purple-600" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium mb-2">{question.questionText}</p>
                                <div className="flex gap-2 flex-wrap mb-3">
                                  <Badge variant="secondary" className="text-xs">
                                    {questionTotalMarks} marks total
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {question.questionType.replace('_', ' ')}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {question.difficultyLevel}
                                  </Badge>
                                  {question.isOptional && (
                                    <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                                      Optional
                                    </Badge>
                                  )}
                                  {hasSubParts && (
                                    <Badge variant="default" className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                                      Structured Question
                                    </Badge>
                                  )}
                                </div>
                                
                                {hasSubParts && (
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                      <span>Question Parts:</span>
                                    </div>
                                    {renderSubQuestions(question.subQuestions!)}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
```

## File: src/features/exam-papers/hooks/use-exam-papers-query.ts
```typescript
'use client'

import { useQuery } from '@tanstack/react-query'
import { examPapersService } from './use-exam-papers'
import type { GetExamPapersParams } from '../types/exam-papers'

export const useExamPapersQuery = (params?: GetExamPapersParams) => {
  return useQuery({
    queryKey: ['exam-papers', params],
    queryFn: () => examPapersService.getAll(params),
    staleTime: 30000,
  })
}

export const useExamPaperQuery = (id: string | undefined, includeQuestions = true) => {
  return useQuery({
    queryKey: ['exam-papers', id, includeQuestions],
    queryFn: async () => {
      if (!id) throw new Error('Exam Paper ID is required')
      return await examPapersService.getById(id, { includeQuestions })
    },
    enabled: !!id && id !== 'undefined',
    retry: 1,
  })
}

export const useExamPaperStatsQuery = () => {
  return useQuery({
    queryKey: ['exam-papers', 'stats'],
    queryFn: () => examPapersService.getStats(),
    staleTime: 60000,
  })
}
```

## File: src/features/exam-sessions/components/exam-session-form.tsx
```typescript
'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createExamSessionSchema, updateExamSessionSchema, type CreateExamSessionFormData, type UpdateExamSessionFormData } from '../validations/exam-session-schemas'
import type { ExamSession } from '../types/exam-sessions'
import { useQuery } from '@tanstack/react-query'
import { examPapersService } from '@/features/exam-papers/hooks/use-exam-papers'
import { roomsService } from '@/features/rooms/hooks/use-rooms'

type CreateExamSessionFormProps = {
  session?: never
  onSubmit: (data: CreateExamSessionFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

type UpdateExamSessionFormProps = {
  session: ExamSession
  onSubmit: (data: UpdateExamSessionFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

type ExamSessionFormProps = CreateExamSessionFormProps | UpdateExamSessionFormProps

export const ExamSessionForm = ({ session, onSubmit, onCancel, isLoading }: ExamSessionFormProps) => {
  const isEditMode = !!session

  // Fetch exam papers and rooms for dropdowns
  const { data: examPapersData } = useQuery({
    queryKey: ['exam-papers'],
    queryFn: () => examPapersService.getAll({ isFinalized: true, isActive: true })
  })

  const { data: roomsData } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => roomsService.getAll({ isActive: true })
  })

  const form = useForm<CreateExamSessionFormData | UpdateExamSessionFormData>({
    resolver: zodResolver(isEditMode ? updateExamSessionSchema : createExamSessionSchema),
    defaultValues: {
      paperId: '',
      examTitle: '',
      examDateTime: '',
      durationMinutes: 120,
      roomId: '',
      maxStudents: 30,
      instructions: '',
      academicYear: new Date().getFullYear().toString(),
      semester: 1
    }
  })

  useEffect(() => {
    if (session) {
      // Format datetime for input
      const examDateTime = session.examDateTime ? 
        new Date(session.examDateTime).toISOString().slice(0, 16) : ''
      
      form.reset({
        paperId: session.paperId,
        examTitle: session.examTitle,
        examDateTime,
        durationMinutes: session.durationMinutes,
        roomId: session.roomId,
        maxStudents: session.maxStudents,
        instructions: session.instructions || '',
        academicYear: session.academicYear,
        semester: session.semester
      })
    }
  }, [session, form])

  const handleSubmit = (data: CreateExamSessionFormData | UpdateExamSessionFormData) => {
    if (isEditMode) {
      (onSubmit as (data: UpdateExamSessionFormData) => void)(data as UpdateExamSessionFormData)
    } else {
      (onSubmit as (data: CreateExamSessionFormData) => void)(data as CreateExamSessionFormData)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Exam Paper Selection */}
        <FormField
          control={form.control}
          name="paperId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exam Paper *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select exam paper" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {examPapersData?.data.map((paper) => (
                    <SelectItem key={paper._id} value={paper._id}>
                      <div className="flex flex-col">
                        <span>{paper.paperTitle}</span>
                        <span className="text-sm text-muted-foreground">
                          {paper.subjectCode} - {paper.subjectName}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="examTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exam Title *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter exam title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="examDateTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exam Date & Time *</FormLabel>
                <FormControl>
                  <Input 
                    type="datetime-local" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="durationMinutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (Minutes) *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="120" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxStudents"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Students *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="30" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="roomId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select room" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roomsData?.data.map((room) => (
                      <SelectItem key={room._id} value={room._id}>
                        <div className="flex flex-col">
                          <span>{room.roomNumber}</span>
                          <span className="text-sm text-muted-foreground">
                            {room.building} - Capacity: {room.capacity}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Academic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="academicYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Academic Year *</FormLabel>
                <FormControl>
                  <Input placeholder="2024" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="semester"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Semester *</FormLabel>
                <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <SelectItem key={sem} value={sem.toString()}>
                        Semester {sem}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Instructions */}
        <FormField
          control={form.control}
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter special instructions for the exam..."
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : isEditMode ? 'Update Session' : 'Create Session'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
```

## File: src/features/exam-sessions/hooks/use-exam-session-mutations.ts
```typescript
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { examSessionsService } from './use-exam-sessions'
import type { CreateExamSessionDto, UpdateExamSessionDto } from '../types/exam-sessions'
import type { ApiError } from '@/types/common'
import { toast } from 'sonner'

export const useCreateExamSession = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateExamSessionDto) => examSessionsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-sessions'] })
      toast.success('Exam Session Created', {
        description: 'Exam session has been scheduled successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Create Exam Session', {
        description: error.message || 'An error occurred while creating the exam session.'
      })
    }
  })
}

export const useUpdateExamSession = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExamSessionDto }) =>
      examSessionsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-sessions'] })
      toast.success('Exam Session Updated', {
        description: 'Exam session has been updated successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Update Exam Session', {
        description: error.message || 'An error occurred while updating the exam session.'
      })
    }
  })
}

export const useCancelExamSession = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      examSessionsService.cancel(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-sessions'] })
      toast.success('Exam Session Cancelled', {
        description: 'Exam session has been cancelled successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Cancel Exam Session', {
        description: error.message || 'An error occurred while cancelling the exam session.'
      })
    }
  })
}

export const useDeleteExamSession = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => examSessionsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-sessions'] })
      toast.success('Exam Session Deleted', {
        description: 'Exam session has been deleted successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Delete Exam Session', {
        description: error.message || 'An error occurred while deleting the exam session.'
      })
    }
  })
}
```

## File: src/features/exam-sessions/validations/exam-session-schemas.ts
```typescript
import { z } from 'zod'
import { EXAM_SESSION_STATUS } from '../types/exam-sessions'

export const createExamSessionSchema = z.object({
  paperId: z.string().min(1, 'Exam paper is required'),
  examTitle: z.string()
    .min(3, 'Exam title must be at least 3 characters')
    .max(100, 'Exam title must be less than 100 characters'),
  examDateTime: z.string().min(1, 'Exam date and time is required'),
  durationMinutes: z.number()
    .min(15, 'Duration must be at least 15 minutes')
    .max(480, 'Duration cannot exceed 8 hours'),
  roomId: z.string().min(1, 'Room is required'),
  maxStudents: z.number()
    .min(1, 'Maximum students must be at least 1')
    .max(500, 'Maximum students cannot exceed 500'),
  instructions: z.string().optional(),
  academicYear: z.string().min(1, 'Academic year is required'),
  semester: z.number()
    .min(1, 'Semester must be at least 1')
    .max(8, 'Semester cannot exceed 8')
})

export const updateExamSessionSchema = createExamSessionSchema.partial().extend({
  status: z.enum([
    EXAM_SESSION_STATUS.SCHEDULED,
    EXAM_SESSION_STATUS.IN_PROGRESS,
    EXAM_SESSION_STATUS.COMPLETED,
    EXAM_SESSION_STATUS.CANCELLED
  ]).optional()
})

export const cancelExamSessionSchema = z.object({
  reason: z.string().min(10, 'Cancellation reason must be at least 10 characters').optional()
})

export type CreateExamSessionFormData = z.infer<typeof createExamSessionSchema>
export type UpdateExamSessionFormData = z.infer<typeof updateExamSessionSchema>
export type CancelExamSessionFormData = z.infer<typeof cancelExamSessionSchema>
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

## File: src/features/exam-papers/components/generate-paper-form.tsx
```typescript
// src/features/exam-papers/components/generate-paper-form.tsx
'use client'

import { useState } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { PlusIcon, TrashIcon, InfoIcon } from 'lucide-react'
import { EXAM_TYPES } from '../types/exam-papers'
import { QUESTION_TYPES, DIFFICULTY_LEVELS } from '@/constants/roles'
import { generatePaperSchema, type GeneratePaperFormData } from '../validations/exam-paper-schemas'
import { useSubjectsQuery, useMySubjectsQuery } from '@/features/subjects/hooks/use-subjects-query'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { useAuth } from '@/lib/auth/auth-provider'
import { USER_ROLES } from '@/constants/roles'

type GeneratePaperFormProps = {
  onSubmit: (data: GeneratePaperFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export const GeneratePaperForm = ({ onSubmit, onCancel, isLoading }: GeneratePaperFormProps) => {
  const { user } = useAuth()
  const { data: allSubjectsData, isLoading: isLoadingAllSubjects } = useSubjectsQuery({ isActive: true })
  const { data: mySubjectsData, isLoading: isLoadingMySubjects } = useMySubjectsQuery({ isActive: true })
  const isFaculty = user?.role === USER_ROLES.FACULTY
  const subjects = (isFaculty ? mySubjectsData?.data : allSubjectsData?.data) || []

  const form = useForm<GeneratePaperFormData>({
    resolver: zodResolver(generatePaperSchema),
    defaultValues: {
      subjectId: '',
      paperTitle: '',
      paperType: EXAM_TYPES.MIDTERM,
      durationMinutes: 180,
      instructions: '',
      questionCriteria: [
        {
          count: 10,
          marksPerQuestion: 2,
          section: 'A'
        }
      ]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'questionCriteria'
  })

  const calculateTotalMarks = () => {
    return fields.reduce((sum, field) => {
      const count = field.count || 0
      const marks = field.marksPerQuestion || 0
      return sum + (count * marks)
    }, 0)
  }

  const totalMarks = calculateTotalMarks()

  if (isLoadingAllSubjects || isLoadingMySubjects) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Info Alert */}
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Auto-Generate Exam Paper</AlertTitle>
          <AlertDescription>
            Automatically generate an exam paper by selecting questions from your question bank based on criteria like difficulty, type, and topic.
            Questions with sub-parts will be automatically included with their full structure.
          </AlertDescription>
        </Alert>

        {/* Basic Information */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="subjectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject._id} value={subject._id}>
                            {subject.subjectCode} - {subject.subjectName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paperType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={EXAM_TYPES.MIDTERM}>Midterm</SelectItem>
                        <SelectItem value={EXAM_TYPES.FINAL}>Final</SelectItem>
                        <SelectItem value={EXAM_TYPES.QUIZ}>Quiz</SelectItem>
                        <SelectItem value={EXAM_TYPES.ASSIGNMENT}>Assignment</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="paperTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paper Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Mathematics Midterm 2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="durationMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1}
                      placeholder="180" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value ? `${Math.floor(field.value / 60)}h ${field.value % 60}m` : ''}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructions (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="General instructions for the exam" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Question Criteria */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Question Selection Criteria</h3>
                <p className="text-sm text-muted-foreground">
                  Total: {totalMarks} marks
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({
                  count: 5,
                  marksPerQuestion: 2,
                  section: String.fromCharCode(65 + fields.length)
                })}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Criteria
              </Button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-4 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Criteria {index + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <TrashIcon className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <FormField
                      control={form.control}
                      name={`questionCriteria.${index}.count`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Count *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={1}
                              placeholder="10"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`questionCriteria.${index}.marksPerQuestion`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Marks Each *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={0.5}
                              step={0.5}
                              placeholder="2"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`questionCriteria.${index}.difficultyLevel`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Difficulty</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Any" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="any">Any</SelectItem>
                              <SelectItem value={DIFFICULTY_LEVELS.EASY}>Easy</SelectItem>
                              <SelectItem value={DIFFICULTY_LEVELS.MEDIUM}>Medium</SelectItem>
                              <SelectItem value={DIFFICULTY_LEVELS.HARD}>Hard</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`questionCriteria.${index}.questionType`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Any" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="any">Any</SelectItem>
                              <SelectItem value={QUESTION_TYPES.MCQ}>MCQ</SelectItem>
                              <SelectItem value={QUESTION_TYPES.SHORT_ANSWER}>Short Answer</SelectItem>
                              <SelectItem value={QUESTION_TYPES.LONG_ANSWER}>Essay/Long</SelectItem>
                              <SelectItem value={QUESTION_TYPES.FILL_BLANK}>Fill Blank</SelectItem>
                              <SelectItem value={QUESTION_TYPES.TRUE_FALSE}>True/False</SelectItem>
                              <SelectItem value={QUESTION_TYPES.STRUCTURED}>Structured</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name={`questionCriteria.${index}.topic`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Topic (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Algebra" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`questionCriteria.${index}.section`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Section (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="A, B, C..." className="uppercase" {...field} onChange={(e) => field.onChange(e.target.value.toUpperCase())} />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Which part of the paper (e.g., Part A)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    Subtotal: {(field.count || 0) * (field.marksPerQuestion || 0)} marks
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Paper'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
```

## File: src/features/exam-papers/hooks/use-exam-paper-mutations.ts
```typescript
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { examPapersService } from './use-exam-papers'
import type { CreateExamPaperDto, UpdateExamPaperDto, GeneratePaperDto } from '../types/exam-papers'
import type { ApiError } from '@/types/common'
import { toast } from 'sonner'

export const useCreateExamPaper = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateExamPaperDto) => examPapersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-papers'] })
      toast.success('Exam Paper Created', {
        description: 'Exam paper has been created successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Create Exam Paper', {
        description: error.message || 'An error occurred while creating the exam paper.'
      })
    }
  })
}

export const useGenerateExamPaper = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: GeneratePaperDto) => examPapersService.generate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-papers'] })
      toast.success('Exam Paper Generated', {
        description: 'Exam paper has been generated successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Generate Exam Paper', {
        description: error.message || 'An error occurred while generating the exam paper.'
      })
    }
  })
}

export const useUpdateExamPaper = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExamPaperDto }) =>
      examPapersService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-papers'] })
      toast.success('Exam Paper Updated', {
        description: 'Exam paper has been updated successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Update Exam Paper', {
        description: error.message || 'An error occurred while updating the exam paper.'
      })
    }
  })
}

export const useDuplicateExamPaper = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, newTitle }: { id: string; newTitle: string }) => 
      examPapersService.duplicate(id, newTitle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-papers'] })
      toast.success('Exam Paper Duplicated', {
        description: 'Exam paper has been duplicated successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Duplicate Exam Paper', {
        description: error.message || 'An error occurred while duplicating the exam paper.'
      })
    }
  })
}

export const useFinalizeExamPaper = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => examPapersService.finalize(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-papers'] })
      toast.success('Exam Paper Finalized', {
        description: 'Exam paper has been finalized and locked.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Finalize Exam Paper', {
        description: error.message || 'An error occurred while finalizing the exam paper.'
      })
    }
  })
}

export const useDeleteExamPaper = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => examPapersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-papers'] })
      toast.success('Exam Paper Deleted', {
        description: 'Exam paper has been deleted successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Delete Exam Paper', {
        description: error.message || 'An error occurred while deleting the exam paper.'
      })
    }
  })
}
```

## File: src/features/exam-sessions/components/exam-session-columns.tsx
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
import { MoreHorizontalIcon, EditIcon, TrashIcon, EyeIcon, XCircleIcon } from 'lucide-react'
import type { ExamSession, ExamSessionStatus } from '../types/exam-sessions'
import { cn } from '@/lib/utils'

const getStatusBadgeClass = (status: ExamSessionStatus) => {
  const statusClasses = {
    scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    in_progress: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    completed: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
  } as const

  return statusClasses[status] || 'bg-muted'
}

const formatStatus = (status: string) => {
  return status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

const formatDateTime = (dateTime: string) => {
  return new Date(dateTime).toLocaleString()
}

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`
  }
  return `${remainingMinutes}m`
}

type ExamSessionColumnsProps = {
  onEdit: (session: ExamSession) => void
  onDelete: (session: ExamSession) => void
  onView: (session: ExamSession) => void
  onCancel: (session: ExamSession) => void
}

export const getExamSessionColumns = ({ 
  onEdit, 
  onDelete, 
  onView, 
  onCancel 
}: ExamSessionColumnsProps): ColumnDef<ExamSession>[] => [
  {
    accessorKey: 'examTitle',
    header: 'Exam Title',
    cell: ({ row }) => {
      const session = row.original
      return (
        <div>
          <div className="font-medium">{session.examTitle}</div>
          <div className="text-sm text-muted-foreground">
            {session.subjectCode && `${session.subjectCode} - `}{session.subjectName}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'examDateTime',
    header: 'Date & Time',
    cell: ({ row }) => {
      const dateTime = row.original.examDateTime
      return (
        <div className="text-sm">
          <div>{formatDateTime(dateTime)}</div>
          <div className="text-muted-foreground">
            Duration: {formatDuration(row.original.durationMinutes)}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'roomNumber',
    header: 'Room',
    cell: ({ row }) => {
      const session = row.original
      return (
        <div className="text-sm">
          <div className="font-medium">{session.roomNumber || '—'}</div>
          {session.building && (
            <div className="text-muted-foreground">{session.building}</div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'students',
    header: 'Students',
    cell: ({ row }) => {
      const session = row.original
      const percentage = session.maxStudents > 0 
        ? Math.round((session.registeredStudents / session.maxStudents) * 100)
        : 0
      
      return (
        <div className="text-sm">
          <div className="font-medium">
            {session.registeredStudents} / {session.maxStudents}
          </div>
          <div className="text-muted-foreground">{percentage}% filled</div>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <Badge variant="outline" className={cn('font-medium', getStatusBadgeClass(status))}>
          {formatStatus(status)}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'academicYear',
    header: 'Academic Year',
    cell: ({ row }) => {
      const session = row.original
      return (
        <div className="text-sm">
          <div>{session.academicYear}</div>
          <div className="text-muted-foreground">Semester {session.semester}</div>
        </div>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt)
      return date.toLocaleDateString()
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const session = row.original
      const canCancel = session.status === 'scheduled'
      const canEdit = session.status === 'scheduled'

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
            <DropdownMenuItem onClick={() => onView(session)}>
              <EyeIcon className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            {canEdit && (
              <DropdownMenuItem onClick={() => onEdit(session)}>
                <EditIcon className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            )}
            {canCancel && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onCancel(session)}
                  className="text-orange-600 focus:text-orange-600"
                >
                  <XCircleIcon className="mr-2 h-4 w-4" />
                  Cancel Session
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(session)}
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

## File: src/features/exam-sessions/hooks/use-exam-sessions-query.ts
```typescript
'use client'

import { useQuery } from '@tanstack/react-query'
import { examSessionsService } from './use-exam-sessions'
import type { GetExamSessionsParams } from '../types/exam-sessions'

export const useExamSessionsQuery = (params?: GetExamSessionsParams) => {
  return useQuery({
    queryKey: ['exam-sessions', params],
    queryFn: () => examSessionsService.getAll(params),
    staleTime: 30000,
  })
}

export const useExamSessionQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: ['exam-sessions', id],
    queryFn: async () => {
      if (!id) throw new Error('Exam Session ID is required')
      const result = await examSessionsService.getById(id)
      return result
    },
    enabled: !!id && id !== 'undefined',
    retry: 1,
  })
}

export const useUpcomingExamSessionsQuery = (params?: { limit?: number }) => {
  return useQuery({
    queryKey: ['exam-sessions', 'upcoming', params],
    queryFn: () => examSessionsService.getUpcoming(params),
    staleTime: 60000,
  })
}

export const useExamSessionStatsQuery = () => {
  return useQuery({
    queryKey: ['exam-sessions', 'stats'],
    queryFn: () => examSessionsService.getStats(),
    staleTime: 300000,
  })
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

## File: src/features/exam-papers/components/exam-paper-columns.tsx
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
import { MoreHorizontalIcon, EditIcon, TrashIcon, EyeIcon, CopyIcon, LockIcon, LayersIcon } from 'lucide-react'
import type { ExamPaper, ExamType } from '../types/exam-papers'
import { cn } from '@/lib/utils'

const getExamTypeBadge = (type: ExamType) => {
  const typeStyles = {
    midterm: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    final: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    quiz: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    assignment: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
  } as const
  return typeStyles[type] || 'bg-muted'
}

const formatExamType = (type: string) => {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0 && mins > 0) return `${hours}h ${mins}m`
  if (hours > 0) return `${hours}h`
  return `${mins}m`
}

type ExamPaperColumnsProps = {
  onEdit: (paper: ExamPaper) => void
  onDelete: (paper: ExamPaper) => void
  onView: (paper: ExamPaper) => void
  onDuplicate: (paper: ExamPaper) => void
  onFinalize: (paper: ExamPaper) => void
}

export const getExamPaperColumns = ({ 
  onEdit, 
  onDelete, 
  onView, 
  onDuplicate,
  onFinalize 
}: ExamPaperColumnsProps): ColumnDef<ExamPaper>[] => [
  {
    accessorKey: 'paperTitle',
    header: 'Title',
    cell: ({ row }) => {
      const paper = row.original
      return (
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium">{paper.paperTitle}</p>
            {paper.parts && paper.parts.length > 1 && (
              <Badge variant="outline" className="text-xs">
                <LayersIcon className="h-3 w-3 mr-1" />
                {paper.parts.length} parts
              </Badge>
            )}
          </div>
          {paper.subjectCode && (
            <p className="text-xs text-muted-foreground">
              {paper.subjectCode} - {paper.subjectName}
            </p>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'paperType',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.original.paperType
      return (
        <Badge variant="outline" className={cn('font-medium', getExamTypeBadge(type))}>
          {formatExamType(type)}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'parts',
    header: 'Structure',
    cell: ({ row }) => {
      const parts = row.original.parts || []
      if (parts.length === 0) return <span className="text-muted-foreground">—</span>
      
      return (
        <div className="flex flex-wrap gap-1">
          {parts.slice(0, 3).map((part) => (
            <Badge key={part.partLabel} variant="secondary" className="text-xs">
              {part.partLabel}
            </Badge>
          ))}
          {parts.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{parts.length - 3}
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'totalMarks',
    header: 'Total Marks',
    cell: ({ row }) => (
      <span className="font-semibold">{row.original.totalMarks}</span>
    ),
  },
  {
    accessorKey: 'durationMinutes',
    header: 'Duration',
    cell: ({ row }) => (
      <span>{formatDuration(row.original.durationMinutes)}</span>
    ),
  },
  {
    accessorKey: 'questionCount',
    header: 'Questions',
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.questionCount || 0}</span>
    ),
  },
  {
    accessorKey: 'isFinalized',
    header: 'Status',
    cell: ({ row }) => {
      const isFinalized = row.original.isFinalized
      const isActive = row.original.isActive
      return (
        <div className="flex gap-1">
          {isFinalized && (
            <Badge variant="default" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
              <LockIcon className="h-3 w-3 mr-1" />
              Finalized
            </Badge>
          )}
          {!isFinalized && (
            <Badge variant="secondary">
              Draft
            </Badge>
          )}
          {!isActive && (
            <Badge variant="secondary">
              Inactive
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt)
      return date.toLocaleDateString()
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const paper = row.original

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
            <DropdownMenuItem onClick={() => onView(paper)}>
              <EyeIcon className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            {!paper.isFinalized && (
              <DropdownMenuItem onClick={() => onEdit(paper)}>
                <EditIcon className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onDuplicate(paper)}>
              <CopyIcon className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            {!paper.isFinalized && (
              <DropdownMenuItem onClick={() => onFinalize(paper)}>
                <LockIcon className="mr-2 h-4 w-4" />
                Finalize
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(paper)}
              className="text-destructive focus:text-destructive"
              disabled={paper.isFinalized}
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

## File: src/features/exam-papers/hooks/use-exam-papers.ts
```typescript
import { apiClient } from '@/lib/api/client'
import type { 
  ExamPaper, 
  CreateExamPaperDto, 
  UpdateExamPaperDto, 
  GeneratePaperDto,
  ExamPaperStats, 
  GetExamPapersParams,
  BackendExamPapersListResponse
} from '../types/exam-papers'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

export const examPapersService = {
  getAll: async (params?: GetExamPapersParams): Promise<PaginatedResponse<ExamPaper>> => {
    const response = await apiClient.get<BackendExamPapersListResponse>('/api/v1/exam-papers', { params })
    return {
      data: response.examPapers || [],
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
      totalPages: response.totalPages || 1
    }
  },

  getById: async (id: string, params?: { includeQuestions?: boolean }): Promise<ApiResponse<ExamPaper>> => {
    const paper = await apiClient.get<ExamPaper>(`/api/v1/exam-papers/${id}`, { params })
    return { data: paper }
  },

  getStats: (): Promise<ApiResponse<ExamPaperStats>> =>
    apiClient.get('/api/v1/exam-papers/stats'),

  create: async (data: CreateExamPaperDto): Promise<ApiResponse<ExamPaper>> => {
    const paper = await apiClient.post<ExamPaper>('/api/v1/exam-papers', data)
    return { data: paper }
  },

  generate: async (data: GeneratePaperDto): Promise<ApiResponse<ExamPaper>> => {
    const paper = await apiClient.post<ExamPaper>('/api/v1/exam-papers/generate', data)
    return { data: paper }
  },

  update: async (id: string, data: UpdateExamPaperDto): Promise<ApiResponse<ExamPaper>> => {
    const paper = await apiClient.patch<ExamPaper>(`/api/v1/exam-papers/${id}`, data)
    return { data: paper }
  },

  duplicate: async (id: string, newTitle: string): Promise<ApiResponse<ExamPaper>> => {
    const paper = await apiClient.post<ExamPaper>(`/api/v1/exam-papers/${id}/duplicate`, { newTitle })
    return { data: paper }
  },

  finalize: async (id: string): Promise<ApiResponse<ExamPaper>> => {
    const paper = await apiClient.patch<ExamPaper>(`/api/v1/exam-papers/${id}/finalize`)
    return { data: paper }
  },

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/exam-papers/${id}`)
}
```

## File: src/features/exam-papers/types/exam-papers.ts
```typescript
import type { QuestionType, DifficultyLevel } from '@/constants/roles'

export const EXAM_TYPES = {
  MIDTERM: 'midterm',
  FINAL: 'final',
  QUIZ: 'quiz',
  ASSIGNMENT: 'assignment'
} as const

export type ExamType = typeof EXAM_TYPES[keyof typeof EXAM_TYPES]

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
```

## File: src/features/exam-papers/validations/exam-paper-schemas.ts
```typescript
import { z } from 'zod'
import { EXAM_TYPES } from '../types/exam-papers'

const subQuestionSchemaBase = z.object({
  questionId: z.string().min(1, 'Question is required'),
  marksAllocated: z.number().min(0.5, 'Marks must be at least 0.5'),
  subQuestionLabel: z.string().min(1, 'Sub-question label is required'),
  subQuestionOrder: z.number().int().min(1),
})

export type SubQuestionInput = z.infer<typeof subQuestionSchemaBase> & {
  subQuestions?: SubQuestionInput[]
}

const subQuestionSchema: z.ZodType<SubQuestionInput> = subQuestionSchemaBase.extend({
  subQuestions: z.lazy(() => subQuestionSchema.array()).optional()
})

const paperQuestionSchema = z.object({
  questionId: z.string().min(1, 'Question is required'),
  questionOrder: z.number().int().min(1),
  marksAllocated: z.number().min(0.5, 'Marks must be at least 0.5'),
  partLabel: z.string().min(1, 'Part label is required'),
  partTitle: z.string().optional(),
  isOptional: z.boolean().optional(),
  subQuestions: z.array(subQuestionSchema).optional()
})

const paperPartSchema = z.object({
  partLabel: z.string().min(1, 'Part label is required'),
  partTitle: z.string().min(1, 'Part title is required'),
  partInstructions: z.string().optional(),
  partOrder: z.number().int().min(1),
  hasOptionalQuestions: z.boolean().optional(),
  minimumQuestionsToAnswer: z.number().int().min(0).optional()
})

export const createExamPaperSchema = z.object({
  subjectId: z.string().min(1, 'Subject is required'),
  paperTitle: z.string().min(5, 'Title must be at least 5 characters'),
  paperType: z.enum([
    EXAM_TYPES.MIDTERM,
    EXAM_TYPES.FINAL,
    EXAM_TYPES.QUIZ,
    EXAM_TYPES.ASSIGNMENT
  ]),
  totalMarks: z.number().min(1, 'Total marks must be at least 1'),
  durationMinutes: z.number().int().min(1, 'Duration must be at least 1 minute'),
  instructions: z.string().optional(),
  parts: z.array(paperPartSchema).min(1, 'At least one part is required'),
  questions: z.array(paperQuestionSchema).min(1, 'At least one question is required')
})

export const updateExamPaperSchema = createExamPaperSchema.partial().extend({
  isActive: z.boolean().optional()
})

const questionCriteriaSchema = z.object({
  topic: z.string().optional(),
  difficultyLevel: z.enum(['easy', 'medium', 'hard']).optional(),
  questionType: z.string().optional(),
  count: z.number().int().min(1, 'Count must be at least 1'),
  marksPerQuestion: z.number().min(0.5, 'Marks per question must be at least 0.5'),
  section: z.string().optional()
})

export const generatePaperSchema = z.object({
  subjectId: z.string().min(1, 'Subject is required'),
  paperTitle: z.string().min(5, 'Title must be at least 5 characters'),
  paperType: z.enum([
    EXAM_TYPES.MIDTERM,
    EXAM_TYPES.FINAL,
    EXAM_TYPES.QUIZ,
    EXAM_TYPES.ASSIGNMENT
  ]),
  durationMinutes: z.number().int().min(1, 'Duration must be at least 1 minute'),
  instructions: z.string().optional(),
  questionCriteria: z.array(questionCriteriaSchema).min(1, 'At least one criteria is required')
})

export type CreateExamPaperFormData = z.infer<typeof createExamPaperSchema>
export type UpdateExamPaperFormData = z.infer<typeof updateExamPaperSchema>
export type GeneratePaperFormData = z.infer<typeof generatePaperSchema>
```

## File: src/features/exam-sessions/hooks/use-exam-sessions.ts
```typescript
import { apiClient } from '@/lib/api/client'
import type { 
  ExamSession, 
  CreateExamSessionDto, 
  UpdateExamSessionDto, 
  ExamSessionStats, 
  GetExamSessionsParams,
  BackendExamSessionsListResponse
} from '../types/exam-sessions'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

type RawExamSession = Omit<ExamSession, 'paperId' | 'paperTitle' | 'subjectCode' | 'subjectName' | 'roomId' | 'roomNumber' | 'building'> & {
  paperId: string | { _id: string; paperTitle: string; subjectCode?: string; subjectName?: string }
  roomId: string | { _id: string; roomNumber: string; building?: string }
}

const extractPaperId = (paperId: RawExamSession['paperId']): string => {
  if (!paperId) return ''
  if (typeof paperId === 'string' && !paperId.includes('{')) {
    return paperId
  }
  if (typeof paperId === 'object' && '_id' in paperId) {
    return paperId._id
  }
  if (typeof paperId === 'string' && paperId.includes('ObjectId')) {
    try {
      const match = paperId.match(/ObjectId\('([^']+)'\)/)
      if (match?.[1]) return match[1]
    } catch {
      return ''
    }
  }
  return ''
}

const extractPaperTitle = (paperId: RawExamSession['paperId']): string | undefined => {
  if (!paperId) return undefined
  if (typeof paperId === 'object' && 'paperTitle' in paperId) {
    return paperId.paperTitle
  }
  if (typeof paperId === 'string' && paperId.includes('paperTitle')) {
    try {
      const match = paperId.match(/paperTitle:\s*'([^']+)'/)
      if (match?.[1]) return match[1]
    } catch {
      return undefined
    }
  }
  return undefined
}

const extractSubjectCode = (paperId: RawExamSession['paperId']): string | undefined => {
  if (!paperId) return undefined
  if (typeof paperId === 'object' && 'subjectCode' in paperId) {
    return paperId.subjectCode
  }
  if (typeof paperId === 'string' && paperId.includes('subjectCode')) {
    try {
      const match = paperId.match(/subjectCode:\s*'([^']+)'/)
      if (match?.[1]) return match[1]
    } catch {
      return undefined
    }
  }
  return undefined
}

const extractSubjectName = (paperId: RawExamSession['paperId']): string | undefined => {
  if (!paperId) return undefined
  if (typeof paperId === 'object' && 'subjectName' in paperId) {
    return paperId.subjectName
  }
  if (typeof paperId === 'string' && paperId.includes('subjectName')) {
    try {
      const match = paperId.match(/subjectName:\s*'([^']+)'/)
      if (match?.[1]) return match[1]
    } catch {
      return undefined
    }
  }
  return undefined
}

const extractRoomId = (roomId: RawExamSession['roomId']): string => {
  if (!roomId) return ''
  if (typeof roomId === 'string' && !roomId.includes('{')) {
    return roomId
  }
  if (typeof roomId === 'object' && '_id' in roomId) {
    return roomId._id
  }
  if (typeof roomId === 'string' && roomId.includes('ObjectId')) {
    try {
      const match = roomId.match(/ObjectId\('([^']+)'\)/)
      if (match?.[1]) return match[1]
    } catch {
      return ''
    }
  }
  return ''
}

const extractRoomNumber = (roomId: RawExamSession['roomId']): string | undefined => {
  if (!roomId) return undefined
  if (typeof roomId === 'object' && 'roomNumber' in roomId) {
    return roomId.roomNumber
  }
  if (typeof roomId === 'string' && roomId.includes('roomNumber')) {
    try {
      const match = roomId.match(/roomNumber:\s*'([^']+)'/)
      if (match?.[1]) return match[1]
    } catch {
      return undefined
    }
  }
  return undefined
}

const extractBuilding = (roomId: RawExamSession['roomId']): string | undefined => {
  if (!roomId) return undefined
  if (typeof roomId === 'object' && 'building' in roomId) {
    return roomId.building
  }
  if (typeof roomId === 'string' && roomId.includes('building')) {
    try {
      const match = roomId.match(/building:\s*'([^']+)'/)
      if (match?.[1]) return match[1]
    } catch {
      return undefined
    }
  }
  return undefined
}

const transformExamSession = (session: RawExamSession): ExamSession => {
  const paperId = extractPaperId(session.paperId)
  const paperTitle = extractPaperTitle(session.paperId)
  const subjectCode = extractSubjectCode(session.paperId)
  const subjectName = extractSubjectName(session.paperId)
  const roomId = extractRoomId(session.roomId)
  const roomNumber = extractRoomNumber(session.roomId)
  const building = extractBuilding(session.roomId)
  
  return {
    ...session,
    paperId,
    paperTitle,
    subjectCode,
    subjectName,
    roomId,
    roomNumber,
    building
  }
}

export const examSessionsService = {
  getAll: async (params?: GetExamSessionsParams): Promise<PaginatedResponse<ExamSession>> => {
    const response = await apiClient.get<BackendExamSessionsListResponse>('/api/v1/exam-sessions', { params })
    return {
      data: (response.examSessions || []).map(transformExamSession),
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
      totalPages: response.totalPages || 1
    }
  },

  getById: async (id: string): Promise<ApiResponse<ExamSession>> => {
    const session = await apiClient.get<RawExamSession>(`/api/v1/exam-sessions/${id}`)
    return {
      data: transformExamSession(session)
    }
  },

  getUpcoming: async (params?: { limit?: number }): Promise<ApiResponse<ExamSession[]>> => {
    const sessions = await apiClient.get<RawExamSession[]>('/api/v1/exam-sessions/upcoming', { params })
    return {
      data: sessions.map(transformExamSession)
    }
  },

  getStats: (): Promise<ApiResponse<ExamSessionStats>> =>
    apiClient.get('/api/v1/exam-sessions/stats'),

  create: async (data: CreateExamSessionDto): Promise<ApiResponse<ExamSession>> => {
    const session = await apiClient.post<RawExamSession>('/api/v1/exam-sessions', data)
    return {
      data: transformExamSession(session)
    }
  },

  update: async (id: string, data: UpdateExamSessionDto): Promise<ApiResponse<ExamSession>> => {
    const session = await apiClient.patch<RawExamSession>(`/api/v1/exam-sessions/${id}`, data)
    return {
      data: transformExamSession(session)
    }
  },

  cancel: async (id: string, reason?: string): Promise<ApiResponse<ExamSession>> => {
    const session = await apiClient.patch<RawExamSession>(`/api/v1/exam-sessions/${id}/cancel`, { reason })
    return {
      data: transformExamSession(session)
    }
  },

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/exam-sessions/${id}`)
}
```

## File: src/features/exam-sessions/types/exam-sessions.ts
```typescript
export const EXAM_SESSION_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const

export type ExamSessionStatus = typeof EXAM_SESSION_STATUS[keyof typeof EXAM_SESSION_STATUS]

export type ExamSession = {
  _id: string
  paperId: string
  paperTitle?: string
  subjectCode?: string
  subjectName?: string
  examTitle: string
  examDateTime: string
  durationMinutes: number
  formattedDuration: string
  roomId: string
  roomNumber?: string
  building?: string
  maxStudents: number
  registeredStudents: number
  instructions?: string
  status: ExamSessionStatus
  createdBy: string
  createdByName?: string
  academicYear: string
  semester: number
  createdAt: string
  updatedAt: string
}

export type CreateExamSessionDto = {
  paperId: string
  examTitle: string
  examDateTime: string
  durationMinutes: number
  roomId: string
  maxStudents: number
  instructions?: string
  academicYear: string
  semester: number
}

export type UpdateExamSessionDto = Partial<CreateExamSessionDto> & {
  status?: ExamSessionStatus
}

export type ExamSessionStats = {
  totalSessions: number
  sessionsByStatus: Record<string, number>
  upcomingSessions: number
  completedSessions: number
}

export type GetExamSessionsParams = {
  paperId?: string
  roomId?: string
  status?: ExamSessionStatus
  academicYear?: string
  semester?: number
  dateFrom?: string
  dateTo?: string
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export type BackendExamSessionsListResponse = {
  examSessions: ExamSession[]
  total: number
  page: number
  limit: number
  totalPages: number
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

## File: src/features/exam-papers/components/exam-paper-form.tsx
```typescript
'use client'

import { useEffect, useState } from 'react'
import { useForm, useFieldArray, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { PlusIcon, TrashIcon, SearchIcon, InfoIcon, ListTreeIcon } from 'lucide-react'
import { EXAM_TYPES } from '../types/exam-papers'
import { createExamPaperSchema, updateExamPaperSchema, type CreateExamPaperFormData, type UpdateExamPaperFormData } from '../validations/exam-paper-schemas'
import type { ExamPaper, PaperQuestionDto } from '../types/exam-papers'
import { useMySubjectsQuery, useSubjectsQuery } from '@/features/subjects/hooks/use-subjects-query'
import { useQuestionsBySubjectQuery } from '@/features/questions/hooks/use-questions-query'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import type { Question } from '@/features/questions/types/questions'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth/auth-provider'
import { USER_ROLES } from '@/constants/roles'

type ExamPaperFormProps = {
  paper?: ExamPaper
  onSubmit: (data: CreateExamPaperFormData | UpdateExamPaperFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export const ExamPaperForm = ({ paper, onSubmit, onCancel, isLoading }: ExamPaperFormProps) => {
  const isEditMode = !!paper
  const [selectedSubject, setSelectedSubject] = useState<string>(paper?.subjectId || '')
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPartForQuestion, setSelectedPartForQuestion] = useState<string>('')

  const { user } = useAuth()
  const { data: allSubjectsData, isLoading: isLoadingAllSubjects } = useSubjectsQuery({ isActive: true })
  const { data: mySubjectsData, isLoading: isLoadingMySubjects } = useMySubjectsQuery({ isActive: true })
  const isFaculty = user?.role === USER_ROLES.FACULTY
  const subjects = (isFaculty ? mySubjectsData?.data : allSubjectsData?.data) || []

  const { data: questionsData, isLoading: isLoadingQuestions } = useQuestionsBySubjectQuery(
    selectedSubject || undefined,
    false
  )
  const questions = questionsData?.data || []

  const form = useForm({
    resolver: zodResolver(isEditMode ? updateExamPaperSchema : createExamPaperSchema),
    defaultValues: {
      subjectId: '',
      paperTitle: '',
      paperType: EXAM_TYPES.MIDTERM,
      totalMarks: 100,
      durationMinutes: 180,
      instructions: '',
      parts: [{ partLabel: 'A', partTitle: 'Part A', partOrder: 1 }],
      questions: []
    }
  }) as UseFormReturn<CreateExamPaperFormData>

  const { fields: partFields, append: appendPart, remove: removePart } = useFieldArray({
    control: form.control,
    name: 'parts'
  })

  const { fields: questionFields, append: appendQuestion, remove: removeQuestion } = useFieldArray({
    control: form.control,
    name: 'questions'
  })

  useEffect(() => {
    if (paper) {
      setSelectedSubject(paper.subjectId)
      form.reset({
        subjectId: paper.subjectId,
        paperTitle: paper.paperTitle,
        paperType: paper.paperType,
        totalMarks: paper.totalMarks,
        durationMinutes: paper.durationMinutes,
        instructions: paper.instructions || '',
        parts: paper.parts.map(p => ({
          partLabel: p.partLabel,
          partTitle: p.partTitle,
          partInstructions: p.partInstructions,
          partOrder: p.partOrder,
          hasOptionalQuestions: p.hasOptionalQuestions,
          minimumQuestionsToAnswer: p.minimumQuestionsToAnswer
        })),
        questions: paper.questions?.map((q) => ({
          questionId: q.questionId,
          questionOrder: q.questionOrder,
          marksAllocated: q.marksAllocated,
          partLabel: q.partLabel,
          partTitle: q.partTitle,
          isOptional: q.isOptional
        })) || []
      })
    }
  }, [paper, form])

  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value)
    form.setValue('subjectId', value)
    form.setValue('questions', [])
  }

  const handleAddQuestion = (question: Question, partLabel: string) => {
    const existingQuestion = questionFields.find(f => f.questionId === question._id)
    if (existingQuestion) return

    const part = partFields.find(p => p.partLabel === partLabel)
    const questionOrder = questionFields.filter(q => q.partLabel === partLabel).length + 1

    const newQuestion: PaperQuestionDto = {
      questionId: question._id,
      questionOrder,
      marksAllocated: question.marks,
      partLabel: partLabel,
      partTitle: part?.partTitle,
      isOptional: false
    }

    appendQuestion(newQuestion)
    setIsQuestionDialogOpen(false)
  }

  const calculateTotalAllocatedMarks = () => {
    return questionFields.reduce((sum, field) => sum + (field.marksAllocated || 0), 0)
  }

  const allocatedMarks = calculateTotalAllocatedMarks()
  const targetMarks = form.watch('totalMarks') || 0

  const filteredQuestions = questions.filter(q => 
    q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.topic?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getQuestionDetails = (questionId: string) => {
    return questions.find(q => q._id === questionId)
  }

  const handleSubmit = (data: CreateExamPaperFormData | UpdateExamPaperFormData) => {
    if (isEditMode) {
      (onSubmit as (data: UpdateExamPaperFormData) => void)(data as UpdateExamPaperFormData)
    } else {
      (onSubmit as (data: CreateExamPaperFormData) => void)(data as CreateExamPaperFormData)
    }
  }

  if (isLoadingAllSubjects || isLoadingMySubjects) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Exam Paper Creation</AlertTitle>
          <AlertDescription>
            Build your exam paper by selecting questions from the question bank. Structured questions with sub-parts are fully supported.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="subjectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject *</FormLabel>
                    <Select 
                      onValueChange={handleSubjectChange} 
                      value={field.value}
                      disabled={isEditMode}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject._id} value={subject._id}>
                            {subject.subjectCode} - {subject.subjectName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paperType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={EXAM_TYPES.MIDTERM}>Midterm</SelectItem>
                        <SelectItem value={EXAM_TYPES.FINAL}>Final</SelectItem>
                        <SelectItem value={EXAM_TYPES.QUIZ}>Quiz</SelectItem>
                        <SelectItem value={EXAM_TYPES.ASSIGNMENT}>Assignment</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="paperTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paper Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., SE3034 - Introduction to Programming - Final Exam 2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="totalMarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Marks *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={1}
                        placeholder="100" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Allocated: {allocatedMarks} / {targetMarks}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="durationMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={1}
                        placeholder="180" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value ? `${Math.floor(field.value / 60)}h ${field.value % 60}m` : ''}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>General Instructions</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="e.g., Answer all questions. Write your answers in the provided answer booklet." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Separator />

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Paper Sections</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Organize your exam into sections (Part A, Part B, etc.)
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendPart({
                  partLabel: String.fromCharCode(65 + partFields.length),
                  partTitle: `Part ${String.fromCharCode(65 + partFields.length)}`,
                  partOrder: partFields.length + 1,
                  hasOptionalQuestions: false
                })}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">

            <div className="space-y-3">
              {partFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-3 bg-muted/50">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">Part {field.partLabel}</Badge>
                      {field.partTitle}
                    </h4>
                    {partFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removePart(index)}
                      >
                        <TrashIcon className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name={`parts.${index}.partLabel`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Section Label *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="A, B, C..." 
                              className="font-mono uppercase" 
                              {...field} 
                              onChange={(e) => field.onChange(e.target.value.toUpperCase())} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`parts.${index}.partTitle`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Section Title *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Multiple Choice Questions" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`parts.${index}.partInstructions`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Section Instructions</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="e.g., Answer all questions. Each question carries 1 mark." 
                            rows={2}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name={`parts.${index}.hasOptionalQuestions`}
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="text-xs !mt-0">Has Optional Questions</FormLabel>
                        </FormItem>
                      )}
                    />

                    {form.watch(`parts.${index}.hasOptionalQuestions`) && (
                      <FormField
                        control={form.control}
                        name={`parts.${index}.minimumQuestionsToAnswer`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Minimum to Answer</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min={0}
                                placeholder="e.g., 3"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Separator />

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Questions</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {questionFields.length} question(s) • {allocatedMarks}/{targetMarks} marks
                </p>
              </div>
              <Dialog open={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="default"
                    disabled={!selectedSubject || partFields.length === 0}
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Questions
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Select Questions from Question Bank</DialogTitle>
                    <DialogDescription>
                      Choose questions to add to your exam paper. Questions with sub-parts will include all their nested structure.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search questions..."
                          className="pl-10"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Select value={selectedPartForQuestion} onValueChange={setSelectedPartForQuestion}>
                        <SelectTrigger className="w-[250px]">
                          <SelectValue placeholder="Select Section" />
                        </SelectTrigger>
                        <SelectContent>
                          {partFields.map(p => (
                            <SelectItem key={p.id} value={p.partLabel}>
                              Part {p.partLabel} - {p.partTitle}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {!selectedPartForQuestion && (
                      <div className="text-center py-8 text-muted-foreground">
                        Please select a section to add questions to
                      </div>
                    )}

                    {selectedPartForQuestion && (
                      <>
                        {isLoadingQuestions ? (
                          <div className="flex justify-center py-8">
                            <LoadingSpinner />
                          </div>
                        ) : filteredQuestions.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            No questions available for this subject
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {filteredQuestions.map((question) => {
                              const isAdded = questionFields.some(f => f.questionId === question._id)
                              return (
                                <div
                                  key={question._id}
                                  className={cn(
                                    "p-4 border rounded-lg hover:bg-muted/50 transition-colors",
                                    isAdded && "bg-muted opacity-50"
                                  )}
                                >
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                      <div className="flex items-start gap-2">
                                        {question.hasSubQuestions && (
                                          <ListTreeIcon className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                        )}
                                        <p className="font-medium line-clamp-2">{question.questionText}</p>
                                      </div>
                                      <div className="flex gap-2 mt-2 flex-wrap">
                                        <Badge variant="outline" className="text-xs">
                                          {question.questionType.replace('_', ' ').toUpperCase()}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                          {question.difficultyLevel}
                                        </Badge>
                                        <Badge variant="secondary" className="text-xs">
                                          {question.marks} marks
                                        </Badge>
                                        {question.hasSubQuestions && (
                                          <Badge variant="default" className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                                            Has Sub-parts
                                          </Badge>
                                        )}
                                        {question.topic && (
                                          <Badge variant="secondary" className="text-xs">
                                            {question.topic}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                    <Button
                                      type="button"
                                      size="sm"
                                      onClick={() => handleAddQuestion(question, selectedPartForQuestion)}
                                      disabled={isAdded}
                                    >
                                      {isAdded ? 'Added' : 'Add'}
                                    </Button>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">

            {questionFields.length === 0 ? (
              <div className="border-2 border-dashed rounded-lg p-12 text-center">
                <p className="text-muted-foreground">No questions added yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Click "Add Questions" to select from your question bank
                </p>
              </div>
            ) : (
              <Accordion type="single" collapsible className="space-y-2">
                {partFields.map((part) => {
                  const partQuestions = questionFields.filter(q => q.partLabel === part.partLabel)
                  const partMarks = partQuestions.reduce((sum, q) => sum + (q.marksAllocated || 0), 0)

                  return (
                    <AccordionItem key={part.id} value={part.partLabel} className="border rounded-lg px-4">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3 flex-1">
                          <Badge variant="outline" className="font-mono">Part {part.partLabel}</Badge>
                          <span className="font-medium">{part.partTitle}</span>
                          <Badge variant="secondary" className="ml-auto mr-4">
                            {partQuestions.length} questions • {partMarks} marks
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-3">
                        {partQuestions.map((field, index) => {
                          const questionDetails = getQuestionDetails(field.questionId)
                          const questionIndex = questionFields.indexOf(field)
                          
                          return (
                            <div key={field.id} className="p-4 border rounded-lg space-y-3 bg-card">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline" className="font-mono text-xs">Q{index + 1}</Badge>
                                    {questionDetails?.hasSubQuestions && (
                                      <ListTreeIcon className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    <p className="font-medium line-clamp-2 flex-1">
                                      {questionDetails?.questionText || 'Question not found'}
                                    </p>
                                  </div>
                                  {questionDetails && (
                                    <div className="flex gap-2 flex-wrap">
                                      <Badge variant="outline" className="text-xs">
                                        {questionDetails.questionType.replace('_', ' ').toUpperCase()}
                                      </Badge>
                                      <Badge variant="outline" className="text-xs">
                                        {questionDetails.difficultyLevel}
                                      </Badge>
                                      {questionDetails.hasSubQuestions && (
                                        <Badge variant="default" className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                                          Structured with sub-parts
                                        </Badge>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeQuestion(questionIndex)}
                                >
                                  <TrashIcon className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <FormField
                                  control={form.control}
                                  name={`questions.${questionIndex}.marksAllocated`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-xs">Marks for this Question</FormLabel>
                                      <FormControl>
                                        <Input 
                                          type="number" 
                                          min={0.5}
                                          step={0.5}
                                          {...field}
                                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                        />
                                      </FormControl>
                                      {questionDetails && (
                                        <FormDescription className="text-xs">
                                          Default: {questionDetails.marks} marks
                                        </FormDescription>
                                      )}
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name={`questions.${questionIndex}.isOptional`}
                                  render={({ field }) => (
                                    <FormItem className="flex items-end pb-2">
                                      <div className="flex items-center space-x-2">
                                        <FormControl>
                                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormLabel className="text-xs !mt-0">Mark as Optional</FormLabel>
                                      </div>
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            )}

            {allocatedMarks !== targetMarks && questionFields.length > 0 && (
              <Alert variant="destructive">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Marks Mismatch</AlertTitle>
                <AlertDescription>
                  Allocated: {allocatedMarks} marks • Target: {targetMarks} marks. Please adjust.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-end space-x-4 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading || questionFields.length === 0 || allocatedMarks !== targetMarks}
          >
            {isLoading ? 'Saving...' : isEditMode ? 'Update Paper' : 'Create Paper'}
          </Button>
        </div>
      </form>
    </Form>
  )
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
```

## File: src/features/questions/components/question-form.tsx
```typescript
'use client'

import { useEffect } from 'react'
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
          name={`${parentPath}.questionDescription` as any}
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
