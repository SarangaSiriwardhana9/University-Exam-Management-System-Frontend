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
        <div className="mb-2">
          <h1 className="text-4xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Overview of the university examination management system
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <Card className="border-l-4 border-l-blue-500 border hover:border-primary/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Students</p>
                  <p className="text-xl font-bold">{overview?.totalStudents || 0}</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <UsersIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border hover:border-primary/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-full">
                  <GraduationCapIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Faculty</p>
                  <p className="text-xl font-bold">{overview?.totalFaculty || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-green-500 border hover:border-primary/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Subjects</p>
                  <p className="text-xl font-bold">{overview?.totalSubjects || 0}</p>
                </div>
                <BookOpenIcon className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-white border hover:border-primary/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CalendarIcon className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Upcoming Exams</p>
                  <p className="text-xl font-bold">{overview?.upcomingExams || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500 border hover:border-primary/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Pending Results</p>
                  <p className="text-xl font-bold">{overview?.pendingResults || 0}</p>
                </div>
                <div className="p-2 bg-amber-50 rounded-lg">
                  <ClockIcon className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-white border hover:border-primary/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-full">
                  <TrendingUpIcon className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pass Rate</p>
                  <p className="text-xl font-bold text-emerald-600">
                    {overview?.overallPassRate?.toFixed(1) || 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Exam Statistics */}
        <Card className="border">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BarChart3Icon className="h-5 w-5 text-primary" />
              </div>
              Exam Statistics
            </CardTitle>
            <CardDescription className="text-base">Current status of examination sessions</CardDescription>
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
            <Card className="border">
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
                            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500"
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
            <Card className="border">
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
                          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
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
        <Card className="border">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardTitle className="text-xl">Recent Activities</CardTitle>
            <CardDescription className="text-base">Latest system activities and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivities.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No recent activities</p>
            ) : (
              <div className="space-y-4">
                {recentActivities.slice(0, 10).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-0 hover:bg-muted/30 -mx-2 px-2 py-2 rounded-lg transition-colors">
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{activity.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs font-medium">
                          {activity.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          by {activity.actor}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap font-medium">
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