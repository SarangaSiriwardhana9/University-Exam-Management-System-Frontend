'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { createRoomSchema, updateRoomSchema, type CreateRoomFormData, type UpdateRoomFormData } from '../validations/room-schemas'
import type { Room } from '../types/rooms'

type CreateRoomFormProps = {
  room?: never
  onSubmit: (data: CreateRoomFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

type UpdateRoomFormProps = {
  room: Room
  onSubmit: (data: UpdateRoomFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

type RoomFormProps = CreateRoomFormProps | UpdateRoomFormProps

export const RoomForm = ({ room, onSubmit, onCancel, isLoading }: RoomFormProps) => {
  const isEditMode = !!room

  const form = useForm<CreateRoomFormData | UpdateRoomFormData>({
    resolver: zodResolver(isEditMode ? updateRoomSchema : createRoomSchema),
    defaultValues: {
      roomNumber: '',
      building: '',
      floorNumber: 0,
      capacity: 30,
      examCapacity: 25,
      facilities: {
        airConditioned: false,
        projector: false,
        whiteboard: false,
        smartBoard: false,
        soundSystem: false,
        wifi: false,
        powerOutlets: 0
      },
      equipment: {
        tables: 0,
        chairs: 0,
        computers: 0,
        printers: 0
      },
      isLab: false,
      isAccessible: false,
      description: ''
    }
  })

  useEffect(() => {
    if (room) {
      form.reset({
        roomNumber: room.roomNumber,
        building: room.building || '',
        floorNumber: room.floorNumber || 0,
        capacity: room.capacity,
        examCapacity: room.examCapacity,
        facilities: room.facilities || {},
        equipment: room.equipment || {},
        isLab: room.isLab || false,
        isAccessible: room.isAccessible || false,
        description: room.description || ''
      })
    }
  }, [room, form])

  const handleSubmit = (data: CreateRoomFormData | UpdateRoomFormData) => {
    if (isEditMode) {
      (onSubmit as (data: UpdateRoomFormData) => void)(data as UpdateRoomFormData)
    } else {
      (onSubmit as (data: CreateRoomFormData) => void)(data as CreateRoomFormData)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="roomNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 101" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="building"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Building</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Main Building" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="floorNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Floor Number</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Capacity *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="30" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum number of people the room can accommodate
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="examCapacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exam Capacity *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="25" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum capacity during exams (with spacing)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="isLab"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Computer Lab
                    </FormLabel>
                    <FormDescription>
                      Mark this room as a computer lab for online exams
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isAccessible"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Wheelchair Accessible
                    </FormLabel>
                    <FormDescription>
                      This room has accessibility features for people with disabilities
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Facilities */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Facilities</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="facilities.airConditioned"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Air Conditioned</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="facilities.projector"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Projector</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="facilities.whiteboard"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Whiteboard</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="facilities.smartBoard"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Smart Board</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="facilities.soundSystem"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Sound System</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="facilities.wifi"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">WiFi</FormLabel>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="facilities.powerOutlets"
            render={({ field }) => (
              <FormItem className="max-w-xs">
                <FormLabel>Power Outlets</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Equipment */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Equipment</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="equipment.tables"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tables</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="equipment.chairs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chairs</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="equipment.computers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Computers</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="equipment.printers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Printers</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Additional notes about this room..."
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : isEditMode ? 'Update Room' : 'Create Room'}
          </Button>
        </div>
      </form>
    </Form>
  )
}