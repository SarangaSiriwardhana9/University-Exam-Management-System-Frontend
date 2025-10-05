 
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