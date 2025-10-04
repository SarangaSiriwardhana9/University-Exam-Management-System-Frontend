'use client'

import { useQuery } from '@tanstack/react-query'
import { roomsService } from './use-rooms'
import type { GetRoomsParams } from '../types/rooms'

export const useRoomsQuery = (params?: GetRoomsParams) => {
  return useQuery({
    queryKey: ['rooms', params],
    queryFn: () => roomsService.getAll(params),
    staleTime: 30000,  
  })
}

export const useRoomQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: ['rooms', id],
    queryFn: async () => {
      if (!id) throw new Error('Room ID is required')
      console.log('Fetching room with ID:', id)
      const result = await roomsService.getById(id)
      console.log('Room fetch result:', result)
      return result
    },
    enabled: !!id && id !== 'undefined',
    retry: 1,
  })
}

export const useBuildingsQuery = () => {
  return useQuery({
    queryKey: ['buildings'],
    queryFn: () => roomsService.getBuildingsList(),
    staleTime: 60000, // Buildings don't change often
  })
}