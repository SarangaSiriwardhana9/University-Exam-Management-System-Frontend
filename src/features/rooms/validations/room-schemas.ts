import { z } from 'zod'

const roomFacilitiesSchema = z.object({
  airConditioned: z.boolean().optional(),
  projector: z.boolean().optional(),
  whiteboard: z.boolean().optional(),
  smartBoard: z.boolean().optional(),
  soundSystem: z.boolean().optional(),
  wifi: z.boolean().optional(),
  powerOutlets: z.number().min(0).optional()
}).optional()

const roomEquipmentSchema = z.object({
  tables: z.number().min(0).optional(),
  chairs: z.number().min(0).optional(),
  computers: z.number().min(0).optional(),
  printers: z.number().min(0).optional()
}).optional()

export const createRoomSchema = z.object({
  roomNumber: z.string().min(1, 'Room number is required'),
  building: z.string().optional(),
  floorNumber: z.number().min(0, 'Floor number must be 0 or greater').optional(),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  examCapacity: z.number().min(1, 'Exam capacity must be at least 1'),
  facilities: roomFacilitiesSchema,
  equipment: roomEquipmentSchema,
  isLab: z.boolean().optional(),
  isAccessible: z.boolean().optional(),
  description: z.string().optional()
}).refine((data) => data.examCapacity <= data.capacity, {
  message: 'Exam capacity cannot exceed total capacity',
  path: ['examCapacity']
})

export const updateRoomSchema = createRoomSchema.partial().extend({
  isActive: z.boolean().optional()
})

export type CreateRoomFormData = z.infer<typeof createRoomSchema>
export type UpdateRoomFormData = z.infer<typeof updateRoomSchema>