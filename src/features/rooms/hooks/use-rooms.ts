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

export const roomsService = {
  getAll: (params?: GetRoomsParams): Promise<PaginatedResponse<Room>> =>
    apiClient.get('/api/v1/rooms', { params }),

  getById: (id: string): Promise<ApiResponse<Room>> =>
    apiClient.get(`/api/v1/rooms/${id}`),

  getByBuilding: (building: string): Promise<ApiResponse<Room[]>> =>
    apiClient.get(`/api/v1/rooms/building/${encodeURIComponent(building)}`),

  getBuildingsList: (): Promise<ApiResponse<{ buildings: string[] }>> =>
    apiClient.get('/api/v1/rooms/buildings'),

  getStats: (): Promise<ApiResponse<RoomStats>> =>
    apiClient.get('/api/v1/rooms/stats'),

  getCapacityDistribution: (): Promise<ApiResponse<Record<string, number>>> =>
    apiClient.get('/api/v1/rooms/capacity-distribution'),

  checkAvailability: (params: CheckAvailabilityParams): Promise<ApiResponse<RoomAvailability[]>> =>
    apiClient.get('/api/v1/rooms/availability', { params }),

  create: (data: CreateRoomDto): Promise<ApiResponse<Room>> =>
    apiClient.post('/api/v1/rooms', data),

  update: (id: string, data: UpdateRoomDto): Promise<ApiResponse<Room>> =>
    apiClient.patch(`/api/v1/rooms/${id}`, data),

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/rooms/${id}`)
}