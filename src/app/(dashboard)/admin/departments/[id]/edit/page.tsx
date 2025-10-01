'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeftIcon } from 'lucide-react'
import { DepartmentForm } from '@/features/departments/components/department-form'
import { useDepartmentQuery } from '@/features/departments/hooks/use-departments-query'
import { useUpdateDepartment } from '@/features/departments/hooks/use-department-mutations'
import type { UpdateDepartmentFormData } from '@/features/departments/validations/department-schemas'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

type EditDepartmentPageProps = {
  params: Promise<{ id: string }>
}

const EditDepartmentPage = ({ params }: EditDepartmentPageProps) => {
  const router = useRouter()
  const { id: departmentId } = use(params)

  const { data: departmentResponse, isLoading, error } = useDepartmentQuery(departmentId)
  const updateMutation = useUpdateDepartment()

  const handleUpdate = (data: UpdateDepartmentFormData) => {
    updateMutation.mutate(
      { id: departmentId, data },
      {
        onSuccess: () => {
          router.push('/admin/departments')
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

  if (error || !departmentResponse?.data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Department Not Found</h2>
          <p className="text-muted-foreground">
            The department you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push('/admin/departments')} className="mt-4">
            Back to Departments
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
            <h1 className="text-3xl font-bold text-gray-900">Edit Department</h1>
            <p className="text-muted-foreground mt-1">
              Update department information for {departmentResponse.data.departmentName}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Department Information</CardTitle>
            <CardDescription>
              Update the department details below and click save.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DepartmentForm
              department={departmentResponse.data}
              onSubmit={handleUpdate}
              onCancel={() => router.push('/admin/departments')}
              isLoading={updateMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}

export default EditDepartmentPage