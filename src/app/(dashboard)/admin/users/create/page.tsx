'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeftIcon } from 'lucide-react'
import { UserForm } from '@/features/users/components/user-form'
import { useCreateUser } from '@/features/users/hooks/use-user-mutations'
import type { CreateUserFormData } from '@/features/users/validations/user-schemas'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

const CreateUserPage = () => {
  const router = useRouter()
  const createMutation = useCreateUser()

  const handleCreate = (data: CreateUserFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        router.push('/admin/users')
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
            <h1 className="text-3xl font-bold text-gray-900">Create New User</h1>
            <p className="text-muted-foreground mt-1">
              Add a new user to the system
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>
              Fill in the details below to create a new user account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserForm
              onSubmit={handleCreate}
              onCancel={() => router.push('/admin/users')}
              isLoading={createMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}

export default CreateUserPage