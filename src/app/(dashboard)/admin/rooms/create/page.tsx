'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeftIcon } from 'lucide-react'
import { RoomForm } from '@/features/rooms/components/room-form'
import { useCreateRoom } from '@/features/rooms/hooks/use-room-mutations'
import type { CreateRoomFormData } from '@/features/rooms/validations/room-schemas'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

const CreateRoomPage = () => {
  const router = useRouter()
  const createMutation = useCreateRoom()

  const handleCreate = (data: CreateRoomFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        router.push('/admin/rooms')
      }
    })
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
            <h1 className="text-3xl font-bold text-gray-900">Create New Room</h1>
            <p className="text-muted-foreground mt-1">
              Add a new room to the system
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Room Information</CardTitle>
            <CardDescription>
              Fill in the details below to create a new room.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RoomForm
              onSubmit={handleCreate}
              onCancel={() => router.push('/admin/rooms')}
              isLoading={createMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}

export default CreateRoomPage