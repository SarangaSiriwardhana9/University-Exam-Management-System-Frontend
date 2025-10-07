 

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
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createSubjectSchema, updateSubjectSchema, type CreateSubjectFormData, type UpdateSubjectFormData } from '../validations/subject-schemas'
import type { Subject } from '../types/subjects'
import { useDepartmentsQuery } from '@/features/departments/hooks/use-departments-query'

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

  // Fetch departments for dropdown
  const { data: departmentsData } = useDepartmentsQuery({ isActive: true })

  const form = useForm<CreateSubjectFormData | UpdateSubjectFormData>({
    resolver: zodResolver(isEditMode ? updateSubjectSchema : createSubjectSchema) as any,
    defaultValues: isEditMode ? {
      subjectName: '',
      departmentId: '',
      year: 1,
      credits: 3,
      description: ''
    } : {
      subjectCode: '',
      subjectName: '',
      departmentId: '',
      year: 1,
      credits: 3,
      description: ''
    }
  })

  useEffect(() => {
    if (subject) {
      form.reset({
        subjectName: subject.subjectName,
        departmentId: subject.departmentId,
        year: subject.year,
        credits: subject.credits,
        description: subject.description || ''
      })
    }
  }, [subject, form])

  const handleSubmit = (data: CreateSubjectFormData | UpdateSubjectFormData) => {
    if (isEditMode) {
      (onSubmit as (data: UpdateSubjectFormData) => void)(data as UpdateSubjectFormData)
    } else {
      (onSubmit as (data: CreateSubjectFormData) => void)(data as CreateSubjectFormData)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Subject Information</h3>
          
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
                    <FormDescription>
                      Unique code for the subject (uppercase)
                    </FormDescription>
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

          <FormField
            control={form.control}
            name="departmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || undefined}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departmentsData?.data && departmentsData.data.length > 0 ? (
                      departmentsData.data.map((department) => (
                        <SelectItem key={department._id} value={department._id}>
                          {department.departmentCode} - {department.departmentName}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        No departments available
                      </div>
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the department this subject belongs to
                </FormDescription>
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
                  <Select 
                    onValueChange={(value) => field.onChange(Number(value))} 
                    value={field.value?.toString()}
                  >
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
                  <FormDescription>
                    Which year is this subject offered in
                  </FormDescription>
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
                      placeholder="3" 
                      min="0" 
                      max="10" 
                      step="0.5"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormDescription>
                    Credit hours for this subject
                  </FormDescription>
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
                  <Textarea 
                    placeholder="Enter subject description (optional)" 
                    className="resize-none"
                    rows={4}
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Brief description of the subject content and objectives
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : isEditMode ? 'Update Subject' : 'Create Subject'}
          </Button>
        </div>
      </form>
    </Form>
  )
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
}

export type CreateSubjectDto = {
  subjectCode: string
  subjectName: string
  departmentId: string
  year: number
  credits?: number
  description?: string
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
})

export const updateSubjectSchema = createSubjectSchema.partial().omit({ subjectCode: true }).extend({
  isActive: z.boolean().optional()
})

export type CreateSubjectFormData = z.infer<typeof createSubjectSchema>
export type UpdateSubjectFormData = z.infer<typeof updateSubjectSchema>
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


export const useMyEnrollmentsQuery = (params?: { academicYear?: string; semester?: number; status?: string }) => {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['enrollments', 'my-enrollments', user?._id, params],
    queryFn: async () => {
      if (!user?._id) throw new Error('User not authenticated')
      return await studentEnrollmentsService.getMyEnrollments(params)
    },
    enabled: !!user?._id,
    staleTime: 30000,
  })
}

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

export const useMySubjectsQuery = () => {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['subjects', 'my-subjects', user?._id],
    queryFn: async () => {
      if (!user?._id) throw new Error('User not authenticated')
      // Since backend doesn't support facultyId filter,
      // we'll get all active subjects and let faculty manage any they're assigned to
      return await subjectsService.getAll({ isActive: true })
    },
    enabled: !!user?._id,
    staleTime: 30000,
  })
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
  subjects: Subject[]
  total: number
  page: number
  limit: number
  totalPages: number
}

type RawSubject = Omit<Subject, 'departmentId' | 'departmentName'> & {
  departmentId: string | { _id: string; departmentCode: string; departmentName: string }
}

// Helper function to extract department name
const extractDepartmentName = (departmentId: RawSubject['departmentId']): string | undefined => {
  if (!departmentId) return undefined
  
  // If it's already an object
  if (typeof departmentId === 'object' && '_id' in departmentId) {
    return departmentId.departmentName
  }
  
  // If it's a stringified object (malformed backend response)
  if (typeof departmentId === 'string' && departmentId.includes('departmentName')) {
    try {
      // Try to extract the departmentName from the string
      const match = departmentId.match(/departmentName:\s*'([^']+)'/)
      if (match && match[1]) {
        return match[1]
      }
    } catch (error) {
      console.error('Failed to parse departmentId:', error)
    }
  }
  
  return undefined
}

// Helper function to extract department ID
const extractDepartmentId = (departmentId: RawSubject['departmentId']): string | undefined => {
  if (!departmentId) return undefined
  
  // If it's a string ID
  if (typeof departmentId === 'string' && !departmentId.includes('{')) {
    return departmentId
  }
  
  // If it's an object
  if (typeof departmentId === 'object' && '_id' in departmentId) {
    return departmentId._id
  }
  
  // If it's a stringified object
  if (typeof departmentId === 'string' && departmentId.includes('ObjectId')) {
    try {
      const match = departmentId.match(/ObjectId\('([^']+)'\)/)
      if (match && match[1]) {
        return match[1]
      }
    } catch (error) {
      console.error('Failed to parse departmentId:', error)
    }
  }
  
  return undefined
}

// Transform subject to normalize the data
const transformSubject = (subj: RawSubject): Subject => {
  const departmentId = extractDepartmentId(subj.departmentId)
  const departmentName = extractDepartmentName(subj.departmentId)
  
  return {
    ...subj,
    departmentId: departmentId || '',
    departmentName: departmentName
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

  removeFacultyAssignment: (assignmentId: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/subjects/faculty-assignment/${assignmentId}`)
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


  getMyEnrollments: async (params?: { academicYear?: string; semester?: number; status?: string }): Promise<ApiResponse<StudentEnrollment[]>> => {
    const enrollments = await apiClient.get<StudentEnrollment[]>('/api/v1/student-enrollments/my-enrollments', { params })
    return {
      data: Array.isArray(enrollments) ? enrollments : []
    }
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
