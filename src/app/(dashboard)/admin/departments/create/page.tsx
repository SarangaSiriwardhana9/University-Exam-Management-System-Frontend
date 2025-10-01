'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeftIcon } from 'lucide-react'
import { DepartmentForm } from '@/features/departments/components/department-form'
import { useCreateDepartment } from '@/features/departments/hooks/use-department-mutations'
import type { CreateDepartmentFormData } from '@/features/departments/validations/department-schemas'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

const CreateDepartmentPage = () => {
  const router = useRouter()
  const createMutation = useCreateDepartment()

  const handleCreate = (data: CreateDepartmentFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        router.push('/admin/departments')
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
            <h1 className="text-3xl font-bold text-gray-900">Create New Department</h1>
            <p className="text-muted-foreground mt-1">
              Add a new department to the university
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Department Information</CardTitle>
            <CardDescription>
              Fill in the details below to create a new department.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DepartmentForm
              onSubmit={handleCreate}
              onCancel={() => router.push('/admin/departments')}
              isLoading={createMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}

export default CreateDepartmentPage