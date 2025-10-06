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
import { MoreHorizontalIcon, EditIcon, TrashIcon, EyeIcon, StarIcon } from 'lucide-react'
import type { AcademicCalendar } from '../types/calendar'
import { cn } from '@/lib/utils'

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const getDuration = (startDate: string, endDate: string) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return `${diffDays} days`
}

type CalendarColumnsProps = {
  onEdit: (calendar: AcademicCalendar) => void
  onDelete: (calendar: AcademicCalendar) => void
  onView: (calendar: AcademicCalendar) => void
  onSetCurrent: (calendar: AcademicCalendar) => void
}

export const getCalendarColumns = ({ 
  onEdit, 
  onDelete, 
  onView, 
  onSetCurrent 
}: CalendarColumnsProps): ColumnDef<AcademicCalendar>[] => [
  {
    accessorKey: 'academicYear',
    header: 'Academic Year',
    cell: ({ row }) => {
      const calendar = row.original
      return (
        <div className="flex items-center space-x-2">
          <div>
            <div className="font-medium">{calendar.academicYear}</div>
            <div className="text-sm text-muted-foreground">
              {calendar.semesterName || `Semester ${calendar.semester}`}
            </div>
          </div>
          {calendar.isCurrent && (
            <StarIcon className="h-4 w-4 text-yellow-500 fill-current" />
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'semester',
    header: 'Semester',
    cell: ({ row }) => {
      const semester = row.original.semester
      return (
        <Badge variant="outline" className="font-medium">
          Semester {semester}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'semesterDuration',
    header: 'Semester Period',
    cell: ({ row }) => {
      const calendar = row.original
      return (
        <div className="text-sm">
          <div className="font-medium">
            {formatDate(calendar.semesterStart)} - {formatDate(calendar.semesterEnd)}
          </div>
          <div className="text-muted-foreground">
            {getDuration(calendar.semesterStart, calendar.semesterEnd)}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'examPeriod',
    header: 'Exam Period',
    cell: ({ row }) => {
      const calendar = row.original
      return (
        <div className="text-sm">
          <div className="font-medium">
            {formatDate(calendar.examStart)} - {formatDate(calendar.examEnd)}
          </div>
          <div className="text-muted-foreground">
            {getDuration(calendar.examStart, calendar.examEnd)}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'resultPublishDate',
    header: 'Result Date',
    cell: ({ row }) => {
      const resultDate = row.original.resultPublishDate
      return (
        <div className="text-sm">
          {resultDate ? formatDate(resultDate) : '—'}
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const calendar = row.original
      const isActive = calendar.isActive
      const isCurrent = calendar.isCurrent
      
      if (isCurrent) {
        return (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
            Current
          </Badge>
        )
      }
      
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
      const calendar = row.original
      const canSetCurrent = !calendar.isCurrent && calendar.isActive

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
            <DropdownMenuItem onClick={() => onView(calendar)}>
              <EyeIcon className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(calendar)}>
              <EditIcon className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            {canSetCurrent && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onSetCurrent(calendar)}
                  className="text-blue-600 focus:text-blue-600"
                >
                  <StarIcon className="mr-2 h-4 w-4" />
                  Set as Current
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(calendar)}
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