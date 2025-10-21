'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeftIcon, EditIcon, TrashIcon, CalendarIcon, ClockIcon, MapPinIcon, UsersIcon } from 'lucide-react'
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
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Status
                <Badge
                  variant="outline"
                  className={cn('font-medium', getStatusBadgeClass(session.status))}
                >
                  {formatStatus(session.status)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold">{session.examTitle}</h3>
                <p className="text-muted-foreground">{session.subjectCode} - {session.subjectName}</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(session.startTime).toLocaleDateString()}</span>
                </div>
                <div className="flex items-start space-x-3 text-sm">
                  <ClockIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Duration: {formatDuration(session.durationMinutes)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{session.roomNumber} - {session.building}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <UsersIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{session.currentStudents} / {session.maxStudents} students</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Exam Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Exam Title</p>
                    <p className="mt-1">{session.examTitle}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Paper Title</p>
                    <p className="mt-1">{session.paperTitle || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Subject</p>
                    <p className="mt-1">{session.subjectCode} - {session.subjectName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Duration</p>
                    <p className="mt-1">{formatDuration(session.durationMinutes)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Schedule Information */}
            <Card>
              <CardHeader>
                <CardTitle>Schedule & Venue</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Date & Time</p>
                    <p className="mt-1">{new Date(session.examDateTime).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Room</p>
                    <p className="mt-1">{session.roomNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Building</p>
                    <p className="mt-1">{session.building || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Capacity</p>
                    <p className="mt-1">{session.currentStudents} / {session.maxStudents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Academic Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Academic Year</p>
                    <p className="mt-1">{session.academicYear}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Semester</p>
                    <p className="mt-1">Semester {session.semester}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created By</p>
                    <p className="mt-1">{session.createdByName || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created At</p>
                    <p className="mt-1">{new Date(session.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            {session.instructions && (
              <Card>
                <CardHeader>
                  <CardTitle>Special Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{session.instructions}</p>
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