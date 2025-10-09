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