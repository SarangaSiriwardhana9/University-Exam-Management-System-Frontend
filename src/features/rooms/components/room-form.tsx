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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { DoorOpenIcon, BuildingIcon, UsersIcon, MonitorIcon, WifiIcon, FileTextIcon, InfoIcon } from 'lucide-react'
import { LoadingSpinner } from '@/components/common/loading-spinner'
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
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DoorOpenIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Room identification and capacity details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="roomNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <DoorOpenIcon className="h-4 w-4" />
                    Room Number *
                  </FormLabel>
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
                  <FormLabel className="flex items-center gap-2">
                    <BuildingIcon className="h-4 w-4" />
                    Building
                  </FormLabel>
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
                  <FormLabel className="flex items-center gap-2">
                    <BuildingIcon className="h-4 w-4" />
                    Floor Number
                  </FormLabel>
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
                  <FormLabel className="flex items-center gap-2">
                    <UsersIcon className="h-4 w-4" />
                    Total Capacity *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="30" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                    />
                  </FormControl>
                  <FormDescription className="flex items-start gap-2">
                    <InfoIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Maximum number of people the room can accommodate</span>
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
                  <FormLabel className="flex items-center gap-2">
                    <UsersIcon className="h-4 w-4" />
                    Exam Capacity *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="25" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                    />
                  </FormControl>
                  <FormDescription className="flex items-start gap-2">
                    <InfoIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Maximum capacity during exams (with spacing)</span>
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
                    <FormDescription className="flex items-start gap-2">
                      <InfoIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Mark this room as a computer lab for online exams</span>
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
                    <FormDescription className="flex items-start gap-2">
                      <InfoIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>This room has accessibility features for people with disabilities</span>
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          </CardContent>
        </Card>

        {/* Facilities */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <WifiIcon className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <CardTitle>Facilities</CardTitle>
                <CardDescription>Available amenities and features</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
          
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
                <FormLabel className="flex items-center gap-2">
                  <InfoIcon className="h-4 w-4" />
                  Power Outlets
                </FormLabel>
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
          </CardContent>
        </Card>

        {/* Equipment */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <MonitorIcon className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <CardTitle>Equipment</CardTitle>
                <CardDescription>Furniture and technology inventory</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="equipment.tables"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileTextIcon className="h-4 w-4" />
                    Tables
                  </FormLabel>
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
                  <FormLabel className="flex items-center gap-2">
                    <FileTextIcon className="h-4 w-4" />
                    Chairs
                  </FormLabel>
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
                  <FormLabel className="flex items-center gap-2">
                    <MonitorIcon className="h-4 w-4" />
                    Computers
                  </FormLabel>
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
                  <FormLabel className="flex items-center gap-2">
                    <MonitorIcon className="h-4 w-4" />
                    Printers
                  </FormLabel>
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
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <FileTextIcon className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <CardTitle>Description</CardTitle>
                <CardDescription>Additional notes and information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <FileTextIcon className="h-4 w-4" />
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="e.g., Large lecture hall with tiered seating..."
                    className="resize-none min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel} size="lg">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} size="lg" className="min-w-[150px]">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                <span>Saving...</span>
              </div>
            ) : (
              isEditMode ? 'Update Room' : 'Create Room'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}