 
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