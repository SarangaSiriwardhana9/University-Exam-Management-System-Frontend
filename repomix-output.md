

# Directory Structure
```
.gitignore
.repomixignore
components.json
eslint.config.mjs
next.config.ts
package.json
postcss.config.mjs
public/file.svg
public/globe.svg
public/next.svg
public/vercel.svg
public/window.svg
README.md
repomix.config.json
src/app/(auth)/layout.tsx
src/app/(auth)/login/page.tsx
src/app/(auth)/register/page.tsx
src/app/(dashboard)/admin/dashboard/page.tsx
src/app/(dashboard)/admin/users/[id]/edit/page.tsx
src/app/(dashboard)/admin/users/[id]/page.tsx
src/app/(dashboard)/admin/users/create/page.tsx
src/app/(dashboard)/admin/users/page.tsx
src/app/(dashboard)/exam-coordinator/dashboard/page.tsx
src/app/(dashboard)/faculty/dashboard/page.tsx
src/app/(dashboard)/invigilator/dashboard/page.tsx
src/app/(dashboard)/layout.tsx
src/app/(dashboard)/student/dashboard/page.tsx
src/app/error.tsx
src/app/globals.css
src/app/layout.tsx
src/app/not-found.tsx
src/app/page.tsx
src/components/common/loading-spinner.tsx
src/components/data-display/data-table.tsx
src/components/navigation/navbar.tsx
src/components/navigation/sidebar.tsx
src/constants/navigation.ts
src/constants/roles.ts
src/constants/routes.ts
src/features/assignments/hooks/use-assignments.ts
src/features/assignments/types/assignments.ts
src/features/auth/components/login-form.tsx
src/features/auth/components/register-form.tsx
src/features/auth/hooks/use-api.ts
src/features/auth/hooks/use-auth-mutations.ts
src/features/auth/types/auth.ts
src/features/auth/validations/auth-schemas.ts
src/features/calendar/hooks/use-calendar.ts
src/features/calendar/types/calendar.ts
src/features/dashboard/hooks/use-dashboard.ts
src/features/dashboard/types/dashboard.ts
src/features/departments/hooks/use-departments.ts
src/features/departments/types/departments.ts
src/features/enrollments/hooks/use-enrollments.ts
src/features/enrollments/types/enrollments.ts
src/features/exam-papers/hooks/use-exam-papers.ts
src/features/exam-papers/types/exam-papers.ts
src/features/exam-sessions/hooks/use-exam-sessions.ts
src/features/exam-sessions/types/exam-sessions.ts
src/features/file-uploads/hooks/use-file-uploads.ts
src/features/file-uploads/types/file-uploads.ts
src/features/notifications/hooks/use-notifications.ts
src/features/notifications/types/notifications.ts
src/features/questions/hooks/use-questions.ts
src/features/questions/types/questions.ts
src/features/registrations/hooks/use-registrations.ts
src/features/registrations/types/registrations.ts
src/features/reports/hooks/use-reports.ts
src/features/reports/types/reports.ts
src/features/results/hooks/use-results.ts
src/features/results/types/results.ts
src/features/rooms/hooks/use-rooms.ts
src/features/rooms/types/rooms.ts
src/features/subjects/hooks/use-subjects.ts
src/features/subjects/types/subjects.ts
src/features/users/components/user-columns.tsx
src/features/users/components/user-form.tsx
src/features/users/hooks/use-user-mutations.ts
src/features/users/hooks/use-users-query.ts
src/features/users/hooks/use-users.ts
src/features/users/types/users.ts
src/features/users/validations/user-schemas.ts
src/lib/api/client.ts
src/lib/api/index.ts
src/lib/auth/auth-guard.tsx
src/lib/auth/auth-provider.tsx
src/lib/auth/role-guard.tsx
src/lib/providers/query-provider.tsx
src/lib/stores/auth-store.ts
src/lib/utils.ts
src/middleware.ts
src/types/auth.ts
src/types/common.ts
tsconfig.json
```


## File: src/app/(auth)/login/page.tsx
````typescript
import { LoginForm } from '@/features/auth/components/login-form'

export default function LoginPage() {
  return <LoginForm />
}
````

## File: src/app/(auth)/register/page.tsx
````typescript
import { RegisterForm } from '@/features/auth/components/register-form'

export default function RegisterPage() {
  return <RegisterForm />
}
````

## File: src/app/(dashboard)/admin/dashboard/page.tsx
````typescript
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

export default function AdminDashboard() {
  return (
    <RoleGuard allowedRoles={[USER_ROLES.ADMIN]}>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Welcome to the Admin Dashboard. This is where you can manage the entire university system.</p>
        </div>
      </div>
    </RoleGuard>
  )
}
````

## File: src/app/(dashboard)/admin/users/[id]/edit/page.tsx
````typescript
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
````

## File: src/app/(dashboard)/admin/users/[id]/page.tsx
````typescript
'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeftIcon, EditIcon, TrashIcon } from 'lucide-react'
import { useUserQuery } from '@/features/users/hooks/use-users-query'
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

type ViewUserPageProps = {
  params: Promise<{ id: string }>
}

const ViewUserPage = ({ params }: ViewUserPageProps) => {
  const router = useRouter()
  const { id: userId } = use(params)

  console.log('View page - User ID from params:', userId)

  const { data: userResponse, isLoading, error } = useUserQuery(userId)

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
            The user you&apos;re looking for doesn&lsquo;t exist.
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

  const user = userResponse.data

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
````

## File: src/app/(dashboard)/admin/users/create/page.tsx
````typescript
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
````

## File: src/app/(dashboard)/admin/users/page.tsx
````typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { PlusIcon } from 'lucide-react'
import { DataTable } from '@/components/data-display/data-table'
import { getUserColumns } from '@/features/users/components/user-columns'
import { useUsersQuery } from '@/features/users/hooks/use-users-query'
import { useDeleteUser } from '@/features/users/hooks/use-user-mutations'
import type { User } from '@/features/users/types/users'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

const UsersPage = () => {
  const router = useRouter()
  const [deletingUser, setDeletingUser] = useState<User | null>(null)

  const { data, isLoading } = useUsersQuery()
  const deleteMutation = useDeleteUser()

  const handleDelete = () => {
    if (!deletingUser) return

    deleteMutation.mutate(deletingUser._id, {
      onSuccess: () => {
        setDeletingUser(null)
      }
    })
  }

  const columns = getUserColumns({
    onEdit: (user) => router.push(`/admin/users/${user._id}/edit`),
    onDelete: (user) => setDeletingUser(user),
    onView: (user) => router.push(`/admin/users/${user._id}`)
  })

  return (
    <RoleGuard allowedRoles={[USER_ROLES.ADMIN]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage all users in the system
            </p>
          </div>
          <Button onClick={() => router.push('/admin/users/create')}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={data?.data || []}
            searchKey="fullName"
            searchPlaceholder="Search users..."
          />
        )}

        {/* Delete Confirmation */}
        <AlertDialog open={!!deletingUser} onOpenChange={() => setDeletingUser(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete <strong>{deletingUser?.fullName}</strong> from the system.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive hover:bg-destructive/90"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </RoleGuard>
  )
}

export default UsersPage
````

## File: src/app/(dashboard)/exam-coordinator/dashboard/page.tsx
````typescript
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

export default function ExamCoordinatorDashboard() {
  return (
    <RoleGuard allowedRoles={[USER_ROLES.EXAM_COORDINATOR]}>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Exam Coordinator Dashboard</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Welcome to the Exam Coordinator Dashboard. Manage exam sessions and registrations here.</p>
        </div>
      </div>
    </RoleGuard>
  )
}
````

## File: src/app/(dashboard)/faculty/dashboard/page.tsx
````typescript
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

export default function FacultyDashboard() {
  return (
    <RoleGuard allowedRoles={[USER_ROLES.FACULTY]}>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Faculty Dashboard</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Welcome to the Faculty Dashboard. Manage your subjects, questions, and exam papers here.</p>
        </div>
      </div>
    </RoleGuard>
  )
}
````

## File: src/app/(dashboard)/invigilator/dashboard/page.tsx
````typescript
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

export default function InvigilatorDashboard() {
  return (
    <RoleGuard allowedRoles={[USER_ROLES.INVIGILATOR]}>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Invigilator Dashboard</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Welcome to the Invigilator Dashboard. View your exam assignments here.</p>
        </div>
      </div>
    </RoleGuard>
  )
}
````

## File: src/app/(dashboard)/student/dashboard/page.tsx
````typescript
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

export default function StudentDashboard() {
  return (
    <RoleGuard allowedRoles={[USER_ROLES.STUDENT]}>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Student Dashboard</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Welcome to the Student Dashboard. View your enrollments, exams, and results here.</p>
        </div>
      </div>
    </RoleGuard>
  )
}
````

## File: src/app/error.tsx
````typescript
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

const Error = ({ error, reset }: ErrorProps) => {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600">
            The page you are looking for doesn&lsquo;t exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/">
              Go Back Home
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="w-full">
            <Link href="/login">
              Go to Login
            </Link>
          </Button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    </div>
  )
}


export default Error
````

## File: src/components/navigation/sidebar.tsx
````typescript
'use client'

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from '@/components/ui/sheet'
import {
  GraduationCapIcon,
  LogOutIcon,
  UserIcon,
  SettingsIcon,
  BellIcon,
  MenuIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-provider'
import { useLogout } from '@/features/auth/hooks/use-auth-mutations'
import { NAVIGATION_ITEMS, type NavItem } from '@/constants/navigation'
import type { UserRole } from '@/constants/roles'
import { cn } from '@/lib/utils'

const getRoleStyle = (role: UserRole) => {
  const roleStyles = {
    admin: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    faculty: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    student: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    exam_coordinator: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    invigilator: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
  } as const

  return roleStyles[role] || 'bg-muted text-muted-foreground'
}

type SidebarContentProps = {
  isCollapsed?: boolean
  onNavigate?: () => void
}

const SidebarContent = ({ isCollapsed = false, onNavigate }: SidebarContentProps) => {
  const { user } = useAuth()
  const logoutMutation = useLogout()
  const pathname = usePathname()

  const navigationItems: NavItem[] = useMemo(() => {
    const userRole = user?.role as UserRole
    return userRole ? NAVIGATION_ITEMS[userRole] || [] : []
  }, [user?.role])

  const handleLogout = useCallback(() => {
    logoutMutation.mutate()
  }, [logoutMutation])

  const getUserInitials = useCallback((name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }, [])

  const formatRole = useCallback((role: string) => {
    return role.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }, [])

  if (!user) return null

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 flex-shrink-0">
            <GraduationCapIcon className="w-6 h-6 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent truncate">
                University
              </h1>
              <p className="text-xs text-muted-foreground -mt-0.5">Management System</p>
            </div>
          )}
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 border-b">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start p-3 h-auto hover:bg-muted/50 transition-colors",
                isCollapsed && "justify-center px-2"
              )}
            >
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={user.profileImage} alt={user.fullName} />
                <AvatarFallback className="gradient-primary text-primary-foreground font-semibold text-sm">
                  {getUserInitials(user.fullName)}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="ml-3 flex-1 text-left min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">
                    {user.fullName}
                  </p>
                  <Badge
                    variant="outline"
                    className={cn("text-xs mt-1", getRoleStyle(user.role))}
                  >
                    {formatRole(user.role)}
                  </Badge>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="start" forceMount>
            <DropdownMenuLabel className="p-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.profileImage} alt={user.fullName} />
                  <AvatarFallback className="gradient-primary text-primary-foreground font-semibold">
                    {getUserInitials(user.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{user.fullName}</p>
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                  <Badge
                    variant="outline"
                    className={cn("mt-1 text-xs", getRoleStyle(user.role))}
                  >
                    {formatRole(user.role)}
                  </Badge>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center cursor-pointer">
                <UserIcon className="mr-3 h-4 w-4" />
                Profile Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center cursor-pointer">
                <SettingsIcon className="mr-3 h-4 w-4" />
                Preferences
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
              disabled={logoutMutation.isPending}
            >
              <LogOutIcon className="mr-3 h-4 w-4" />
              {logoutMutation.isPending ? 'Signing out...' : 'Sign out'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigationItems.map((item: NavItem) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  isCollapsed && "justify-center px-2"
                )}
              >
                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                  {isActive && <div className="w-2 h-2 bg-current rounded-full" />}
                  {!isActive && <div className="w-1.5 h-1.5 bg-current/40 rounded-full" />}
                </div>
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="p-4 border-t space-y-2">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start relative",
            isCollapsed && "justify-center px-2"
          )}
        >
          <BellIcon className="h-5 w-5" />
          {!isCollapsed && <span className="ml-3">Notifications</span>}
          <Badge className="absolute top-1 right-1 w-5 h-5 text-xs bg-destructive hover:bg-destructive p-0 flex items-center justify-center">
            3
          </Badge>
        </Button>

        <Button
          variant="ghost"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className={cn(
            "w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10",
            isCollapsed && "justify-center px-2"
          )}
        >
          <LogOutIcon className="h-5 w-5" />
          {!isCollapsed && (
            <span className="ml-3">
              {logoutMutation.isPending ? 'Signing out...' : 'Sign out'}
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r bg-card transition-all duration-300 relative",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        <SidebarContent isCollapsed={isCollapsed} />

        {/* Collapse Toggle */}
        <Button
          variant="outline"
          size="icon"
          className="absolute -right-3 top-6 h-6 w-6 rounded-full border shadow-sm z-10"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-4 w-4" />
          ) : (
            <ChevronLeftIcon className="h-4 w-4" />
          )}
        </Button>
      </aside>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shadow-lg">
              <MenuIcon className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
````

## File: src/constants/roles.ts
````typescript
export const USER_ROLES = {
  ADMIN: 'admin',
  FACULTY: 'faculty', 
  STUDENT: 'student',
  EXAM_COORDINATOR: 'exam_coordinator',
  INVIGILATOR: 'invigilator'
} as const

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]

export const QUESTION_TYPES = {
  MCQ: 'mcq',
  SHORT_ANSWER: 'short_answer',
  LONG_ANSWER: 'long_answer',
  FILL_BLANK: 'fill_blank',
  TRUE_FALSE: 'true_false'
} as const

export type QuestionType = typeof QUESTION_TYPES[keyof typeof QUESTION_TYPES]

export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
} as const

export type DifficultyLevel = typeof DIFFICULTY_LEVELS[keyof typeof DIFFICULTY_LEVELS]

export const BLOOMS_TAXONOMY = {
  REMEMBER: 'remember',
  UNDERSTAND: 'understand',
  APPLY: 'apply',
  ANALYZE: 'analyze',
  EVALUATE: 'evaluate',
  CREATE: 'create'
} as const

export type BloomsTaxonomy = typeof BLOOMS_TAXONOMY[keyof typeof BLOOMS_TAXONOMY]
````

## File: src/constants/routes.ts
````typescript
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    DEPARTMENTS: '/admin/departments',
    SUBJECTS: '/admin/subjects',
    ROOMS: '/admin/rooms',
    REPORTS: '/admin/reports',
    CALENDAR: '/admin/calendar'
        REPORTS: '/admin/reports',
    GENERATE_REPORT: '/admin/reports/generate',
  },
  
  FACULTY: {
    ROOT: '/faculty',
    DASHBOARD: '/faculty/dashboard',
    SUBJECTS: '/faculty/subjects',
    QUESTIONS: '/faculty/questions',
    EXAM_PAPERS: '/faculty/exam-papers',
    RESULTS: '/faculty/results',
    ASSIGNMENTS: '/faculty/assignments'
  },
  
  STUDENT: {
    ROOT: '/student',
    DASHBOARD: '/student/dashboard',
    ENROLLMENTS: '/student/enrollments',
    EXAMS: '/student/exams',
    RESULTS: '/student/results',
    NOTIFICATIONS: '/student/notifications'
  },
  
  EXAM_COORDINATOR: {
    ROOT: '/exam-coordinator',
    DASHBOARD: '/exam-coordinator/dashboard',
    EXAM_SESSIONS: '/exam-coordinator/exam-sessions',
    REGISTRATIONS: '/exam-coordinator/registrations',
    ROOMS: '/exam-coordinator/rooms',
    ASSIGNMENTS: '/exam-coordinator/assignments'
  },
  
  INVIGILATOR: {
    ROOT: '/invigilator',
    DASHBOARD: '/invigilator/dashboard',
    ASSIGNMENTS: '/invigilator/assignments'
  }
} as const
````

## File: src/features/assignments/hooks/use-assignments.ts
````typescript
import { apiClient } from '@/lib/api/client'
import type { 
  InvigilatorAssignment, 
  CreateAssignmentDto, 
  UpdateAssignmentDto, 
  AssignmentStats, 
  GetAssignmentsParams 
} from '../types/assignments'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

export const invigilatorAssignmentsService = {
  getAll: (params?: GetAssignmentsParams): Promise<PaginatedResponse<InvigilatorAssignment>> =>
    apiClient.get('/api/v1/invigilator-assignments', { params }),

  getById: (id: string): Promise<ApiResponse<InvigilatorAssignment>> =>
    apiClient.get(`/api/v1/invigilator-assignments/${id}`),

  getBySession: (sessionId: string): Promise<ApiResponse<InvigilatorAssignment[]>> =>
    apiClient.get(`/api/v1/invigilator-assignments/session/${sessionId}`),

  getByInvigilator: (invigilatorId: string, params?: { upcoming?: boolean }): Promise<ApiResponse<InvigilatorAssignment[]>> =>
    apiClient.get(`/api/v1/invigilator-assignments/invigilator/${invigilatorId}`, { params }),

  getStats: (): Promise<ApiResponse<AssignmentStats>> =>
    apiClient.get('/api/v1/invigilator-assignments/stats'),

  create: (data: CreateAssignmentDto): Promise<ApiResponse<InvigilatorAssignment>> =>
    apiClient.post('/api/v1/invigilator-assignments', data),

  update: (id: string, data: UpdateAssignmentDto): Promise<ApiResponse<InvigilatorAssignment>> =>
    apiClient.patch(`/api/v1/invigilator-assignments/${id}`, data),

  confirm: (id: string): Promise<ApiResponse<InvigilatorAssignment>> =>
    apiClient.patch(`/api/v1/invigilator-assignments/${id}/confirm`),

  decline: (id: string, reason?: string): Promise<ApiResponse<InvigilatorAssignment>> =>
    apiClient.patch(`/api/v1/invigilator-assignments/${id}/decline`, { reason }),

  complete: (id: string, notes?: string): Promise<ApiResponse<InvigilatorAssignment>> =>
    apiClient.patch(`/api/v1/invigilator-assignments/${id}/complete`, { notes }),

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/invigilator-assignments/${id}`)
}
````

## File: src/features/assignments/types/assignments.ts
````typescript
export const ASSIGNMENT_TYPE = {
  CHIEF: 'chief',
  ASSISTANT: 'assistant',
  SUBSTITUTE: 'substitute'
} as const

export type AssignmentType = typeof ASSIGNMENT_TYPE[keyof typeof ASSIGNMENT_TYPE]

export const ASSIGNMENT_STATUS = {
  ASSIGNED: 'assigned',
  CONFIRMED: 'confirmed',
  DECLINED: 'declined',
  COMPLETED: 'completed'
} as const

export type AssignmentStatus = typeof ASSIGNMENT_STATUS[keyof typeof ASSIGNMENT_STATUS]

export type InvigilatorAssignment = {
  _id: string
  sessionId: string
  examTitle?: string
  examDateTime?: string
  roomNumber?: string
  invigilatorId: string
  invigilatorName?: string
  invigilatorEmail?: string
  assignmentType: AssignmentType
  assignedBy: string
  assignedByName?: string
  assignmentDate: string
  status: AssignmentStatus
  confirmedAt?: string
  declinedAt?: string
  declineReason?: string
  completedAt?: string
  notes?: string
  specialInstructions?: string
  createdAt: string
  updatedAt: string
}

export type CreateAssignmentDto = {
  sessionId: string
  invigilatorId: string
  assignmentType: AssignmentType
  assignmentDate: string
  notes?: string
  specialInstructions?: string
}

export type UpdateAssignmentDto = Partial<CreateAssignmentDto> & {
  status?: AssignmentStatus
  confirmedAt?: string
  declinedAt?: string
  declineReason?: string
  completedAt?: string
}

export type AssignmentStats = {
  totalAssignments: number
  assignmentsByStatus: Record<string, number>
  assignmentsByType: Record<string, number>
}

export type GetAssignmentsParams = {
  sessionId?: string
  invigilatorId?: string
  assignmentType?: AssignmentType
  status?: AssignmentStatus
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
````

## File: src/features/auth/hooks/use-api.ts
````typescript
import { apiClient } from '@/lib/api/client'
import type { LoginDto, RegisterDto, LoginResponse } from '../types/auth'
import { ApiResponse } from '@/types/common'

export const authService = {
  login: (data: LoginDto): Promise<LoginResponse> =>   
    apiClient.post('/api/v1/auth/login', data),

  register: (data: RegisterDto): Promise<LoginResponse> =>
    apiClient.post('/api/v1/auth/register', data),

  logout: (): Promise<ApiResponse<{ message: string }>> =>
    apiClient.post('/api/v1/auth/logout'),

  refreshToken: (): Promise<ApiResponse<{ accessToken: string }>> =>
    apiClient.post('/api/v1/auth/refresh'),

  forgotPassword: (email: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.post('/api/v1/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.post('/api/v1/auth/reset-password', { token, password }),

  setToken: (token: string | null): void => {
    apiClient.setToken(token)
  }
}
````

## File: src/features/calendar/hooks/use-calendar.ts
````typescript
import { apiClient } from '@/lib/api/client'
import type { 
  AcademicCalendar, 
  CreateCalendarDto, 
  UpdateCalendarDto, 
  CalendarSummary, 
  GetCalendarParams 
} from '../types/calendar'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

export const academicCalendarService = {
  getAll: (params?: GetCalendarParams): Promise<PaginatedResponse<AcademicCalendar>> =>
    apiClient.get('/api/v1/academic-calendar', { params }),

  getById: (id: string): Promise<ApiResponse<AcademicCalendar>> =>
    apiClient.get(`/api/v1/academic-calendar/${id}`),

  getCurrent: (): Promise<ApiResponse<AcademicCalendar | null>> =>
    apiClient.get('/api/v1/academic-calendar/current'),

  getSummary: (): Promise<ApiResponse<CalendarSummary>> =>
    apiClient.get('/api/v1/academic-calendar/summary'),

  create: (data: CreateCalendarDto): Promise<ApiResponse<AcademicCalendar>> =>
    apiClient.post('/api/v1/academic-calendar', data),

  update: (id: string, data: UpdateCalendarDto): Promise<ApiResponse<AcademicCalendar>> =>
    apiClient.patch(`/api/v1/academic-calendar/${id}`, data),

  setCurrent: (id: string): Promise<ApiResponse<AcademicCalendar>> =>
    apiClient.patch(`/api/v1/academic-calendar/${id}/set-current`),

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/academic-calendar/${id}`)
}
````

## File: src/features/calendar/types/calendar.ts
````typescript
export type AcademicCalendar = {
  _id: string
  academicYear: string
  semester: number
  semesterName: string
  semesterStart: string
  semesterEnd: string
  examStart: string
  examEnd: string
  resultPublishDate?: string
  isCurrent: boolean
  isActive: boolean
  description?: string
  examDuration: number
  createdAt: string
  updatedAt: string
}

export type CreateCalendarDto = {
  academicYear: string
  semester: number
  semesterStart: string
  semesterEnd: string
  examStart: string
  examEnd: string
  resultPublishDate?: string
  isCurrent?: boolean
  description?: string
}

export type UpdateCalendarDto = Partial<CreateCalendarDto> & {
  isActive?: boolean
}

export type CalendarSummary = {
  currentSemester: AcademicCalendar | null
  upcomingDeadlines: Array<{
    type: string
    date: string
    description: string
  }>
}

export type GetCalendarParams = {
  academicYear?: string
  semester?: number
  isCurrent?: boolean
  isActive?: boolean
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
````

## File: src/features/dashboard/hooks/use-dashboard.ts
````typescript
import { apiClient } from '@/lib/api/client'
import type { 
  AdminDashboard, 
  FacultyDashboard, 
  StudentDashboard, 
  DashboardStats 
} from '../types/dashboard'
import type { ApiResponse } from '@/types/common'

export const dashboardService = {
  getAdminDashboard: (): Promise<ApiResponse<AdminDashboard>> =>
    apiClient.get('/api/v1/dashboard/admin'),

  getFacultyDashboard: (): Promise<ApiResponse<FacultyDashboard>> =>
    apiClient.get('/api/v1/dashboard/faculty'),

  getStudentDashboard: (): Promise<ApiResponse<StudentDashboard>> =>
    apiClient.get('/api/v1/dashboard/student'),

  getDashboard: (): Promise<ApiResponse<DashboardStats>> =>
    apiClient.get('/api/v1/dashboard'),

  getSystemHealth: (): Promise<ApiResponse<Record<string, boolean>>> =>
    apiClient.get('/api/v1/dashboard/system-health'),

  getRecentActivity: (params?: { limit?: number }): Promise<ApiResponse<DashboardStats['recentActivity']>> =>
    apiClient.get('/api/v1/dashboard/recent-activity', { params })
}
````

## File: src/features/dashboard/types/dashboard.ts
````typescript
export type DashboardActivity = {
  id: string
  type: string
  description: string
  timestamp: string
  userId: string
  userName: string
}

export type DashboardStats = {
  totalUsers: number
  totalDepartments: number
  totalSubjects: number
  totalExamSessions: number
  upcomingExams: number
  recentActivity: DashboardActivity[]
}

export type AdminDashboard = DashboardStats & {
  usersByRole: Record<string, number>
  examsByStatus: Record<string, number>
  systemHealth: {
    database: boolean
    storage: boolean
    notifications: boolean
  }
}

export type FacultyDashboard = {
  mySubjects: number
  myQuestions: number
  myExamPapers: number
  upcomingExams: Array<{
    id: string
    title: string
    date: string
    room: string
  }>
  pendingGrading: number
  recentActivity: DashboardActivity[]
}

export type StudentDashboard = {
  enrolledSubjects: number
  upcomingExams: Array<{
    id: string
    title: string
    date: string
    room: string
  }>
  completedExams: number
  pendingResults: number
  recentGrades: Array<{
    id: string
    subject: string
    marks: number
    grade: string
  }>
  notifications: Array<{
    id: string
    title: string
    message: string
    time: string
  }>
}
````

## File: src/features/departments/hooks/use-departments.ts
````typescript
import { apiClient } from '@/lib/api/client'
import type { 
  Department, 
  CreateDepartmentDto, 
  UpdateDepartmentDto, 
  DepartmentStats, 
  GetDepartmentsParams 
} from '../types/departments'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

export const departmentsService = {
  getAll: (params?: GetDepartmentsParams): Promise<PaginatedResponse<Department>> =>
    apiClient.get('/api/v1/departments', { params }),

  getById: (id: string): Promise<ApiResponse<Department>> =>
    apiClient.get(`/api/v1/departments/${id}`),

  getStats: (): Promise<ApiResponse<DepartmentStats>> =>
    apiClient.get('/api/v1/departments/stats'),

  create: (data: CreateDepartmentDto): Promise<ApiResponse<Department>> =>
    apiClient.post('/api/v1/departments', data),

  update: (id: string, data: UpdateDepartmentDto): Promise<ApiResponse<Department>> =>
    apiClient.patch(`/api/v1/departments/${id}`, data),

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/departments/${id}`)
}
````

## File: src/features/departments/types/departments.ts
````typescript
export type Department = {
  _id: string
  departmentCode: string
  departmentName: string
  headOfDepartment?: string
  headOfDepartmentName?: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type CreateDepartmentDto = {
  departmentCode: string
  departmentName: string
  headOfDepartment?: string
  description?: string
}

export type UpdateDepartmentDto = Partial<Omit<CreateDepartmentDto, 'departmentCode'>> & {
  isActive?: boolean
}

export type DepartmentStats = {
  totalDepartments: number
  activeDepartments: number
  departmentsByFaculty: Record<string, number>
}

export type GetDepartmentsParams = {
  isActive?: boolean
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
````

## File: src/features/enrollments/hooks/use-enrollments.ts
````typescript
import { apiClient } from '@/lib/api/client'
import type { 
  StudentEnrollment, 
  CreateEnrollmentDto, 
  UpdateEnrollmentDto, 
  EnrollmentStats, 
  GetEnrollmentsParams 
} from '../types/enrollments'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

export const studentEnrollmentsService = {
  getAll: (params?: GetEnrollmentsParams): Promise<PaginatedResponse<StudentEnrollment>> =>
    apiClient.get('/api/v1/student-enrollments', { params }),

  getById: (id: string): Promise<ApiResponse<StudentEnrollment>> =>
    apiClient.get(`/api/v1/student-enrollments/${id}`),

  getByStudent: (studentId: string, params?: { academicYear?: string; semester?: number }): Promise<ApiResponse<StudentEnrollment[]>> =>
    apiClient.get(`/api/v1/student-enrollments/student/${studentId}`, { params }),

  getBySubject: (subjectId: string, params?: { academicYear?: string; semester?: number }): Promise<ApiResponse<StudentEnrollment[]>> =>
    apiClient.get(`/api/v1/student-enrollments/subject/${subjectId}`, { params }),

  getStats: (): Promise<ApiResponse<EnrollmentStats>> =>
    apiClient.get('/api/v1/student-enrollments/stats'),

  create: (data: CreateEnrollmentDto): Promise<ApiResponse<StudentEnrollment>> =>
    apiClient.post('/api/v1/student-enrollments', data),

  update: (id: string, data: UpdateEnrollmentDto): Promise<ApiResponse<StudentEnrollment>> =>
    apiClient.patch(`/api/v1/student-enrollments/${id}`, data),

  withdraw: (id: string, reason?: string): Promise<ApiResponse<StudentEnrollment>> =>
    apiClient.patch(`/api/v1/student-enrollments/${id}/withdraw`, { reason }),

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/student-enrollments/${id}`)
}
````

## File: src/features/enrollments/types/enrollments.ts
````typescript
export const ENROLLMENT_STATUS = {
  ACTIVE: 'active',
  WITHDRAWN: 'withdrawn',
  COMPLETED: 'completed'
} as const

export type EnrollmentStatus = typeof ENROLLMENT_STATUS[keyof typeof ENROLLMENT_STATUS]

export type StudentEnrollment = {
  _id: string
  studentId: string
  studentName?: string
  studentEmail?: string
  subjectId: string
  subjectCode?: string
  subjectName?: string
  subjectCredits?: number
  academicYear: string
  semester: number
  enrollmentDate: string
  status: EnrollmentStatus
  withdrawnDate?: string
  withdrawnReason?: string
  enrolledBy: string
  enrolledByName?: string
  createdAt: string
  updatedAt: string
}

export type CreateEnrollmentDto = {
  studentId: string
  subjectId: string
  academicYear: string
  semester: number
  enrollmentDate: string
}

export type UpdateEnrollmentDto = Partial<CreateEnrollmentDto> & {
  status?: EnrollmentStatus
  withdrawnDate?: string
  withdrawnReason?: string
}

export type EnrollmentStats = {
  totalEnrollments: number
  enrollmentsByStatus: Record<string, number>
  enrollmentsBySubject: Record<string, number>
}

export type GetEnrollmentsParams = {
  studentId?: string
  subjectId?: string
  academicYear?: string
  semester?: number
  status?: EnrollmentStatus
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
````

## File: src/features/exam-papers/hooks/use-exam-papers.ts
````typescript
import { apiClient } from '@/lib/api/client'
import type { 
  ExamPaper, 
  CreateExamPaperDto, 
  UpdateExamPaperDto, 
  GeneratePaperDto,
  ExamPaperStats, 
  GetExamPapersParams 
} from '../types/exam-papers'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

export const examPapersService = {
  getAll: (params?: GetExamPapersParams): Promise<PaginatedResponse<ExamPaper>> =>
    apiClient.get('/api/v1/exam-papers', { params }),

  getById: (id: string, params?: { includeQuestions?: boolean }): Promise<ApiResponse<ExamPaper>> =>
    apiClient.get(`/api/v1/exam-papers/${id}`, { params }),

  getStats: (): Promise<ApiResponse<ExamPaperStats>> =>
    apiClient.get('/api/v1/exam-papers/stats'),

  create: (data: CreateExamPaperDto): Promise<ApiResponse<ExamPaper>> =>
    apiClient.post('/api/v1/exam-papers', data),

  generate: (data: GeneratePaperDto): Promise<ApiResponse<ExamPaper>> =>
    apiClient.post('/api/v1/exam-papers/generate', data),

  update: (id: string, data: UpdateExamPaperDto): Promise<ApiResponse<ExamPaper>> =>
    apiClient.patch(`/api/v1/exam-papers/${id}`, data),

  duplicate: (id: string): Promise<ApiResponse<ExamPaper>> =>
    apiClient.post(`/api/v1/exam-papers/${id}/duplicate`),

  finalize: (id: string): Promise<ApiResponse<ExamPaper>> =>
    apiClient.patch(`/api/v1/exam-papers/${id}/finalize`),

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/exam-papers/${id}`)
}
````

## File: src/features/exam-papers/types/exam-papers.ts
````typescript
import type { QuestionType, DifficultyLevel } from '@/constants/roles'

export const EXAM_TYPES = {
  MIDTERM: 'midterm',
  FINAL: 'final',
  QUIZ: 'quiz',
  ASSIGNMENT: 'assignment'
} as const

export type ExamType = typeof EXAM_TYPES[keyof typeof EXAM_TYPES]

export type ExamPaper = {
  _id: string
  subjectId: string
  subjectCode?: string
  subjectName?: string
  paperTitle: string
  paperType: ExamType
  totalMarks: number
  durationMinutes: number
  formattedDuration: string
  instructions?: string
  createdBy: string
  createdByName?: string
  isFinalized: boolean
  finalizedAt?: string
  finalizedBy?: string
  versionNumber: number
  parentPaperId?: string
  isActive: boolean
  questions?: PaperQuestion[]
  questionCount?: number
  createdAt: string
  updatedAt: string
}

export type PaperQuestion = {
  _id: string
  questionId: string
  questionText: string
  questionType: string
  difficultyLevel: string
  questionOrder: number
  marksAllocated: number
  section: string
  isOptional: boolean
  createdAt: string
}

export type CreateExamPaperDto = {
  subjectId: string
  paperTitle: string
  paperType: ExamType
  totalMarks: number
  durationMinutes: number
  instructions?: string
  questions: Array<{
    questionId: string
    questionOrder: number
    marksAllocated: number
    section?: string
    isOptional?: boolean
  }>
}

export type UpdateExamPaperDto = Partial<CreateExamPaperDto> & {
  isActive?: boolean
}

export type GeneratePaperDto = {
  subjectId: string
  paperTitle: string
  paperType: ExamType
  durationMinutes: number
  instructions?: string
  questionCriteria: Array<{
    topic?: string
    difficultyLevel?: DifficultyLevel
    questionType?: QuestionType
    count: number
    marksPerQuestion: number
    section?: string
  }>
}

export type ExamPaperStats = {
  totalPapers: number
  papersByType: Record<string, number>
  papersBySubject: Record<string, number>
  finalizedPapers: number
}

export type GetExamPapersParams = {
  subjectId?: string
  paperType?: ExamType
  isFinalized?: boolean
  isActive?: boolean
  myPapers?: boolean
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
````

## File: src/features/exam-sessions/hooks/use-exam-sessions.ts
````typescript
import { apiClient } from '@/lib/api/client'
import type { 
  ExamSession, 
  CreateExamSessionDto, 
  UpdateExamSessionDto, 
  ExamSessionStats, 
  GetExamSessionsParams 
} from '../types/exam-sessions'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

export const examSessionsService = {
  getAll: (params?: GetExamSessionsParams): Promise<PaginatedResponse<ExamSession>> =>
    apiClient.get('/api/v1/exam-sessions', { params }),

  getById: (id: string): Promise<ApiResponse<ExamSession>> =>
    apiClient.get(`/api/v1/exam-sessions/${id}`),

  getUpcoming: (params?: { limit?: number }): Promise<ApiResponse<ExamSession[]>> =>
    apiClient.get('/api/v1/exam-sessions/upcoming', { params }),

  getStats: (): Promise<ApiResponse<ExamSessionStats>> =>
    apiClient.get('/api/v1/exam-sessions/stats'),

  create: (data: CreateExamSessionDto): Promise<ApiResponse<ExamSession>> =>
    apiClient.post('/api/v1/exam-sessions', data),

  update: (id: string, data: UpdateExamSessionDto): Promise<ApiResponse<ExamSession>> =>
    apiClient.patch(`/api/v1/exam-sessions/${id}`, data),

  cancel: (id: string, reason?: string): Promise<ApiResponse<ExamSession>> =>
    apiClient.patch(`/api/v1/exam-sessions/${id}/cancel`, { reason }),

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/exam-sessions/${id}`)
}
````

## File: src/features/exam-sessions/types/exam-sessions.ts
````typescript
export const EXAM_SESSION_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const

export type ExamSessionStatus = typeof EXAM_SESSION_STATUS[keyof typeof EXAM_SESSION_STATUS]

export type ExamSession = {
  _id: string
  paperId: string
  paperTitle?: string
  subjectCode?: string
  subjectName?: string
  examTitle: string
  examDateTime: string
  durationMinutes: number
  formattedDuration: string
  roomId: string
  roomNumber?: string
  building?: string
  maxStudents: number
  currentStudents: number
  instructions?: string
  status: ExamSessionStatus
  createdBy: string
  createdByName?: string
  academicYear: string
  semester: number
  createdAt: string
  updatedAt: string
}

export type CreateExamSessionDto = {
  paperId: string
  examTitle: string
  examDateTime: string
  durationMinutes: number
  roomId: string
  maxStudents: number
  instructions?: string
  academicYear: string
  semester: number
}

export type UpdateExamSessionDto = Partial<CreateExamSessionDto> & {
  status?: ExamSessionStatus
}

export type ExamSessionStats = {
  totalSessions: number
  sessionsByStatus: Record<string, number>
  upcomingSessions: number
  completedSessions: number
}

export type GetExamSessionsParams = {
  paperId?: string
  roomId?: string
  status?: ExamSessionStatus
  academicYear?: string
  semester?: number
  dateFrom?: string
  dateTo?: string
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
````

## File: src/features/file-uploads/hooks/use-file-uploads.ts
````typescript
import { apiClient } from '@/lib/api/client'
import type { 
  FileUpload, 
  FileUploadStats, 
  GetFileUploadsParams 
} from '../types/file-uploads'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

export const fileUploadsService = {
  uploadSingle: (file: File, relatedTable?: string, relatedId?: string, description?: string): Promise<ApiResponse<FileUpload>> => {
    const formData = new FormData()
    formData.append('file', file)
    if (relatedTable) formData.append('relatedTable', relatedTable)
    if (relatedId) formData.append('relatedId', relatedId)
    if (description) formData.append('description', description)
    
    return apiClient.upload('/api/v1/file-uploads/single', formData)
  },

  uploadMultiple: (files: File[], relatedTable?: string, relatedId?: string): Promise<ApiResponse<FileUpload[]>> => {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    if (relatedTable) formData.append('relatedTable', relatedTable)
    if (relatedId) formData.append('relatedId', relatedId)
    
    return apiClient.upload('/api/v1/file-uploads/multiple', formData)
  },

  getAll: (params?: GetFileUploadsParams): Promise<PaginatedResponse<FileUpload>> => 
    apiClient.get('/api/v1/file-uploads', { params }),

  getById: (id: string): Promise<ApiResponse<FileUpload>> =>
    apiClient.get(`/api/v1/file-uploads/${id}`),

  getByRelated: (relatedTable: string, relatedId: string): Promise<ApiResponse<FileUpload[]>> =>
    apiClient.get(`/api/v1/file-uploads/related/${relatedTable}/${relatedId}`),

  getStats: (): Promise<ApiResponse<FileUploadStats>> =>
    apiClient.get('/api/v1/file-uploads/stats'),

  download: (id: string): Promise<Blob> =>
    apiClient.get(`/api/v1/file-uploads/${id}/download`),

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/file-uploads/${id}`)
}
````

## File: src/features/file-uploads/types/file-uploads.ts
````typescript
export type FileUpload = {
  _id: string
  originalName: string
  fileName: string
  filePath: string
  mimeType: string
  fileSize: number
  relatedTable?: string
  relatedId?: string
  description?: string
  uploadedBy: string
  uploadedByName?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type CreateFileUploadDto = {
  file: File
  relatedTable?: string
  relatedId?: string
  description?: string
}

export type FileUploadStats = {
  totalFiles: number
  totalSize: number
  filesByType: Record<string, number>
}

export type GetFileUploadsParams = {
  relatedTable?: string
  relatedId?: string
  mimeType?: string
  uploadedBy?: string
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
````

## File: src/features/notifications/hooks/use-notifications.ts
````typescript
import { apiClient } from '@/lib/api/client'
import type { 
  Notification, 
  CreateNotificationDto, 
  UpdateNotificationDto, 
  NotificationStats, 
  GetNotificationsParams 
} from '../types/notifications'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

export const notificationsService = {
  getAll: (params?: GetNotificationsParams): Promise<PaginatedResponse<Notification>> =>
    apiClient.get('/api/v1/notifications', { params }),

  getById: (id: string): Promise<ApiResponse<Notification>> =>
    apiClient.get(`/api/v1/notifications/${id}`),

  getUnread: (params?: { limit?: number }): Promise<ApiResponse<Notification[]>> =>
    apiClient.get('/api/v1/notifications/unread', { params }),

  getStats: (): Promise<ApiResponse<NotificationStats>> =>
    apiClient.get('/api/v1/notifications/stats'),

  create: (data: CreateNotificationDto): Promise<ApiResponse<Notification>> =>
    apiClient.post('/api/v1/notifications', data),

  createBulk: (data: CreateNotificationDto[]): Promise<ApiResponse<Notification[]>> =>
    apiClient.post('/api/v1/notifications/bulk', { notifications: data }),

  update: (id: string, data: UpdateNotificationDto): Promise<ApiResponse<Notification>> =>
    apiClient.patch(`/api/v1/notifications/${id}`, data),

  markAsRead: (id: string): Promise<ApiResponse<Notification>> =>
    apiClient.patch(`/api/v1/notifications/${id}/mark-read`),

  markAllAsRead: (): Promise<ApiResponse<{ message: string; count: number }>> =>
    apiClient.patch('/api/v1/notifications/mark-all-read'),

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/notifications/${id}`),

  deleteAll: (): Promise<ApiResponse<{ message: string; count: number }>> =>
    apiClient.delete('/api/v1/notifications/all')
}
````

## File: src/features/notifications/types/notifications.ts
````typescript
export const NOTIFICATION_TYPE = {
  EXAM_SCHEDULE: 'exam_schedule',
  RESULT: 'result',
  ANNOUNCEMENT: 'announcement',
  REMINDER: 'reminder',
  ALERT: 'alert'
} as const

export type NotificationType = typeof NOTIFICATION_TYPE[keyof typeof NOTIFICATION_TYPE]

export const NOTIFICATION_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
} as const

export type NotificationPriority = typeof NOTIFICATION_PRIORITY[keyof typeof NOTIFICATION_PRIORITY]

export type Notification = {
  _id: string
  recipientId: string
  recipientName?: string
  senderId?: string
  senderName?: string
  title: string
  message: string
  notificationType: NotificationType
  isRead: boolean
  priority: NotificationPriority
  relatedTable?: string
  relatedId?: string
  scheduledAt?: string
  sentAt?: string
  readAt?: string
  createdAt: string
}

export type CreateNotificationDto = {
  recipientId: string
  title: string
  message: string
  notificationType: NotificationType
  priority?: NotificationPriority
  relatedTable?: string
  relatedId?: string
  scheduledAt?: string
}

export type UpdateNotificationDto = Partial<CreateNotificationDto> & {
  isRead?: boolean
  readAt?: string
  sentAt?: string
}

export type NotificationStats = {
  totalNotifications: number
  unreadCount: number
  notificationsByType: Record<string, number>
}

export type GetNotificationsParams = {
  recipientId?: string
  notificationType?: NotificationType
  isRead?: boolean
  priority?: NotificationPriority
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
````

## File: src/features/questions/hooks/use-questions.ts
````typescript
import { apiClient } from '@/lib/api/client'
import type { 
  Question, 
  CreateQuestionDto, 
  UpdateQuestionDto, 
  QuestionStats, 
  GetQuestionsParams 
} from '../types/questions'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

export const questionsService = {
  getAll: (params?: GetQuestionsParams): Promise<PaginatedResponse<Question>> =>
    apiClient.get('/api/v1/questions', { params }),

  getById: (id: string): Promise<ApiResponse<Question>> =>
    apiClient.get(`/api/v1/questions/${id}`),

  getBySubject: (subjectId: string, params?: { includePrivate?: boolean }): Promise<ApiResponse<Question[]>> =>
    apiClient.get(`/api/v1/questions/subject/${subjectId}`, { params }),

  getStats: (): Promise<ApiResponse<QuestionStats>> =>
    apiClient.get('/api/v1/questions/stats'),

  create: (data: CreateQuestionDto): Promise<ApiResponse<Question>> =>
    apiClient.post('/api/v1/questions', data),

  update: (id: string, data: UpdateQuestionDto): Promise<ApiResponse<Question>> =>
    apiClient.patch(`/api/v1/questions/${id}`, data),

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/questions/${id}`)
}
````

## File: src/features/questions/types/questions.ts
````typescript
import type { QuestionType, DifficultyLevel, BloomsTaxonomy } from '@/constants/roles'

export type Question = {
  _id: string
  subjectId: string
  subjectCode?: string
  subjectName?: string
  questionText: string
  questionDescription?: string
  questionType: QuestionType
  difficultyLevel: DifficultyLevel
  marks: number
  topic?: string
  subtopic?: string
  bloomsTaxonomy?: BloomsTaxonomy
  keywords?: string
  usageCount: number
  isPublic: boolean
  createdBy: string
  createdByName?: string
  isActive: boolean
  options?: QuestionOption[]
  createdAt: string
  updatedAt: string
}

export type QuestionOption = {
  _id: string
  optionText: string
  isCorrect: boolean
  optionOrder: number
  createdAt: string
}

export type CreateQuestionDto = {
  subjectId: string
  questionText: string
  questionDescription?: string
  questionType: QuestionType
  difficultyLevel: DifficultyLevel
  marks: number
  topic?: string
  subtopic?: string
  bloomsTaxonomy?: BloomsTaxonomy
  keywords?: string
  isPublic?: boolean
  options?: Array<{
    optionText: string
    isCorrect: boolean
    optionOrder: number
  }>
}

export type UpdateQuestionDto = Partial<CreateQuestionDto> & {
  isActive?: boolean
}

export type QuestionStats = {
  totalQuestions: number
  questionsByType: Record<string, number>
  questionsByDifficulty: Record<string, number>
  questionsBySubject: Record<string, number>
}

export type GetQuestionsParams = {
  subjectId?: string
  questionType?: QuestionType
  difficultyLevel?: DifficultyLevel
  topic?: string
  isPublic?: boolean
  isActive?: boolean
  myQuestions?: boolean
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
````

## File: src/features/registrations/hooks/use-registrations.ts
````typescript
import { apiClient } from '@/lib/api/client'
import type { 
  ExamRegistration, 
  CreateRegistrationDto, 
  UpdateRegistrationDto, 
  RegistrationStats, 
  GetRegistrationsParams 
} from '../types/registrations'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

export const examRegistrationsService = {
  getAll: (params?: GetRegistrationsParams): Promise<PaginatedResponse<ExamRegistration>> =>
    apiClient.get('/api/v1/exam-registrations', { params }),

  getById: (id: string): Promise<ApiResponse<ExamRegistration>> =>
    apiClient.get(`/api/v1/exam-registrations/${id}`),

  getBySession: (sessionId: string): Promise<ApiResponse<ExamRegistration[]>> =>
    apiClient.get(`/api/v1/exam-registrations/session/${sessionId}`),

  getByStudent: (studentId: string, params?: { upcoming?: boolean }): Promise<ApiResponse<ExamRegistration[]>> =>
    apiClient.get(`/api/v1/exam-registrations/student/${studentId}`, { params }),

  getStats: (): Promise<ApiResponse<RegistrationStats>> =>
    apiClient.get('/api/v1/exam-registrations/stats'),

  create: (data: CreateRegistrationDto): Promise<ApiResponse<ExamRegistration>> =>
    apiClient.post('/api/v1/exam-registrations', data),

  update: (id: string, data: UpdateRegistrationDto): Promise<ApiResponse<ExamRegistration>> =>
    apiClient.patch(`/api/v1/exam-registrations/${id}`, data),

  cancel: (id: string, reason?: string): Promise<ApiResponse<ExamRegistration>> =>
    apiClient.patch(`/api/v1/exam-registrations/${id}/cancel`, { reason }),

  markAttendance: (id: string, status: string): Promise<ApiResponse<ExamRegistration>> =>
    apiClient.patch(`/api/v1/exam-registrations/${id}/attendance`, { status }),

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/exam-registrations/${id}`)
}
````

## File: src/features/registrations/types/registrations.ts
````typescript
export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late'
} as const

export type AttendanceStatus = typeof ATTENDANCE_STATUS[keyof typeof ATTENDANCE_STATUS]

export const REGISTRATION_STATUS = {
  REGISTERED: 'registered',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled'
} as const

export type RegistrationStatus = typeof REGISTRATION_STATUS[keyof typeof REGISTRATION_STATUS]

export type ExamRegistration = {
  _id: string
  sessionId: string
  examTitle?: string
  examDateTime?: string
  roomNumber?: string
  studentId: string
  studentName?: string
  studentEmail?: string
  registrationDate: string
  seatNumber?: string
  attendanceStatus?: AttendanceStatus
  specialRequirements?: string
  status: RegistrationStatus
  registeredBy: string
  registeredByName?: string
  cancelledAt?: string
  cancellationReason?: string
  createdAt: string
  updatedAt: string
}

export type CreateRegistrationDto = {
  sessionId: string
  studentId: string
  registrationDate: string
  seatNumber?: string
  specialRequirements?: string
}

export type UpdateRegistrationDto = Partial<CreateRegistrationDto> & {
  status?: RegistrationStatus
  attendanceStatus?: AttendanceStatus
  cancelledAt?: string
  cancellationReason?: string
}

export type RegistrationStats = {
  totalRegistrations: number
  registrationsByStatus: Record<string, number>
  attendanceStats: Record<string, number>
}

export type GetRegistrationsParams = {
  sessionId?: string
  studentId?: string
  status?: RegistrationStatus
  attendanceStatus?: AttendanceStatus
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
````

## File: src/features/reports/hooks/use-reports.ts
````typescript
import { apiClient } from '@/lib/api/client'
import type { 
  ReportConfig, 
  ReportResult, 
  ReportType 
} from '../types/reports'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

export const reportsService = {
  generate: (data: ReportConfig): Promise<ApiResponse<ReportResult>> =>
    apiClient.post('/api/v1/reports/generate', data),

  getReportTypes: (): Promise<ApiResponse<ReportType[]>> =>
    apiClient.get('/api/v1/reports/types'),

  getReportHistory: (params?: { limit?: number; page?: number }): Promise<PaginatedResponse<ReportResult>> =>
    apiClient.get('/api/v1/reports/history', { params }),

  download: (reportId: string): Promise<Blob> =>
    apiClient.get(`/api/v1/reports/${reportId}/download`),

  delete: (reportId: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/reports/${reportId}`)
}
````

## File: src/features/reports/types/reports.ts
````typescript
export const REPORT_FORMAT = {
  PDF: 'pdf',
  EXCEL: 'excel',
  CSV: 'csv',
  JSON: 'json'
} as const

export type ReportFormat = typeof REPORT_FORMAT[keyof typeof REPORT_FORMAT]

export type ReportConfig = {
  reportType: string
  title: string
  description: string
  parameters: Record<string, unknown>
  filters: Record<string, unknown>
  format: ReportFormat
}

export type ReportResult = {
  reportId: string
  title: string
  generatedAt: string
  generatedBy: string
  format: ReportFormat
  filePath?: string
  data?: Record<string, unknown>
}

export type ReportType = {
  id: string
  name: string
  description: string
  category: string
  parameters: Array<{
    name: string
    type: string
    required: boolean
    options?: string[]
  }>
}
````

## File: src/features/results/hooks/use-results.ts
````typescript
import { apiClient } from '@/lib/api/client'
import type { 
  Result, 
  CreateResultDto, 
  UpdateResultDto, 
  ResultStats, 
  GetResultsParams 
} from '../types/results'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

export const resultsService = {
  getAll: (params?: GetResultsParams): Promise<PaginatedResponse<Result>> =>
    apiClient.get('/api/v1/results', { params }),

  getById: (id: string): Promise<ApiResponse<Result>> =>
    apiClient.get(`/api/v1/results/${id}`),

  getBySession: (sessionId: string): Promise<ApiResponse<Result[]>> =>
    apiClient.get(`/api/v1/results/session/${sessionId}`),

  getByStudent: (studentId: string, params?: { published?: boolean }): Promise<ApiResponse<Result[]>> =>
    apiClient.get(`/api/v1/results/student/${studentId}`, { params }),

  getStats: (params?: { sessionId?: string; subjectId?: string }): Promise<ApiResponse<ResultStats>> =>
    apiClient.get('/api/v1/results/stats', { params }),

  create: (data: CreateResultDto): Promise<ApiResponse<Result>> =>
    apiClient.post('/api/v1/results', data),

  createBulk: (data: CreateResultDto[]): Promise<ApiResponse<Result[]>> =>
    apiClient.post('/api/v1/results/bulk', { results: data }),

  update: (id: string, data: UpdateResultDto): Promise<ApiResponse<Result>> =>
    apiClient.patch(`/api/v1/results/${id}`, data),

  verify: (id: string): Promise<ApiResponse<Result>> =>
    apiClient.patch(`/api/v1/results/${id}/verify`),

  publish: (id: string): Promise<ApiResponse<Result>> =>
    apiClient.patch(`/api/v1/results/${id}/publish`),

  publishBulk: (sessionId: string): Promise<ApiResponse<Result[]>> =>
    apiClient.patch(`/api/v1/results/session/${sessionId}/publish`),

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/results/${id}`)
}
````

## File: src/features/results/types/results.ts
````typescript
export type Result = {
  _id: string
  sessionId: string
  examTitle?: string
  subjectCode?: string
  subjectName?: string
  examDate?: string
  studentId: string
  studentName?: string
  studentEmail?: string
  marksObtained: number
  totalMarks: number
  percentage: number
  grade?: string
  gradePoints?: number
  isPass: boolean
  remarks?: string
  enteredBy: string
  enteredByName?: string
  verifiedBy?: string
  verifiedByName?: string
  verifiedAt?: string
  isPublished: boolean
  publishedAt?: string
  publishedBy?: string
  enteredAt: string
  updatedAt: string
}

export type CreateResultDto = {
  sessionId: string
  studentId: string
  marksObtained: number
  totalMarks: number
  grade?: string
  gradePoints?: number
  remarks?: string
}

export type UpdateResultDto = Partial<CreateResultDto> & {
  verifiedBy?: string
  verifiedAt?: string
  isPublished?: boolean
  publishedAt?: string
  publishedBy?: string
}

export type ResultStats = {
  totalResults: number
  averagePercentage: number
  gradeDistribution: Record<string, number>
  passRate: number
}

export type GetResultsParams = {
  sessionId?: string
  studentId?: string
  subjectId?: string
  academicYear?: string
  semester?: number
  isPublished?: boolean
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
````

## File: src/features/rooms/hooks/use-rooms.ts
````typescript
import { apiClient } from '@/lib/api/client'
import type { 
  Room, 
  CreateRoomDto, 
  UpdateRoomDto, 
  RoomStats, 
  CheckAvailabilityParams,
  RoomAvailability,
  GetRoomsParams 
} from '../types/rooms'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

export const roomsService = {
  getAll: (params?: GetRoomsParams): Promise<PaginatedResponse<Room>> =>
    apiClient.get('/api/v1/rooms', { params }),

  getById: (id: string): Promise<ApiResponse<Room>> =>
    apiClient.get(`/api/v1/rooms/${id}`),

  getByBuilding: (building: string): Promise<ApiResponse<Room[]>> =>
    apiClient.get(`/api/v1/rooms/building/${encodeURIComponent(building)}`),

  getBuildingsList: (): Promise<ApiResponse<{ buildings: string[] }>> =>
    apiClient.get('/api/v1/rooms/buildings'),

  getStats: (): Promise<ApiResponse<RoomStats>> =>
    apiClient.get('/api/v1/rooms/stats'),

  getCapacityDistribution: (): Promise<ApiResponse<Record<string, number>>> =>
    apiClient.get('/api/v1/rooms/capacity-distribution'),

  checkAvailability: (params: CheckAvailabilityParams): Promise<ApiResponse<RoomAvailability[]>> =>
    apiClient.get('/api/v1/rooms/availability', { params }),

  create: (data: CreateRoomDto): Promise<ApiResponse<Room>> =>
    apiClient.post('/api/v1/rooms', data),

  update: (id: string, data: UpdateRoomDto): Promise<ApiResponse<Room>> =>
    apiClient.patch(`/api/v1/rooms/${id}`, data),

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/rooms/${id}`)
}
````

## File: src/features/rooms/types/rooms.ts
````typescript
export type Room = {
  _id: string
  roomNumber: string
  building?: string
  fullRoomNumber: string
  floorNumber?: number
  capacity: number
  examCapacity: number
  capacityRatio: number
  facilities?: RoomFacilities
  equipment?: RoomEquipment
  isAccessible: boolean
  isActive: boolean
  description?: string
  createdAt: string
  updatedAt: string
}

export type RoomFacilities = {
  airConditioned?: boolean
  projector?: boolean
  whiteboard?: boolean
  smartBoard?: boolean
  soundSystem?: boolean
  wifi?: boolean
  powerOutlets?: number
}

export type RoomEquipment = {
  tables?: number
  chairs?: number
  computers?: number
  printers?: number
}

export type CreateRoomDto = {
  roomNumber: string
  building?: string
  floorNumber?: number
  capacity: number
  examCapacity: number
  facilities?: RoomFacilities
  equipment?: RoomEquipment
  isAccessible?: boolean
  description?: string
}

export type UpdateRoomDto = Partial<CreateRoomDto> & {
  isActive?: boolean
}

export type RoomStats = {
  totalRooms: number
  roomsByBuilding: Record<string, number>
  averageCapacity: number
  accessibleRooms: number
}

export type CheckAvailabilityParams = {
  date: string
  startTime: string
  endTime: string
  minCapacity?: number
  excludeRoomId?: string
}

export type RoomAvailability = {
  roomId: string
  roomNumber: string
  building?: string
  capacity: number
  isAvailable: boolean
  conflictingSessions?: Array<{
    id: string
    title: string
    startTime: string
    endTime: string
  }>
}

export type GetRoomsParams = {
  building?: string
  minCapacity?: number
  maxCapacity?: number
  isAccessible?: boolean
  isActive?: boolean
  hasFacility?: string
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
````

## File: src/features/subjects/hooks/use-subjects.ts
````typescript
import { apiClient } from '@/lib/api/client'
import type { 
  Subject, 
  CreateSubjectDto, 
  UpdateSubjectDto, 
  AssignFacultyDto,
  FacultyAssignment,
  SubjectStats, 
  GetSubjectsParams 
} from '../types/subjects'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

export const subjectsService = {
  getAll: (params?: GetSubjectsParams): Promise<PaginatedResponse<Subject>> =>
    apiClient.get('/api/v1/subjects', { params }),

  getById: (id: string): Promise<ApiResponse<Subject>> =>
    apiClient.get(`/api/v1/subjects/${id}`),

  getByDepartment: (departmentId: string): Promise<ApiResponse<Subject[]>> =>
    apiClient.get(`/api/v1/subjects/department/${departmentId}`),

  getStats: (): Promise<ApiResponse<SubjectStats>> =>
    apiClient.get('/api/v1/subjects/stats'),

  create: (data: CreateSubjectDto): Promise<ApiResponse<Subject>> =>
    apiClient.post('/api/v1/subjects', data),

  update: (id: string, data: UpdateSubjectDto): Promise<ApiResponse<Subject>> =>
    apiClient.patch(`/api/v1/subjects/${id}`, data),

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/subjects/${id}`),

  assignFaculty: (id: string, data: AssignFacultyDto): Promise<ApiResponse<FacultyAssignment>> =>
    apiClient.post(`/api/v1/subjects/${id}/assign-faculty`, data),

  getFacultyAssignments: (id: string, params?: { academicYear?: string; semester?: number }): Promise<ApiResponse<FacultyAssignment[]>> =>
    apiClient.get(`/api/v1/subjects/${id}/faculty`, { params }),

  removeFacultyAssignment: (assignmentId: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/subjects/faculty-assignment/${assignmentId}`)
}
````

## File: src/features/subjects/types/subjects.ts
````typescript
export type Subject = {
  _id: string
  subjectCode: string
  subjectName: string
  departmentId: string
  departmentName?: string
  year: number
  credits: number
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type CreateSubjectDto = {
  subjectCode: string
  subjectName: string
  departmentId: string
  year: number
  credits?: number
  description?: string
}

export type UpdateSubjectDto = Partial<Omit<CreateSubjectDto, 'subjectCode'>> & {
  isActive?: boolean
}

export type AssignFacultyDto = {
  facultyId: string
  academicYear: string
  semester: number
  isCoordinator: boolean
  assignedDate: string
}

export type FacultyAssignment = {
  _id: string
  facultyId: string
  facultyName: string
  academicYear: string
  semester: number
  isCoordinator: boolean
  assignedDate: string
}

export type SubjectStats = {
  totalSubjects: number
  subjectsByDepartment: Record<string, number>
  subjectsByYear: Record<string, number>
}

export type GetSubjectsParams = {
  departmentId?: string
  year?: number
  isActive?: boolean
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
````

## File: src/features/users/components/user-columns.tsx
````typescript
'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontalIcon, EditIcon, TrashIcon, EyeIcon } from 'lucide-react'
import type { User } from '../types/users'
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

type UserColumnsProps = {
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  onView: (user: User) => void
}

export const getUserColumns = ({ onEdit, onDelete, onView }: UserColumnsProps): ColumnDef<User>[] => [
  {
    accessorKey: 'fullName',
    header: 'Full Name',
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
            {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div>
            <div className="font-medium">{user.fullName}</div>
            <div className="text-sm text-muted-foreground">@{user.username}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.original.role
      return (
        <Badge variant="outline" className={cn('font-medium', getRoleBadgeClass(role))}>
          {formatRole(role)}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'contactPrimary',
    header: 'Phone',
    cell: ({ row }) => row.original.contactPrimary || '—',
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.original.isActive
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt)
      return date.toLocaleDateString()
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onView(user)}>
              <EyeIcon className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(user)}>
              <EditIcon className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(user)}
              className="text-destructive focus:text-destructive"
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
````

## File: src/features/users/components/user-form.tsx
````typescript
'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { USER_ROLES } from '@/constants/roles'
import { createUserSchema, updateUserSchema, type CreateUserFormData, type UpdateUserFormData } from '../validations/user-schemas'
import type { User } from '../types/users'

// Use discriminated union for props
type CreateUserFormProps = {
  user?: never
  onSubmit: (data: CreateUserFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

type UpdateUserFormProps = {
  user: User
  onSubmit: (data: UpdateUserFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

type UserFormProps = CreateUserFormProps | UpdateUserFormProps

export const UserForm = ({ user, onSubmit, onCancel, isLoading }: UserFormProps) => {
  const isEditMode = !!user

  const form = useForm<CreateUserFormData | UpdateUserFormData>({
    resolver: zodResolver(isEditMode ? updateUserSchema : createUserSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      fullName: '',
      role: USER_ROLES.STUDENT,
      contactPrimary: '',
      contactSecondary: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      departmentId: ''
    }
  })

  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        contactPrimary: user.contactPrimary || '',
        contactSecondary: user.contactSecondary || '',
        addressLine1: user.addressLine1 || '',
        addressLine2: user.addressLine2 || '',
        city: user.city || '',
        state: user.state || '',
        postalCode: user.postalCode || '',
        country: user.country || '',
        departmentId: user.departmentId || ''
      })
    }
  }, [user, form])

  const handleSubmit = (data: CreateUserFormData | UpdateUserFormData) => {
    if (isEditMode) {
      // Type assertion is safe here because we know user exists in edit mode
      (onSubmit as (data: UpdateUserFormData) => void)(data as UpdateUserFormData)
    } else {
      (onSubmit as (data: CreateUserFormData) => void)(data as CreateUserFormData)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter username" 
                      {...field} 
                      disabled={isEditMode}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={USER_ROLES.ADMIN}>Admin</SelectItem>
                      <SelectItem value={USER_ROLES.FACULTY}>Faculty</SelectItem>
                      <SelectItem value={USER_ROLES.STUDENT}>Student</SelectItem>
                      <SelectItem value={USER_ROLES.EXAM_COORDINATOR}>Exam Coordinator</SelectItem>
                      <SelectItem value={USER_ROLES.INVIGILATOR}>Invigilator</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {!isEditMode && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password *</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Enter password" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="contactPrimary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter primary phone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactSecondary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secondary Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter secondary phone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Address Information</h3>
          
          <FormField
            control={form.control}
            name="addressLine1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Line 1</FormLabel>
                <FormControl>
                  <Input placeholder="Street address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="addressLine2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Line 2</FormLabel>
                <FormControl>
                  <Input placeholder="Apartment, suite, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input placeholder="ZIP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="Country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : isEditMode ? 'Update User' : 'Create User'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
````

## File: src/features/users/hooks/use-user-mutations.ts
````typescript
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usersService } from './use-users'
import type { CreateUserDto, UpdateUserDto } from '../types/users'
import type { ApiError } from '@/types/common'
import { toast } from 'sonner'

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUserDto) => usersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User Created', {
        description: 'User has been created successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Create User', {
        description: error.message || 'An error occurred while creating the user.'
      })
    }
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) =>
      usersService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User Updated', {
        description: 'User has been updated successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Update User', {
        description: error.message || 'An error occurred while updating the user.'
      })
    }
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => usersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User Deleted', {
        description: 'User has been deleted successfully.'
      })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Delete User', {
        description: error.message || 'An error occurred while deleting the user.'
      })
    }
  })
}
````

## File: src/features/users/hooks/use-users-query.ts
````typescript
'use client'

import { useQuery } from '@tanstack/react-query'
import { usersService } from './use-users'
import type { GetUsersParams } from '../types/users'

export const useUsersQuery = (params?: GetUsersParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => usersService.getAll(params),
    staleTime: 30000,  
  })
}

export const useUserQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: async () => {
      if (!id) throw new Error('User ID is required')
      console.log('Fetching user with ID:', id)
      const result = await usersService.getById(id)
      console.log('User fetch result:', result)
      return result
    },
    enabled: !!id && id !== 'undefined',
    retry: 1,
  })
}
````

## File: src/features/users/validations/user-schemas.ts
````typescript
import { z } from 'zod'
import { USER_ROLES } from '@/constants/roles'

export const createUserSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  role: z.enum([
    USER_ROLES.ADMIN,
    USER_ROLES.FACULTY,
    USER_ROLES.STUDENT,
    USER_ROLES.EXAM_COORDINATOR,
    USER_ROLES.INVIGILATOR
  ]),
  contactPrimary: z.string().optional(),
  contactSecondary: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  departmentId: z.string().optional()
})

export const updateUserSchema = createUserSchema.partial().omit({ password: true })

export type CreateUserFormData = z.infer<typeof createUserSchema>
export type UpdateUserFormData = z.infer<typeof updateUserSchema>
````

## File: src/lib/api/client.ts
````typescript
import type { ApiError } from '@/types/common'

type RequestConfig = {
  params?: Record<string, unknown>
  headers?: Record<string, string>
}

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private getHeaders = (customHeaders?: Record<string, string>): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    return headers
  }

  private buildURL = (url: string, params?: Record<string, unknown>): string => {
    const fullURL = new URL(url, this.baseURL)
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          fullURL.searchParams.append(key, String(value))
        }
      })
    }
    
    return fullURL.toString()
  }

  private handleResponse = async <T>(response: Response): Promise<T> => {
    if (response.status === 401) {
      this.handleUnauthorized()
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const error: ApiError = {
        message: errorData.message || 'Request failed',
        error: errorData.error || 'HTTP Error',
        statusCode: response.status
      }
      throw error
    }

    return response.json()
  }

  private handleUnauthorized = () => {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
  }

  setToken = (token: string | null): void => {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token)
      } else {
        localStorage.removeItem('auth_token')
      }
    }
  }

  getToken = (): string | null => {
    if (this.token) return this.token
    
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth_token')
      if (storedToken) {
        this.token = storedToken
        return storedToken
      }
    }
    
    return null
  }

  get = async <T = unknown>(url: string, config?: RequestConfig): Promise<T> => {
    const fullURL = this.buildURL(url, config?.params)
    const response = await fetch(fullURL, {
      method: 'GET',
      headers: this.getHeaders(config?.headers)
    })
    return this.handleResponse<T>(response)
  }

  post = async <T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> => {
    const fullURL = this.buildURL(url, config?.params)
    const response = await fetch(fullURL, {
      method: 'POST',
      headers: this.getHeaders(config?.headers),
      body: JSON.stringify(data)
    })
    return this.handleResponse<T>(response)
  }

  patch = async <T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> => {
    const fullURL = this.buildURL(url, config?.params)
    const response = await fetch(fullURL, {
      method: 'PATCH',
      headers: this.getHeaders(config?.headers),
      body: JSON.stringify(data)
    })
    return this.handleResponse<T>(response)
  }

  put = async <T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> => {
    const fullURL = this.buildURL(url, config?.params)
    const response = await fetch(fullURL, {
      method: 'PUT',
      headers: this.getHeaders(config?.headers),
      body: JSON.stringify(data)
    })
    return this.handleResponse<T>(response)
  }

  delete = async <T = unknown>(url: string, config?: RequestConfig): Promise<T> => {
    const fullURL = this.buildURL(url, config?.params)
    const response = await fetch(fullURL, {
      method: 'DELETE',
      headers: this.getHeaders(config?.headers)
    })
    return this.handleResponse<T>(response)
  }

  upload = async <T = unknown>(url: string, formData: FormData, config?: RequestConfig): Promise<T> => {
    const fullURL = this.buildURL(url, config?.params)
    const headers = { ...config?.headers }
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }
    
    // Don't set Content-Type for FormData, let browser set it with boundary
    delete headers['Content-Type']
    
    const response = await fetch(fullURL, {
      method: 'POST',
      headers,
      body: formData
    })
    return this.handleResponse<T>(response)
  }
}

// Create and export the API client instance
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
export const apiClient = new ApiClient(API_BASE_URL)

// Initialize token from localStorage on client side
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('auth_token')
  if (token) {
    apiClient.setToken(token)
  }
}
````

## File: src/lib/api/index.ts
````typescript
import { invigilatorAssignmentsService } from '@/features/assignments/hooks/use-assignments'
import { authService } from '@/features/auth/hooks/use-api'
import { academicCalendarService } from '@/features/calendar/hooks/use-calendar'
import { dashboardService } from '@/features/dashboard/hooks/use-dashboard'
import { departmentsService } from '@/features/departments/hooks/use-departments'
import { studentEnrollmentsService } from '@/features/enrollments/hooks/use-enrollments'
import { examPapersService } from '@/features/exam-papers/hooks/use-exam-papers'
import { examSessionsService } from '@/features/exam-sessions/hooks/use-exam-sessions'
import { fileUploadsService } from '@/features/file-uploads/hooks/use-file-uploads'
import { notificationsService } from '@/features/notifications/hooks/use-notifications'
import { questionsService } from '@/features/questions/hooks/use-questions'
import { examRegistrationsService } from '@/features/registrations/hooks/use-registrations'
import { reportsService } from '@/features/reports/hooks/use-reports'
import { resultsService } from '@/features/results/hooks/use-results'
import { roomsService } from '@/features/rooms/hooks/use-rooms'
import { subjectsService } from '@/features/subjects/hooks/use-subjects'
import { usersService } from '@/features/users/hooks/use-users'

 
 
 
 

// Combined API object
export const api = {
  auth: authService,
  users: usersService,
  departments: departmentsService,
  subjects: subjectsService,
  questions: questionsService,
  rooms: roomsService,
  examPapers: examPapersService,
  examSessions: examSessionsService,
  studentEnrollments: studentEnrollmentsService,
  examRegistrations: examRegistrationsService,
  invigilatorAssignments: invigilatorAssignmentsService,
  results: resultsService,
  academicCalendar: academicCalendarService,
  notifications: notificationsService,
  fileUploads: fileUploadsService,
  reports: reportsService,
  dashboard: dashboardService
}

export default api
````

## File: src/lib/providers/query-provider.tsx
````typescript
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
````

## File: src/lib/utils.ts
````typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
````

## File: src/types/auth.ts
````typescript
import type { UserRole } from '@/constants/roles'

export type LoginDto = {
  usernameOrEmail: string
  password: string
}

export type RegisterDto = {
  email: string
  username?: string
  password: string
  fullName: string
  contactPrimary?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
}

export type LoginResponse = {
  user: {
    id: string
    username: string
    email: string
    fullName: string
    role: string
    isActive: boolean
  }
  accessToken: string
}

export type ForgotPasswordDto = {
  email: string
}

export type ResetPasswordDto = {
  token: string
  password: string
  confirmPassword: string
}
````

## File: src/types/common.ts
````typescript
export type PaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type ApiResponse<T> = {
  data: T
  message?: string
}

export type ApiError = {
  message: string
  error?: string
  statusCode?: number
}

export type BaseQueryParams = {
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
````

## File: tsconfig.json
````json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
````

## File: src/app/(auth)/layout.tsx
````typescript
type AuthLayoutProps = {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="  w-full space-y-8">
        {children}
      </div>
    </div>
  )
}
````

## File: src/app/(dashboard)/layout.tsx
````typescript
import { AuthGuard } from '@/lib/auth/auth-guard'
import { Sidebar } from '@/components/navigation/sidebar'

type DashboardLayoutProps = {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
````

## File: src/app/globals.css
````css
@import "tailwindcss";

 
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;

    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;

    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;

    --primary: 194 27% 6%;
    --primary-foreground: 0 0% 98%;

    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;

    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;

    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;

    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 5.9% 10%;

    --radius: 0.5rem;

    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;

    /* font variables */
    --font-unbounded: '';
    --font-inter: '';
  }

  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;

    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;

    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;

    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;

    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;

    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;

    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;

    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;

    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}

 
@theme inline {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));

  --color-chart-1: hsl(var(--chart-1));
  --color-chart-2: hsl(var(--chart-2));
  --color-chart-3: hsl(var(--chart-3));
  --color-chart-4: hsl(var(--chart-4));
  --color-chart-5: hsl(var(--chart-5));

  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

 
body {
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  font-family: Arial, Helvetica, sans-serif;
}
````

## File: src/app/not-found.tsx
````typescript
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600">
            The page you are looking for doesn&lsquo;t exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/">
              Go Back Home
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="w-full">
            <Link href="/login">
              Go to Login
            </Link>
          </Button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFound
````

## File: src/components/data-display/data-table.tsx
````typescript
'use client'

import { useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ColumnsIcon,
  SearchIcon,
} from 'lucide-react'

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
  showColumnVisibility?: boolean
}

export const DataTable = <TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Search...',
  showColumnVisibility = true,
}: DataTableProps<TData, TValue>) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        {searchKey && (
          <div className="relative flex-1 max-w-sm">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="pl-10"
            />
          </div>
        )}

        {showColumnVisibility && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <ColumnsIcon className="mr-2 h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <select
              className="h-8 w-[70px] rounded-md border border-input bg-transparent px-2 text-sm"
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value))
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
````

## File: src/constants/navigation.ts
````typescript
import { ROUTES } from './routes'
import { USER_ROLES } from './roles'
import type { UserRole } from './roles'

export type NavItem = {
  title: string
  href: string
  icon?: string
  description?: string
}

export const NAVIGATION_ITEMS: Record<UserRole, NavItem[]> = {
  [USER_ROLES.ADMIN]: [
    { title: 'Dashboard', href: ROUTES.ADMIN.DASHBOARD, icon: 'dashboard' },
    { title: 'Users', href: ROUTES.ADMIN.USERS, icon: 'users' },
    { title: 'Departments', href: ROUTES.ADMIN.DEPARTMENTS, icon: 'building' },
    { title: 'Subjects', href: ROUTES.ADMIN.SUBJECTS, icon: 'book' },
    { title: 'Rooms', href: ROUTES.ADMIN.ROOMS, icon: 'map' },
    { title: 'Reports', href: ROUTES.ADMIN.REPORTS, icon: 'chart' },
    { title: 'Calendar', href: ROUTES.ADMIN.CALENDAR, icon: 'calendar' }
  ],
  [USER_ROLES.FACULTY]: [
    { title: 'Dashboard', href: ROUTES.FACULTY.DASHBOARD, icon: 'dashboard' },
    { title: 'Subjects', href: ROUTES.FACULTY.SUBJECTS, icon: 'book' },
    { title: 'Questions', href: ROUTES.FACULTY.QUESTIONS, icon: 'help-circle' },
    { title: 'Exam Papers', href: ROUTES.FACULTY.EXAM_PAPERS, icon: 'file-text' },
    { title: 'Results', href: ROUTES.FACULTY.RESULTS, icon: 'award' },
    { title: 'Assignments', href: ROUTES.FACULTY.ASSIGNMENTS, icon: 'clipboard' }
  ],
  [USER_ROLES.STUDENT]: [
    { title: 'Dashboard', href: ROUTES.STUDENT.DASHBOARD, icon: 'dashboard' },
    { title: 'Enrollments', href: ROUTES.STUDENT.ENROLLMENTS, icon: 'user-plus' },
    { title: 'Exams', href: ROUTES.STUDENT.EXAMS, icon: 'clock' },
    { title: 'Results', href: ROUTES.STUDENT.RESULTS, icon: 'award' },
    { title: 'Notifications', href: ROUTES.STUDENT.NOTIFICATIONS, icon: 'bell' }
  ],
  [USER_ROLES.EXAM_COORDINATOR]: [
    { title: 'Dashboard', href: ROUTES.EXAM_COORDINATOR.DASHBOARD, icon: 'dashboard' },
    { title: 'Exam Sessions', href: ROUTES.EXAM_COORDINATOR.EXAM_SESSIONS, icon: 'calendar' },
    { title: 'Registrations', href: ROUTES.EXAM_COORDINATOR.REGISTRATIONS, icon: 'user-check' },
    { title: 'Rooms', href: ROUTES.EXAM_COORDINATOR.ROOMS, icon: 'map' },
    { title: 'Assignments', href: ROUTES.EXAM_COORDINATOR.ASSIGNMENTS, icon: 'clipboard' }
  ],
  [USER_ROLES.INVIGILATOR]: [
    { title: 'Dashboard', href: ROUTES.INVIGILATOR.DASHBOARD, icon: 'dashboard' },
    { title: 'Assignments', href: ROUTES.INVIGILATOR.ASSIGNMENTS, icon: 'clipboard' }
  ]
}
````

## File: src/features/auth/components/login-form.tsx
````typescript
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { EyeIcon, EyeOffIcon, LogInIcon, AlertCircleIcon } from 'lucide-react'
import { useLogin } from '../hooks/use-auth-mutations'
import { loginSchema, type LoginFormData } from '../validations/auth-schemas'

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const loginMutation = useLogin()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usernameOrEmail: '',
      password: ''
    }
  })

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-8 pt-8">
            <div className="mx-auto w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <LogInIcon className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-muted-foreground mt-2">Sign in to your university account</p>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            {loginMutation.isError && (
              <Alert className="mb-6 border-destructive/20 bg-destructive/5">
                <AlertCircleIcon className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-destructive">
                  {loginMutation.error?.message || 'Login failed. Please try again.'}
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="usernameOrEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Username or Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your username or email"
                          className="h-12 focus:ring-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            className="h-12 pr-12 focus:ring-primary"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? (
                              <EyeOffIcon className="w-5 h-5" />
                            ) : (
                              <EyeIcon className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 gradient-primary text-primary-foreground font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link 
                  href="/register" 
                  className="text-primary hover:text-primary/80 font-medium hover:underline transition-colors"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
````

## File: src/features/auth/components/register-form.tsx
````typescript
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { EyeIcon, EyeOffIcon, UserPlusIcon, AlertCircleIcon } from 'lucide-react'
import { useRegister } from '../hooks/use-auth-mutations'
import { registerSchema, type RegisterFormData } from '../validations/auth-schemas'

export const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const registerMutation = useRegister()

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      contactPrimary: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: ''
    }
  })

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary/5 via-background to-accent/5 p-4">
      <div className="  max-w-2xl">
        <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6 pt-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-student to-student/80 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <UserPlusIcon className="w-8 h-8 text-student-foreground" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-student to-student/80 bg-clip-text text-transparent">
              Join University
            </h1>
            <p className="text-muted-foreground mt-2">Create your account to get started</p>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            {registerMutation.isError && (
              <Alert className="mb-6 border-destructive/20 bg-destructive/5">
                <AlertCircleIcon className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-destructive">
                  {registerMutation.error?.message || 'Registration failed. Please try again.'}
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your full name"
                          className="h-11 focus:ring-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Username & Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">Username</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Choose username"
                            className="h-11 focus:ring-primary"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            className="h-11 focus:ring-primary"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Password Fields Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Create password"
                              className="h-11 pr-12 focus:ring-primary"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showPassword ? (
                                <EyeOffIcon className="w-5 h-5" />
                              ) : (
                                <EyeIcon className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder="Confirm password"
                              className="h-11 pr-12 focus:ring-primary"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showConfirmPassword ? (
                                <EyeOffIcon className="w-5 h-5" />
                              ) : (
                                <EyeIcon className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Phone Number */}
                <FormField
                  control={form.control}
                  name="contactPrimary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Phone Number <span className="text-muted-foreground text-sm">(Optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter phone number"
                          className="h-11 focus:ring-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Address Fields - Optional */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-sm font-medium text-muted-foreground border-b border-border pb-2">
                    Address Information (Optional)
                  </h4>
                  
                  <FormField
                    control={form.control}
                    name="addressLine1"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Street address"
                            className="h-10 focus:ring-primary"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="City"
                              className="h-10 focus:ring-primary"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="State"
                              className="h-10 focus:ring-primary"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="ZIP"
                              className="h-10 focus:ring-primary"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-student to-student/80 hover:from-student/90 hover:to-student/70 text-student-foreground font-medium transition-all duration-200 shadow-lg hover:shadow-xl mt-6"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-student-foreground border-t-transparent rounded-full animate-spin" />
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <Link 
                  href="/login" 
                  className="text-primary hover:text-primary/80 font-medium hover:underline transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
````

## File: src/features/auth/types/auth.ts
````typescript
import type { UserRole } from '@/constants/roles'

export type LoginDto = {
  usernameOrEmail: string
  password: string
}

export type RegisterDto = {
  email: string
  username?: string
  password: string
  fullName: string
  contactPrimary?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
}

export type LoginUser = {
  id: string
  username: string
  email: string
  fullName: string
  role: UserRole
  isActive: boolean
  profileImage?: string
}

export type LoginResponse = {
  user: LoginUser
  accessToken: string
}

export type ForgotPasswordDto = {
  email: string
}

export type ResetPasswordDto = {
  token: string
  password: string
  confirmPassword: string
}
````

## File: src/features/auth/validations/auth-schemas.ts
````typescript
import { z } from 'zod'

export const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, 'Username or email is required'),
  password: z.string().min(1, 'Password is required')
})

export const registerSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string()
    .email('Please enter a valid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string()
    .min(1, 'Please confirm your password'),
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must be less than 50 characters'),
  contactPrimary: z.string()
    .optional()
    .refine((val) => !val || /^[\d\s\-\+\(\)]+$/.test(val), 'Please enter a valid phone number'),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string()
    .optional()
    .refine((val) => !val || /^\d{5}(-\d{4})?$/.test(val), 'Please enter a valid postal code')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
````

## File: src/features/users/hooks/use-users.ts
````typescript
import { apiClient } from '@/lib/api/client'
import type { 
  User, 
  CreateUserDto, 
  UpdateUserDto, 
  ChangePasswordDto, 
  UserStats, 
  GetUsersParams,
  BackendUsersListResponse
} from '../types/users'
import type { PaginatedResponse, ApiResponse } from '@/types/common'

export const usersService = {
  getAll: async (params?: GetUsersParams): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get<BackendUsersListResponse>('/api/v1/users', { params })
    return {
      data: response.users || [],
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
      totalPages: response.totalPages || 1
    }
  },

  getById: async (id: string): Promise<ApiResponse<User>> => {
    const user = await apiClient.get<User>(`/api/v1/users/${id}`)
    // If backend returns user directly, wrap it
    return {
      data: user
    }
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const user = await apiClient.get<User>('/api/v1/users/profile')
    return {
      data: user
    }
  },

  getStats: (): Promise<ApiResponse<UserStats>> =>
    apiClient.get('/api/v1/users/stats'),

  create: async (data: CreateUserDto): Promise<ApiResponse<User>> => {
    const user = await apiClient.post<User>('/api/v1/users', data)
    return {
      data: user
    }
  },

  update: async (id: string, data: UpdateUserDto): Promise<ApiResponse<User>> => {
    const user = await apiClient.patch<User>(`/api/v1/users/${id}`, data)
    return {
      data: user
    }
  },

  updateProfile: async (data: UpdateUserDto): Promise<ApiResponse<User>> => {
    const user = await apiClient.patch<User>('/api/v1/users/profile', data)
    return {
      data: user
    }
  },

  changePassword: (data: ChangePasswordDto): Promise<ApiResponse<{ message: string }>> =>
    apiClient.patch('/api/v1/users/profile/change-password', data),

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/api/v1/users/${id}`)
}
````

## File: src/features/users/types/users.ts
````typescript
import type { UserRole } from '@/constants/roles'

export type User = {
  _id: string
  username: string
  email: string
  fullName: string
  role: UserRole
  isActive: boolean
  contactPrimary?: string
  contactSecondary?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  profileImage?: string
  departmentId?: string
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}

export type CreateUserDto = {
  username: string
  password: string
  email: string
  fullName: string
  role: UserRole
  contactPrimary?: string
  contactSecondary?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  departmentId?: string
}

export type UpdateUserDto = Partial<Omit<CreateUserDto, 'username' | 'password'>> & {
  isActive?: boolean
}

export type ChangePasswordDto = {
  currentPassword: string
  newPassword: string
}

export type UserStats = {
  totalUsers: number
  activeUsers: number
  usersByRole: Record<string, number>
}

export type GetUsersParams = {
  role?: UserRole
  isActive?: boolean
  departmentId?: string
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export type BackendUsersListResponse = {
  users: User[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type BackendUserResponse = {
  user: User
}
````

## File: src/lib/auth/auth-guard.tsx
````typescript
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './auth-provider'
import { LoadingSpinner } from '@/components/common/loading-spinner'

type AuthGuardProps = {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const AuthGuard = ({ children, fallback }: AuthGuardProps) => {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
````

## File: src/lib/auth/role-guard.tsx
````typescript
'use client'

import { useAuth } from './auth-provider'
import type { UserRole } from '@/constants/roles'

type RoleGuardProps = {
  allowedRoles: UserRole[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const RoleGuard = ({ allowedRoles, children, fallback }: RoleGuardProps) => {
  const { user } = useAuth()

  if (!user || !allowedRoles.includes(user.role)) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600 mt-2">You don&rsquo;t have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
````

## File: src/middleware.ts
````typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const middleware = (request: NextRequest) => {
  const token = request.cookies.get('auth_token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '')

  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // If accessing protected route without token, redirect to login
  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If accessing auth routes with token, redirect to appropriate dashboard
  if (isPublicRoute && token && pathname !== '/') {
    // You might want to decode the token to get user role and redirect accordingly
    // For now, redirect to a default route
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
````

## File: src/app/layout.tsx
````typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { AuthProvider } from '@/lib/auth/auth-provider'
import { QueryProvider } from '@/lib/providers/query-provider'
import { Toaster } from 'sonner'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "University Management System",
  description: "Comprehensive university exam management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            <NuqsAdapter>
              {children}
              <Toaster position="top-right" />
            </NuqsAdapter>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
````

## File: src/components/common/loading-spinner.tsx
````typescript
import { cn } from '@/lib/utils'

type LoadingSpinnerProps = {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export const LoadingSpinner = ({ className, size = 'md' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div 
      className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600', 
        sizeClasses[size], 
        className
      )} 
      aria-label="Loading"
    />
  )
}
````

## File: src/components/navigation/navbar.tsx
````typescript
'use client'

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { 
  MenuIcon, 
  LogOutIcon, 
  UserIcon, 
  SettingsIcon, 
  BellIcon,
  GraduationCapIcon
} from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-provider'
import { useLogout } from '@/features/auth/hooks/use-auth-mutations'
import { NAVIGATION_ITEMS, type NavItem } from '@/constants/navigation'
import type { UserRole } from '@/constants/roles'
import { cn } from '@/lib/utils'

// Role-specific styling helper
const getRoleStyle = (role: UserRole) => {
  const roleStyles = {
    admin: 'role-admin',
    faculty: 'role-faculty', 
    student: 'role-student',
    exam_coordinator: 'role-exam-coordinator',
    invigilator: 'role-invigilator'
  } as const
  
  return roleStyles[role] || 'bg-muted text-muted-foreground'
}

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user } = useAuth()
  const logoutMutation = useLogout()
  const pathname = usePathname()

  const navigationItems: NavItem[] = useMemo(() => {
    const userRole = user?.role as UserRole
    return userRole ? NAVIGATION_ITEMS[userRole] || [] : []
  }, [user?.role])

  const handleLogout = useCallback(() => {
    logoutMutation.mutate()
  }, [logoutMutation])

  const getUserInitials = useCallback((name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }, [])

  const formatRole = useCallback((role: string) => {
    return role.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }, [])

  if (!user) return null

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
              <GraduationCapIcon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                University
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">Management System</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item: NavItem) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {item.title}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <BellIcon className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-destructive hover:bg-destructive">
                3
              </Badge>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-primary/20 transition-all">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.profileImage} alt={user.fullName} />
                    <AvatarFallback className="gradient-primary text-primary-foreground font-semibold">
                      {getUserInitials(user.fullName)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72" align="end" forceMount>
                <DropdownMenuLabel className="p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.profileImage} alt={user.fullName} />
                      <AvatarFallback className="gradient-primary text-primary-foreground font-semibold">
                        {getUserInitials(user.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{user.fullName}</p>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                      <Badge 
                        variant="outline" 
                        className={cn("mt-1 text-xs", getRoleStyle(user.role))}
                      >
                        {formatRole(user.role)}
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center cursor-pointer">
                    <UserIcon className="mr-3 h-4 w-4" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center cursor-pointer">
                    <SettingsIcon className="mr-3 h-4 w-4" />
                    Preferences
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                  disabled={logoutMutation.isPending}
                >
                  <LogOutIcon className="mr-3 h-4 w-4" />
                  {logoutMutation.isPending ? 'Signing out...' : 'Sign out'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <MenuIcon className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-6 mt-6">
                  <div className="flex items-center space-x-3 pb-4 border-b">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.profileImage} alt={user.fullName} />
                      <AvatarFallback className="gradient-primary text-primary-foreground font-semibold">
                        {getUserInitials(user.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{user.fullName}</p>
                      <Badge className={cn("text-xs", getRoleStyle(user.role))}>
                        {formatRole(user.role)}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {navigationItems.map((item: NavItem) => {
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "block px-4 py-3 rounded-lg text-base font-medium transition-colors",
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          )}
                        >
                          {item.title}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
````

## File: src/features/auth/hooks/use-auth-mutations.ts
````typescript
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authService } from './use-api'
import { useAuth } from '@/lib/auth/auth-provider'
import { ROUTES } from '@/constants/routes'
import { USER_ROLES } from '@/constants/roles'
import type { LoginFormData, RegisterFormData } from '../validations/auth-schemas'
import type { LoginUser } from '../types/auth'
import type { User } from '@/features/users/types/users'
import type { ApiError } from '@/types/common'
import { toast } from 'sonner'

const convertLoginUserToUser = (loginUser: LoginUser): User => ({
  _id: loginUser.id,
  username: loginUser.username,
  email: loginUser.email,
  fullName: loginUser.fullName,
  role: loginUser.role,
  isActive: loginUser.isActive,
  profileImage: loginUser.profileImage,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
})

const DASHBOARD_ROUTES = {
  [USER_ROLES.ADMIN]: ROUTES.ADMIN.DASHBOARD,
  [USER_ROLES.FACULTY]: ROUTES.FACULTY.DASHBOARD,
  [USER_ROLES.STUDENT]: ROUTES.STUDENT.DASHBOARD,
  [USER_ROLES.EXAM_COORDINATOR]: ROUTES.EXAM_COORDINATOR.DASHBOARD,
  [USER_ROLES.INVIGILATOR]: ROUTES.INVIGILATOR.DASHBOARD
} as const

export const useLogin = () => {
  const { login } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await authService.login(data)
      return response
    },
    onSuccess: (response) => {
      const user = convertLoginUserToUser(response.user)
      login(response.accessToken, user)
      
      // Clear any cached data
      queryClient.clear()
      
      const redirectRoute = DASHBOARD_ROUTES[response.user.role as keyof typeof DASHBOARD_ROUTES] || ROUTES.HOME
      
      toast.success(`Welcome back, ${response.user.fullName}!`, {
        description: 'You have been successfully logged in.'
      })
      
      // Small delay to ensure state is updated
      setTimeout(() => {
        router.replace(redirectRoute)
      }, 100)
    },
    onError: (error: ApiError) => {
      const errorMessage = error.message || 'Login failed. Please check your credentials.'
      toast.error('Login Failed', {
        description: errorMessage
      })
    }
  })
}

export const useRegister = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const { confirmPassword, ...registerData } = data
      return authService.register(registerData)
    },
    onSuccess: () => {
      toast.success('Account Created Successfully!', {
        description: 'Please sign in with your new account.'
      })
      router.push('/login')
    },
    onError: (error: ApiError) => {
      const errorMessage = error.message || 'Registration failed. Please try again.'
      toast.error('Registration Failed', {
        description: errorMessage
      })
    }
  })
}

export const useLogout = () => {
  const { logout } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logout()
      queryClient.clear()
      toast.success('Logged Out', {
        description: 'You have been successfully logged out.'
      })
      router.replace('/login')
    },
    onError: () => {
      // Even if API call fails, logout locally
      logout()
      queryClient.clear()
      router.replace('/login')
      toast.success('Logged Out', {
        description: 'You have been successfully logged out.'
      })
    }
  })
}
````

## File: src/lib/auth/auth-provider.tsx
````typescript
'use client'

import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'
import { useAuthStore } from '@/lib/stores/auth-store'
import { usersService } from '@/features/users/hooks/use-users'
 
import type { User } from '@/features/users/types/users'

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, user: User) => void
  logout: () => void
  refetchUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const store = useAuthStore()
  const [isHydrated, setIsHydrated] = useState(false)
  const [isFetchingUser, setIsFetchingUser] = useState(false)

  // Memoized values
  const isLoading = !store.isInitialized || isFetchingUser

  // useCallback for refetchUser to prevent dependency issues
  const refetchUser = useCallback(async () => {
    if (!store.isAuthenticated || !store.token) return
    
    setIsFetchingUser(true)
    try {
      const response = await usersService.getProfile()
      store.setUser(response.data)
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      store.logout()
    } finally {
      setIsFetchingUser(false)
    }
  }, [store.isAuthenticated, store.token, store.setUser, store.logout])

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Initialize auth state only once after hydration
  useEffect(() => {
    if (!isHydrated || store.isInitialized) return

    const initializeAuth = async () => {
      try {
        store.initialize()
        
        // If we have a token but no user data, fetch user profile
        if (store.isAuthenticated && !store.user) {
          await refetchUser()
        }
      } catch (error) {
        console.error('Auth initialization failed:', error)
        store.logout()
      }
    }

    initializeAuth()
  }, [isHydrated, store.isInitialized, store.isAuthenticated, store.user, store.initialize, store.logout, refetchUser])

  const contextValue = useMemo(() => ({
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading,
    login: store.login,
    logout: store.logout,
    refetchUser
  }), [store.user, store.isAuthenticated, isLoading, store.login, store.logout, refetchUser])

  // Show loading screen during hydration or initialization
  if (!isHydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-pulse"></div>
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">University Management System</h2>
            <p className="text-muted-foreground">Initializing application...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}
````

## File: src/lib/stores/auth-store.ts
````typescript
// src/lib/stores/auth-store.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { apiClient } from '@/lib/api/client'
import type { User } from '@/features/users/types/users'

type AuthState = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isInitialized: boolean
}

type AuthActions = {
  login: (token: string, user: User) => void
  logout: () => void
  setUser: (user: User) => void
  initialize: () => void
  setInitialized: (initialized: boolean) => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isInitialized: false,

      // Actions
      login: (token: string, user: User) => {
        apiClient.setToken(token)
        set({
          user,
          token,
          isAuthenticated: true,
          isInitialized: true
        })
      },

      logout: () => {
        apiClient.setToken(null)
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isInitialized: true
        })
      },

      setUser: (user: User) => {
        set({ user })
      },

      initialize: () => {
        const { token, isInitialized } = get()
        
        // Prevent multiple initializations
        if (isInitialized) return
        
        if (token) {
          apiClient.setToken(token)
          set({ 
            isAuthenticated: true,
            isInitialized: true 
          })
        } else {
          set({ 
            isInitialized: true 
          })
        }
      },

      setInitialized: (initialized: boolean) => {
        set({ isInitialized: initialized })
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          apiClient.setToken(state.token)
        }
      }
    }
  )
)
````

## File: src/app/page.tsx
````typescript
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-provider'
import { ROUTES } from '@/constants/routes'
import { USER_ROLES } from '@/constants/roles'
import type { UserRole } from '@/constants/roles'

const DASHBOARD_ROUTES: Record<UserRole, string> = {
  [USER_ROLES.ADMIN]: ROUTES.ADMIN.DASHBOARD,
  [USER_ROLES.FACULTY]: ROUTES.FACULTY.DASHBOARD,
  [USER_ROLES.STUDENT]: ROUTES.STUDENT.DASHBOARD,
  [USER_ROLES.EXAM_COORDINATOR]: ROUTES.EXAM_COORDINATOR.DASHBOARD,
  [USER_ROLES.INVIGILATOR]: ROUTES.INVIGILATOR.DASHBOARD
} as const

const HomePage = () => {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      router.replace('/login')
      return
    }

    if (user?.role) {
      const dashboardRoute = DASHBOARD_ROUTES[user.role]
      if (dashboardRoute) {
        router.replace(dashboardRoute)
      }
    }
  }, [isAuthenticated, isLoading, user?.role, router])

 
  return null
}

export default HomePage
````

 