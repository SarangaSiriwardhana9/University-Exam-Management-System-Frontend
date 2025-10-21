'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeftIcon, EditIcon, TrashIcon, CalendarIcon, ClockIcon, MapPinIcon, UsersIcon, FileTextIcon, BookOpenIcon, GraduationCapIcon, InfoIcon, CheckCircle2Icon } from 'lucide-react'
import { useExamSessionQuery } from '@/features/exam-sessions/hooks/use-exam-sessions-query'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'
import { cn } from '@/lib/utils'
import type { ExamSessionStatus } from '@/features/exam-sessions/types/exam-sessions'

const getStatusBadgeClass = (status: ExamSessionStatus) => {
  const statusClasses = {
    scheduled: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-orange-100 text-orange-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  } as const

  return statusClasses[status] || 'bg-muted'
}

const formatStatus = (status: string) => {
  return status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`
  }
  return `${remainingMinutes}m`
}

type ViewExamSessionPageProps = {
  params: Promise<{ id: string }>
}

const ViewExamSessionPage = ({ params }: ViewExamSessionPageProps) => {
  const router = useRouter()
  const { id: sessionId } = use(params)

  console.log('View page - Session ID from params:', sessionId)

  const { data: sessionResponse, isLoading, error } = useExamSessionQuery(sessionId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    console.error('Error fetching exam session:', error)
  }

  if (!sessionResponse?.data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Exam Session Not Found</h2>
          <p className="text-muted-foreground">
            The exam session you&apos;re looking for doesn&apos;t exist.
          </p>
          {error && (
            <p className="text-sm text-red-500">
              Error: {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          )}
          <Button onClick={() => router.push('/exam-coordinator/exam-sessions')} className="mt-4">
            Back to Exam Sessions
          </Button>
        </div>
      </div>
    )
  }

  const session = sessionResponse.data
  const canEdit = session.status === 'scheduled'

  return (
    <RoleGuard allowedRoles={[USER_ROLES.EXAM_COORDINATOR, USER_ROLES.ADMIN]}>
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
              <h1 className="text-3xl font-bold text-gray-900">Exam Session Details</h1>
              <p className="text-muted-foreground mt-1">
                View information for {session.examTitle}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {canEdit && (
              <Button
                variant="outline"
                onClick={() => router.push(`/exam-coordinator/exam-sessions/${sessionId}/edit`)}
              >
                <EditIcon className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
            <Button variant="destructive">
              <TrashIcon className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Overview Card */}
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CheckCircle2Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Status Overview</CardTitle>
                </div>
                <Badge
                  variant="outline"
                  className={cn('font-medium', getStatusBadgeClass(session.status))}
                >
                  {formatStatus(session.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg">
                <h3 className="text-xl font-bold">{session.examTitle}</h3>
                <p className="text-sm text-muted-foreground mt-1">{session.subjectCode} - {session.subjectName}</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <CalendarIcon className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="font-medium">{new Date(session.startTime).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <ClockIcon className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Time & Duration</p>
                    <p className="font-medium">
                      {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Duration: {formatDuration(session.durationMinutes)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <MapPinIcon className="h-4 w-4 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Venue</p>
                    <p className="font-medium">{session.roomNumber}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{session.building}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <UsersIcon className="h-4 w-4 text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Registered Students</p>
                    <p className="font-medium">{session.currentStudents} / {session.maxStudents}</p>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all" 
                        style={{ width: `${(session.currentStudents / session.maxStudents) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Exam Information */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <FileTextIcon className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle>Exam Information</CardTitle>
                    <CardDescription>Details about the exam paper and subject</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpenIcon className="h-4 w-4" />
                      <span>Exam Title</span>
                    </div>
                    <p className="font-medium text-lg">{session.examTitle}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileTextIcon className="h-4 w-4" />
                      <span>Paper Title</span>
                    </div>
                    <p className="font-medium text-lg">{session.paperTitle || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpenIcon className="h-4 w-4" />
                      <span>Subject</span>
                    </div>
                    <p className="font-medium">{session.subjectCode} - {session.subjectName}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ClockIcon className="h-4 w-4" />
                      <span>Duration</span>
                    </div>
                    <p className="font-medium">{formatDuration(session.durationMinutes)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Schedule & Venue */}
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <CalendarIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <CardTitle>Schedule & Venue</CardTitle>
                    <CardDescription>Date, time, and location details</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarIcon className="h-4 w-4" />
                      <span>Date & Time</span>
                    </div>
                    <p className="font-medium">{new Date(session.examDateTime).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPinIcon className="h-4 w-4" />
                      <span>Room</span>
                    </div>
                    <p className="font-medium">{session.roomNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPinIcon className="h-4 w-4" />
                      <span>Building</span>
                    </div>
                    <p className="font-medium">{session.building || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <UsersIcon className="h-4 w-4" />
                      <span>Capacity</span>
                    </div>
                    <p className="font-medium">{session.currentStudents} / {session.maxStudents} students</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academic Details */}
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <GraduationCapIcon className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <CardTitle>Academic Details</CardTitle>
                    <CardDescription>Year, semester, and creation information</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <GraduationCapIcon className="h-4 w-4" />
                      <span>Academic Year</span>
                    </div>
                    <p className="font-medium">{session.academicYear}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarIcon className="h-4 w-4" />
                      <span>Semester</span>
                    </div>
                    <p className="font-medium">Semester {session.semester}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <UsersIcon className="h-4 w-4" />
                      <span>Created By</span>
                    </div>
                    <p className="font-medium">{session.createdByName || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ClockIcon className="h-4 w-4" />
                      <span>Created At</span>
                    </div>
                    <p className="font-medium">{new Date(session.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            {session.instructions && (
              <Card className="border-l-4 border-l-gray-500">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gray-500/10 rounded-lg">
                      <InfoIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <CardTitle>Special Instructions</CardTitle>
                      <CardDescription>Important information for students</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{session.instructions}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </RoleGuard>
  )
}

export default ViewExamSessionPage