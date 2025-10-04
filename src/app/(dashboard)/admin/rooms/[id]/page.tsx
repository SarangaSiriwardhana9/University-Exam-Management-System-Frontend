'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeftIcon, EditIcon, TrashIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react'
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
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Room Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary mx-auto">
                  {room.roomNumber}
                </div>
                <h3 className="mt-4 font-semibold text-lg">{room.fullRoomNumber}</h3>
                {room.building && (
                  <p className="text-sm text-muted-foreground">{room.building}</p>
                )}
                <Badge variant={room.isActive ? 'default' : 'secondary'} className="mt-2">
                  {room.isActive ? 'Active' : 'Inactive'}
                </Badge>
                {room.isAccessible && (
                  <Badge variant="outline" className="mt-2 ml-2">
                    Accessible
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Room Information Cards */}
          <div className="md:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Room Number</p>
                    <p className="mt-1">{room.roomNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Building</p>
                    <p className="mt-1">{room.building || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Floor</p>
                    <p className="mt-1">
                      {room.floorNumber !== undefined ? `Floor ${room.floorNumber}` : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Capacity Ratio</p>
                    <p className="mt-1">{Math.round(room.capacityRatio * 100)}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Capacity</p>
                    <p className="mt-1 font-semibold">{room.capacity} people</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Exam Capacity</p>
                    <p className="mt-1 font-semibold">{room.examCapacity} people</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Facilities */}
            <Card>
              <CardHeader>
                <CardTitle>Facilities</CardTitle>
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
            <Card>
              <CardHeader>
                <CardTitle>Equipment</CardTitle>
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
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{room.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle>Room Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created At</p>
                    <p className="mt-1">{new Date(room.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                    <p className="mt-1">{new Date(room.updatedAt).toLocaleString()}</p>
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