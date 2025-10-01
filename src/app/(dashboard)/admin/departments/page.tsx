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
import { getDepartmentColumns } from '@/features/departments/components/department-columns'
import { useDepartmentsQuery } from '@/features/departments/hooks/use-departments-query'
import { useDeleteDepartment } from '@/features/departments/hooks/use-department-mutations'
import type { Department } from '@/features/departments/types/departments'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

const DepartmentsPage = () => {
  const router = useRouter()
  const [deletingDepartment, setDeletingDepartment] = useState<Department | null>(null)

  const { data, isLoading } = useDepartmentsQuery()
  const deleteMutation = useDeleteDepartment()

  const handleDelete = () => {
    if (!deletingDepartment) return

    deleteMutation.mutate(deletingDepartment._id, {
      onSuccess: () => {
        setDeletingDepartment(null)
      }
    })
  }

  const columns = getDepartmentColumns({
    onEdit: (department) => router.push(`/admin/departments/${department._id}/edit`),
    onDelete: (department) => setDeletingDepartment(department),
    onView: (department) => router.push(`/admin/departments/${department._id}`)
  })

  return (
    <RoleGuard allowedRoles={[USER_ROLES.ADMIN]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Departments Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage all departments in the university
            </p>
          </div>
          <Button onClick={() => router.push('/admin/departments/create')}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Department
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
            searchKey="departmentName"
            searchPlaceholder="Search departments..."
          />
        )}

        {/* Delete Confirmation */}
        <AlertDialog open={!!deletingDepartment} onOpenChange={() => setDeletingDepartment(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete <strong>{deletingDepartment?.departmentName}</strong> from the system.
                This action cannot be undone and may affect related subjects and users.
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

export default DepartmentsPage