'use client'

import { useRouter } from 'next/navigation'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  CalendarIcon,
  UsersIcon,
  ClipboardListIcon,
  CheckCircle2Icon,
  XCircleIcon,
  ClockIcon,
  TrendingUpIcon,
  AlertCircleIcon,
  PlusIcon,
  FileTextIcon,
  BellIcon,
  BarChart3Icon,
} from 'lucide-react'
import { useExamSessionsQuery } from '@/features/exam-sessions/hooks/use-exam-sessions-query'
import { useRegistrationsQuery, useRegistrationStatsQuery } from '@/features/exam-registrations/hooks/use-registrations-query'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { format } from 'date-fns'

export default function ExamCoordinatorDashboard() {
  const router = useRouter()
  
  // Fetch data
  const { data: sessionsData, isLoading: sessionsLoading } = useExamSessionsQuery({ limit: 100 })
  const { data: registrationsData, isLoading: registrationsLoading } = useRegistrationsQuery({ limit: 100 })
  const { data: statsData } = useRegistrationStatsQuery()

  const sessions = sessionsData?.data || []
  const registrations = registrationsData?.data || []

  // Calculate statistics
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const upcomingSessions = sessions.filter(s => {
    const sessionDate = new Date(s.startTime)
    return s.status === 'scheduled' && sessionDate >= today
  })
  
  const todaySessions = sessions.filter(s => {
    const sessionDate = new Date(s.startTime)
    sessionDate.setHours(0, 0, 0, 0)
    return sessionDate.getTime() === today.getTime()
  })

  const ongoingSessions = sessions.filter(s => s.status === 'in_progress')
  const completedSessions = sessions.filter(s => s.status === 'completed')
  
  const totalRegistrations = registrations.length
  const registeredStudents = registrations.filter(r => r.status === 'registered').length
  const completedExams = registrations.filter(r => r.status === 'completed').length
  const absentStudents = registrations.filter(r => r.status === 'absent').length

  const stats = statsData?.data || {
    total: totalRegistrations,
    registered: registeredStudents,
    inProgress: 0,
    completed: completedExams,
    absent: absentStudents,
  }

  const isLoading = sessionsLoading || registrationsLoading

  if (isLoading) {
    return (
      <RoleGuard allowedRoles={[USER_ROLES.EXAM_COORDINATOR]}>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </RoleGuard>
    )
  }

  return (
    <RoleGuard allowedRoles={[USER_ROLES.EXAM_COORDINATOR]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Exam Coordinator Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage exam sessions, registrations, and monitor exam activities
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => router.push('/exam-coordinator/exam-sessions/create')}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Exam Session
            </Button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Exam Sessions */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Total Exam Sessions</CardDescription>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-3xl">{sessions.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingUpIcon className="h-3 w-3 text-green-600" />
                <span>All time sessions</span>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Exams */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Upcoming Exams</CardDescription>
                <ClockIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-3xl text-blue-600">{upcomingSessions.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Scheduled for future</span>
              </div>
            </CardContent>
          </Card>

          {/* Today's Exams */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Today's Exams</CardDescription>
                <AlertCircleIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-3xl text-orange-600">{todaySessions.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{ongoingSessions.length} in progress</span>
              </div>
            </CardContent>
          </Card>

          {/* Completed Exams */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Completed Exams</CardDescription>
                <CheckCircle2Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-3xl text-green-600">{completedSessions.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Successfully completed</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Registration Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Registrations</CardDescription>
              <CardTitle className="text-2xl">{stats.total}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">All exam registrations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Awaiting Exam</CardDescription>
              <CardTitle className="text-2xl text-blue-600">{stats.registered}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Ready to take exam</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>In Progress</CardDescription>
              <CardTitle className="text-2xl text-orange-600">{stats.inProgress}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Currently taking exam</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Completed</CardDescription>
              <CardTitle className="text-2xl text-green-600">{stats.completed}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Exams submitted</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Absent</CardDescription>
              <CardTitle className="text-2xl text-red-600">{stats.absent}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Did not attend</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Upcoming Exams */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => router.push('/exam-coordinator/exam-sessions/create')}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create New Exam Session
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => router.push('/exam-coordinator/registrations')}
              >
                <UsersIcon className="h-4 w-4 mr-2" />
                Manage Registrations
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => router.push('/exam-coordinator/exam-sessions')}
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                View All Exam Sessions
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => router.push('/exam-coordinator/rooms')}
              >
                <FileTextIcon className="h-4 w-4 mr-2" />
                Manage Exam Rooms
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Exams */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Upcoming Exams</CardTitle>
                  <CardDescription>Next scheduled exam sessions</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => router.push('/exam-coordinator/exam-sessions')}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {upcomingSessions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No upcoming exams scheduled</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingSessions.slice(0, 5).map((session) => (
                    <div 
                      key={session._id} 
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => router.push(`/exam-coordinator/exam-sessions/${session._id}`)}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{session.examTitle}</p>
                        <p className="text-xs text-muted-foreground">
                          {session.subjectCode && `${session.subjectCode} - `}{session.subjectName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium">
                          {format(new Date(session.startTime), 'MMM dd, yyyy')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(session.startTime), 'hh:mm a')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>{format(today, 'EEEE, MMMM dd, yyyy')}</CardDescription>
          </CardHeader>
          <CardContent>
            {todaySessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ClockIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No exams scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todaySessions.map((session) => (
                  <div 
                    key={session._id} 
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{session.examTitle}</p>
                      <p className="text-xs text-muted-foreground">
                        {session.roomNumber && `Room: ${session.roomNumber}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={session.status === 'in_progress' ? 'default' : 'secondary'}>
                        {session.status === 'in_progress' ? 'Ongoing' : 'Scheduled'}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(session.startTime), 'hh:mm a')}
                      </p>
                    </div>
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