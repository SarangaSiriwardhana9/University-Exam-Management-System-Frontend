'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeftIcon, EditIcon, TrashIcon, UserIcon, MailIcon, ShieldIcon, BuildingIcon, GraduationCapIcon, PhoneIcon, MapPinIcon, ClockIcon, CheckCircle2Icon } from 'lucide-react'
import { useUserQuery } from '@/features/users/hooks/use-users-query'
import { useDepartmentQuery } from '@/features/departments/hooks/use-departments-query'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'
import { cn } from '@/lib/utils'
import type { UserRole } from '@/constants/roles'

const getRoleBadgeClass = (role: UserRole) => {
  const roleClasses = {
    admin: 'bg-blue-100 text-blue-700',
    faculty: 'bg-purple-100 text-purple-700',
    student: 'bg-green-100 text-green-700',
    exam_coordinator: 'bg-orange-100 text-orange-700',
    invigilator: 'bg-indigo-100 text-indigo-700'
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
          <Card className="md:col-span-1 border-l-4 border-l-primary">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <UserIcon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Profile</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-3xl font-bold text-primary border-4 border-primary/20">
                  {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <h3 className="mt-4 font-semibold text-xl">{user.fullName}</h3>
                <p className="text-sm text-muted-foreground font-mono">@{user.username}</p>
                <div className="flex flex-col gap-2 mt-3 w-full">
                  <Badge
                    variant="outline"
                    className={cn('justify-center font-medium', getRoleBadgeClass(user.role))}
                  >
                    <ShieldIcon className="h-3 w-3 mr-1" />
                    {formatRole(user.role)}
                  </Badge>
                  <Badge variant={user.isActive ? 'default' : 'secondary'} className="justify-center">
                    <CheckCircle2Icon className="h-3 w-3 mr-1" />
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Information Cards */}
          <div className="md:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <UserIcon className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Account details and credentials</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MailIcon className="h-4 w-4" />
                      <span>Email</span>
                    </div>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <UserIcon className="h-4 w-4" />
                      <span>Username</span>
                    </div>
                    <p className="font-medium font-mono">{user.username}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <UserIcon className="h-4 w-4" />
                      <span>Full Name</span>
                    </div>
                    <p className="font-medium">{user.fullName}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ShieldIcon className="h-4 w-4" />
                      <span>Role</span>
                    </div>
                    <p className="font-medium">{formatRole(user.role)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academic Information - Show for Students and Faculty */}
            {(isStudent || isFaculty) && (
              <Card className="border-l-4 border-l-purple-500">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <GraduationCapIcon className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <CardTitle>Academic Information</CardTitle>
                      <CardDescription>Department and academic details</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BuildingIcon className="h-4 w-4" />
                        <span>Department</span>
                      </div>
                      {isDepartmentLoading ? (
                        <div className="flex items-center gap-2">
                          <LoadingSpinner size="sm" />
                          <span className="text-sm">Loading...</span>
                        </div>
                      ) : department ? (
                        <div>
                          <p className="font-medium">{department.departmentName}</p>
                          <p className="text-sm text-muted-foreground">
                            Code: {department.departmentCode}
                          </p>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">Not assigned</p>
                      )}
                    </div>
                    
                    {isStudent && (
                      <>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <GraduationCapIcon className="h-4 w-4" />
                            <span>Academic Year</span>
                          </div>
                          <p className="font-medium">
                            {getYearLabel(user.year)}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <GraduationCapIcon className="h-4 w-4" />
                            <span>Semester</span>
                          </div>
                          <p className="font-medium">
                            {user.semester ? `Semester ${user.semester}` : '—'}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {department?.description && (
                    <div className="pt-4 border-t">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Department Description</p>
                      <p className="text-sm p-3 bg-muted/50 rounded-lg">{department.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Contact Information */}
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <PhoneIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>Phone numbers for communication</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <PhoneIcon className="h-4 w-4" />
                      <span>Primary Phone</span>
                    </div>
                    <p className="font-medium">{user.contactPrimary || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <PhoneIcon className="h-4 w-4" />
                      <span>Secondary Phone</span>
                    </div>
                    <p className="font-medium">{user.contactSecondary || '—'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <MapPinIcon className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <CardTitle>Address Information</CardTitle>
                    <CardDescription>Residential address details</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPinIcon className="h-4 w-4" />
                    <span>Address</span>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium">
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
                </div>
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card className="border-l-4 border-l-gray-500">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gray-500/10 rounded-lg">
                    <ClockIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Creation and activity timestamps</CardDescription>
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
                    <p className="font-medium">{new Date(user.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ClockIcon className="h-4 w-4" />
                      <span>Last Updated</span>
                    </div>
                    <p className="font-medium">{new Date(user.updatedAt).toLocaleString()}</p>
                  </div>
                  {user.lastLoginAt && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2Icon className="h-4 w-4" />
                        <span>Last Login</span>
                      </div>
                      <p className="font-medium">{new Date(user.lastLoginAt).toLocaleString()}</p>
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