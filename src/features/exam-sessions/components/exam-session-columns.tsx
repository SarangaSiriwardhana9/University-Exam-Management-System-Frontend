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
    scheduled: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-orange-100 text-orange-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
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

const getSessionTimeStatus = (session: ExamSession) => {
  const now = new Date()
  const startTime = new Date(session.startTime)
  const endTime = new Date(session.endTime)

  if (session.status === 'cancelled') {
    return { label: 'Cancelled', variant: 'destructive' as const, color: 'text-red-600' }
  }

  if (session.status === 'completed') {
    return { label: 'Completed', variant: 'default' as const, color: 'text-green-600' }
  }

  if (endTime < now) {
    return { label: 'Expired', variant: 'outline' as const, color: 'text-gray-700' }
  }

  if (startTime <= now && endTime >= now) {
    return { label: 'Ongoing', variant: 'default' as const, color: 'text-orange-600' }
  }

  if (startTime > now) {
    return { label: 'Upcoming', variant: 'outline' as const, color: 'text-blue-600' }
  }

  return { label: 'Scheduled', variant: 'outline' as const, color: 'text-blue-600' }
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
    header: 'Schedule',
    cell: ({ row }) => {
      const session = row.original
      const startTime = new Date(session.startTime)
      const endTime = new Date(session.endTime)
      
      return (
        <div className="text-sm">
          <div className="font-medium">
            {startTime.toLocaleDateString()}
          </div>
          <div className="text-muted-foreground">
            {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-xs text-muted-foreground">
            ({formatDuration(session.durationMinutes)})
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
      const session = row.original
      const timeStatus = getSessionTimeStatus(session)
      
      // If cancelled or completed, only show one badge
      if (session.status === 'cancelled' || session.status === 'completed') {
        return (
          <Badge variant="outline" className={cn('font-medium', getStatusBadgeClass(session.status))}>
            {formatStatus(session.status)}
          </Badge>
        )
      }
      
      return (
        <div className="flex flex-col gap-1">
          <Badge variant="outline" className={cn('font-medium', getStatusBadgeClass(session.status))}>
            {formatStatus(session.status)}
          </Badge>
          <Badge variant={timeStatus.variant} className={cn('text-xs font-medium', timeStatus.color)}>
            {timeStatus.label}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: 'year',
    header: 'Academic Year',
    cell: ({ row }) => {
      const session = row.original
      return (
        <div className="text-sm">
          <div>{session.year}</div>
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