'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeftIcon, EditIcon, TrashIcon, CheckCircleIcon, XCircleIcon, DoorOpenIcon, BuildingIcon, UsersIcon, WifiIcon, MonitorIcon, FileTextIcon, ClockIcon, CheckCircle2Icon } from 'lucide-react'
import { useRoomQuery } from '@/features/rooms/hooks/use-rooms-query'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

type ViewRoomPageProps = {
  params: Promise<{ id: string }>
}

const ViewRoomPage = ({ params }: ViewRoomPageProps) => {
  const router = useRouter()
  const { id: roomId } = use(params)

  console.log('View page - Room ID from params:', roomId)

  const { data: roomResponse, isLoading, error } = useRoomQuery(roomId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    console.error('Error fetching room:', error)
  }

  if (!roomResponse?.data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Room Not Found</h2>
          <p className="text-muted-foreground">
            The room you&apos;re looking for doesn&apos;t exist.
          </p>
          {error && (
            <p className="text-sm text-red-500">
              Error: {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          )}
          <Button onClick={() => router.push('/admin/rooms')} className="mt-4">
            Back to Rooms
          </Button>
        </div>
      </div>
    )
  }

  const room = roomResponse.data

  return (
    <RoleGuard allowedRoles={[USER_ROLES.ADMIN]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.back()}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Room Details</h1>
              <p className="text-muted-foreground mt-1">
                View information for {room.fullRoomNumber}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/admin/rooms/${roomId}/edit`)}
            >
              <EditIcon className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive">
              <TrashIcon className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Room Profile Card */}
          <Card className="md:col-span-1 border-l-4 border-l-primary">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <DoorOpenIcon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Room Profile</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-3xl font-bold text-primary mx-auto border-4 border-primary/20">
                  {room.roomNumber}
                </div>
                <h3 className="mt-4 font-semibold text-xl">{room.fullRoomNumber}</h3>
                {room.building && (
                  <p className="text-sm text-muted-foreground font-medium">{room.building}</p>
                )}
                <div className="flex flex-col gap-2 mt-3">
                  <Badge variant={room.isActive ? 'default' : 'secondary'} className="justify-center">
                    <CheckCircle2Icon className="h-3 w-3 mr-1" />
                    {room.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  {room.isLab && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 justify-center">
                      <MonitorIcon className="h-3 w-3 mr-1" />
                      Computer Lab
                    </Badge>
                  )}
                  {room.isAccessible && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 justify-center">
                      <CheckCircleIcon className="h-3 w-3 mr-1" />
                      Accessible
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Room Information Cards */}
          <div className="md:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <DoorOpenIcon className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Room details and capacity</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DoorOpenIcon className="h-4 w-4" />
                      <span>Room Number</span>
                    </div>
                    <p className="font-semibold text-lg">{room.roomNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BuildingIcon className="h-4 w-4" />
                      <span>Building</span>
                    </div>
                    <p className="font-medium">{room.building || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BuildingIcon className="h-4 w-4" />
                      <span>Floor</span>
                    </div>
                    <p className="font-medium">
                      {room.floorNumber !== undefined ? `Floor ${room.floorNumber}` : '—'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <UsersIcon className="h-4 w-4" />
                      <span>Total Capacity</span>
                    </div>
                    <p className="font-semibold text-lg">{room.capacity} people</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <UsersIcon className="h-4 w-4" />
                      <span>Exam Capacity</span>
                    </div>
                    <p className="font-semibold text-lg">{room.examCapacity} people</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <UsersIcon className="h-4 w-4" />
                      <span>Capacity Ratio</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${Math.round(room.capacityRatio * 100)}%` }}
                        />
                      </div>
                      <span className="font-medium text-sm">{Math.round(room.capacityRatio * 100)}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Facilities */}
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <WifiIcon className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <CardTitle>Facilities</CardTitle>
                    <CardDescription>Available amenities and features</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {room.facilities ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="flex items-center space-x-2">
                      {room.facilities.airConditioned ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-gray-400" />
                      )}
                      <span className="text-sm">Air Conditioned</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {room.facilities.projector ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-gray-400" />
                      )}
                      <span className="text-sm">Projector</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {room.facilities.whiteboard ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-gray-400" />
                      )}
                      <span className="text-sm">Whiteboard</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {room.facilities.smartBoard ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-gray-400" />
                      )}
                      <span className="text-sm">Smart Board</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {room.facilities.soundSystem ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-gray-400" />
                      )}
                      <span className="text-sm">Sound System</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {room.facilities.wifi ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-gray-400" />
                      )}
                      <span className="text-sm">WiFi</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No facilities information</p>
                )}
                {room.facilities?.powerOutlets !== undefined && room.facilities.powerOutlets > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium text-muted-foreground">Power Outlets</p>
                    <p className="mt-1">{room.facilities.powerOutlets} outlets</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Equipment */}
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <MonitorIcon className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <CardTitle>Equipment</CardTitle>
                    <CardDescription>Furniture and technology inventory</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {room.equipment ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {room.equipment.tables !== undefined && room.equipment.tables > 0 && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Tables</p>
                        <p className="mt-1 font-semibold">{room.equipment.tables}</p>
                      </div>
                    )}
                    {room.equipment.chairs !== undefined && room.equipment.chairs > 0 && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Chairs</p>
                        <p className="mt-1 font-semibold">{room.equipment.chairs}</p>
                      </div>
                    )}
                    {room.equipment.computers !== undefined && room.equipment.computers > 0 && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Computers</p>
                        <p className="mt-1 font-semibold">{room.equipment.computers}</p>
                      </div>
                    )}
                    {room.equipment.printers !== undefined && room.equipment.printers > 0 && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Printers</p>
                        <p className="mt-1 font-semibold">{room.equipment.printers}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No equipment information</p>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            {room.description && (
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <FileTextIcon className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <CardTitle>Description</CardTitle>
                      <CardDescription>Additional notes about this room</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm leading-relaxed">{room.description}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Metadata */}
            <Card className="border-l-4 border-l-gray-500">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gray-500/10 rounded-lg">
                    <ClockIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <CardTitle>System Information</CardTitle>
                    <CardDescription>Creation and update timestamps</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ClockIcon className="h-4 w-4" />
                      <span>Created At</span>
                    </div>
                    <p className="font-medium">{new Date(room.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ClockIcon className="h-4 w-4" />
                      <span>Last Updated</span>
                    </div>
                    <p className="font-medium">{new Date(room.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RoleGuard>
  )
}

export default ViewRoomPage