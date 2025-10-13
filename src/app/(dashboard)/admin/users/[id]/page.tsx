'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeftIcon, EditIcon, TrashIcon } from 'lucide-react'
import { useUserQuery } from '@/features/users/hooks/use-users-query'
import { useDepartmentQuery } from '@/features/departments/hooks/use-departments-query'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'
import { cn } from '@/lib/utils'
import type { UserRole } from '@/constants/roles'

const getRoleBadgeClass = (role: UserRole) => {
  const roleClasses = {
    admin: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    faculty: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    student: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    exam_coordinator: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    invigilator: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
  } as const

  return roleClasses[role] || 'bg-muted'
}

const formatRole = (role: string) => {
  return role.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

const getYearLabel = (year?: number) => {
  if (!year) return '—'
  return `Year ${year}`
}

type ViewUserPageProps = {
  params: Promise<{ id: string }>
}

const ViewUserPage = ({ params }: ViewUserPageProps) => {
  const router = useRouter()
  const { id: userId } = use(params)

  const { data: userResponse, isLoading, error } = useUserQuery(userId)
  
 
  const user = userResponse?.data
  const { data: departmentResponse, isLoading: isDepartmentLoading } = useDepartmentQuery(
    user?.departmentId
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
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
          <Button onClick={() => router.push('/admin/users')} className="mt-4">
            Back to Users
          </Button>
        </div>
      </div>
    )
  }

  const department = departmentResponse?.data
  const isStudent = user.role === USER_ROLES.STUDENT
  const isFaculty = user.role === USER_ROLES.FACULTY

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
              <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
              <p className="text-muted-foreground mt-1">
                View information for {user.fullName}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/admin/users/${userId}/edit`)}
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
          {/* User Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
                  {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <h3 className="mt-4 font-semibold text-lg">{user.fullName}</h3>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
                <Badge
                  variant="outline"
                  className={cn('mt-2', getRoleBadgeClass(user.role))}
                >
                  {formatRole(user.role)}
                </Badge>
                <Badge variant={user.isActive ? 'default' : 'secondary'} className="mt-2">
                  {user.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* User Information Cards */}
          <div className="md:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="mt-1">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Username</p>
                    <p className="mt-1">{user.username}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                    <p className="mt-1">{user.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Role</p>
                    <p className="mt-1">{formatRole(user.role)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academic Information - Show for Students and Faculty */}
            {(isStudent || isFaculty) && (
              <Card>
                <CardHeader>
                  <CardTitle>Academic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Department</p>
                      {isDepartmentLoading ? (
                        <div className="flex items-center mt-1">
                          <LoadingSpinner size="sm" />
                          <span className="ml-2 text-sm">Loading...</span>
                        </div>
                      ) : department ? (
                        <div className="mt-1">
                          <p className="font-medium">{department.departmentName}</p>
                          <p className="text-sm text-muted-foreground">
                            Code: {department.departmentCode}
                          </p>
                        </div>
                      ) : (
                        <p className="mt-1 text-muted-foreground">Not assigned</p>
                      )}
                    </div>
                    
                    {isStudent && (
                      <>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Academic Year</p>
                          <p className="mt-1">
                            {getYearLabel(user.year)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Semester</p>
                          <p className="mt-1">
                            {user.semester ? `Semester ${user.semester}` : '—'}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {department?.description && (
                    <div className="pt-2 border-t">
                      <p className="text-sm font-medium text-muted-foreground">Department Description</p>
                      <p className="mt-1 text-sm">{department.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Primary Phone</p>
                    <p className="mt-1">{user.contactPrimary || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Secondary Phone</p>
                    <p className="mt-1">{user.contactSecondary || '—'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
              <CardHeader>
                <CardTitle>Address Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Address</p>
                  <p className="mt-1">
                    {[
                      user.addressLine1,
                      user.addressLine2,
                      user.city,
                      user.state,
                      user.postalCode,
                      user.country
                    ]
                      .filter(Boolean)
                      .join(', ') || '—'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created At</p>
                    <p className="mt-1">{new Date(user.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                    <p className="mt-1">{new Date(user.updatedAt).toLocaleString()}</p>
                  </div>
                  {user.lastLoginAt && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Last Login</p>
                      <p className="mt-1">{new Date(user.lastLoginAt).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RoleGuard>
  )
}

export default ViewUserPage