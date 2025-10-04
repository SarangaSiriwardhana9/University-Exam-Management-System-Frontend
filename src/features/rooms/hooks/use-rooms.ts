import { apiClient } from '@/lib/api/client'
import type { 
  Room, 
  CreateRoomDto, 
  UpdateRoomDto, 
  RoomStats, 
  CheckAvailabilityParams,
  RoomAvailability,
  GetRoomsParams 
} from '../types/rooms'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

 
type BackendRoomsListResponse = {
  rooms: Room[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const roomsService = {
  getAll: async (params?: GetRoomsParams): Promise<PaginatedResponse<Room>> => {
    const response = await apiClient.get<BackendRoomsListResponse>('/api/v1/rooms', { params })
    return {
      data: response.rooms || [],
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
      totalPages: response.totalPages || 1
    }
  },

  getById: async (id: string): Promise<ApiResponse<Room>> => {
    const room = await apiClient.get<Room>(`/api/v1/rooms/${id}`)
    return {
      data: room
    }
  },

  getByBuilding: async (building: string): Promise<ApiResponse<Room[]>> => {
    const rooms = await apiClient.get<Room[]>(`/api/v1/rooms/building/${encodeURIComponent(building)}`)
    return {
      data: rooms
    }
  },

  getBuildingsList: (): Promise<ApiResponse<{ buildings: string[] }>> =>
    apiClient.get('/api/v1/rooms/buildings'),

  getStats: (): Promise<ApiResponse<RoomStats>> =>
    apiClient.get('/api/v1/rooms/stats'),

  getCapacityDistribution: (): Promise<ApiResponse<Record<string, number>>> =>
    apiClient.get('/api/v1/rooms/capacity-distribution'),

  checkAvailability: (params: CheckAvailabilityParams): Promise<ApiResponse<RoomAvailability[]>> =>
    apiClient.get('/api/v1/rooms/availability', { params }),

  create: async (data: CreateRoomDto): Promise<ApiResponse<Room>> => {
    const room = await apiClient.post<Room>('/api/v1/rooms', data)
    return {
      data: room
    }
  },

  update: async (id: string, data: UpdateRoomDto): Promise<ApiResponse<Room>> => {
    const room = await apiClient.patch<Room>(`/api/v1/rooms/${id}`, data)
    return {
      data: room
    }
  },

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/rooms/${id}`)
}