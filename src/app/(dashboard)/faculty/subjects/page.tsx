// src/app/(dashboard)/faculty/subjects/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/data-display/data-table'
import { getFacultySubjectColumns } from '@/features/subjects/components/faculty-subject-columns'
import { useAuth } from '@/lib/auth/auth-provider'
import { useMySubjectsQuery } from '@/features/subjects/hooks/use-subjects-query'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpenIcon, HelpCircleIcon, FileTextIcon } from 'lucide-react'

const FacultySubjectsPage = () => {
  const router = useRouter()
  const { user } = useAuth()

  const { data, isLoading } = useMySubjectsQuery()

  const columns = getFacultySubjectColumns({
    onView: (subject) => router.push(`/faculty/subjects/${subject._id}`),
    onManageQuestions: (subject) => router.push(`/faculty/questions?subjectId=${subject._id}`),
    onManagePapers: (subject) => router.push(`/faculty/exam-papers?subjectId=${subject._id}`)
  })

  // Calculate quick stats
  const totalSubjects = data?.data?.length || 0
  const activeSubjects = data?.data?.filter(s => s.isActive).length || 0

  return (
    <RoleGuard allowedRoles={[USER_ROLES.FACULTY]}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Subjects</h1>
          <p className="text-muted-foreground mt-1">
            Subjects assigned to you for teaching and management
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
              <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSubjects}</div>
              <p className="text-xs text-muted-foreground">
                Assigned to you
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subjects</CardTitle>
              <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeSubjects}</div>
              <p className="text-xs text-muted-foreground">
                Currently teaching
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <button
                onClick={() => router.push('/faculty/questions')}
                className="w-full text-left text-sm hover:text-primary transition-colors flex items-center"
              >
                <HelpCircleIcon className="h-3 w-3 mr-2" />
                Manage Questions
              </button>
              <button
                onClick={() => router.push('/faculty/exam-papers')}
                className="w-full text-left text-sm hover:text-primary transition-colors flex items-center"
              >
                <FileTextIcon className="h-3 w-3 mr-2" />
                Manage Exam Papers
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Subjects Table */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Your Subjects</CardTitle>
              <CardDescription>
                View and manage the subjects you are teaching
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={data?.data || []}
                searchKey="subjectName"
                searchPlaceholder="Search your subjects..."
              />
            </CardContent>
          </Card>
        )}
      </div>
    </RoleGuard>
  )
}

export default FacultySubjectsPage