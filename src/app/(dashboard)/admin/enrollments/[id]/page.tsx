 
'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeftIcon, EditIcon, TrashIcon, BookOpenIcon } from 'lucide-react'
import { useEnrollmentQuery } from '@/features/enrollments/hooks/use-enrollments-query'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'
import { cn } from '@/lib/utils'
import type { EnrollmentStatus } from '@/features/enrollments/types/enrollments'

const getStatusBadgeClass = (status: EnrollmentStatus) => {
  const statusClasses = {
    active: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    withdrawn: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
  } as const

  return statusClasses[status] || 'bg-muted'
}

const formatStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

type ViewEnrollmentPageProps = {
  params: Promise<{ id: string }>
}

const ViewEnrollmentPage = ({ params }: ViewEnrollmentPageProps) => {
  const router = useRouter()
  const { id: enrollmentId } = use(params)

  const { data: enrollmentResponse, isLoading, error } = useEnrollmentQuery(enrollmentId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !enrollmentResponse?.data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Enrollment Not Found</h2>
          <p className="text-muted-foreground">
            The enrollment you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push('/admin/enrollments')} className="mt-4">
            Back to Enrollments
          </Button>
        </div>
      </div>
    )
  }

  const enrollment = enrollmentResponse.data

  return (
    <RoleGuard allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.EXAM_COORDINATOR]}>
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
              <h1 className="text-3xl font-bold text-gray-900">Enrollment Details</h1>
              <p className="text-muted-foreground mt-1">
                {enrollment.studentName} - {enrollment.subjectName}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/admin/enrollments/${enrollmentId}/edit`)}
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
          {/* Enrollment Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Enrollment Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpenIcon className="w-12 h-12 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold text-lg">{enrollment.studentName}</h3>
                <p className="text-sm text-muted-foreground">{enrollment.studentEmail}</p>
                <div className="flex flex-col gap-2 mt-3 w-full">
                  <Badge
                    variant="outline"
                    className={cn('justify-center', getStatusBadgeClass(enrollment.status))}
                  >
                    {formatStatus(enrollment.status)}
                  </Badge>
                  <Badge variant="outline" className="justify-center">
                    Year {enrollment.year}
                  </Badge>
                  <Badge variant="outline" className="justify-center">
                    Semester {enrollment.semester}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enrollment Information Cards */}
          <div className="md:col-span-2 space-y-6">
            {/* Subject Information */}
            <Card>
              <CardHeader>
                <CardTitle>Subject Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Subject Code</p>
                    <p className="mt-1 font-mono font-semibold">{enrollment.subjectCode}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Subject Name</p>
                    <p className="mt-1">{enrollment.subjectName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Credits</p>
                    <p className="mt-1">{enrollment.subjectCredits || '—'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enrollment Details */}
            <Card>
              <CardHeader>
                <CardTitle>Enrollment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Enrollment Date</p>
                    <p className="mt-1">{new Date(enrollment.enrollmentDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Year</p>
                    <p className="mt-1">Year {enrollment.year}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Semester</p>
                    <p className="mt-1">Semester {enrollment.semester}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge
                      variant="outline"
                      className={cn('mt-1', getStatusBadgeClass(enrollment.status))}
                    >
                      {formatStatus(enrollment.status)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Enrolled By</p>
                    <p className="mt-1">{enrollment.enrolledByName || '—'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Withdrawal Information */}
            {enrollment.status === 'withdrawn' && (
              <Card>
                <CardHeader>
                  <CardTitle>Withdrawal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Withdrawn Date</p>
                      <p className="mt-1">
                        {enrollment.withdrawnDate 
                          ? new Date(enrollment.withdrawnDate).toLocaleDateString()
                          : '—'}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-muted-foreground">Reason</p>
                      <p className="mt-1">{enrollment.withdrawnReason || '—'}</p>
                    </div>
                  </div>
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
                    <p className="mt-1">{new Date(enrollment.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                    <p className="mt-1">{new Date(enrollment.updatedAt).toLocaleString()}</p>
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

export default ViewEnrollmentPage