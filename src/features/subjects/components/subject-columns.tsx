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