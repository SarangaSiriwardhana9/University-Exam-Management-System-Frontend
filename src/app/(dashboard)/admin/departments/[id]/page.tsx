'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeftIcon, EditIcon, TrashIcon } from 'lucide-react'
import { useDepartmentQuery } from '@/features/departments/hooks/use-departments-query'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

type ViewDepartmentPageProps = {
  params: Promise<{ id: string }>
}

const ViewDepartmentPage = ({ params }: ViewDepartmentPageProps) => {
  const router = useRouter()
  const { id: departmentId } = use(params)

  const { data: departmentResponse, isLoading, error } = useDepartmentQuery(departmentId)

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

  const department = departmentResponse.data

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
              <h1 className="text-3xl font-bold text-gray-900">Department Details</h1>
              <p className="text-muted-foreground mt-1">
                View information for {department.departmentName}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/admin/departments/${departmentId}/edit`)}
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
          {/* Department Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary font-mono">
                  {department.departmentCode}
                </div>
                <h3 className="mt-4 font-semibold text-lg">{department.departmentName}</h3>
                <p className="text-sm text-muted-foreground">Department Code: {department.departmentCode}</p>
                <Badge variant={department.isActive ? 'default' : 'secondary'} className="mt-2">
                  {department.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Department Information Cards */}
          <div className="md:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Department Code</p>
                    <p className="mt-1 font-mono font-semibold">{department.departmentCode}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Department Name</p>
                    <p className="mt-1">{department.departmentName}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Head of Department</p>
                    <p className="mt-1">{department.headOfDepartmentName || '—'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            {department.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{department.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created At</p>
                    <p className="mt-1">{new Date(department.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                    <p className="mt-1">{new Date(department.updatedAt).toLocaleString()}</p>
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

export default ViewDepartmentPage