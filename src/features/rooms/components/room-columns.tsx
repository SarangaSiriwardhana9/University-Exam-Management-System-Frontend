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
import type { Room } from '../types/rooms'
import { cn } from '@/lib/utils'

type RoomColumnsProps = {
  onEdit: (room: Room) => void
  onDelete: (room: Room) => void
  onView: (room: Room) => void
}

export const getRoomColumns = ({ onEdit, onDelete, onView }: RoomColumnsProps): ColumnDef<Room>[] => [
  {
    accessorKey: 'fullRoomNumber',
    header: 'Room',
    cell: ({ row }) => {
      const room = row.original
      return (
        <div>
          <div className="font-medium">{room.fullRoomNumber}</div>
          {room.building && (
            <div className="text-sm text-muted-foreground">{room.building}</div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'capacity',
    header: 'Capacity',
    cell: ({ row }) => {
      const room = row.original
      return (
        <div className="text-center">
          <div className="font-medium">{room.capacity}</div>
          <div className="text-xs text-muted-foreground">
            Exam: {room.examCapacity}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'floorNumber',
    header: 'Floor',
    cell: ({ row }) => {
      const floor = row.original.floorNumber
      return floor !== undefined ? `Floor ${floor}` : '—'
    },
  },
  {
    accessorKey: 'isAccessible',
    header: 'Accessible',
    cell: ({ row }) => {
      const isAccessible = row.original.isAccessible
      return isAccessible ? (
        <CheckCircleIcon className="h-5 w-5 text-green-600" />
      ) : (
        <XCircleIcon className="h-5 w-5 text-gray-400" />
      )
    },
  },
  {
    id: 'facilities',
    header: 'Facilities',
    cell: ({ row }) => {
      const facilities = row.original.facilities
      if (!facilities) return '—'
      
      const facilityList = []
      if (facilities.airConditioned) facilityList.push('AC')
      if (facilities.projector) facilityList.push('Projector')
      if (facilities.wifi) facilityList.push('WiFi')
      
      return facilityList.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {facilityList.slice(0, 2).map(facility => (
            <Badge key={facility} variant="secondary" className="text-xs">
              {facility}
            </Badge>
          ))}
          {facilityList.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{facilityList.length - 2}
            </Badge>
          )}
        </div>
      ) : '—'
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
      const room = row.original

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
            <DropdownMenuItem onClick={() => onView(room)}>
              <EyeIcon className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(room)}>
              <EditIcon className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(room)}
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