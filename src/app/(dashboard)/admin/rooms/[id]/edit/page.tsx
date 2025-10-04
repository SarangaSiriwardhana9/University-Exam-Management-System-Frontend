'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeftIcon } from 'lucide-react'
import { RoomForm } from '@/features/rooms/components/room-form'
import { useRoomQuery } from '@/features/rooms/hooks/use-rooms-query'
import { useUpdateRoom } from '@/features/rooms/hooks/use-room-mutations'
import type { UpdateRoomFormData } from '@/features/rooms/validations/room-schemas'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

type EditRoomPageProps = {
  params: Promise<{ id: string }>
}

const EditRoomPage = ({ params }: EditRoomPageProps) => {
  const router = useRouter()
  const { id: roomId } = use(params)

  console.log('Edit page - Room ID from params:', roomId)

  const { data: roomResponse, isLoading, error } = useRoomQuery(roomId)
  const updateMutation = useUpdateRoom()

  const handleUpdate = (data: UpdateRoomFormData) => {
    updateMutation.mutate(
      { id: roomId, data },
      {
        onSuccess: () => {
          router.push('/admin/rooms')
        }
      }
    )
  }

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
          <div className="text-sm text-muted-foreground">
            <p>Room ID: {roomId}</p>
            <p>Check console for more details</p>
          </div>
          <Button onClick={() => router.push('/admin/rooms')} className="mt-4">
            Back to Rooms
          </Button>
        </div>
      </div>
    )
  }

  return (
    <RoleGuard allowedRoles={[USER_ROLES.ADMIN]}>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Room</h1>
            <p className="text-muted-foreground mt-1">
              Update room information for {roomResponse.data.fullRoomNumber}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Room Information</CardTitle>
            <CardDescription>
              Update the room details below and click save.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RoomForm
              room={roomResponse.data}
              onSubmit={handleUpdate}
              onCancel={() => router.push('/admin/rooms')}
              isLoading={updateMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}

export default EditRoomPage