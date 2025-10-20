'use client'

import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useStudentDashboardQuery } from '@/features/dashboard/hooks/use-dashboard-query'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { BookOpenIcon, CalendarIcon, TrophyIcon, ClockIcon, ArrowRightIcon, AlertCircleIcon, CheckCircle2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'

export default function StudentDashboard() {
  const router = useRouter()
  const { data: dashboard, isLoading } = useStudentDashboardQuery()

  if (isLoading) {
    return (
      <RoleGuard allowedRoles={[USER_ROLES.STUDENT]}>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </RoleGuard>
    )
  }

  return (
    <RoleGuard allowedRoles={[USER_ROLES.STUDENT]}>
      <div className="space-y-6">
        <div className="mb-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent">Student Dashboard</h1>
          <p className="text-muted-foreground mt-2 text-lg">Welcome back! Here's your academic overview.</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Enrolled Subjects</p>
                  <p className="text-xl font-bold">{dashboard?.enrolledSubjects || 0}</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <BookOpenIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-white hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CalendarIcon className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Upcoming Exams</p>
                  <p className="text-xl font-bold">{dashboard?.upcomingExams?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-full">
                  <CheckCircle2Icon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Completed Exams</p>
                  <p className="text-xl font-bold">{dashboard?.completedExams || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-amber-500 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Pending Results</p>
                  <p className="text-xl font-bold">{dashboard?.pendingResults || 0}</p>
                </div>
                <ClockIcon className="h-5 w-5 text-amber-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Upcoming Exams</CardTitle>
                  <CardDescription className="text-base">Your scheduled examinations</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/student/exams')}
                >
                  View All
                  <ArrowRightIcon className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!dashboard?.upcomingExams || dashboard.upcomingExams.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No upcoming exams</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {dashboard.upcomingExams.slice(0, 3).map((exam) => (
                    <div
                      key={exam.id}
                      className="flex items-start justify-between p-4 border rounded-xl hover:bg-primary/5 hover:border-primary/30 cursor-pointer transition-all duration-200 hover:shadow-md"
                      onClick={() => router.push(`/student/exams`)}
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{exam.title}</h4>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            {format(new Date(exam.date), 'MMM dd, yyyy')}
                          </span>
                          <span>{exam.room}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {format(new Date(exam.date), 'HH:mm')}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Recent Grades</CardTitle>
                  <CardDescription className="text-base">Your latest exam results</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/student/results')}
                >
                  View All
                  <ArrowRightIcon className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!dashboard?.recentGrades || dashboard.recentGrades.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <TrophyIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No results published yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {dashboard.recentGrades.map((grade) => (
                    <div
                      key={grade.id}
                      className="flex items-center justify-between p-4 border rounded-xl hover:bg-primary/5 hover:border-primary/30 cursor-pointer transition-all duration-200 hover:shadow-md"
                      onClick={() => router.push('/student/results')}
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{grade.subject}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {grade.marks} marks
                        </p>
                      </div>
                      <Badge
                        variant={grade.grade === 'F' ? 'destructive' : 'default'}
                        className={grade.grade.startsWith('A') ? 'bg-green-600' : ''}
                      >
                        {grade.grade}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {dashboard?.notifications && dashboard.notifications.length > 0 && (
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardTitle className="text-xl">Notifications</CardTitle>
              <CardDescription className="text-base">Important updates and announcements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboard.notifications.map((notification) => (
                  <Alert key={notification.id}>
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{notification.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                          {notification.time}
                        </span>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardTitle className="text-xl">Quick Actions</CardTitle>
            <CardDescription className="text-base">Access frequently used features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Button
                variant="outline"
                className="justify-start h-auto py-4 hover:bg-primary/5 hover:border-primary/50 hover:shadow-md transition-all duration-200"
                onClick={() => router.push('/student/enrollments')}
              >
                <BookOpenIcon className="h-5 w-5 mr-2" />
                <div className="text-left">
                  <div className="font-medium">My Enrollments</div>
                  <div className="text-xs text-muted-foreground">View enrolled subjects</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto py-4"
                onClick={() => router.push('/student/exams')}
              >
                <CalendarIcon className="h-5 w-5 mr-2" />
                <div className="text-left">
                  <div className="font-medium">My Exams</div>
                  <div className="text-xs text-muted-foreground">View exam schedule</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto py-4"
                onClick={() => router.push('/student/results')}
              >
                <TrophyIcon className="h-5 w-5 mr-2" />
                <div className="text-left">
                  <div className="font-medium">My Results</div>
                  <div className="text-xs text-muted-foreground">Check your grades</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto py-4"
                onClick={() => router.push('/student/exam-calendar')}
              >
                <ClockIcon className="h-5 w-5 mr-2" />
                <div className="text-left">
                  <div className="font-medium">Exam Calendar</div>
                  <div className="text-xs text-muted-foreground">View full calendar</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}