 
'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeftIcon, BookOpenIcon, CalendarIcon, UserIcon } from 'lucide-react'
import { useEnrollmentQuery } from '@/features/enrollments/hooks/use-enrollments-query'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'
import { cn } from '@/lib/utils'
import type { EnrollmentStatus } from '@/features/enrollments/types/enrollments'

const getStatusBadgeClass = (status: EnrollmentStatus) => {
  const statusClasses = {
    active: 'bg-green-100 text-green-700',
    withdrawn: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700'
  } as const

  return statusClasses[status] || 'bg-muted'
}

const formatStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

type StudentViewEnrollmentPageProps = {
  params: Promise<{ id: string }>
}

const StudentViewEnrollmentPage = ({ params }: StudentViewEnrollmentPageProps) => {
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
          <Button onClick={() => router.push('/student/enrollments')} className="mt-4">
            Back to My Enrollments
          </Button>
        </div>
      </div>
    )
  }

  const enrollment = enrollmentResponse.data

  return (
    <RoleGuard allowedRoles={[USER_ROLES.STUDENT]}>
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
            <h1 className="text-3xl font-bold text-gray-900">Enrollment Details</h1>
            <p className="text-muted-foreground mt-1">
              {enrollment.subjectName}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Subject Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Subject Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpenIcon className="w-12 h-12 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold text-lg">{enrollment.subjectName}</h3>
                <p className="text-sm text-muted-foreground font-mono font-semibold mt-1">
                  {enrollment.subjectCode}
                </p>
                <div className="flex flex-col gap-2 mt-3 w-full">
                  <Badge
                    variant="outline"
                    className={cn('justify-center', getStatusBadgeClass(enrollment.status))}
                  >
                    {formatStatus(enrollment.status)}
                  </Badge>
                  {enrollment.subjectCredits && (
                    <Badge variant="outline" className="justify-center">
                      {enrollment.subjectCredits} Credits
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enrollment Information */}
          <div className="md:col-span-2 space-y-6">
            {/* Academic Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  Academic Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Academic Year</p>
                    <p className="mt-1 font-medium">{enrollment.academicYear}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Semester</p>
                    <p className="mt-1 font-medium">Semester {enrollment.semester}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Enrollment Date</p>
                    <p className="mt-1">{new Date(enrollment.enrollmentDate).toLocaleDateString()}</p>
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
                </div>
              </CardContent>
            </Card>

            {/* Enrollment Officer */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserIcon className="w-5 h-5 mr-2" />
                  Enrollment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Enrolled By</p>
                  <p className="mt-1">{enrollment.enrolledByName || 'System'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Withdrawal Information */}
            {enrollment.status === 'withdrawn' && (
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-700">Withdrawal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Withdrawn Date</p>
                    <p className="mt-1">
                      {enrollment.withdrawnDate 
                        ? new Date(enrollment.withdrawnDate).toLocaleDateString()
                        : '—'}
                    </p>
                  </div>
                  {enrollment.withdrawnReason && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Reason</p>
                      <p className="mt-1">{enrollment.withdrawnReason}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            {enrollment.status === 'active' && (
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => router.push(`/student/exams?subjectId=${enrollment.subjectId}`)}
                  >
                    View Exams
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => router.push(`/student/results?subjectId=${enrollment.subjectId}`)}
                  >
                    View Results
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </RoleGuard>
  )
}

export default StudentViewEnrollmentPage