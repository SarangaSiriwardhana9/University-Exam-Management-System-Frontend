'use client'

import { useRouter } from 'next/navigation'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpenIcon, FileTextIcon, ClipboardListIcon, UsersIcon, CalendarIcon, CheckCircle2Icon, ClockIcon, PlayCircleIcon, PlusIcon, EyeIcon } from 'lucide-react'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { useFacultyDashboardQuery } from '@/features/dashboard/hooks/use-dashboard-query'
import { formatDistanceToNow } from 'date-fns'

export default function FacultyDashboard() {
  const router = useRouter()
  const { data, isLoading } = useFacultyDashboardQuery()

  if (isLoading) {
    return (
      <RoleGuard allowedRoles={[USER_ROLES.FACULTY]}>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </RoleGuard>
    )
  }

  const overview = data?.overview || data?.data?.overview
  const examStats = data?.examStats || data?.data?.examStats
  const activities = data?.recentActivities || data?.data?.recentActivities || []

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'ongoing': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <RoleGuard allowedRoles={[USER_ROLES.FACULTY]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Faculty Dashboard</h1>
            <p className="text-muted-foreground mt-1">Overview of your teaching activities and exam management</p>
          </div>
          <Button onClick={() => router.push('/faculty/questions/new')}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Question
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/faculty/subjects')}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>My Subjects</CardDescription>
                <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-3xl">{overview?.mySubjects || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Active subjects</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/faculty/sessions')}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Upcoming Exams</CardDescription>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-3xl text-blue-600">{overview?.myUpcomingExams || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Scheduled sessions</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/faculty/marking')}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Pending Marking</CardDescription>
                <ClipboardListIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-3xl text-orange-600">{overview?.myPendingResults || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Submissions to mark</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Active Students</CardDescription>
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-3xl">{overview?.myActiveStudents || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Enrolled students</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Exam Statistics</CardTitle>
              <CardDescription>Overview of your exam sessions and resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarIcon className="h-4 w-4 text-blue-600" />
                    <p className="text-sm font-medium text-blue-900">Scheduled</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{examStats?.scheduledExams || 0}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <PlayCircleIcon className="h-4 w-4 text-green-600" />
                    <p className="text-sm font-medium text-green-900">Ongoing</p>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{examStats?.ongoingExams || 0}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2Icon className="h-4 w-4 text-gray-600" />
                    <p className="text-sm font-medium text-gray-900">Completed</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-600">{examStats?.completedExams || 0}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileTextIcon className="h-4 w-4 text-purple-600" />
                    <p className="text-sm font-medium text-purple-900">Exam Papers</p>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">{examStats?.totalPapers || 0}</p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ClipboardListIcon className="h-4 w-4 text-indigo-600" />
                    <p className="text-sm font-medium text-indigo-900">Questions</p>
                  </div>
                  <p className="text-2xl font-bold text-indigo-600">{examStats?.totalQuestions || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/faculty/questions/new')}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Question
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/faculty/exam-papers/create')}>
                <FileTextIcon className="h-4 w-4 mr-2" />
                Create Exam Paper
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/faculty/sessions')}>
                <CalendarIcon className="h-4 w-4 mr-2" />
                View Exam Sessions
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/faculty/marking')}>
                <ClipboardListIcon className="h-4 w-4 mr-2" />
                Mark Submissions
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/faculty/results')}>
                <EyeIcon className="h-4 w-4 mr-2" />
                View Results
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest exam sessions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ClockIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No recent activities</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.date && formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                      </p>
                    </div>
                    <Badge className={getStatusColor(activity.status)}>
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}