'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeftIcon, EditIcon, TrashIcon, CalendarIcon, ClockIcon, StarIcon } from 'lucide-react'
import { useCalendarQuery } from '@/features/calendar/hooks/use-calendar-query'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getDaysBetween = (start: string, end: string) => {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

type ViewCalendarPageProps = {
  params: Promise<{ id: string }>
}

const ViewCalendarPage = ({ params }: ViewCalendarPageProps) => {
  const router = useRouter()
  const { id: calendarId } = use(params)

  console.log('View page - Calendar ID from params:', calendarId)

  const { data: calendarResponse, isLoading, error } = useCalendarQuery(calendarId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    console.error('Error fetching calendar:', error)
  }

  if (!calendarResponse?.data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Calendar Not Found</h2>
          <p className="text-muted-foreground">
            The calendar you&apos;re looking for doesn&apos;t exist.
          </p>
          {error && (
            <p className="text-sm text-red-500">
              Error: {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          )}
          <Button onClick={() => router.push('/admin/calendar')} className="mt-4">
            Back to Calendar
          </Button>
        </div>
      </div>
    )
  }

  const calendar = calendarResponse.data
  const semesterDays = getDaysBetween(calendar.semesterStart, calendar.semesterEnd)
  const examDays = getDaysBetween(calendar.examStart, calendar.examEnd)

  return (
    <RoleGuard allowedRoles={[USER_ROLES.ADMIN]}>
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
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
                <span>Academic Calendar Details</span>
                {calendar.isCurrent && (
                  <StarIcon className="h-6 w-6 text-yellow-500 fill-current" />
                )}
              </h1>
              <p className="text-muted-foreground mt-1">
                {calendar.academicYear} - Semester {calendar.semester}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/admin/calendar/${calendarId}/edit`)}
            >
              <EditIcon className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive">
              <TrashIcon className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Overview
                <div className="flex space-x-2">
                  {calendar.isCurrent && (
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      Current
                    </Badge>
                  )}
                  <Badge variant={calendar.isActive ? 'default' : 'secondary'}>
                    {calendar.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold">{calendar.academicYear}</h3>
                <p className="text-muted-foreground">
                  {calendar.semesterName || `Semester ${calendar.semester}`}
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Semester Duration</span>
                  <span className="font-medium">{semesterDays} days</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Exam Duration</span>
                  <span className="font-medium">{examDays} days</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Academic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Academic Year</p>
                    <p className="mt-1 text-lg font-semibold">{calendar.academicYear}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Semester</p>
                    <p className="mt-1 text-lg font-semibold">
                      {calendar.semesterName || `Semester ${calendar.semester}`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Semester Period */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5" />
                  <span>Semester Period</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                    <p className="text-sm">{formatDate(calendar.semesterStart)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">End Date</p>
                    <p className="text-sm">{formatDate(calendar.semesterEnd)}</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <ClockIcon className="inline h-4 w-4 mr-1" />
                    Total Duration: <span className="font-medium">{semesterDays} days</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Exam Period */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ClockIcon className="h-5 w-5" />
                  <span>Exam Period</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Exam Start</p>
                    <p className="text-sm">{formatDate(calendar.examStart)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Exam End</p>
                    <p className="text-sm">{formatDate(calendar.examEnd)}</p>
                  </div>
                </div>
                {calendar.resultPublishDate && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Result Publish Date</p>
                    <p className="text-sm">{formatDate(calendar.resultPublishDate)}</p>
                  </div>
                )}
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <ClockIcon className="inline h-4 w-4 mr-1" />
                    Exam Duration: <span className="font-medium">{examDays} days</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            {calendar.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{calendar.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle>Calendar Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created At</p>
                    <p className="mt-1 text-sm">{new Date(calendar.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                    <p className="mt-1 text-sm">{new Date(calendar.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RoleGuard>
  )
}

export default ViewCalendarPage