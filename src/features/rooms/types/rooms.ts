export type Room = {
  _id: string
  roomNumber: string
  building?: string
  fullRoomNumber: string
  floorNumber?: number
  capacity: number
  examCapacity: number
  capacityRatio: number
  facilities?: RoomFacilities
  equipment?: RoomEquipment
  isAccessible: boolean
  isActive: boolean
  description?: string
  createdAt: string
  updatedAt: string
}

export type RoomFacilities = {
  airConditioned?: boolean
  projector?: boolean
  whiteboard?: boolean
  smartBoard?: boolean
  soundSystem?: boolean
  wifi?: boolean
  powerOutlets?: number
}

export type RoomEquipment = {
  tables?: number
  chairs?: number
  computers?: number
  printers?: number
}

export type CreateRoomDto = {
  roomNumber: string
  building?: string
  floorNumber?: number
  capacity: number
  examCapacity: number
  facilities?: RoomFacilities
  equipment?: RoomEquipment
  isAccessible?: boolean
  description?: string
}

export type UpdateRoomDto = Partial<CreateRoomDto> & {
  isActive?: boolean
}

export type RoomStats = {
  totalRooms: number
  roomsByBuilding: Record<string, number>
  averageCapacity: number
  accessibleRooms: number
}

export type CheckAvailabilityParams = {
  date: string
  startTime: string
  endTime: string
  minCapacity?: number
  excludeRoomId?: string
}

export type RoomAvailability = {
  roomId: string
  roomNumber: string
  building?: string
  capacity: number
  isAvailable: boolean
  conflictingSessions?: Array<{
    id: string
    title: string
    startTime: string
    endTime: string
  }>
}

export type GetRoomsParams = {
  building?: string
  minCapacity?: number
  maxCapacity?: number
  isAccessible?: boolean
  isActive?: boolean
  hasFacility?: string
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}