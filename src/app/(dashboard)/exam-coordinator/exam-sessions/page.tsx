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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { PlusIcon } from 'lucide-react'
import { DataTable } from '@/components/data-display/data-table'
import { getExamSessionColumns } from '@/features/exam-sessions/components/exam-session-columns'
import { useExamSessionsQuery } from '@/features/exam-sessions/hooks/use-exam-sessions-query'
import { useDeleteExamSession, useCancelExamSession } from '@/features/exam-sessions/hooks/use-exam-session-mutations'
import type { ExamSession } from '@/features/exam-sessions/types/exam-sessions'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

const ExamSessionsPage = () => {
  const router = useRouter()
  const [deletingSession, setDeletingSession] = useState<ExamSession | null>(null)
  const [cancellingSession, setCancellingSession] = useState<ExamSession | null>(null)
  const [cancellationReason, setCancellationReason] = useState('')

  const { data, isLoading } = useExamSessionsQuery()
  const deleteMutation = useDeleteExamSession()
  const cancelMutation = useCancelExamSession()

  const handleDelete = () => {
    if (!deletingSession) return

    deleteMutation.mutate(deletingSession._id, {
      onSuccess: () => {
        setDeletingSession(null)
      }
    })
  }

  const handleCancel = () => {
    if (!cancellingSession) return

    cancelMutation.mutate(
      { 
        id: cancellingSession._id, 
        reason: cancellationReason.trim() || undefined 
      },
      {
        onSuccess: () => {
          setCancellingSession(null)
          setCancellationReason('')
        }
      }
    )
  }

  const columns = getExamSessionColumns({
    onEdit: (session) => router.push(`/exam-coordinator/exam-sessions/${session._id}/edit`),
    onDelete: (session) => setDeletingSession(session),
    onView: (session) => router.push(`/exam-coordinator/exam-sessions/${session._id}`),
    onCancel: (session) => setCancellingSession(session)
  })

  return (
    <RoleGuard allowedRoles={[USER_ROLES.EXAM_COORDINATOR, USER_ROLES.ADMIN]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Exam Sessions</h1>
            <p className="text-muted-foreground mt-1">
              Manage all exam sessions and schedules
            </p>
          </div>
          <Button onClick={() => router.push('/exam-coordinator/exam-sessions/create')}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Schedule Exam
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
            searchKey="examTitle"
            searchPlaceholder="Search exam sessions..."
          />
        )}

        {/* Delete Confirmation */}
        <AlertDialog open={!!deletingSession} onOpenChange={() => setDeletingSession(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the exam session <strong>{deletingSession?.examTitle}</strong>.
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

        {/* Cancel Session Dialog */}
        <Dialog open={!!cancellingSession} onOpenChange={() => setCancellingSession(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Exam Session</DialogTitle>
              <DialogDescription>
                You are about to cancel the exam session <strong>{cancellingSession?.examTitle}</strong>.
                Please provide a reason for cancellation (optional).
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="reason">Cancellation Reason</Label>
                <Textarea
                  id="reason"
                  placeholder="Enter reason for cancellation..."
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCancellingSession(null)}>
                Keep Session
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Session'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RoleGuard>
  )
}

export default ExamSessionsPage