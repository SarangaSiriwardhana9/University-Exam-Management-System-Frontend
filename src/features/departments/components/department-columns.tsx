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
import { MoreHorizontalIcon, EditIcon, TrashIcon, EyeIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react'
import type { Department } from '../types/departments'

type DepartmentColumnsProps = {
  onEdit: (department: Department) => void
  onDelete: (department: Department) => void
  onView: (department: Department) => void
  onToggleActive: (department: Department) => void
}

export const getDepartmentColumns = ({ onEdit, onDelete, onView, onToggleActive }: DepartmentColumnsProps): ColumnDef<Department>[] => [
  {
    accessorKey: 'departmentCode',
    header: 'Code',
    cell: ({ row }) => (
      <div className="font-mono font-semibold text-primary">
        {row.original.departmentCode}
      </div>
    ),
  },
  {
    accessorKey: 'departmentName',
    header: 'Department Name',
    cell: ({ row }) => (
      <div className="font-medium">{row.original.departmentName}</div>
    ),
  },
  {
    accessorKey: 'headOfDepartmentName',
    header: 'Head of Department',
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.original.headOfDepartmentName || '—'}
      </div>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const description = row.original.description
      return (
        <div className="max-w-md truncate text-muted-foreground">
          {description || '—'}
        </div>
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
      const department = row.original

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
            <DropdownMenuItem onClick={() => onView(department)}>
              <EyeIcon className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(department)}>
              <EditIcon className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleActive(department)}>
              {department.isActive ? (
                <>
                  <XCircleIcon className="mr-2 h-4 w-4" />
                  Mark as Inactive
                </>
              ) : (
                <>
                  <CheckCircleIcon className="mr-2 h-4 w-4" />
                  Mark as Active
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(department)}
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