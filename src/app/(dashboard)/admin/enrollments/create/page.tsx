 
'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeftIcon } from 'lucide-react'
import { EnrollmentForm } from '@/features/enrollments/components/enrollment-form'
import { useCreateEnrollment } from '@/features/enrollments/hooks/use-enrollment-mutations'
import type { CreateEnrollmentFormData } from '@/features/enrollments/validations/enrollment-schemas'
import { RoleGuard } from '@/lib/auth/role-guard'
import { USER_ROLES } from '@/constants/roles'

const CreateEnrollmentPage = () => {
  const router = useRouter()
  const createMutation = useCreateEnrollment()

  const handleCreate = (data: CreateEnrollmentFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        router.push('/admin/enrollments')
      }
    })
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
            <h1 className="text-3xl font-bold text-gray-900">Create New Enrollment</h1>
            <p className="text-muted-foreground mt-1">
              Enroll a student in a subject
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Enrollment Information</CardTitle>
            <CardDescription>
              Fill in the details below to create a new enrollment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EnrollmentForm
              onSubmit={handleCreate}
              onCancel={() => router.push('/admin/enrollments')}
              isLoading={createMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}

export default CreateEnrollmentPage