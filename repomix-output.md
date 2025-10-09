This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
src/app/globals.css
src/app/layout.tsx
src/constants/roles.ts
src/constants/routes.ts
src/features/enrollments/components/enrollment-columns.tsx
src/features/enrollments/components/enrollment-form.tsx
src/features/enrollments/components/student-enrollment-columns.tsx
src/features/enrollments/hooks/use-enrollment-mutations.ts
src/features/enrollments/hooks/use-enrollments-query.ts
src/features/enrollments/hooks/use-enrollments.ts
src/features/enrollments/types/enrollments.ts
src/features/enrollments/validations/enrollment-schemas.ts
src/features/exam-papers/components/exam-paper-columns.tsx
src/features/exam-papers/components/exam-paper-form.tsx
src/features/exam-papers/components/generate-paper-form.tsx
src/features/exam-papers/hooks/use-exam-paper-mutations.ts
src/features/exam-papers/hooks/use-exam-papers-query.ts
src/features/exam-papers/hooks/use-exam-papers.ts
src/features/exam-papers/types/exam-papers.ts
src/features/exam-papers/validations/exam-paper-schemas.ts
src/features/questions/components/question-columns.tsx
src/features/questions/components/question-form.tsx
src/features/questions/hooks/use-question-mutations.ts
src/features/questions/hooks/use-questions-query.ts
src/features/questions/hooks/use-questions.ts
src/features/questions/types/questions.ts
src/features/questions/validations/question-schemas.ts
src/features/subjects/components/faculty-subject-columns.tsx
src/features/subjects/components/subject-columns.tsx
src/features/subjects/components/subject-form.tsx
src/features/subjects/hooks/use-subject-mutations.ts
src/features/subjects/hooks/use-subjects-query.ts
src/features/subjects/hooks/use-subjects.ts
src/features/subjects/types/subjects.ts
src/features/subjects/validations/subject-schemas.ts
src/lib/api/client.ts
src/lib/api/index.ts
src/lib/providers/query-provider.tsx
src/lib/utils.ts
src/types/auth.ts
src/types/common.ts
```

# Files

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

export const QUESTION_TYPES = {
  MCQ: 'mcq',
  SHORT_ANSWER: 'short_answer',
  LONG_ANSWER: 'long_answer',
  FILL_BLANK: 'fill_blank',
  TRUE_FALSE: 'true_false'
} as const

export type QuestionType = typeof QUESTION_TYPES[keyof typeof QUESTION_TYPES]

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
```

## File: src/features/enrollments/components/enrollment-columns.tsx
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
import { MoreHorizontalIcon, EditIcon, TrashIcon, EyeIcon } from 'lucide-react'
import type { StudentEnrollment, EnrollmentStatus } from '../types/enrollments'
import { cn } from '@/lib/utils'

const getStatusBadgeClass = (status: EnrollmentStatus) => {
  const statusClasses = {
    active: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    withdrawn: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
  } as const

  return statusClasses[status] || 'bg-muted'
}

const formatStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

type EnrollmentColumnsProps = {
  onEdit: (enrollment: StudentEnrollment) => void
  onDelete: (enrollment: StudentEnrollment) => void
  onView: (enrollment: StudentEnrollment) => void
}

export const getEnrollmentColumns = ({ 
  onEdit, 
  onDelete, 
  onView 
}: EnrollmentColumnsProps): ColumnDef<StudentEnrollment>[] => [
  {
    accessorKey: 'studentName',
    header: 'Student',
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.studentName}</div>
        <div className="text-sm text-muted-foreground">{row.original.studentEmail}</div>
      </div>
    ),
  },
  {
    accessorKey: 'subjectCode',
    header: 'Subject Code',
    cell: ({ row }) => (
      <div className="font-mono font-semibold text-primary">
        {row.original.subjectCode}
      </div>
    ),
  },
  {
    accessorKey: 'subjectName',
    header: 'Subject Name',
    cell: ({ row }) => (
      <div className="max-w-xs truncate">{row.original.subjectName}</div>
    ),
  },
  {
    accessorKey: 'academicYear',
    header: 'Academic Year',
    cell: ({ row }) => (
      <div className="font-medium">{row.original.academicYear}</div>
    ),
  },
  {
    accessorKey: 'semester',
    header: 'Semester',
    cell: ({ row }) => (
      <Badge variant="outline">
        Semester {row.original.semester}
      </Badge>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <Badge variant="outline" className={cn(getStatusBadgeClass(status))}>
          {formatStatus(status)}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'enrollmentDate',
    header: 'Enrolled',
    cell: ({ row }) => {
      const date = new Date(row.original.enrollmentDate)
      return date.toLocaleDateString()
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const enrollment = row.original

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
            <DropdownMenuItem onClick={() => onView(enrollment)}>
              <EyeIcon className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(enrollment)}>
              <EditIcon className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(enrollment)}
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

## File: src/features/enrollments/components/enrollment-form.tsx
```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  createEnrollmentSchema, 
  updateEnrollmentSchema, 
  type CreateEnrollmentFormData, 
  type UpdateEnrollmentFormData 
} from '../validations/enrollment-schemas'
import type { StudentEnrollment } from '../types/enrollments'
import { useUsersQuery } from '@/features/users/hooks/use-users-query'
import { useSubjectsQuery } from '@/features/subjects/hooks/use-subjects-query'
import { USER_ROLES } from '@/constants/roles'
import { ENROLLMENT_STATUS } from '../types/enrollments'

type CreateEnrollmentFormProps = {
  enrollment?: never
  onSubmit: (data: CreateEnrollmentFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

type UpdateEnrollmentFormProps = {
  enrollment: StudentEnrollment
  onSubmit: (data: UpdateEnrollmentFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

type EnrollmentFormProps = CreateEnrollmentFormProps | UpdateEnrollmentFormProps

export const EnrollmentForm = ({ enrollment, onSubmit, onCancel, isLoading }: EnrollmentFormProps) => {
  const isEditMode = !!enrollment

  // Fetch students and subjects for dropdowns
  const { data: studentsData } = useUsersQuery({ role: USER_ROLES.STUDENT, isActive: true })
  const { data: subjectsData } = useSubjectsQuery({ isActive: true })

  const form = useForm<CreateEnrollmentFormData | UpdateEnrollmentFormData>({
    resolver: zodResolver(isEditMode ? updateEnrollmentSchema : createEnrollmentSchema) as any,
    defaultValues: isEditMode ? {
      academicYear: '',
      semester: 1,
      enrollmentDate: new Date().toISOString().split('T')[0],
    } : {
      studentId: '',
      subjectId: '',
      academicYear: '',
      semester: 1,
      enrollmentDate: new Date().toISOString().split('T')[0],
    }
  })

  useEffect(() => {
    if (enrollment) {
      form.reset({
        academicYear: enrollment.academicYear,
        semester: enrollment.semester,
        enrollmentDate: new Date(enrollment.enrollmentDate).toISOString().split('T')[0],
        status: enrollment.status,
      })
    }
  }, [enrollment, form])

  const handleSubmit = (data: CreateEnrollmentFormData | UpdateEnrollmentFormData) => {
    if (isEditMode) {
      (onSubmit as (data: UpdateEnrollmentFormData) => void)(data as UpdateEnrollmentFormData)
    } else {
      (onSubmit as (data: CreateEnrollmentFormData) => void)(data as CreateEnrollmentFormData)
    }
  }

  // Get current academic year
  const currentYear = new Date().getFullYear()
  const academicYears = [
    `${currentYear}-${currentYear + 1}`,
    `${currentYear - 1}-${currentYear}`,
    `${currentYear + 1}-${currentYear + 2}`,
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Enrollment Information</h3>
          
          {!isEditMode && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select student" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {studentsData?.data && studentsData.data.length > 0 ? (
                          studentsData.data.map((student) => (
                            <SelectItem key={student._id} value={student._id}>
                              {student.fullName} ({student.email})
                            </SelectItem>
                          ))
                        ) : (
                          <div className="py-6 text-center text-sm text-muted-foreground">
                            No students available
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the student to enroll
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subjectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjectsData?.data && subjectsData.data.length > 0 ? (
                          subjectsData.data.map((subject) => (
                            <SelectItem key={subject._id} value={subject._id}>
                              {subject.subjectCode} - {subject.subjectName}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="py-6 text-center text-sm text-muted-foreground">
                            No subjects available
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the subject to enroll in
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="academicYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Academic Year *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {academicYears.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Academic year for enrollment
                  </FormDescription>
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
                  <Select 
                    onValueChange={(value) => field.onChange(Number(value))} 
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[1, 2].map((sem) => (
                        <SelectItem key={sem} value={sem.toString()}>
                          Semester {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Semester for enrollment
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enrollmentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enrollment Date *</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Date of enrollment
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {isEditMode && (
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={ENROLLMENT_STATUS.ACTIVE}>Active</SelectItem>
                      <SelectItem value={ENROLLMENT_STATUS.WITHDRAWN}>Withdrawn</SelectItem>
                      <SelectItem value={ENROLLMENT_STATUS.COMPLETED}>Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Update enrollment status
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="flex items-center justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : isEditMode ? 'Update Enrollment' : 'Create Enrollment'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
```

## File: src/features/enrollments/components/student-enrollment-columns.tsx
```typescript
'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EyeIcon } from 'lucide-react'
import type { StudentEnrollment, EnrollmentStatus } from '../types/enrollments'
import { cn } from '@/lib/utils'

const getStatusBadgeClass = (status: EnrollmentStatus) => {
  const statusClasses = {
    active: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    withdrawn: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
  } as const

  return statusClasses[status] || 'bg-muted'
}

const formatStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

type StudentEnrollmentColumnsProps = {
  onView: (enrollment: StudentEnrollment) => void
}

export const getStudentEnrollmentColumns = ({ 
  onView 
}: StudentEnrollmentColumnsProps): ColumnDef<StudentEnrollment>[] => [
  {
    accessorKey: 'subjectCode',
    header: 'Subject Code',
    cell: ({ row }) => (
      <div className="font-mono font-semibold text-primary">
        {row.original.subjectCode}
      </div>
    ),
  },
  {
    accessorKey: 'subjectName',
    header: 'Subject Name',
    cell: ({ row }) => (
      <div className="font-medium">{row.original.subjectName}</div>
    ),
  },
  {
    accessorKey: 'subjectCredits',
    header: 'Credits',
    cell: ({ row }) => (
      <div className="text-center">{row.original.subjectCredits || '—'}</div>
    ),
  },
  {
    accessorKey: 'academicYear',
    header: 'Academic Year',
    cell: ({ row }) => (
      <div className="font-medium">{row.original.academicYear}</div>
    ),
  },
  {
    accessorKey: 'semester',
    header: 'Semester',
    cell: ({ row }) => (
      <Badge variant="outline">
        Semester {row.original.semester}
      </Badge>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <Badge variant="outline" className={cn(getStatusBadgeClass(status))}>
          {formatStatus(status)}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'enrollmentDate',
    header: 'Enrolled Date',
    cell: ({ row }) => {
      const date = new Date(row.original.enrollmentDate)
      return date.toLocaleDateString()
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const enrollment = row.original

      return (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onView(enrollment)}
        >
          <EyeIcon className="mr-2 h-4 w-4" />
          View
        </Button>
      )
    },
  },
]
```

## File: src/features/enrollments/validations/enrollment-schemas.ts
```typescript
import { z } from 'zod'
import { ENROLLMENT_STATUS } from '../types/enrollments'

export const createEnrollmentSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  subjectId: z.string().min(1, 'Subject is required'),
  academicYear: z.string().min(1, 'Academic year is required'),
  semester: z.coerce.number()
    .int('Semester must be an integer')
    .min(1, 'Semester must be at least 1')
    .max(2, 'Semester must be at most 2'),
  enrollmentDate: z.string().min(1, 'Enrollment date is required'),
})

export const updateEnrollmentSchema = z.object({
  academicYear: z.string().optional(),
  semester: z.coerce.number()
    .int('Semester must be an integer')
    .min(1, 'Semester must be at least 1')
    .max(2, 'Semester must be at most 2')
    .optional(),
  enrollmentDate: z.string().optional(),
  status: z.enum([
    ENROLLMENT_STATUS.ACTIVE,
    ENROLLMENT_STATUS.WITHDRAWN,
    ENROLLMENT_STATUS.COMPLETED
  ]).optional(),
})

export type CreateEnrollmentFormData = z.infer<typeof createEnrollmentSchema>
export type UpdateEnrollmentFormData = z.infer<typeof updateEnrollmentSchema>
```

## File: src/features/exam-papers/components/exam-paper-columns.tsx
```typescript
// src/features/exam-papers/components/exam-paper-columns.tsx
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
import { MoreHorizontalIcon, EditIcon, TrashIcon, EyeIcon, CopyIcon, LockIcon } from 'lucide-react'
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
          <p className="font-medium">{paper.paperTitle}</p>
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
            <Badge variant="default" className="bg-purple-100 text-purple-700">
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

## File: src/features/exam-papers/components/generate-paper-form.tsx
```typescript
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
import { PlusIcon, TrashIcon } from 'lucide-react'
import { EXAM_TYPES } from '../types/exam-papers'
import { QUESTION_TYPES, DIFFICULTY_LEVELS } from '@/constants/roles'
import { generatePaperSchema, type GeneratePaperFormData } from '../validations/exam-paper-schemas'
import { useSubjectsQuery } from '@/features/subjects/hooks/use-subjects-query'
import { LoadingSpinner } from '@/components/common/loading-spinner'

type GeneratePaperFormProps = {
  onSubmit: (data: GeneratePaperFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export const GeneratePaperForm = ({ onSubmit, onCancel, isLoading }: GeneratePaperFormProps) => {
  const { data: subjectsData, isLoading: isLoadingSubjects } = useSubjectsQuery({ isActive: true })
  const subjects = subjectsData?.data || []

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

  if (isLoadingSubjects) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
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
        </div>

        {/* Question Criteria */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Question Criteria</h3>
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
              <div key={field.id} className="p-4 border rounded-lg space-y-4">
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
                            min={1}
                            placeholder="2"
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
                            <SelectItem value={QUESTION_TYPES.LONG_ANSWER}>Long Answer</SelectItem>
                            <SelectItem value={QUESTION_TYPES.FILL_BLANK}>Fill Blank</SelectItem>
                            <SelectItem value={QUESTION_TYPES.TRUE_FALSE}>True/False</SelectItem>
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
                          <Input placeholder="A, B, C..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="text-sm text-muted-foreground">
                  Subtotal: {(field.count || 0) * (field.marksPerQuestion || 0)} marks
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
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
// src/features/exam-papers/hooks/use-exam-paper-mutations.ts
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
    mutationFn: (id: string) => examPapersService.duplicate(id),
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

## File: src/features/exam-papers/validations/exam-paper-schemas.ts
```typescript
import { z } from 'zod'
import { EXAM_TYPES } from '../types/exam-papers'

const paperQuestionSchema = z.object({
  questionId: z.string().min(1, 'Question is required'),
  questionOrder: z.number().int().min(1),
  marksAllocated: z.number().int().min(1, 'Marks must be at least 1'),
  section: z.string().optional(),
  isOptional: z.boolean().optional()
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
  totalMarks: z.number().int().min(1, 'Total marks must be at least 1'),
  durationMinutes: z.number().int().min(1, 'Duration must be at least 1 minute'),
  instructions: z.string().optional(),
  questions: z.array(paperQuestionSchema).min(1, 'At least one question is required')
}).refine((data) => {
  const allocatedMarks = data.questions.reduce((sum, q) => sum + q.marksAllocated, 0)
  return allocatedMarks === data.totalMarks
}, {
  message: "Sum of allocated marks must equal total marks",
  path: ["totalMarks"]
})

export const updateExamPaperSchema = createExamPaperSchema.partial().extend({
  isActive: z.boolean().optional()
})

const questionCriteriaSchema = z.object({
  topic: z.string().optional(),
  difficultyLevel: z.enum(['easy', 'medium', 'hard']).optional(),
  questionType: z.enum(['mcq', 'short_answer', 'long_answer', 'fill_blank', 'true_false']).optional(),
  count: z.number().int().min(1, 'Count must be at least 1'),
  marksPerQuestion: z.number().int().min(1, 'Marks per question must be at least 1'),
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
import { MoreHorizontalIcon, EditIcon, TrashIcon, EyeIcon } from 'lucide-react'
import type { Question } from '../types/questions'
import { cn } from '@/lib/utils'
import type { QuestionType, DifficultyLevel } from '@/constants/roles'

const getQuestionTypeBadge = (type: QuestionType) => {
  const typeStyles = {
    mcq: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    short_answer: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    long_answer: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    fill_blank: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    true_false: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300'
  } as const
  return typeStyles[type] || 'bg-muted'
}

const getDifficultyBadge = (level: DifficultyLevel) => {
  const difficultyStyles = {
    easy: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    hard: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
  } as const
  return difficultyStyles[level] || 'bg-muted'
}

const formatQuestionType = (type: string) => {
  return type.replace('_', ' ').toUpperCase()
}

const formatDifficulty = (level: string) => {
  return level.charAt(0).toUpperCase() + level.slice(1)
}

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
      return (
        <div className="max-w-md">
          <p className="font-medium line-clamp-2">{text}</p>
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
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.subjectCode}</p>
        <p className="text-xs text-muted-foreground">{row.original.subjectName}</p>
      </div>
    ),
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

## File: src/features/questions/hooks/use-question-mutations.ts
```typescript
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { questionsService } from './use-questions'
import type { CreateQuestionDto, UpdateQuestionDto } from '../types/questions'
import type { ApiError } from '@/types/common'
import { toast } from 'sonner'

export const useCreateQuestion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateQuestionDto) => questionsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] })
      toast.success('Question Created', {
        description: 'Question has been added to the question bank.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Create Question', {
        description: error.message || 'An error occurred while creating the question.'
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
      toast.success('Question Updated', {
        description: 'Question has been updated successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Update Question', {
        description: error.message || 'An error occurred while updating the question.'
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
      toast.success('Question Deleted', {
        description: 'Question has been removed from the question bank.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Delete Question', {
        description: error.message || 'An error occurred while deleting the question.'
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

## File: src/features/subjects/hooks/use-subject-mutations.ts
```typescript
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { subjectsService } from './use-subjects'
import type { CreateSubjectDto, UpdateSubjectDto } from '../types/subjects'
import type { ApiError } from '@/types/common'
import { toast } from 'sonner'

export const useCreateSubject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSubjectDto) => subjectsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      toast.success('Subject Created', {
        description: 'Subject has been created successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Create Subject', {
        description: error.message || 'An error occurred while creating the subject.'
      })
    }
  })
}

export const useUpdateSubject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSubjectDto }) =>
      subjectsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      toast.success('Subject Updated', {
        description: 'Subject has been updated successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Update Subject', {
        description: error.message || 'An error occurred while updating the subject.'
      })
    }
  })
}

export const useDeleteSubject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => subjectsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      toast.success('Subject Deleted', {
        description: 'Subject has been deleted successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Delete Subject', {
        description: error.message || 'An error occurred while deleting the subject.'
      })
    }
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

## File: src/app/globals.css
```css
@import "tailwindcss";

 
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;

    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;

    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;

    --primary: 194 27% 6%;
    --primary-foreground: 0 0% 98%;

    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;

    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;

    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;

    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 5.9% 10%;

    --radius: 0.5rem;

    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;

    /* font variables */
    --font-unbounded: '';
    --font-inter: '';
  }

  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;

    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;

    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;

    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;

    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;

    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;

    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;

    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;

    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}

 
@theme inline {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));

  --color-chart-1: hsl(var(--chart-1));
  --color-chart-2: hsl(var(--chart-2));
  --color-chart-3: hsl(var(--chart-3));
  --color-chart-4: hsl(var(--chart-4));
  --color-chart-5: hsl(var(--chart-5));

  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

 
body {
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  font-family: Arial, Helvetica, sans-serif;
}
```

## File: src/features/enrollments/hooks/use-enrollment-mutations.ts
```typescript
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { studentEnrollmentsService } from './use-enrollments'
import type { CreateEnrollmentDto, UpdateEnrollmentDto, SelfEnrollmentDto } from '../types/enrollments'
import type { ApiError } from '@/types/common'
import { toast } from 'sonner'

export const useCreateEnrollment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateEnrollmentDto) => studentEnrollmentsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
      toast.success('Enrollment Created', {
        description: 'Student has been enrolled successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Create Enrollment', {
        description: error.message || 'An error occurred while creating the enrollment.'
      })
    }
  })
}

 
export const useSelfEnrollment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SelfEnrollmentDto) => studentEnrollmentsService.selfEnroll(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
      toast.success('Enrolled Successfully', {
        description: 'You have been enrolled in the subject.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Enroll', {
        description: error.message || 'An error occurred while enrolling.'
      })
    }
  })
}

export const useUpdateEnrollment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEnrollmentDto }) =>
      studentEnrollmentsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
      toast.success('Enrollment Updated', {
        description: 'Enrollment has been updated successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Update Enrollment', {
        description: error.message || 'An error occurred while updating the enrollment.'
      })
    }
  })
}

export const useWithdrawEnrollment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      studentEnrollmentsService.withdraw(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
      toast.success('Enrollment Withdrawn', {
        description: 'Student has been withdrawn from the subject.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Withdraw Enrollment', {
        description: error.message || 'An error occurred while withdrawing the enrollment.'
      })
    }
  })
}

export const useDeleteEnrollment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => studentEnrollmentsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
      toast.success('Enrollment Deleted', {
        description: 'Enrollment has been deleted successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Delete Enrollment', {
        description: error.message || 'An error occurred while deleting the enrollment.'
      })
    }
  })
}
```

## File: src/features/enrollments/types/enrollments.ts
```typescript
export const ENROLLMENT_STATUS = {
  ACTIVE: 'active',
  WITHDRAWN: 'withdrawn',
  COMPLETED: 'completed'
} as const

export type EnrollmentStatus = typeof ENROLLMENT_STATUS[keyof typeof ENROLLMENT_STATUS]

export type StudentEnrollment = {
  _id: string
  studentId: string
  studentName?: string
  studentEmail?: string
  subjectId: string
  subjectCode?: string
  subjectName?: string
  subjectCredits?: number
  academicYear: string
  semester: number
  enrollmentDate: string
  status: EnrollmentStatus
  withdrawnDate?: string
  withdrawnReason?: string
  enrolledBy?: string
  enrolledByName?: string
  createdAt: string
  updatedAt: string
}


export type AvailableSubject = {
  _id: string
  subjectCode: string
  subjectName: string
  year: number
  credits: number
  description?: string
  departmentId: string
  departmentName?: string
  isEnrolled: boolean
  enrolledStudentsCount?: number
}

export type CreateEnrollmentDto = {
  studentId: string
  subjectId: string
  academicYear: string
  semester: number
  enrollmentDate?: string
}


export type SelfEnrollmentDto = {
  subjectId: string
  academicYear: string
  semester: number
}

export type UpdateEnrollmentDto = {
  academicYear?: string
  semester?: number
  enrollmentDate?: string
  status?: EnrollmentStatus
  withdrawnReason?: string
  withdrawnDate?: string
}

export type EnrollmentStats = {
  totalEnrollments: number
  activeEnrollments: number
  withdrawnEnrollments: number
  completedEnrollments: number
  averageEnrollmentsPerSubject: number
  averageEnrollmentsPerStudent: number
}

export type GetEnrollmentsParams = {
  studentId?: string
  subjectId?: string
  academicYear?: string
  semester?: number
  status?: EnrollmentStatus
  page?: number
  limit?: number
  search?: string
}
```

## File: src/features/exam-papers/components/exam-paper-form.tsx
```typescript
// src/features/exam-papers/components/exam-paper-form.tsx
'use client'

import { useEffect, useState } from 'react'
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
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { PlusIcon, TrashIcon, SearchIcon } from 'lucide-react'
import { EXAM_TYPES } from '../types/exam-papers'
import { createExamPaperSchema, updateExamPaperSchema, type CreateExamPaperFormData, type UpdateExamPaperFormData } from '../validations/exam-paper-schemas'
import type { ExamPaper } from '../types/exam-papers'
import { useMySubjectsQuery, useSubjectsQuery } from '@/features/subjects/hooks/use-subjects-query'
import { useQuestionsBySubjectQuery } from '@/features/questions/hooks/use-questions-query'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import type { Question } from '@/features/questions/types/questions'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth/auth-provider'
import { USER_ROLES } from '@/constants/roles'

type CreateExamPaperFormProps = {
  paper?: never
  onSubmit: (data: CreateExamPaperFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

type UpdateExamPaperFormProps = {
  paper: ExamPaper
  onSubmit: (data: UpdateExamPaperFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

type ExamPaperFormProps = CreateExamPaperFormProps | UpdateExamPaperFormProps

export const ExamPaperForm = ({ paper, onSubmit, onCancel, isLoading }: ExamPaperFormProps) => {
  const isEditMode = !!paper
  const [selectedSubject, setSelectedSubject] = useState<string>(paper?.subjectId || '')
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

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

  const form = useForm<CreateExamPaperFormData | UpdateExamPaperFormData>({
    resolver: zodResolver(isEditMode ? updateExamPaperSchema : createExamPaperSchema),
    defaultValues: {
      subjectId: '',
      paperTitle: '',
      paperType: EXAM_TYPES.MIDTERM,
      totalMarks: 100,
      durationMinutes: 180,
      instructions: '',
      questions: []
    }
  })

  const { fields, append, remove } = useFieldArray({
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
        questions: paper.questions?.map((q, idx) => ({
          questionId: q.questionId,
          questionOrder: q.questionOrder || idx + 1,
          marksAllocated: q.marksAllocated,
          section: q.section || '',
          isOptional: q.isOptional || false
        })) || []
      })
    }
  }, [paper, form])

  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value)
    form.setValue('subjectId', value)
    // Clear questions when subject changes
    form.setValue('questions', [])
  }

  const handleAddQuestion = (question: Question) => {
    const existingQuestion = fields.find(f => f.questionId === question._id)
    if (existingQuestion) {
      return // Question already added
    }

    append({
      questionId: question._id,
      questionOrder: fields.length + 1,
      marksAllocated: question.marks,
      section: '',
      isOptional: false
    })
    setIsQuestionDialogOpen(false)
  }

  const calculateTotalAllocatedMarks = () => {
    return fields.reduce((sum, field) => sum + (field.marksAllocated || 0), 0)
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
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          
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
                  <Input placeholder="e.g., Mathematics Midterm 2024" {...field} />
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
        </div>

        {/* Questions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Questions</h3>
              <p className="text-sm text-muted-foreground">
                {fields.length} question(s) added
              </p>
            </div>
            <Dialog open={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={!selectedSubject}
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Questions
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Select Questions</DialogTitle>
                  <DialogDescription>
                    Choose questions from the question bank
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search questions..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {isLoadingQuestions ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner />
                    </div>
                  ) : filteredQuestions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No questions available
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredQuestions.map((question) => {
                        const isAdded = fields.some(f => f.questionId === question._id)
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
                                <p className="font-medium line-clamp-2">{question.questionText}</p>
                                <div className="flex gap-2 mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    {question.questionType.replace('_', ' ').toUpperCase()}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {question.difficultyLevel}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {question.marks} marks
                                  </Badge>
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
                                onClick={() => handleAddQuestion(question)}
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
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {fields.length === 0 ? (
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <p className="text-muted-foreground">No questions added yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Click &ldquo;Add Questions&ldquo; to select from question bank
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {fields.map((field, index) => {
                const questionDetails = getQuestionDetails(field.questionId)
                return (
                  <div key={field.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-sm">Q{index + 1}.</span>
                          <p className="font-medium line-clamp-1">
                            {questionDetails?.questionText || 'Question not found'}
                          </p>
                        </div>
                        {questionDetails && (
                          <div className="flex gap-2">
                            <Badge variant="outline" className="text-xs">
                              {questionDetails.questionType.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {questionDetails.difficultyLevel}
                            </Badge>
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <TrashIcon className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <FormField
                        control={form.control}
                        name={`questions.${index}.marksAllocated`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Marks</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min={1}
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
                        name={`questions.${index}.section`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Section</FormLabel>
                            <FormControl>
                              <Input placeholder="A, B, C..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`questions.${index}.isOptional`}
                        render={({ field }) => (
                          <FormItem className="flex items-end pb-2">
                            <div className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="text-xs !mt-0">Optional</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {allocatedMarks !== targetMarks && fields.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                ⚠️ Allocated marks ({allocatedMarks}) don&lsquo;t match total marks ({targetMarks})
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading || fields.length === 0 || allocatedMarks !== targetMarks}
          >
            {isLoading ? 'Saving...' : isEditMode ? 'Update Paper' : 'Create Paper'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
```

## File: src/features/exam-papers/hooks/use-exam-papers.ts
```typescript
// src/features/exam-papers/hooks/use-exam-papers.ts
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

type RawExamPaper = Omit<ExamPaper, 'subjectId' | 'subjectCode' | 'subjectName'> & {
  subjectId: string | { _id: string; subjectCode: string; subjectName: string }
}

// Helper functions for subject transformation
const extractSubjectCode = (subjectId: RawExamPaper['subjectId']): string | undefined => {
  if (!subjectId) return undefined
  if (typeof subjectId === 'object' && '_id' in subjectId) {
    return subjectId.subjectCode
  }
  if (typeof subjectId === 'string' && subjectId.includes('subjectCode')) {
    try {
      const match = subjectId.match(/subjectCode:\s*'([^']+)'/)
      if (match && match[1]) return match[1]
    } catch (error) {
      console.error('Failed to parse subjectId:', error)
    }
  }
  return undefined
}

const extractSubjectName = (subjectId: RawExamPaper['subjectId']): string | undefined => {
  if (!subjectId) return undefined
  if (typeof subjectId === 'object' && '_id' in subjectId) {
    return subjectId.subjectName
  }
  if (typeof subjectId === 'string' && subjectId.includes('subjectName')) {
    try {
      const match = subjectId.match(/subjectName:\s*'([^']+)'/)
      if (match && match[1]) return match[1]
    } catch (error) {
      console.error('Failed to parse subjectId:', error)
    }
  }
  return undefined
}

const extractSubjectId = (subjectId: RawExamPaper['subjectId']): string => {
  if (!subjectId) return ''
  if (typeof subjectId === 'string' && !subjectId.includes('{')) {
    return subjectId
  }
  if (typeof subjectId === 'object' && '_id' in subjectId) {
    return subjectId._id
  }
  if (typeof subjectId === 'string' && subjectId.includes('ObjectId')) {
    try {
      const match = subjectId.match(/ObjectId\('([^']+)'\)/)
      if (match && match[1]) return match[1]
    } catch (error) {
      console.error('Failed to parse subjectId:', error)
    }
  }
  return ''
}

const transformExamPaper = (paper: RawExamPaper): ExamPaper => {
  const subjectId = extractSubjectId(paper.subjectId)
  const subjectCode = extractSubjectCode(paper.subjectId)
  const subjectName = extractSubjectName(paper.subjectId)
  
  return {
    ...paper,
    subjectId,
    subjectCode,
    subjectName
  }
}

export const examPapersService = {
  getAll: async (params?: GetExamPapersParams): Promise<PaginatedResponse<ExamPaper>> => {
    const response = await apiClient.get<BackendExamPapersListResponse>('/api/v1/exam-papers', { params })
    return {
      data: (response.examPapers || []).map(transformExamPaper),
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
      totalPages: response.totalPages || 1
    }
  },

  getById: async (id: string, params?: { includeQuestions?: boolean }): Promise<ApiResponse<ExamPaper>> => {
    const paper = await apiClient.get<RawExamPaper>(`/api/v1/exam-papers/${id}`, { params })
    return {
      data: transformExamPaper(paper)
    }
  },

  getStats: (): Promise<ApiResponse<ExamPaperStats>> =>
    apiClient.get('/api/v1/exam-papers/stats'),

  create: async (data: CreateExamPaperDto): Promise<ApiResponse<ExamPaper>> => {
    const paper = await apiClient.post<RawExamPaper>('/api/v1/exam-papers', data)
    return {
      data: transformExamPaper(paper)
    }
  },

  generate: async (data: GeneratePaperDto): Promise<ApiResponse<ExamPaper>> => {
    const paper = await apiClient.post<RawExamPaper>('/api/v1/exam-papers/generate', data)
    return {
      data: transformExamPaper(paper)
    }
  },

  update: async (id: string, data: UpdateExamPaperDto): Promise<ApiResponse<ExamPaper>> => {
    const paper = await apiClient.patch<RawExamPaper>(`/api/v1/exam-papers/${id}`, data)
    return {
      data: transformExamPaper(paper)
    }
  },

  duplicate: async (id: string): Promise<ApiResponse<ExamPaper>> => {
    const paper = await apiClient.post<RawExamPaper>(`/api/v1/exam-papers/${id}/duplicate`)
    return {
      data: transformExamPaper(paper)
    }
  },

  finalize: async (id: string): Promise<ApiResponse<ExamPaper>> => {
    const paper = await apiClient.patch<RawExamPaper>(`/api/v1/exam-papers/${id}/finalize`)
    return {
      data: transformExamPaper(paper)
    }
  },

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/exam-papers/${id}`)
}
```

## File: src/features/exam-papers/types/exam-papers.ts
```typescript
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
```

## File: src/features/questions/components/question-form.tsx
```typescript
// src/features/questions/components/question-form.tsx
'use client'

import { useEffect, useState } from 'react'
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
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PlusIcon, TrashIcon } from 'lucide-react'
import { QUESTION_TYPES, DIFFICULTY_LEVELS, BLOOMS_TAXONOMY } from '@/constants/roles'
import { createQuestionSchema, updateQuestionSchema, type CreateQuestionFormData, type UpdateQuestionFormData } from '../validations/question-schemas'
import type { Question } from '../types/questions'
import { useMySubjectsQuery, useSubjectsQuery } from '@/features/subjects/hooks/use-subjects-query'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { useAuth } from '@/lib/auth/auth-provider'
import { USER_ROLES } from '@/constants/roles'

type CreateQuestionFormProps = {
  question?: never
  onSubmit: (data: CreateQuestionFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

type UpdateQuestionFormProps = {
  question: Question
  onSubmit: (data: UpdateQuestionFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

type QuestionFormProps = CreateQuestionFormProps | UpdateQuestionFormProps

export const QuestionForm = ({ question, onSubmit, onCancel, isLoading }: QuestionFormProps) => {
  const isEditMode = !!question
  const [selectedType, setSelectedType] = useState<string>(question?.questionType || QUESTION_TYPES.MCQ)

  const { user } = useAuth()
  const { data: allSubjectsData, isLoading: isLoadingAllSubjects } = useSubjectsQuery({ isActive: true })
  const { data: mySubjectsData, isLoading: isLoadingMySubjects } = useMySubjectsQuery({ isActive: true })
  const isFaculty = user?.role === USER_ROLES.FACULTY
  const subjects = (isFaculty ? mySubjectsData?.data : allSubjectsData?.data) || []

  const form = useForm<CreateQuestionFormData | UpdateQuestionFormData>({
    resolver: zodResolver(isEditMode ? updateQuestionSchema : createQuestionSchema),
    defaultValues: {
      subjectId: '',
      questionText: '',
      questionDescription: '',
      questionType: QUESTION_TYPES.MCQ,
      difficultyLevel: DIFFICULTY_LEVELS.MEDIUM,
      marks: 1,
      topic: '',
      subtopic: '',
      bloomsTaxonomy: BLOOMS_TAXONOMY.UNDERSTAND,
      keywords: '',
      isPublic: true,
      options: [
        { optionText: '', isCorrect: false, optionOrder: 1 },
        { optionText: '', isCorrect: false, optionOrder: 2 }
      ]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'options'
  })

  useEffect(() => {
    if (question) {
      console.log('Setting form values with question:', question)
      form.reset({
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
        options: question.options && question.options.length > 0 
          ? question.options.map(opt => ({
              optionText: opt.optionText,
              isCorrect: opt.isCorrect,
              optionOrder: opt.optionOrder
            }))
          : [
              { optionText: '', isCorrect: false, optionOrder: 1 },
              { optionText: '', isCorrect: false, optionOrder: 2 }
            ]
      })
      setSelectedType(question.questionType)
    }
  }, [question, form])

  const handleSubmit = (data: CreateQuestionFormData | UpdateQuestionFormData) => {
    if (isEditMode) {
      // For updates, exclude subjectId and options if not needed
      const updateData: any = { ...data }
      delete updateData.subjectId
      
      if (selectedType !== QUESTION_TYPES.MCQ && selectedType !== QUESTION_TYPES.TRUE_FALSE) {
        delete updateData.options
      }
      
      (onSubmit as (data: UpdateQuestionFormData) => void)(updateData)
    } else {
      // For creates, only exclude options if not needed
      const createData: any = { ...data }
      if (selectedType !== QUESTION_TYPES.MCQ && selectedType !== QUESTION_TYPES.TRUE_FALSE) {
        delete createData.options
      }
      
      (onSubmit as (data: CreateQuestionFormData) => void)(createData)
    }
  }

  const needsOptions = selectedType === QUESTION_TYPES.MCQ || selectedType === QUESTION_TYPES.TRUE_FALSE

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
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="subjectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isEditMode}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subjects.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground">
                          No subjects available
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

            <FormField
              control={form.control}
              name="questionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Type *</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value)
                      setSelectedType(value)
                    }} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={QUESTION_TYPES.MCQ}>Multiple Choice (MCQ)</SelectItem>
                      <SelectItem value={QUESTION_TYPES.SHORT_ANSWER}>Short Answer</SelectItem>
                      <SelectItem value={QUESTION_TYPES.LONG_ANSWER}>Long Answer</SelectItem>
                      <SelectItem value={QUESTION_TYPES.FILL_BLANK}>Fill in the Blank</SelectItem>
                      <SelectItem value={QUESTION_TYPES.TRUE_FALSE}>True/False</SelectItem>
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
                    placeholder="Enter the question text" 
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
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Additional context or instructions" 
                    className="min-h-[80px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <FormField
              control={form.control}
              name="marks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marks *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1}
                      max={100}
                      placeholder="Enter marks" 
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
              name="bloomsTaxonomy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bloom&apos;s Taxonomy</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
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
          </div>
        </div>

        {/* Categorization */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Categorization</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Calculus, Grammar" {...field} />
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
                    <Input placeholder="e.g., Derivatives, Tenses" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="keywords"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Keywords</FormLabel>
                <FormControl>
                  <Input placeholder="Comma-separated keywords for searching" {...field} />
                </FormControl>
                <FormDescription>
                  Add keywords to make this question easier to find
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isPublic"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Make this question public</FormLabel>
                  <FormDescription>
                    Public questions can be used by other faculty members
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Options for MCQ/True-False */}
        {needsOptions && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Answer Options</h3>
              {selectedType === QUESTION_TYPES.MCQ && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ 
                    optionText: '', 
                    isCorrect: false, 
                    optionOrder: fields.length + 1 
                  })}
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <FormField
                    control={form.control}
                    name={`options.${index}.isCorrect`}
                    render={({ field }) => (
                      <FormItem className="flex items-center space-y-0 pt-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`options.${index}.optionText`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
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

                  {selectedType === QUESTION_TYPES.MCQ && fields.length > 2 && (
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
              ))}
            </div>

            <p className="text-sm text-muted-foreground">
              Check the box next to correct answer(s)
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : isEditMode ? 'Update Question' : 'Create Question'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
```

## File: src/features/questions/hooks/use-questions.ts
```typescript
// src/features/questions/hooks/use-questions.ts
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

type RawQuestion = Omit<Question, 'subjectId' | 'subjectCode' | 'subjectName'> & {
  subjectId: string | { _id: string; subjectCode: string; subjectName: string }
}

// Helper function to extract subject details
const extractSubjectCode = (subjectId: RawQuestion['subjectId']): string | undefined => {
  if (!subjectId) return undefined
  
  // If it's already an object
  if (typeof subjectId === 'object' && '_id' in subjectId) {
    return subjectId.subjectCode
  }
  
  // If it's a stringified object (malformed backend response)
  if (typeof subjectId === 'string' && subjectId.includes('subjectCode')) {
    try {
      const match = subjectId.match(/subjectCode:\s*'([^']+)'/)
      if (match && match[1]) {
        return match[1]
      }
    } catch (error) {
      console.error('Failed to parse subjectId:', error)
    }
  }
  
  return undefined
}

const extractSubjectName = (subjectId: RawQuestion['subjectId']): string | undefined => {
  if (!subjectId) return undefined
  
  // If it's already an object
  if (typeof subjectId === 'object' && '_id' in subjectId) {
    return subjectId.subjectName
  }
  
  // If it's a stringified object
  if (typeof subjectId === 'string' && subjectId.includes('subjectName')) {
    try {
      const match = subjectId.match(/subjectName:\s*'([^']+)'/)
      if (match && match[1]) {
        return match[1]
      }
    } catch (error) {
      console.error('Failed to parse subjectId:', error)
    }
  }
  
  return undefined
}

// Helper function to extract subject ID
const extractSubjectId = (subjectId: RawQuestion['subjectId']): string => {
  if (!subjectId) return ''
  
  // If it's a string ID
  if (typeof subjectId === 'string' && !subjectId.includes('{')) {
    return subjectId
  }
  
  // If it's an object
  if (typeof subjectId === 'object' && '_id' in subjectId) {
    return subjectId._id
  }
  
  // If it's a stringified object
  if (typeof subjectId === 'string' && subjectId.includes('ObjectId')) {
    try {
      const match = subjectId.match(/ObjectId\('([^']+)'\)/)
      if (match && match[1]) {
        return match[1]
      }
    } catch (error) {
      console.error('Failed to parse subjectId:', error)
    }
  }
  
  return ''
}

// Transform question to normalize the data
const transformQuestion = (question: RawQuestion): Question => {
  const subjectId = extractSubjectId(question.subjectId)
  const subjectCode = extractSubjectCode(question.subjectId)
  const subjectName = extractSubjectName(question.subjectId)
  
  return {
    ...question,
    subjectId,
    subjectCode,
    subjectName
  }
}

export const questionsService = {
  getAll: async (params?: GetQuestionsParams): Promise<PaginatedResponse<Question>> => {
    const response = await apiClient.get<BackendQuestionsListResponse>('/api/v1/questions', { params })
    return {
      data: (response.questions || []).map(transformQuestion),
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
      totalPages: response.totalPages || 1
    }
  },

  getById: async (id: string): Promise<ApiResponse<Question>> => {
    const question = await apiClient.get<RawQuestion>(`/api/v1/questions/${id}`)
    return {
      data: transformQuestion(question)
    }
  },

  getBySubject: async (subjectId: string, params?: { includePrivate?: boolean }): Promise<ApiResponse<Question[]>> => {
    const questions = await apiClient.get<RawQuestion[]>(`/api/v1/questions/subject/${subjectId}`, { params })
    return {
      data: Array.isArray(questions) ? questions.map(transformQuestion) : []
    }
  },

  getStats: (): Promise<ApiResponse<QuestionStats>> =>
    apiClient.get('/api/v1/questions/stats'),

  create: async (data: CreateQuestionDto): Promise<ApiResponse<Question>> => {
    const question = await apiClient.post<RawQuestion>('/api/v1/questions', data)
    return {
      data: transformQuestion(question)
    }
  },

  update: async (id: string, data: UpdateQuestionDto): Promise<ApiResponse<Question>> => {
    const question = await apiClient.patch<RawQuestion>(`/api/v1/questions/${id}`, data)
    return {
      data: transformQuestion(question)
    }
  },

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/questions/${id}`)
}
```

## File: src/features/questions/types/questions.ts
```typescript
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
```

## File: src/features/questions/validations/question-schemas.ts
```typescript
import { z } from 'zod'
import { QUESTION_TYPES, DIFFICULTY_LEVELS, BLOOMS_TAXONOMY } from '@/constants/roles'

const questionOptionSchema = z.object({
  optionText: z.string().min(1, 'Option text is required'),
  isCorrect: z.boolean(),
  optionOrder: z.number().int().min(1)
})

export const createQuestionSchema = z.object({
  subjectId: z.string().min(1, 'Subject is required'),
  questionText: z.string().min(10, 'Question text must be at least 10 characters'),
  questionDescription: z.string().optional(),
  questionType: z.enum([
    QUESTION_TYPES.MCQ,
    QUESTION_TYPES.SHORT_ANSWER,
    QUESTION_TYPES.LONG_ANSWER,
    QUESTION_TYPES.FILL_BLANK,
    QUESTION_TYPES.TRUE_FALSE
  ]),
  difficultyLevel: z.enum([
    DIFFICULTY_LEVELS.EASY,
    DIFFICULTY_LEVELS.MEDIUM,
    DIFFICULTY_LEVELS.HARD
  ]),
  marks: z.number().int().min(1, 'Marks must be at least 1').max(100, 'Marks cannot exceed 100'),
  topic: z.string().optional(),
  subtopic: z.string().optional(),
  bloomsTaxonomy: z.enum([
    BLOOMS_TAXONOMY.REMEMBER,
    BLOOMS_TAXONOMY.UNDERSTAND,
    BLOOMS_TAXONOMY.APPLY,
    BLOOMS_TAXONOMY.ANALYZE,
    BLOOMS_TAXONOMY.EVALUATE,
    BLOOMS_TAXONOMY.CREATE
  ]).optional(),
  keywords: z.string().optional(),
  isPublic: z.boolean().optional(),
  options: z.array(questionOptionSchema).optional()
}).refine((data) => {
  // MCQ and TRUE_FALSE must have options
  if (data.questionType === QUESTION_TYPES.MCQ || data.questionType === QUESTION_TYPES.TRUE_FALSE) {
    return data.options && data.options.length >= 2
  }
  return true
}, {
  message: "MCQ and True/False questions must have at least 2 options",
  path: ["options"]
}).refine((data) => {
  // At least one correct answer for MCQ
  if (data.questionType === QUESTION_TYPES.MCQ && data.options) {
    return data.options.some(opt => opt.isCorrect)
  }
  return true
}, {
  message: "MCQ must have at least one correct answer",
  path: ["options"]
})

export const updateQuestionSchema = createQuestionSchema.partial().omit({ subjectId: true }).extend({
  isActive: z.boolean().optional()
})

export type CreateQuestionFormData = z.infer<typeof createQuestionSchema>
export type UpdateQuestionFormData = z.infer<typeof updateQuestionSchema>
```

## File: src/features/subjects/components/faculty-subject-columns.tsx
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
import { MoreHorizontalIcon, EyeIcon, HelpCircleIcon, FileTextIcon, UsersIcon } from 'lucide-react'
import type { Subject } from '../types/subjects'

type FacultySubjectColumnsProps = {
  onView: (subject: Subject) => void
  onManageQuestions: (subject: Subject) => void
  onManagePapers: (subject: Subject) => void
}

export const getFacultySubjectColumns = ({ 
  onView, 
  onManageQuestions, 
  onManagePapers 
}: FacultySubjectColumnsProps): ColumnDef<Subject>[] => [
  {
    accessorKey: 'subjectCode',
    header: 'Code',
    cell: ({ row }) => (
      <div className="font-mono font-semibold text-primary">
        {row.original.subjectCode}
      </div>
    ),
  },
  {
    accessorKey: 'subjectName',
    header: 'Subject Name',
    cell: ({ row }) => (
      <div className="font-medium max-w-xs truncate">{row.original.subjectName}</div>
    ),
  },
  {
    accessorKey: 'departmentName',
    header: 'Department',
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.original.departmentName || '—'}
      </div>
    ),
  },
  {
    accessorKey: 'licName',
    header: 'LIC',
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">{row.original.licName || '—'}</div>
    ),
  },
  {
    accessorKey: 'year',
    header: 'Year',
    cell: ({ row }) => (
      <Badge variant="outline" className="font-mono">
        Year {row.original.year}
      </Badge>
    ),
  },
  {
    accessorKey: 'credits',
    header: 'Credits',
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.original.credits}
      </div>
    ),
  },
  {
    accessorKey: 'lecturerIds',
    header: 'Lecturers',
    cell: ({ row }) => (
      <div className="text-sm max-w-xs truncate">{(row.original.lecturers || []).map(l => l.fullName).join(', ') || '—'}</div>
    ),
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
    header: 'Actions',
    cell: ({ row }) => {
      const subject = row.original

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
            <DropdownMenuItem onClick={() => onView(subject)}>
              <EyeIcon className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onManageQuestions(subject)}>
              <HelpCircleIcon className="mr-2 h-4 w-4" />
              Manage Questions
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onManagePapers(subject)}>
              <FileTextIcon className="mr-2 h-4 w-4" />
              Manage Exam Papers
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => window.open(`/faculty/subjects/${subject._id}/students`, '_blank')}
            >
              <UsersIcon className="mr-2 h-4 w-4" />
              View Students
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
```

## File: src/features/subjects/types/subjects.ts
```typescript
export type Subject = {
  _id: string
  subjectCode: string
  subjectName: string
  departmentId: string
  departmentName?: string
  year: number
  credits: number
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  licId?: string
  licName?: string
  lecturerIds?: string[]
  lecturers?: { _id: string; fullName: string }[]
}

export type CreateSubjectDto = {
  subjectCode: string
  subjectName: string
  departmentId: string
  year: number
  credits?: number
  description?: string
  licId?: string
  lecturerIds?: string[]
}

export type UpdateSubjectDto = Partial<Omit<CreateSubjectDto, 'subjectCode'>> & {
  isActive?: boolean
}

export type AssignFacultyDto = {
  facultyId: string
  academicYear: string
  semester: number
  isCoordinator: boolean
  assignedDate: string
}

export type FacultyAssignment = {
  _id: string
  facultyId: string
  facultyName: string
  academicYear: string
  semester: number
  isCoordinator: boolean
  assignedDate: string
}

export type SubjectStats = {
  totalSubjects: number
  subjectsByDepartment: Record<string, number>
  subjectsByYear: Record<string, number>
}

export type GetSubjectsParams = {
  departmentId?: string
  year?: number
  isActive?: boolean
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
```

## File: src/features/subjects/validations/subject-schemas.ts
```typescript
import { z } from 'zod'

export const createSubjectSchema = z.object({
  subjectCode: z.string()
    .min(2, 'Subject code must be at least 2 characters')
    .max(20, 'Subject code must be less than 20 characters')
    .regex(/^[A-Z0-9\-]+$/, 'Subject code must contain only uppercase letters, numbers, and hyphens'),
  subjectName: z.string()
    .min(3, 'Subject name must be at least 3 characters')
    .max(200, 'Subject name must be less than 200 characters'),
  departmentId: z.string()
    .min(1, 'Department is required'),
  year: z.coerce.number()
    .int('Year must be an integer')
    .min(1, 'Year must be at least 1')
    .max(6, 'Year must be at most 6'),
  credits: z.coerce.number()
    .min(0, 'Credits must be at least 0')
    .max(10, 'Credits must be at most 10')
    .optional()
    .default(3),
  description: z.string().optional()
  ,
  licId: z.string().optional(),
  lecturerIds: z.array(z.string()).optional()
})

export const updateSubjectSchema = createSubjectSchema.partial().omit({ subjectCode: true }).extend({
  isActive: z.boolean().optional()
})

export type CreateSubjectFormData = z.infer<typeof createSubjectSchema>
export type UpdateSubjectFormData = z.infer<typeof updateSubjectSchema>
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

## File: src/features/enrollments/hooks/use-enrollments-query.ts
```typescript
'use client'

import { useQuery } from '@tanstack/react-query'
import { studentEnrollmentsService } from './use-enrollments'
import type { GetEnrollmentsParams } from '../types/enrollments'
import { useAuth } from '@/lib/auth/auth-provider'

export const useEnrollmentsQuery = (params?: GetEnrollmentsParams) => {
  return useQuery({
    queryKey: ['enrollments', params],
    queryFn: () => studentEnrollmentsService.getAll(params),
    staleTime: 30000,
  })
}

export const useEnrollmentQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: ['enrollments', id],
    queryFn: async () => {
      if (!id) throw new Error('Enrollment ID is required')
      return await studentEnrollmentsService.getById(id)
    },
    enabled: !!id && id !== 'undefined',
    retry: 1,
  })
}


 
export const useMyEnrollmentsQuery = (params?: GetEnrollmentsParams) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['enrollments', 'my-enrollments', user?._id, params],
    queryFn: async () => {
      if (!user?._id) throw new Error('User not authenticated');
      return await studentEnrollmentsService.getMyEnrollments(params);  
    },
    enabled: !!user?._id,
    staleTime: 30000,
  });
};

export const useEnrollmentsBySubjectQuery = (subjectId: string | undefined) => {
  return useQuery({
    queryKey: ['enrollments', 'subject', subjectId],
    queryFn: async () => {
      if (!subjectId) throw new Error('Subject ID is required')
      return await studentEnrollmentsService.getBySubject(subjectId)
    },
    enabled: !!subjectId && subjectId !== 'undefined',
    staleTime: 30000,
  })
}

export const useEnrollmentStatsQuery = () => {
  return useQuery({
    queryKey: ['enrollments', 'stats'],
    queryFn: () => studentEnrollmentsService.getStats(),
    staleTime: 60000,
  })
}


export const useAvailableSubjectsQuery = (academicYear: string, semester: number) => {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['enrollments', 'available-subjects', academicYear, semester, user?._id],
    queryFn: async () => {
      if (!academicYear || !semester) throw new Error('Academic year and semester are required')
      return await studentEnrollmentsService.getAvailableSubjects(academicYear, semester)
    },
    enabled: !!academicYear && !!semester && !!user?._id,
    staleTime: 30000,
  })
}
```

## File: src/features/subjects/components/subject-columns.tsx
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
import { MoreHorizontalIcon, EditIcon, TrashIcon, EyeIcon } from 'lucide-react'
import type { Subject } from '../types/subjects'

type SubjectColumnsProps = {
  onEdit: (subject: Subject) => void
  onDelete: (subject: Subject) => void
  onView: (subject: Subject) => void
}

export const getSubjectColumns = ({ onEdit, onDelete, onView }: SubjectColumnsProps): ColumnDef<Subject>[] => [
  {
    accessorKey: 'subjectCode',
    header: 'Code',
    cell: ({ row }) => (
      <div className="font-mono font-semibold text-primary">
        {row.original.subjectCode}
      </div>
    ),
  },
  {
    accessorKey: 'subjectName',
    header: 'Subject Name',
    cell: ({ row }) => (
      <div className="font-medium max-w-xs truncate">{row.original.subjectName}</div>
    ),
  },
  {
    accessorKey: 'departmentName',
    header: 'Department',
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.original.departmentName || '—'}
      </div>
    ),
  },
  {
    accessorKey: 'licName',
    header: 'LIC',
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">{row.original.licName || '—'}</div>
    ),
  },
  {
    accessorKey: 'year',
    header: 'Year',
    cell: ({ row }) => (
      <Badge variant="outline" className="font-mono">
        Year {row.original.year}
      </Badge>
    ),
  },
  {
    accessorKey: 'credits',
    header: 'Credits',
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.original.credits}
      </div>
    ),
  },
  {
    accessorKey: 'lecturerIds',
    header: 'Lecturers',
    cell: ({ row }) => (
      <div className="text-sm max-w-xs truncate">
        {row.original.lecturers?.length
          ? row.original.lecturers.map(l => l.fullName).join(', ')
          : row.original.lecturerIds?.length
            ? `${row.original.lecturerIds.length} lecturer${row.original.lecturerIds.length > 1 ? 's' : ''}`
            : '—'}
      </div>
    ),
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
      const subject = row.original

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
            <DropdownMenuItem onClick={() => onView(subject)}>
              <EyeIcon className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(subject)}>
              <EditIcon className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(subject)}
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

## File: src/features/subjects/components/subject-form.tsx
```typescript
'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Resolver } from 'react-hook-form'
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  createSubjectSchema,
  updateSubjectSchema,
  type CreateSubjectFormData,
  type UpdateSubjectFormData,
} from '../validations/subject-schemas'

import type { Subject } from '../types/subjects'
import type { User } from '@/features/users/types/users'
import type { Department } from '@/features/departments/types/departments'
import { useDepartmentsQuery, useDepartmentQuery } from '@/features/departments/hooks/use-departments-query'
import { useUsersQuery, useUserQuery } from '@/features/users/hooks/use-users-query'
import { usersService } from '@/features/users/hooks/use-users'
import { USER_ROLES } from '@/constants/roles'

type CreateSubjectFormProps = {
  subject?: never
  onSubmit: (data: CreateSubjectFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

type UpdateSubjectFormProps = {
  subject: Subject
  onSubmit: (data: UpdateSubjectFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

type SubjectFormProps = CreateSubjectFormProps | UpdateSubjectFormProps

export const SubjectForm = ({ subject, onSubmit, onCancel, isLoading }: SubjectFormProps) => {
  const isEditMode = !!subject

  const { data: departmentsData, isLoading: isDepartmentsLoading } = useDepartmentsQuery({ isActive: true })
  const { data: facultyData, isLoading: isFacultyLoading } = useUsersQuery({ role: USER_ROLES.FACULTY, isActive: true })

  const extractId = (v?: string | { _id?: string; id?: string } | null): string | undefined => {
    if (!v) return undefined
    if (typeof v === 'string') return v
    return v._id ?? v.id ?? undefined
  }

  const subjectDepartmentId = extractId(subject?.departmentId)
  const subjectLicId = extractId(subject?.licId)

  const { data: departmentResponse, isLoading: isDepartmentLoading } = useDepartmentQuery(subjectDepartmentId ?? undefined)
  const { data: licResponse, isLoading: isLicLoading } = useUserQuery(subjectLicId ?? undefined)

  const [extraLecturers, setExtraLecturers] = useState<User[]>([])
  const [isLoadingExtraLecturers, setIsLoadingExtraLecturers] = useState(false)
  const [licOpen, setLicOpen] = useState(false)
  const [lecturerQuery, setLecturerQuery] = useState('')

  const form = useForm<CreateSubjectFormData | UpdateSubjectFormData>({
    resolver: zodResolver(isEditMode ? updateSubjectSchema : createSubjectSchema) as unknown as Resolver<
      CreateSubjectFormData | UpdateSubjectFormData
    >,
    defaultValues: isEditMode
      ? {
          subjectName: '',
          departmentId: '',
          year: 1,
          credits: 3,
          description: '',
          licId: undefined,
          lecturerIds: [],
        }
      : {
          subjectCode: '',
          subjectName: '',
          departmentId: '',
          year: 1,
          credits: 3,
          description: '',
          licId: undefined,
          lecturerIds: [],
        },
  })

  const watchedLecturerIds = form.watch('lecturerIds')

  useEffect(() => {
    if (!subject || !subject.lecturerIds?.length) return

    const missingIds = subject.lecturerIds.map(extractId).filter(Boolean) as string[]
    const existing = new Set((facultyData?.data || []).map((u: User) => u._id))
    const toFetch = missingIds.filter((id) => !existing.has(id))

    if (toFetch.length > 0) {
      setIsLoadingExtraLecturers(true)
      Promise.all(
        toFetch.map((id) => usersService.getById(id).then((r) => r.data).catch(() => null))
      )
        .then((res) => {
          setExtraLecturers(res.filter(Boolean) as User[])
        })
        .finally(() => setIsLoadingExtraLecturers(false))
    }
  }, [subject, facultyData?.data])

  useEffect(() => {
    if (!isEditMode || !subject) return

    const readyToReset =
      !isDepartmentsLoading &&
      !isFacultyLoading &&
      (!subjectDepartmentId || !isDepartmentLoading) &&
      (!subjectLicId || !isLicLoading)

    if (readyToReset) {
      form.reset({
        subjectName: subject.subjectName,
        departmentId: subjectDepartmentId ?? '',
        year: subject.year,
        credits: subject.credits,
        description: subject.description || '',
        licId: subjectLicId ?? undefined,
        lecturerIds: subject.lecturerIds?.map(extractId).filter(Boolean) || [],
      })
    }
  }, [
    isEditMode,
    subject,
    isDepartmentsLoading,
    isFacultyLoading,
    isDepartmentLoading,
    isLicLoading,
    subjectDepartmentId,
    subjectLicId,
    form,
  ])

  const facultyOptions = useMemo(() => {
    const map = new Map<string, User>()
    ;(facultyData?.data || []).forEach((u) => map.set(u._id, u))
    if (licResponse?.data) map.set(licResponse.data._id, licResponse.data)
    extraLecturers.forEach((u) => map.set(u._id, u))
    return Array.from(map.values())
  }, [facultyData?.data, licResponse?.data, extraLecturers])

  const departmentOptions = useMemo(() => {
    const map = new Map<string, Department>()
    ;(departmentsData?.data || []).forEach((d) => map.set(d._id, d))
    if (departmentResponse?.data) map.set(departmentResponse.data._id, departmentResponse.data)
    if (subject?.departmentId && typeof subject.departmentId === 'object') {
      const deptObj = subject.departmentId as Department
      if (deptObj._id) map.set(deptObj._id, deptObj)
    }
    return Array.from(map.values())
  }, [departmentsData?.data, departmentResponse?.data, subject?.departmentId])

  const handleSubmit = (data: CreateSubjectFormData | UpdateSubjectFormData) => {
    isEditMode
      ? (onSubmit as (data: UpdateSubjectFormData) => void)(data as UpdateSubjectFormData)
      : (onSubmit as (data: CreateSubjectFormData) => void)(data as CreateSubjectFormData)
  }

  const isLoadingInitialData =
    isEditMode &&
    (isDepartmentsLoading ||
      isFacultyLoading ||
      (subjectDepartmentId && isDepartmentLoading) ||
      (subjectLicId && isLicLoading) ||
      isLoadingExtraLecturers)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Subject Information</h3>
          {isLoadingInitialData && (
            <div className="text-sm text-muted-foreground">Loading subject data...</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!isEditMode && (
              <FormField
                control={form.control}
                name="subjectCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject Code *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., CS101, MATH201"
                        {...field}
                        className="font-mono uppercase"
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      />
                    </FormControl>
                    <FormDescription>Unique code for the subject (uppercase)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="subjectName"
              render={({ field }) => (
                <FormItem className={!isEditMode ? '' : 'md:col-span-2'}>
                  <FormLabel>Subject Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Data Structures and Algorithms" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="licId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lecturer In Charge (LIC)</FormLabel>
                  <Popover open={licOpen} onOpenChange={setLicOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox" className="w-full justify-between" disabled={Boolean(isFacultyLoading || (isEditMode && subjectLicId && isLicLoading))}>
                        {field.value ? (facultyOptions.find((u) => u._id === field.value)?.fullName || 'Select LIC (optional)') : 'Select LIC (optional)'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search lecturers..." />
                        <CommandEmpty>No lecturer found.</CommandEmpty>
                        <CommandList>
                          {facultyOptions.map((u) => (
                            <CommandItem
                              key={u._id}
                              value={`${u.fullName} ${u.email}`}
                              onSelect={() => {
                                field.onChange(u._id)
                                setLicOpen(false)
                              }}
                            >
                              {u.fullName} ({u.email})
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>Optional lecturer in charge for this subject</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Lecturers</FormLabel>
              <div className="mb-2">
                <Input placeholder="Search lecturers..." value={lecturerQuery} onChange={(e) => setLecturerQuery(e.target.value)} />
              </div>
              <div className="max-h-40 overflow-auto rounded border p-2">
                {isFacultyLoading || isLoadingExtraLecturers ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">Loading lecturers...</div>
                ) : facultyOptions.length > 0 ? (
                  facultyOptions
                    .filter((u) => {
                      const q = lecturerQuery.trim().toLowerCase()
                      if (!q) return true
                      return (
                        u.fullName.toLowerCase().includes(q) ||
                        (u.email || '').toLowerCase().includes(q)
                      )
                    })
                    .map((u) => (
                    <label
                      key={u._id}
                      className="flex items-center space-x-2 py-1 cursor-pointer hover:bg-accent rounded px-2"
                    >
                      <input
                        type="checkbox"
                        checked={watchedLecturerIds?.includes(u._id) ?? false}
                        onChange={(e) => {
                          const current = form.getValues('lecturerIds') || []
                          if (e.target.checked) {
                            form.setValue('lecturerIds', [...current, u._id], { shouldDirty: true })
                          } else {
                            form.setValue(
                              'lecturerIds',
                              current.filter((id: string) => id !== u._id),
                              { shouldDirty: true }
                            )
                          }
                        }}
                        className="cursor-pointer"
                      />
                      <span className="text-sm">
                        {u.fullName} ({u.email})
                      </span>
                    </label>
                    ))
                ) : (
                  <div className="py-6 text-center text-sm text-muted-foreground">No faculty available</div>
                )}
              </div>
              <FormDescription>Assign multiple lecturers to this subject</FormDescription>
            </FormItem>
          </div>

          <FormField
            control={form.control}
            name="departmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? undefined}
                  disabled={Boolean(isDepartmentsLoading || (isEditMode && subjectDepartmentId && isDepartmentLoading))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departmentOptions.length > 0 ? (
                      departmentOptions.map((department) => (
                        <SelectItem key={department._id} value={department._id}>
                          {department.departmentCode} - {department.departmentName}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        {isDepartmentsLoading ? 'Loading departments...' : 'No departments available'}
                      </div>
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>Select the department this subject belongs to</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Academic Year *</FormLabel>
                  <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value?.toString() ?? undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          Year {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Which year is this subject offered in</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="credits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credits *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="3"
                    />
                  </FormControl>
                  <FormDescription>Credit hours for this subject</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter subject description (optional)" className="resize-none" rows={4} {...field} />
                </FormControl>
                <FormDescription>Brief description of the subject content and objectives</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || isLoadingInitialData}>
            {isLoading ? 'Saving...' : isEditMode ? 'Update Subject' : 'Create Subject'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
```

## File: src/features/subjects/hooks/use-subjects-query.ts
```typescript
'use client'

import { useQuery } from '@tanstack/react-query'
import { subjectsService } from './use-subjects'
import type { GetSubjectsParams } from '../types/subjects'
import { useAuth } from '@/lib/auth/auth-provider'

export const useSubjectsQuery = (params?: GetSubjectsParams) => {
  return useQuery({
    queryKey: ['subjects', params],
    queryFn: () => subjectsService.getAll(params),
    staleTime: 30000,
  })
}

export const useSubjectQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: ['subjects', id],
    queryFn: async () => {
      if (!id) throw new Error('Subject ID is required')
      return await subjectsService.getById(id)
    },
    enabled: !!id && id !== 'undefined',
    retry: 1,
  })
}

export const useSubjectStatsQuery = () => {
  return useQuery({
    queryKey: ['subjects', 'stats'],
    queryFn: () => subjectsService.getStats(),
    staleTime: 60000,
  })
}

export const useFacultyAssignmentsQuery = (subjectId: string | undefined, params?: { academicYear?: string; semester?: number }) => {
  return useQuery({
    queryKey: ['subjects', subjectId, 'assignments', params],
    queryFn: async () => {
      if (!subjectId) throw new Error('Subject ID is required')
      return await subjectsService.getFacultyAssignments(subjectId, params)
    },
    enabled: !!subjectId && subjectId !== 'undefined',
    retry: 1,
  })
}

export const useSubjectsByDepartmentQuery = (departmentId: string | undefined) => {
  return useQuery({
    queryKey: ['subjects', 'department', departmentId],
    queryFn: async () => {
      if (!departmentId) throw new Error('Department ID is required')
      return await subjectsService.getByDepartment(departmentId)
    },
    enabled: !!departmentId && departmentId !== 'undefined',
    staleTime: 30000,
  })
}

export const useMySubjectsQuery = (params?: GetSubjectsParams) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['subjects', 'my-subjects', user?._id, params],
    queryFn: async () => {
      if (!user?._id) throw new Error('User not authenticated');

      return await subjectsService.getMySubjects(params, user._id);
    },
    enabled: !!user?._id,
    staleTime: 30000,
  });
};
```

## File: src/features/enrollments/hooks/use-enrollments.ts
```typescript
import { apiClient } from '@/lib/api/client'
import type { 
  StudentEnrollment, 
  CreateEnrollmentDto, 
  UpdateEnrollmentDto, 
  EnrollmentStats, 
  GetEnrollmentsParams,
  AvailableSubject,
  SelfEnrollmentDto
} from '../types/enrollments'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

type BackendEnrollmentsListResponse = {
  enrollments: StudentEnrollment[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const studentEnrollmentsService = {
  getAll: async (params?: GetEnrollmentsParams): Promise<PaginatedResponse<StudentEnrollment>> => {
    const response = await apiClient.get<BackendEnrollmentsListResponse>('/api/v1/student-enrollments', { params })
    return {
      data: response.enrollments || [],
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
      totalPages: response.totalPages || 1
    }
  },

  getById: async (id: string): Promise<ApiResponse<StudentEnrollment>> => {
    const enrollment = await apiClient.get<StudentEnrollment>(`/api/v1/student-enrollments/${id}`)
    return {
      data: enrollment
    }
  },

  getByStudent: async (studentId: string, params?: { academicYear?: string; semester?: number }): Promise<ApiResponse<StudentEnrollment[]>> => {
    const enrollments = await apiClient.get<StudentEnrollment[]>(`/api/v1/student-enrollments/student/${studentId}`, { params })
    return {
      data: Array.isArray(enrollments) ? enrollments : []
    }
  },


getMyEnrollments: async (params?: GetEnrollmentsParams): Promise<PaginatedResponse<StudentEnrollment>> => {
  // The backend may return either a paginated object or a plain array for
  // the "my-enrollments" endpoint. Accept both shapes and normalize to the
  // PaginatedResponse expected by the UI.
  const response = await apiClient.get<BackendEnrollmentsListResponse | StudentEnrollment[]>(
    '/api/v1/student-enrollments/my-enrollments',
    { params }
  );

  // If the backend returned a plain array, wrap it into the paginated shape.
  if (Array.isArray(response)) {
    return {
      data: response || [],
      total: response.length || 0,
      page: 1,
      limit: response.length || 10,
      totalPages: 1,
    };
  }

  // Otherwise assume the paginated shape.
  return {
    data: response.enrollments || [],
    total: response.total || 0,
    page: response.page || 1,
    limit: response.limit || 10,
    totalPages: response.totalPages || 1,
  };
},
  getBySubject: async (subjectId: string, params?: { academicYear?: string; semester?: number }): Promise<ApiResponse<StudentEnrollment[]>> => {
    const enrollments = await apiClient.get<StudentEnrollment[]>(`/api/v1/student-enrollments/subject/${subjectId}`, { params })
    return {
      data: Array.isArray(enrollments) ? enrollments : []
    }
  },

  getStats: (): Promise<ApiResponse<EnrollmentStats>> =>
    apiClient.get('/api/v1/student-enrollments/stats'),


  getAvailableSubjects: async (academicYear: string, semester: number): Promise<ApiResponse<AvailableSubject[]>> => {
    const subjects = await apiClient.get<AvailableSubject[]>('/api/v1/student-enrollments/available-subjects', {
      params: { academicYear, semester }
    })
    return {
      data: Array.isArray(subjects) ? subjects : []
    }
  },

  create: async (data: CreateEnrollmentDto): Promise<ApiResponse<StudentEnrollment>> => {
    const enrollment = await apiClient.post<StudentEnrollment>('/api/v1/student-enrollments', data)
    return {
      data: enrollment
    }
  },


  selfEnroll: async (data: SelfEnrollmentDto): Promise<ApiResponse<StudentEnrollment>> => {
    const enrollment = await apiClient.post<StudentEnrollment>('/api/v1/student-enrollments/self-enroll', data)
    return {
      data: enrollment
    }
  },

  update: async (id: string, data: UpdateEnrollmentDto): Promise<ApiResponse<StudentEnrollment>> => {
    const enrollment = await apiClient.patch<StudentEnrollment>(`/api/v1/student-enrollments/${id}`, data)
    return {
      data: enrollment
    }
  },

  withdraw: async (id: string, reason?: string): Promise<ApiResponse<StudentEnrollment>> => {
    const enrollment = await apiClient.patch<StudentEnrollment>(`/api/v1/student-enrollments/${id}/withdraw`, { reason })
    return {
      data: enrollment
    }
  },

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/student-enrollments/${id}`)
}
```

## File: src/features/subjects/hooks/use-subjects.ts
```typescript
import { apiClient } from '@/lib/api/client'
import type { 
  Subject, 
  CreateSubjectDto, 
  UpdateSubjectDto, 
  AssignFacultyDto,
  FacultyAssignment,
  SubjectStats, 
  GetSubjectsParams 
} from '../types/subjects'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

type BackendSubjectsListResponse = {
  subjects: RawSubject[]
  total: number
  page: number
  limit: number
  totalPages: number
}

type RawSubject = Omit<Subject, 'departmentId' | 'departmentName'> & {
  departmentId: string | { _id: string; departmentCode: string; departmentName: string }
}

const extractDepartmentName = (departmentId: RawSubject['departmentId']): string | undefined => {
  if (!departmentId) return undefined
  
  if (typeof departmentId === 'object' && '_id' in departmentId) {
    return departmentId.departmentName
  }
  
  if (typeof departmentId === 'string' && departmentId.includes('departmentName')) {
    try {
      const match = departmentId.match(/departmentName:\s*'([^']+)'/)
      if (match?.[1]) return match[1]
    } catch {
      return undefined
    }
  }
  
  return undefined
}

const extractDepartmentId = (departmentId: RawSubject['departmentId']): string | undefined => {
  if (!departmentId) return undefined
  
  if (typeof departmentId === 'string' && !departmentId.includes('{')) {
    return departmentId
  }
  
  if (typeof departmentId === 'object' && '_id' in departmentId) {
    return departmentId._id
  }
  
  if (typeof departmentId === 'string' && departmentId.includes('ObjectId')) {
    try {
      const match = departmentId.match(/ObjectId\('([^']+)'\)/)
      if (match?.[1]) return match[1]
    } catch {
      return undefined
    }
  }
  
  return undefined
}

const transformSubject = (subj: RawSubject): Subject => {
  const departmentId = extractDepartmentId(subj.departmentId)
  const departmentName = (subj as Record<string, unknown>).departmentName as string | undefined || extractDepartmentName(subj.departmentId)
  
  let licId: string | undefined = undefined
  let licName: string | undefined = undefined
  
  if (subj['licId']) {
    const lic = subj['licId'] as Record<string, unknown>
    if (typeof lic === 'string') {
      licId = lic
    } else if (lic?._id) {
      licId = lic._id as string
      licName = lic.fullName as string
    }
  }
  
  if (!licName && (subj as Record<string, unknown>).licName) {
    licName = (subj as Record<string, unknown>).licName as string
  }

  let lecturerIds: string[] | undefined = undefined
  let lecturers: { _id: string; fullName: string }[] | undefined = undefined
  
  if (Array.isArray(subj['lecturerIds'])) {
    const arr = subj['lecturerIds'] as Record<string, unknown>[]
    lecturerIds = arr.map((x) => (x?._id ? String(x._id) : String(x)))
    
    if (arr.length > 0 && arr[0]?._id) {
      lecturers = arr.map((x) => ({ 
        _id: String(x._id), 
        fullName: x.fullName as string 
      }))
    } else if ((subj as Record<string, unknown>).lecturers && Array.isArray((subj as Record<string, unknown>).lecturers)) {
      const subjLecturers = (subj as Record<string, unknown>).lecturers as Record<string, unknown>[]
      lecturers = subjLecturers.map((x) => ({ 
        _id: x._id?.toString() ?? String(x._id), 
        fullName: x.fullName as string 
      }))
    }
  }

  return {
    ...subj,
    departmentId: departmentId || '',
    departmentName,
    licId,
    licName,
    lecturerIds,
    lecturers
  }
}

export const subjectsService = {
  getAll: async (params?: GetSubjectsParams): Promise<PaginatedResponse<Subject>> => {
    const response = await apiClient.get<BackendSubjectsListResponse>('/api/v1/subjects', { params })
    return {
      data: (response.subjects || []).map(transformSubject),
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
      totalPages: response.totalPages || 1
    }
  },

  getById: async (id: string): Promise<ApiResponse<Subject>> => {
    const subject = await apiClient.get<RawSubject>(`/api/v1/subjects/${id}`)
    return {
      data: transformSubject(subject)
    }
  },

  getByDepartment: async (departmentId: string): Promise<ApiResponse<Subject[]>> => {
    const subjects = await apiClient.get<RawSubject[]>(`/api/v1/subjects/department/${departmentId}`)
    return {
      data: Array.isArray(subjects) ? subjects.map(transformSubject) : []
    }
  },

  getStats: (): Promise<ApiResponse<SubjectStats>> =>
    apiClient.get('/api/v1/subjects/stats'),

  create: async (data: CreateSubjectDto): Promise<ApiResponse<Subject>> => {
    const subject = await apiClient.post<RawSubject>('/api/v1/subjects', data)
    return {
      data: transformSubject(subject)
    }
  },

  update: async (id: string, data: UpdateSubjectDto): Promise<ApiResponse<Subject>> => {
    const subject = await apiClient.patch<RawSubject>(`/api/v1/subjects/${id}`, data)
    return {
      data: transformSubject(subject)
    }
  },

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/subjects/${id}`),

  assignFaculty: (id: string, data: AssignFacultyDto): Promise<ApiResponse<FacultyAssignment>> =>
    apiClient.post(`/api/v1/subjects/${id}/assign-faculty`, data),

  getFacultyAssignments: (id: string, params?: { academicYear?: string; semester?: number }): Promise<ApiResponse<FacultyAssignment[]>> =>
    apiClient.get(`/api/v1/subjects/${id}/faculty`, { params }),

  getMyAssignments: (params?: { academicYear?: string; semester?: number }): Promise<ApiResponse<FacultyAssignment[]>> =>
    apiClient.get('/api/v1/subjects/my', { params }),

  getMySubjects: async (params?: GetSubjectsParams, userId?: string): Promise<PaginatedResponse<Subject>> => {
    const resp = await apiClient.get<FacultyAssignment[]>('/api/v1/subjects/my')
    const assignments = Array.isArray(resp) ? resp : []

    let subjects: Subject[] = []
    
    if (assignments.length === 0 && userId) {
      const all = await apiClient.get<BackendSubjectsListResponse>('/api/v1/subjects', { 
        params: { page: 1, limit: 2000 } 
      })
      const rawSubjects = Array.isArray(all.subjects) ? all.subjects : []
      subjects = rawSubjects.map(transformSubject).filter((s) => {
        if (s.licId && s.licId === userId) return true
        if (Array.isArray(s.lecturerIds) && s.lecturerIds.includes(userId)) return true
        return false
      })
    } else {
      subjects = assignments.map((a: Record<string, unknown>) => {
        const s = (a.subjectId || {}) as Record<string, unknown>
        const raw: RawSubject = {
          _id: (s._id ?? s.subjectId ?? '') as string,
          subjectCode: (s.subjectCode ?? '') as string,
          subjectName: (s.subjectName ?? '') as string,
          departmentId: (s.departmentId && (typeof s.departmentId === 'string' || (s.departmentId as Record<string, unknown>)._id)) 
            ? s.departmentId as RawSubject['departmentId']
            : '',
          year: (s.year ?? 0) as number,
          credits: (s.credits ?? 0) as number,
          description: s.description as string | undefined,
          isActive: (s.isActive ?? true) as boolean,
          createdAt: (s.createdAt ?? new Date().toISOString()) as string,
          updatedAt: (s.updatedAt ?? new Date().toISOString()) as string,
        }
        return transformSubject(raw)
      })
    }

    const page = params?.page ?? 1
    const limit = params?.limit ?? 10
    const total = subjects.length
    const totalPages = Math.max(1, Math.ceil(total / limit))
    const start = (page - 1) * limit
    const paged = subjects.slice(start, start + limit)

    return {
      data: paged,
      total,
      page,
      limit,
      totalPages,
    }
  },

  removeFacultyAssignment: (assignmentId: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/subjects/faculty-assignment/${assignmentId}`)
}
```
