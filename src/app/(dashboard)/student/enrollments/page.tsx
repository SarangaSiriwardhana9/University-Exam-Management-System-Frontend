 
'use client'

import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/data-display/data-table'
import { getStudentEnrollmentColumns } from '@/features/enrollments/components/student-enrollment-columns'
import { useAuth } from '@/lib/auth/auth-provider'
import { useMyEnrollmentsQuery } from '@/features/enrollments/hooks/use-enrollments-query'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpenIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react'
import { ENROLLMENT_STATUS } from '@/features/enrollments/types/enrollments'

const StudentEnrollmentsPage = () => {
  const router = useRouter()
  const { user } = useAuth()

  const { data, isLoading } = useMyEnrollmentsQuery()

  const columns = getStudentEnrollmentColumns({
    onView: (enrollment) => router.push(`/student/enrollments/${enrollment._id}`)
  })

  // Calculate stats
  const totalEnrollments = data?.data?.length || 0
  const activeEnrollments = data?.data?.filter(e => e.status === ENROLLMENT_STATUS.ACTIVE).length || 0
  const completedEnrollments = data?.data?.filter(e => e.status === ENROLLMENT_STATUS.COMPLETED).length || 0

  return (
    <RoleGuard allowedRoles={[USER_ROLES.STUDENT]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Enrollments</h1>
          <p className="text-muted-foreground mt-1">
            View your enrolled subjects and academic progress
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
              <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEnrollments}</div>
              <p className="text-xs text-muted-foreground">All subjects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Enrollments</CardTitle>
              <CheckCircleIcon className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeEnrollments}</div>
              <p className="text-xs text-muted-foreground">Currently studying</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <XCircleIcon className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedEnrollments}</div>
              <p className="text-xs text-muted-foreground">Finished courses</p>
            </CardContent>
          </Card>
        </div>

        {/* Enrollments Table */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Your Enrollments</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={data?.data || []}
                searchKey="subjectName"
                searchPlaceholder="Search subjects..."
              />
            </CardContent>
          </Card>
        )}
      </div>
    </RoleGuard>
  )
}

export default StudentEnrollmentsPage