 
'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeftIcon } from 'lucide-react'
import { EnrollmentForm } from '@/features/enrollments/components/enrollment-form'
import { useEnrollmentQuery } from '@/features/enrollments/hooks/use-enrollments-query'
import { useUpdateEnrollment } from '@/features/enrollments/hooks/use-enrollment-mutations'
import type { UpdateEnrollmentFormData } from '@/features/enrollments/validations/enrollment-schemas'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

type EditEnrollmentPageProps = {
  params: Promise<{ id: string }>
}

const EditEnrollmentPage = ({ params }: EditEnrollmentPageProps) => {
  const router = useRouter()
  const { id: enrollmentId } = use(params)

  const { data: enrollmentResponse, isLoading, error } = useEnrollmentQuery(enrollmentId)
  const updateMutation = useUpdateEnrollment()

  const handleUpdate = (data: UpdateEnrollmentFormData) => {
    updateMutation.mutate(
      { id: enrollmentId, data },
      {
        onSuccess: () => {
          router.push('/admin/enrollments')
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

  if (error || !enrollmentResponse?.data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Enrollment Not Found</h2>
          <p className="text-muted-foreground">
            The enrollment you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push('/admin/enrollments')} className="mt-4">
            Back to Enrollments
          </Button>
        </div>
      </div>
    )
  }

  return (
    <RoleGuard allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.EXAM_COORDINATOR]}>
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
            <h1 className="text-3xl font-bold text-gray-900">Edit Enrollment</h1>
            <p className="text-muted-foreground mt-1">
              Update enrollment information
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Enrollment Information</CardTitle>
            <CardDescription>
              Update the enrollment details below and click save.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EnrollmentForm
              enrollment={enrollmentResponse.data}
              onSubmit={handleUpdate}
              onCancel={() => router.push('/admin/enrollments')}
              isLoading={updateMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}

export default EditEnrollmentPage