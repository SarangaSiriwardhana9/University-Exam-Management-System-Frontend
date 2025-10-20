'use client'

import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { useAdminDashboardQuery } from '@/features/dashboard/hooks/use-dashboard-query'
import { 
  UsersIcon, 
  GraduationCapIcon, 
  BookOpenIcon, 
  CalendarIcon,
  ClockIcon,
  TrendingUpIcon,
  CheckCircle2Icon,
  XCircleIcon,
  AlertCircleIcon,
  BarChart3Icon,
  PieChartIcon
} from 'lucide-react'
import { format } from 'date-fns'

export default function AdminDashboard() {
  const { data, isLoading } = useAdminDashboardQuery()

  if (isLoading) {
    return (
      <RoleGuard allowedRoles={[USER_ROLES.ADMIN]}>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </RoleGuard>
    )
  }

  const overview = data?.overview
  const examStats = data?.examStats
  const recentActivities = data?.recentActivities || []
  const charts = data?.charts

  return (
    <RoleGuard allowedRoles={[USER_ROLES.ADMIN]}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of the university examination management system
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Total Students</CardDescription>
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-3xl">{overview?.totalStudents || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Active student accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Total Faculty</CardDescription>
                <GraduationCapIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-3xl">{overview?.totalFaculty || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Active faculty members</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Total Subjects</CardDescription>
                <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-3xl">{overview?.totalSubjects || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Active subjects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Upcoming Exams</CardDescription>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-3xl">{overview?.upcomingExams || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Next 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Pending Results</CardDescription>
                <ClockIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-3xl">{overview?.pendingResults || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Awaiting publication</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Overall Pass Rate</CardDescription>
                <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-3xl text-green-600">
                {overview?.overallPassRate?.toFixed(1) || 0}%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">All published results</p>
            </CardContent>
          </Card>
        </div>

        {/* Exam Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3Icon className="h-5 w-5" />
              Exam Statistics
            </CardTitle>
            <CardDescription>Current status of examination sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-blue-600" />
                  <p className="text-2xl font-bold">{examStats?.scheduledExams || 0}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Ongoing</p>
                <div className="flex items-center gap-2">
                  <AlertCircleIcon className="h-4 w-4 text-orange-600" />
                  <p className="text-2xl font-bold">{examStats?.ongoingExams || 0}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Completed</p>
                <div className="flex items-center gap-2">
                  <CheckCircle2Icon className="h-4 w-4 text-green-600" />
                  <p className="text-2xl font-bold">{examStats?.completedExams || 0}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Cancelled</p>
                <div className="flex items-center gap-2">
                  <XCircleIcon className="h-4 w-4 text-red-600" />
                  <p className="text-2xl font-bold">{examStats?.cancelledExams || 0}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Attendance Rate</p>
                <div className="flex items-center gap-2">
                  <UsersIcon className="h-4 w-4 text-purple-600" />
                  <p className="text-2xl font-bold">{examStats?.averageAttendanceRate?.toFixed(1) || 0}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Grade Distribution */}
          {charts?.gradeDistribution && Object.keys(charts.gradeDistribution).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  Grade Distribution
                </CardTitle>
                <CardDescription>Overall grade distribution across all results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(charts.gradeDistribution)
                    .sort(([a], [b]) => {
                      const gradeOrder = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F']
                      return gradeOrder.indexOf(a) - gradeOrder.indexOf(b)
                    })
                    .map(([grade, count]) => {
                      const total = Object.values(charts.gradeDistribution).reduce((a, b) => a + b, 0)
                      const percentage = ((count / total) * 100).toFixed(1)
                      return (
                        <div key={grade} className="flex items-center gap-3">
                          <Badge variant="outline" className="w-12 justify-center">
                            {grade}
                          </Badge>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-muted-foreground">{count} students</span>
                              <span className="text-sm font-medium">{percentage}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Exams by Month */}
          {charts?.examsByMonth && Object.keys(charts.examsByMonth).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3Icon className="h-5 w-5" />
                  Exams by Month
                </CardTitle>
                <CardDescription>Examination schedule for current year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(charts.examsByMonth).map(([month, count]) => {
                    const maxCount = Math.max(...Object.values(charts.examsByMonth))
                    const percentage = ((count / maxCount) * 100).toFixed(0)
                    return (
                      <div key={month} className="flex items-center gap-3">
                        <span className="text-sm font-medium w-12">{month}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-muted-foreground">{count} exams</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest system activities and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivities.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No recent activities</p>
            ) : (
              <div className="space-y-4">
                {recentActivities.slice(0, 10).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {activity.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          by {activity.actor}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {format(new Date(activity.timestamp), 'MMM dd, HH:mm')}
                    </span>
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