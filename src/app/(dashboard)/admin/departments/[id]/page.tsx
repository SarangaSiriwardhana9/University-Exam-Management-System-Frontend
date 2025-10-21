'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeftIcon, EditIcon, TrashIcon, BuildingIcon, UserIcon, FileTextIcon, ClockIcon, CheckCircle2Icon } from 'lucide-react'
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
            The department you're looking for doesn't exist.
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
          <Card className="md:col-span-1 border-l-4 border-l-primary">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BuildingIcon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Profile</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-3xl font-bold text-primary font-mono border-4 border-primary/20">
                  {department.departmentCode}
                </div>
                <h3 className="mt-4 font-semibold text-xl">{department.departmentName}</h3>
                <p className="text-sm text-muted-foreground font-mono">Code: {department.departmentCode}</p>
                <Badge variant={department.isActive ? 'default' : 'secondary'} className="mt-3 justify-center">
                  <CheckCircle2Icon className="h-3 w-3 mr-1" />
                  {department.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Department Information Cards */}
          <div className="md:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <BuildingIcon className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Department details and leadership</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileTextIcon className="h-4 w-4" />
                      <span>Department Code</span>
                    </div>
                    <p className="font-mono font-semibold text-lg">{department.departmentCode}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BuildingIcon className="h-4 w-4" />
                      <span>Department Name</span>
                    </div>
                    <p className="font-medium text-lg">{department.departmentName}</p>
                  </div>
                  <div className="col-span-full space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <UserIcon className="h-4 w-4" />
                      <span>Head of Department</span>
                    </div>
                    <p className="font-medium">{department.headOfDepartmentName || '—'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            {department.description && (
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <FileTextIcon className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <CardTitle>Description</CardTitle>
                      <CardDescription>About this department</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm leading-relaxed">{department.description}</p>
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
                    <p className="font-medium">{new Date(department.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ClockIcon className="h-4 w-4" />
                      <span>Last Updated</span>
                    </div>
                    <p className="font-medium">{new Date(department.updatedAt).toLocaleString()}</p>
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