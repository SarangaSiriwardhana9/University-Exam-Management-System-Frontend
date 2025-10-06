'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { PlusIcon } from 'lucide-react'
import { DataTable } from '@/components/data-display/data-table'
import { getCalendarColumns } from '@/features/calendar/components/calendar-columns'
import { useCalendarsQuery } from '@/features/calendar/hooks/use-calendar-query'
import { useDeleteCalendar, useSetCurrentCalendar } from '@/features/calendar/hooks/use-calendar-mutations'
import type { AcademicCalendar } from '@/features/calendar/types/calendar'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

const CalendarPage = () => {
  const router = useRouter()
  const [deletingCalendar, setDeletingCalendar] = useState<AcademicCalendar | null>(null)
  const [settingCurrent, setSettingCurrent] = useState<AcademicCalendar | null>(null)

  const { data, isLoading } = useCalendarsQuery()
  const deleteMutation = useDeleteCalendar()
  const setCurrentMutation = useSetCurrentCalendar()

  const handleDelete = () => {
    if (!deletingCalendar) return

    deleteMutation.mutate(deletingCalendar._id, {
      onSuccess: () => {
        setDeletingCalendar(null)
      }
    })
  }

  const handleSetCurrent = () => {
    if (!settingCurrent) return

    setCurrentMutation.mutate(settingCurrent._id, {
      onSuccess: () => {
        setSettingCurrent(null)
      }
    })
  }

  const columns = getCalendarColumns({
    onEdit: (calendar) => router.push(`/admin/calendar/${calendar._id}/edit`),
    onDelete: (calendar) => setDeletingCalendar(calendar),
    onView: (calendar) => router.push(`/admin/calendar/${calendar._id}`),
    onSetCurrent: (calendar) => setSettingCurrent(calendar)
  })

  return (
    <RoleGuard allowedRoles={[USER_ROLES.ADMIN]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Academic Calendar</h1>
            <p className="text-muted-foreground mt-1">
              Manage academic year calendars and schedules
            </p>
          </div>
          <Button onClick={() => router.push('/admin/calendar/create')}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Calendar
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={data?.data || []}
            searchKey="academicYear"
            searchPlaceholder="Search calendars..."
          />
        )}

        {/* Delete Confirmation */}
        <AlertDialog open={!!deletingCalendar} onOpenChange={() => setDeletingCalendar(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the calendar for <strong>{deletingCalendar?.academicYear} Semester {deletingCalendar?.semester}</strong>.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive hover:bg-destructive/90"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Set Current Confirmation */}
        <AlertDialog open={!!settingCurrent} onOpenChange={() => setSettingCurrent(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Set Current Calendar</AlertDialogTitle>
              <AlertDialogDescription>
                This will set <strong>{settingCurrent?.academicYear} Semester {settingCurrent?.semester}</strong> as the current academic calendar.
                All other calendars will be marked as non-current.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleSetCurrent}
                disabled={setCurrentMutation.isPending}
              >
                {setCurrentMutation.isPending ? 'Setting...' : 'Set as Current'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </RoleGuard>
  )
}

export default CalendarPage