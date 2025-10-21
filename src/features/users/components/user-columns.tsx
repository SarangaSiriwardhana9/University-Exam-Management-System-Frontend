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
import type { User } from '../types/users'
import { cn } from '@/lib/utils'
import type { UserRole } from '@/constants/roles'

const ROLE_BADGE_CLASSES: Record<UserRole, string> = {
  admin: 'bg-blue-100 text-blue-700',
  faculty: 'bg-purple-100 text-purple-700',
  student: 'bg-green-100 text-green-700',
  exam_coordinator: 'bg-orange-100 text-orange-700',
  invigilator: 'bg-indigo-100 text-indigo-700'
}

const getRoleBadgeClass = (role: UserRole) => ROLE_BADGE_CLASSES[role] || 'bg-muted'

const formatRole = (role: string) => role.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())

type UserColumnsProps = {
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  onView: (user: User) => void
}

export const getUserColumns = ({ onEdit, onDelete, onView }: UserColumnsProps): ColumnDef<User>[] => [
  {
    accessorKey: 'fullName',
    header: 'Full Name',
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
            {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div>
            <div className="font-medium">{user.fullName}</div>
            <div className="text-sm text-muted-foreground">@{user.username}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.original.role
      return (
        <Badge variant="outline" className={cn('font-medium', getRoleBadgeClass(role))}>
          {formatRole(role)}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'contactPrimary',
    header: 'Phone',
    cell: ({ row }) => row.original.contactPrimary || '—',
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
      const user = row.original

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
            <DropdownMenuItem onClick={() => onView(user)}>
              <EyeIcon className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(user)}>
              <EditIcon className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(user)}
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