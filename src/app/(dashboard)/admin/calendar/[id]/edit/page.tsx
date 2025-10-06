'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeftIcon } from 'lucide-react'
import { CalendarForm } from '@/features/calendar/components/calendar-form'
import { useCalendarQuery } from '@/features/calendar/hooks/use-calendar-query'
import { useUpdateCalendar } from '@/features/calendar/hooks/use-calendar-mutations'
import type { UpdateCalendarFormData } from '@/features/calendar/validations/calendar-schemas'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

type EditCalendarPageProps = {
  params: Promise<{ id: string }>
}

const EditCalendarPage = ({ params }: EditCalendarPageProps) => {
  const router = useRouter()
  const { id: calendarId } = use(params)

  console.log('Edit page - Calendar ID from params:', calendarId)

  const { data: calendarResponse, isLoading, error } = useCalendarQuery(calendarId)
  const updateMutation = useUpdateCalendar()

  const handleUpdate = (data: UpdateCalendarFormData) => {
    updateMutation.mutate(
      { id: calendarId, data },
      {
        onSuccess: () => {
          router.push('/admin/calendar')
        }
      }
    )
  }

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

  return (
    <RoleGuard allowedRoles={[USER_ROLES.ADMIN]}>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Academic Calendar</h1>
            <p className="text-muted-foreground mt-1">
              Update calendar for {calendarResponse.data.academicYear} Semester {calendarResponse.data.semester}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Calendar Information</CardTitle>
            <CardDescription>
              Update the calendar details below and click save.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CalendarForm
              calendar={calendarResponse.data}
              onSubmit={handleUpdate}
              onCancel={() => router.push('/admin/calendar')}
              isLoading={updateMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}

export default EditCalendarPage