 
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
    accessorKey: 'year',
    header: 'Year',
    cell: ({ row }) => (
      <Badge variant="outline">Year {row.original.year}</Badge>
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