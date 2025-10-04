'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { roomsService } from './use-rooms'
import type { CreateRoomDto, UpdateRoomDto } from '../types/rooms'
import type { ApiError } from '@/types/common'
import { toast } from 'sonner'

export const useCreateRoom = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateRoomDto) => roomsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      toast.success('Room Created', {
        description: 'Room has been created successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Create Room', {
        description: error.message || 'An error occurred while creating the room.'
      })
    }
  })
}

export const useUpdateRoom = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoomDto }) =>
      roomsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      toast.success('Room Updated', {
        description: 'Room has been updated successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Update Room', {
        description: error.message || 'An error occurred while updating the room.'
      })
    }
  })
}

export const useDeleteRoom = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => roomsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      toast.success('Room Deleted', {
        description: 'Room has been deleted successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Delete Room', {
        description: error.message || 'An error occurred while deleting the room.'
      })
    }
  })
}