'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeftIcon } from 'lucide-react'
import { UserForm } from '@/features/users/components/user-form'
import { useUserQuery } from '@/features/users/hooks/use-users-query'
import { useUpdateUser } from '@/features/users/hooks/use-user-mutations'
import type { UpdateUserFormData } from '@/features/users/validations/user-schemas'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

type EditUserPageProps = {
  params: Promise<{ id: string }>
}

const EditUserPage = ({ params }: EditUserPageProps) => {
  const router = useRouter()
  const { id: userId } = use(params)

  console.log('Edit page - User ID from params:', userId)

  const { data: userResponse, isLoading, error } = useUserQuery(userId)
  const updateMutation = useUpdateUser()

  const handleUpdate = (data: UpdateUserFormData) => {
    updateMutation.mutate(
      { id: userId, data },
      {
        onSuccess: () => {
          router.push('/admin/users')
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
    console.error('Error fetching user:', error)
  }

  if (!userResponse?.data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">User Not Found</h2>
          <p className="text-muted-foreground">
            The user you&apos;re looking for doesn&apos;t exist.
          </p>
          {error && (
            <p className="text-sm text-red-500">
              Error: {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          )}
          <div className="text-sm text-muted-foreground">
            <p>User ID: {userId}</p>
            <p>Check console for more details</p>
          </div>
          <Button onClick={() => router.push('/admin/users')} className="mt-4">
            Back to Users
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
            <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
            <p className="text-muted-foreground mt-1">
              Update user information for {userResponse.data.fullName}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>
              Update the user details below and click save.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserForm
              user={userResponse.data}
              onSubmit={handleUpdate}
              onCancel={() => router.push('/admin/users')}
              isLoading={updateMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}

export default EditUserPage