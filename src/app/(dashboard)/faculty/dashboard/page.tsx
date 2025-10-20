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
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent">Faculty Dashboard</h1>
            <p className="text-muted-foreground mt-2 text-lg">Overview of your teaching activities and exam management</p>
          </div>
          <Button onClick={() => router.push('/faculty/questions/new')} className="gradient-primary text-white shadow-lg hover:shadow-xl">
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Question
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/faculty/subjects')}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">My Subjects</p>
                  <p className="text-xl font-bold">{overview?.mySubjects || 0}</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <BookOpenIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-white hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/faculty/sessions')}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CalendarIcon className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Upcoming Exams</p>
                  <p className="text-xl font-bold">{overview?.myUpcomingExams || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/faculty/marking')}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 rounded-full">
                  <ClipboardListIcon className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pending Marking</p>
                  <p className="text-xl font-bold">{overview?.myPendingResults || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-purple-500 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Active Students</p>
                  <p className="text-xl font-bold">{overview?.myActiveStudents || 0}</p>
                </div>
                <UsersIcon className="h-5 w-5 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardTitle className="text-xl">Exam Statistics</CardTitle>
              <CardDescription className="text-base">Overview of your exam sessions and resources</CardDescription>
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

          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardTitle className="text-xl">Quick Actions</CardTitle>
              <CardDescription className="text-base">Common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start hover:bg-primary/5 hover:border-primary/50 transition-all" onClick={() => router.push('/faculty/questions/new')}>
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

        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardTitle className="text-xl">Recent Activities</CardTitle>
            <CardDescription className="text-base">Latest exam sessions and updates</CardDescription>
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
                  <div key={index} className="flex items-center justify-between p-4 border rounded-xl hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 hover:shadow-md">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{activity.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
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