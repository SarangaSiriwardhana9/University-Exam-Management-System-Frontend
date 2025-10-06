'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeftIcon } from 'lucide-react'
import { CalendarForm } from '@/features/calendar/components/calendar-form'
import { useCreateCalendar } from '@/features/calendar/hooks/use-calendar-mutations'
import type { CreateCalendarFormData } from '@/features/calendar/validations/calendar-schemas'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

const CreateCalendarPage = () => {
  const router = useRouter()
  const createMutation = useCreateCalendar()

  const handleCreate = (data: CreateCalendarFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        router.push('/admin/calendar')
      }
    })
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
            <h1 className="text-3xl font-bold text-gray-900">Create Academic Calendar</h1>
            <p className="text-muted-foreground mt-1">
              Add a new academic year calendar
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Calendar Information</CardTitle>
            <CardDescription>
              Fill in the details below to create a new academic calendar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CalendarForm
              onSubmit={handleCreate}
              onCancel={() => router.push('/admin/calendar')}
              isLoading={createMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}

export default CreateCalendarPage