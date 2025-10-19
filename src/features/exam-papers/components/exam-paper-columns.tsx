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
import { MoreHorizontalIcon, EditIcon, TrashIcon, EyeIcon, CopyIcon, LockIcon, LayersIcon, PowerIcon } from 'lucide-react'
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
  onToggleActive: (paper: ExamPaper) => void
}

export const getExamPaperColumns = ({ 
  onEdit, 
  onDelete, 
  onView, 
  onDuplicate,
  onFinalize,
  onToggleActive
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
            <DropdownMenuItem onClick={() => onEdit(paper)}>
              <EditIcon className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
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
            <DropdownMenuItem onClick={() => onToggleActive(paper)}>
              <PowerIcon className="mr-2 h-4 w-4" />
              {paper.isActive ? 'Deactivate' : 'Activate'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(paper)}
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