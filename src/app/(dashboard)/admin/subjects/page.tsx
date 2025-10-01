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
import { getSubjectColumns } from '@/features/subjects/components/subject-columns'
import { useSubjectsQuery } from '@/features/subjects/hooks/use-subjects-query'
import { useDeleteSubject } from '@/features/subjects/hooks/use-subject-mutations'
import type { Subject } from '@/features/subjects/types/subjects'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

const SubjectsPage = () => {
  const router = useRouter()
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null)

  const { data, isLoading } = useSubjectsQuery()
  const deleteMutation = useDeleteSubject()

  const handleDelete = () => {
    if (!deletingSubject) return

    deleteMutation.mutate(deletingSubject._id, {
      onSuccess: () => {
        setDeletingSubject(null)
      }
    })
  }

  const columns = getSubjectColumns({
    onEdit: (subject) => router.push(`/admin/subjects/${subject._id}/edit`),
    onDelete: (subject) => setDeletingSubject(subject),
    onView: (subject) => router.push(`/admin/subjects/${subject._id}`)
  })

  return (
    <RoleGuard allowedRoles={[USER_ROLES.ADMIN]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Subjects Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage all subjects offered by the university
            </p>
          </div>
          <Button onClick={() => router.push('/admin/subjects/create')}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Subject
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
            searchKey="subjectName"
            searchPlaceholder="Search subjects..."
          />
        )}

        {/* Delete Confirmation */}
        <AlertDialog open={!!deletingSubject} onOpenChange={() => setDeletingSubject(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete <strong>{deletingSubject?.subjectName}</strong> ({deletingSubject?.subjectCode}) from the system.
                This action cannot be undone and may affect related questions, exam papers, and enrollments.
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
      </div>
    </RoleGuard>
  )
}

export default SubjectsPage